/**
 * 历史记录路由
 * 基于 Edge KV 的历史排盘记录 CRUD（按 IP 隔离）
 *
 * 环境变量通过 esbuild define 注入为常量
 */

// 定义全局常量（由 esbuild 在构建时注入）
declare const ENV_KV_NAMESPACE: string;

declare class EdgeKV {
  constructor(config: { namespace: string });
  get(key: string, options?: { type?: string }): Promise<any>;
  put(key: string, value: any): Promise<void>;
  delete(key: string): Promise<boolean>;
}

export interface StoredRecord {
  id: string;
  type: 'single' | 'compatibility' | 'divination';
  data: unknown;
  updatedAt: string;
}

type JsonFn = (data: unknown, status?: number) => Response;

interface Env {
  KV_NAMESPACE: string;
}

/**
 * 获取环境变量
 * 优先从 env 参数获取（Cloudflare Workers），其次使用构建时注入的常量（阿里云 ESA）
 */
function getEnvVar(
  env: Record<string, string>,
  key: 'KV_NAMESPACE',
  defaultValue: string,
): string {
  // 优先从 env 参数获取（Cloudflare Workers）
  if (env && env[key]) {
    return env[key];
  }

  // 回退到构建时注入的常量（阿里云 ESA）
  if (typeof ENV_KV_NAMESPACE !== 'undefined') {
    return ENV_KV_NAMESPACE;
  }

  return defaultValue;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function handleHistoryRoutes(
  request: Request,
  env: Record<string, string>,
  ctx: { json: JsonFn },
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // 获取环境变量（支持 Cloudflare Workers 和阿里云 ESA）
  const kvNamespace = getEnvVar(env, 'KV_NAMESPACE', 'wenxu-kv');

  const ip = getClientIp(request);
  const kv = new EdgeKV({ namespace: kvNamespace });
  const userKey = `ip_${ip}`;

  // GET /api/history -> 获取全部历史记录
  if (path === '/api/history' && request.method === 'GET') {
    const data = await kv.get(`user_${userKey}_records`, { type: 'json' });
    const records = Array.isArray(data) ? data : [];
    return ctx.json({ records });
  }

  // POST /api/history -> 新增/更新一条记录
  if (path === '/api/history' && request.method === 'POST') {
    const record = (await request.json()) as StoredRecord;
    if (!record.id || !record.type) {
      return ctx.json({ error: '记录缺少 id 或 type' }, 400);
    }
    record.updatedAt = new Date().toISOString();
    const data = await kv.get(`user_${userKey}_records`, { type: 'json' });
    const records: StoredRecord[] = Array.isArray(data) ? data : [];
    const filtered = records.filter((r) => r.id !== record.id);
    filtered.unshift(record);
    await kv.put(`user_${userKey}_records`, JSON.stringify(filtered.slice(0, 100)));
    return ctx.json({ ok: true, record });
  }

  // DELETE /api/history/:id -> 删除一条记录
  const deleteMatch = path.match(/^\/api\/history\/(.+)$/);
  if (deleteMatch && request.method === 'DELETE') {
    const recordId = deleteMatch[1];
    const data = await kv.get(`user_${userKey}_records`, { type: 'json' });
    const records: StoredRecord[] = Array.isArray(data) ? data : [];
    const filtered = records.filter((r) => r.id !== recordId);
    if (filtered.length === records.length) {
      return ctx.json({ error: '记录不存在' }, 404);
    }
    await kv.put(`user_${userKey}_records`, JSON.stringify(filtered));
    return ctx.json({ ok: true });
  }

  return ctx.json({ error: 'Not Found' }, 404);
}
