/**
 * 本地大模型配置管理
 * 用户可自定义 API Key、Base URL、Model，存储在 localStorage
 */

const STORAGE_KEY = 'wenxu_local_llm_config';

export interface LocalLLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const DEFAULT_CONFIG: LocalLLMConfig = {
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
};

export function loadLocalLLMConfig(): LocalLLMConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) as Partial<LocalLLMConfig>;
    return {
      apiKey: parsed.apiKey || '',
      baseUrl: parsed.baseUrl || DEFAULT_CONFIG.baseUrl,
      model: parsed.model || DEFAULT_CONFIG.model,
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveLocalLLMConfig(config: LocalLLMConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function hasLocalLLMConfig(): boolean {
  const config = loadLocalLLMConfig();
  return config.apiKey.trim().length > 0;
}

/**
 * 从兼容 OpenAI 格式的 API 获取可用模型列表
 * 优先通过本地代理请求（绕过 CORS），失败则直接请求
 */
export async function fetchAvailableModels(baseUrl: string, apiKey?: string): Promise<string[]> {
  const endpoint = baseUrl.replace(/\/+$/, '');
  const modelsUrl = endpoint.endsWith('/v1') ? `${endpoint}/models` : `${endpoint}/v1/models`;

  // 优先尝试通过本地代理请求（开发环境绕过 CORS）
  try {
    const proxyParams = new URLSearchParams({ url: modelsUrl });
    if (apiKey?.trim()) proxyParams.set('key', apiKey);
    const proxyRes = await fetch(`/api/proxy/models?${proxyParams}`);
    if (proxyRes.ok) {
      const data = await proxyRes.json() as { data?: Array<{ id: string }> };
      if (Array.isArray(data.data)) {
        return data.data.map((m) => m.id).filter(Boolean);
      }
    }
  } catch {
    // 代理不可用，回退到直接请求
  }

  // 直接请求（生产环境或代理不可用时）
  const headers: Record<string, string> = {};
  if (apiKey?.trim()) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(modelsUrl, { headers });
  if (!response.ok) {
    throw new Error(`获取模型列表失败 (${response.status})`);
  }

  const data = await response.json() as { data?: Array<{ id: string }> };
  if (!Array.isArray(data.data)) {
    throw new Error('返回格式不符合预期');
  }

  return data.data.map((m) => m.id).filter(Boolean);
}

/**
 * 使用本地配置直连大模型（流式）
 */
export async function* streamLocalLLM(
  systemPrompt: string,
  userMessage: string,
  config: LocalLLMConfig,
): AsyncGenerator<string> {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`本地模型请求失败 (${response.status}): ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed SSE lines
      }
    }
  }
}
