// routes/llm.ts
import { Context, Hono } from "hono";

export const llm = new Hono();

llm.post('/hf/v1/chat/completions', async (c: Context) => {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';
  if (!token) {
    return c.json({ error: 'Authorization header is missing' }, 401);
  }

  const body = await c.req.json();
  const messages = body.messages || [];
  const model = body.model;
  const temperature = body.temperature || 0.7;
  const max_tokens = body.max_tokens || 8196;
  const top_p = Math.min(Math.max(body.top_p || 0.9, 0.0001), 0.9999);
  const stream = body.stream || false;

  const payload = {
    model: model,
    messages: messages,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    stream: stream
  }

  const url = `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const newResponse = new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      }
    });
    return newResponse;
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})
