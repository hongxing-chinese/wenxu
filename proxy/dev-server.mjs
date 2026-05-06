/**
 * 本地开发服务器
 * 模拟 ESA 边缘函数环境，用内存存储替代 EdgeKV
 * 运行方式: node --env-file=.env --import tsx proxy/dev-server.mjs
 */

import { createServer } from 'node:http';

// ========== 内存 KV 模拟 ==========
const memoryStore = new Map();

class MockEdgeKV {
  constructor({ namespace }) {
    this.namespace = namespace;
  }
  async get(key, options) {
    const raw = memoryStore.get(key);
    if (raw === undefined) return null;
    if (options?.type === 'json') {
      try { return JSON.parse(raw); } catch { return null; }
    }
    return raw;
  }
  async put(key, value) {
    memoryStore.set(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
  async delete(key) {
    return memoryStore.delete(key);
  }
}

// 将 MockEdgeKV 注入到全局，让 proxy 源码中的 `new EdgeKV()` 能正常工作
globalThis.EdgeKV = MockEdgeKV;

// ========== 动态导入 proxy 路由 ==========
const { handleChatRoutes } = await import('./src/routes/chat.ts');
const { handleHistoryRoutes } = await import('./src/routes/history.ts');

// ========== 环境变量 ==========
const env = {
  LLM_API_KEY: process.env.LLM_API_KEY || '',
  LLM_BASE_URL: process.env.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  LLM_MODEL: process.env.LLM_MODEL || 'qwen-plus',
  KV_NAMESPACE: process.env.KV_NAMESPACE || 'wenxu-kv',
  APP_ORIGIN: process.env.APP_ORIGIN || 'http://localhost:5173',
};

// ========== CORS 头 ==========
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': env.APP_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function corsResponse(res, response) {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value);
  }
  res.statusCode = response.status;
  for (const [key, value] of response.headers) {
    res.setHeader(key, value);
  }
  response.text().then((body) => res.end(body));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function notFound() {
  return json({ error: 'Not Found' }, 404);
}

// ========== HTTP 服务器 ==========
const server = createServer(async (req, res) => {
  // 处理 CORS 预检
  if (req.method === 'OPTIONS') {
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      res.setHeader(key, value);
    }
    res.statusCode = 204;
    res.end();
    return;
  }

  // 将 Node.js IncomingMessage 转换为 Web Request
  const url = `http://localhost:3001${req.url}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  const body = ['GET', 'HEAD'].includes(req.method)
    ? undefined
    : await new Promise((resolve) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));
      });

  const request = new Request(url, { method: req.method, headers, body });

  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    let response;

    if (path.startsWith('/api/chat')) {
      response = await handleChatRoutes(request, env, { json });
    } else if (path.startsWith('/api/history')) {
      response = await handleHistoryRoutes(request, env, { json });
    } else if (path === '/api/proxy/models' && request.method === 'GET') {
      const targetUrl = parsedUrl.searchParams.get('url');
      const apiKey = parsedUrl.searchParams.get('key') || '';
      if (!targetUrl) {
        response = json({ error: '缺少 url 参数' }, 400);
      } else {
        try {
          const proxyHeaders = { Accept: 'application/json' };
          if (apiKey) proxyHeaders['Authorization'] = `Bearer ${apiKey}`;
          const llmRes = await fetch(targetUrl, { headers: proxyHeaders });
          const data = await llmRes.text();
          response = new Response(data, {
            status: llmRes.status,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (err) {
          response = json({ error: `代理请求失败: ${err.message}` }, 502);
        }
      }
    } else {
      response = notFound();
    }

    corsResponse(res, response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    corsResponse(res, json({ error: message }, 500));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`\n  Local API server running at http://localhost:${PORT}`);
  console.log(`  APP_ORIGIN:   ${env.APP_ORIGIN}`);
  console.log(`  LLM_BASE_URL: ${env.LLM_BASE_URL}`);
  console.log(`  LLM_MODEL:    ${env.LLM_MODEL}`);
  console.log(`  KV_NAMESPACE: ${env.KV_NAMESPACE}`);
  if (!env.LLM_API_KEY) console.log('  ⚠ LLM_API_KEY 未设置，云端对话功能不可用');
  console.log('');
});
