/**
 * 边缘函数 API 客户端
 * 统一管理与后端的通信
 */

const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error || `请求失败: ${response.status}`);
  }

  return response.json();
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const chatApi = {
  async *streamCompletion(systemPrompt: string, userMessage: string): AsyncGenerator<string> {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userMessage, stream: true }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: response.statusText }));
      if (response.status === 429) {
        throw new Error(body.error || '今日免费额度已用完，请配置本地模型继续使用');
      }
      throw new Error(body.error || `请求失败: ${response.status}`);
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
  },
};

export interface StoredRecord {
  id: string;
  type: 'single' | 'compatibility' | 'divination';
  data: unknown;
  updatedAt: string;
}

export const historyApi = {
  getAll(): Promise<{ records: StoredRecord[] }> {
    return request('/history');
  },

  save(record: StoredRecord): Promise<{ ok: boolean }> {
    return request('/history', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },

  remove(id: string): Promise<{ ok: boolean }> {
    return request(`/history/${id}`, { method: 'DELETE' });
  },
};
