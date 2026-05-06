/**
 * ESA 边缘函数入口
 * 路由分发：/api/chat/*, /api/history/*
 */

import { handleChatRoutes } from './routes/chat';
import { handleHistoryRoutes } from './routes/history';

type EdgeHandler = (
  request: Request,
  env: Record<string, string>,
) => Promise<Response> | Response;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function corsResponse(response: Response): Response {
  const newResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    newResponse.headers.set(key, value);
  }
  return newResponse;
}

function handleOptions(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function notFound(): Response {
  return json({ error: 'Not Found' }, 404);
}

export default {
  async fetch(request: Request, env: Record<string, string>): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      let response: Response;

      if (path.startsWith('/api/chat')) {
        response = await handleChatRoutes(request, env, { json });
      } else if (path.startsWith('/api/history')) {
        response = await handleHistoryRoutes(request, env, { json });
      } else {
        response = notFound();
      }

      return corsResponse(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      return corsResponse(json({ error: message }, 500));
    }
  },
} satisfies { fetch: EdgeHandler };
