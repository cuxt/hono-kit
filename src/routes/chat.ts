// routes/chat.ts
import { Context, Hono } from 'hono'

const chat = new Hono()

chat.post('/models', async (c) => {
  const { url, apikey } = await c.req.json();
  const newUrl = url.replace(/\/$/, '') + '/v1/models';
  const headers = {
    'Authorization': `Bearer ${apikey}`
  }

  try {
    const res = await fetch(newUrl, { headers });
    const data = await res.json() as any;

    if (!res.ok) {
      return c.json({ error: 'Error fetching models' }, 500);
    }

    const list = data.data.map((model: any) => model.id);

    list.sort((a: string, b: string) => {
      if (a.startsWith('@') && !b.startsWith('@')) {
        return 1;
      } else if (!a.startsWith('@') && b.startsWith('@')) {
        return -1;
      } else {
        return a.localeCompare(b);
      }
    });
    return c.json(list);
  } catch (error) {
    return c.json({ error: 'Error fetching models' }, 500);
  }
})

chat.post('/cloudflare', async (c: Context) => {
  const { model, prompt, stream } = await c.req.json();

  const answer = await c.env.AI.run(model, {
    prompt: prompt,
    stream: stream
  });

  return new Response(answer, {
    headers: { "content-type": "text/event-stream" }
  });
})

export { chat }