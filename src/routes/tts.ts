// routes/tts.ts
import { Context, Hono } from "hono";

export const tts = new Hono();

tts.post('/', async (c: Context) => {
  const body = await c.req.json();
  const targetUrl = "https://tts.xbxin.com/v1/audio/speech";

  // 转发请求
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer binxin`
    },
    body: JSON.stringify({
      model: body.model,
      voice: body.voice,
      input: body.input,
    }),
  });

  return new Response(response.body);
})

tts.get('/', async (c: Context) => {
  const targetUrl = "https://tts.xbxin.com/";
  const response = await fetch(targetUrl);
  return new Response(response.body, {
    headers: response.headers
  });
})