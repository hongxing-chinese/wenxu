/**
 * LLM 代理路由
 * 接收前端排盘数据，后端组装提示词，流式转发大模型 API 响应
 * 基于 IP 的每日免费额度限制
 *
 * 环境变量通过 esbuild define 注入为常量
 */

// 定义全局常量（由 esbuild 在构建时注入）
declare const ENV_LLM_API_KEY: string;
declare const ENV_LLM_BASE_URL: string;
declare const ENV_LLM_MODEL: string;
declare const ENV_KV_NAMESPACE: string;

declare class EdgeKV {
  constructor(config: { namespace: string });
  get(key: string, options?: { type?: string }): Promise<any>;
  put(key: string, value: any): Promise<void>;
}

type JsonFn = (data: unknown, status?: number) => Response;

interface Env {
  LLM_API_KEY: string;
  LLM_BASE_URL: string;
  LLM_MODEL: string;
  KV_NAMESPACE: string;
}

interface ChatRequest {
  systemPrompt: string;
  userMessage: string;
  stream?: boolean;
}

const DAILY_FREE_LIMIT = 15;

/**
 * 获取环境变量
 * 优先从 env 参数获取（Cloudflare Workers），其次使用构建时注入的常量（阿里云 ESA）
 */
function getEnvVar(
  env: Record<string, string>,
  key: 'KV_NAMESPACE' | 'LLM_API_KEY' | 'LLM_BASE_URL' | 'LLM_MODEL',
  defaultValue: string,
): string {
  // 优先从 env 参数获取（Cloudflare Workers）
  if (env && env[key]) {
    return env[key];
  }

  // 回退到构建时注入的常量（阿里云 ESA）
  switch (key) {
    case 'KV_NAMESPACE':
      return typeof ENV_KV_NAMESPACE !== 'undefined' ? ENV_KV_NAMESPACE : defaultValue;
    case 'LLM_API_KEY':
      return typeof ENV_LLM_API_KEY !== 'undefined' ? ENV_LLM_API_KEY : defaultValue;
    case 'LLM_BASE_URL':
      return typeof ENV_LLM_BASE_URL !== 'undefined' ? ENV_LLM_BASE_URL : defaultValue;
    case 'LLM_MODEL':
      return typeof ENV_LLM_MODEL !== 'undefined' ? ENV_LLM_MODEL : defaultValue;
    default:
      return defaultValue;
  }
}

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function checkAndIncrementRate(kv: EdgeKV, ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${ip}:${getTodayKey()}`;
  const data = await kv.get(key, { type: 'json' });
  const count = typeof data === 'number' ? data : 0;

  if (count >= DAILY_FREE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await kv.put(key, String(count + 1));
  return { allowed: true, remaining: DAILY_FREE_LIMIT - count - 1 };
}

export async function handleChatRoutes(
  request: Request,
  env: Record<string, string>,
  ctx: { json: JsonFn },
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // 获取环境变量（支持 Cloudflare Workers 和阿里云 ESA）
  const kvNamespace = getEnvVar(env, 'KV_NAMESPACE', 'wenxu-kv');
  const llmBaseUrl = getEnvVar(env, 'LLM_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1');
  const llmModel = getEnvVar(env, 'LLM_MODEL', 'qwen-plus');
  const llmApiKey = getEnvVar(env, 'LLM_API_KEY', '');

  // 调试日志
  console.log('[DEBUG] 环境变量检查:');
  console.log('[DEBUG] KV_NAMESPACE:', kvNamespace);
  console.log('[DEBUG] LLM_BASE_URL:', llmBaseUrl);
  console.log('[DEBUG] LLM_MODEL:', llmModel);
  console.log('[DEBUG] LLM_API_KEY:', llmApiKey ? '已设置(长度:' + llmApiKey.length + ')' : '未设置');

  // POST /api/chat/completions -> 流式 LLM 对话
  if (path === '/api/chat/completions' && request.method === 'POST') {
    // IP 限流检查
    const ip = getClientIp(request);
    const kv = new EdgeKV({ namespace: kvNamespace });
    const rateResult = await checkAndIncrementRate(kv, ip);

    if (!rateResult.allowed) {
      return ctx.json({
        error: '今日免费额度已用完（每天15次）',
        code: 'RATE_LIMITED',
      }, 429);
    }

    const body = (await request.json()) as ChatRequest;
    if (!body.systemPrompt || !body.userMessage) {
      return ctx.json({ error: '缺少 systemPrompt 或 userMessage' }, 400);
    }

    const baseUrl = llmBaseUrl.replace(/\/$/, '');
    const model = llmModel;

    const llmResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${llmApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: body.systemPrompt },
          { role: 'user', content: body.userMessage },
        ],
        stream: body.stream !== false,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      return ctx.json({ error: `LLM API 错误: ${llmResponse.status}`, detail: errorText }, 502);
    }

    // 流式透传 SSE 响应
    return new Response(llmResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-RateLimit-Remaining': String(rateResult.remaining),
      },
    });
  }

  return ctx.json({ error: 'Not Found' }, 404);
}
