// Cloudflare Pages Function: 代理 DeepSeek API
// 用户无需配置 API Key，key 存储在服务端环境变量中
// 内置 IP 限流：每 IP 每分钟最多 15 次请求

interface ChatRequest {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const DEFAULT_MODEL = 'deepseek-chat';

// 限流配置
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 分钟窗口
const RATE_LIMIT_MAX_REQUESTS = 15;   // 每窗口最大请求数

// 所有响应都带 CORS 头
function corsHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
}

// 从请求中提取客户端 IP
function getClientIP(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Real-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// 限流检查：基于 Cloudflare KV（如果可用）或内存 Map 降级
// 返回 { allowed: boolean, remaining: number, resetAt: number }
async function checkRateLimit(
  env: Record<string, unknown>,
  clientIP: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `ratelimit:${clientIP}`;
  const now = Date.now();
  const resetAt = now + RATE_LIMIT_WINDOW_MS;

  // 尝试使用 Cloudflare KV（如果绑定了 RATE_LIMIT namespace）
  const kv = (env as Record<string, unknown>).RATE_LIMIT as
    | { get: (k: string) => Promise<string | null>; put: (k: string, v: string, o?: { expirationTtl?: number }) => Promise<void> }
    | undefined;

  if (kv) {
    // KV 模式：跨边缘节点共享
    const raw = await kv.get(key);
    if (raw) {
      const data = JSON.parse(raw) as { count: number; windowStart: number };
      if (now - data.windowStart < RATE_LIMIT_WINDOW_MS) {
        const count = data.count + 1;
        if (count > RATE_LIMIT_MAX_REQUESTS) {
          return { allowed: false, remaining: 0, resetAt: data.windowStart + RATE_LIMIT_WINDOW_MS };
        }
        await kv.put(key, JSON.stringify({ count, windowStart: data.windowStart }), { expirationTtl: 120 });
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - count, resetAt: data.windowStart + RATE_LIMIT_WINDOW_MS };
      }
    }
    // 新窗口
    await kv.put(key, JSON.stringify({ count: 1, windowStart: now }), { expirationTtl: 120 });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt };
  }

  // 降级模式：内存 Map（单个边缘节点级别限流）
  // 在全局作用域缓存，同一 Worker 实例内有效
  const globalScope = globalThis as unknown as { __rateLimitMap?: Map<string, { count: number; windowStart: number }> };
  if (!globalScope.__rateLimitMap) {
    globalScope.__rateLimitMap = new Map();
  }
  const rateMap = globalScope.__rateLimitMap;
  const entry = rateMap.get(key);

  if (entry && now - entry.windowStart < RATE_LIMIT_WINDOW_MS) {
    entry.count += 1;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0, resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS };
    }
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS };
  }

  // 新窗口
  rateMap.set(key, { count: 1, windowStart: now });
  // 定期清理过期条目（防止内存泄漏）
  if (rateMap.size > 1000) {
    for (const [k, v] of rateMap) {
      if (now - v.windowStart >= RATE_LIMIT_WINDOW_MS) rateMap.delete(k);
    }
  }
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt };
}

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  // 只允许 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders(),
    });
  }

  // 限流检查
  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimit(env as Record<string, unknown>, clientIP);
  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return new Response(
      JSON.stringify({
        error: '请求过于频繁',
        detail: `每分钟限 ${RATE_LIMIT_MAX_REQUESTS} 次，请 ${retryAfter} 秒后再试`,
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders(),
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json() as ChatRequest;

    // 从环境变量获取 API Key
    const apiKey = (env as Record<string, string>).DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server API key not configured' }), {
        status: 500,
        headers: corsHeaders(),
      });
    }

    // 转发到 DeepSeek API
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        messages: body.messages,
        temperature: body.temperature ?? 0.8,
        max_tokens: body.max_tokens ?? 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `DeepSeek API error: ${response.status}`, detail: errorText }), {
        status: response.status,
        headers: corsHeaders(),
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders(),
        'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000)),
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error', detail: String(err) }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
};

// 处理 OPTIONS 预检请求
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
