// routes/tools.ts
import { Hono } from 'hono';

const tools = new Hono();

// 简单的字符串反转功能
tools.post('/reverse', async (c) => {
  const { text } = await c.req.json<{ text: string }>();

  const reversedText = text.split('').reverse().join('');

  return c.json({ reversedText });
});

export { tools };
