// routes/kv.ts
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { role } from "../utils/auth";
import { list, read, write } from "../utils/kv";

export const kv = new Hono();

kv.use('*', async function (c, next) {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';

  const userRole = await role(c, token)
  if (userRole !== 1) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});


kv.get('/list', authMiddleware, async (c) => {
  const data = await list(c);
  return c.json(data);
})

kv.post('/read', authMiddleware, async (c) => {
  const { key } = await c.req.json();
  const data = await read(c, key);
  return c.json(data);
})

kv.post('/write', authMiddleware, async (c) => {
  const { key, value } = await c.req.json();
  const data = await write(c, key, value);
  return c.json(data);
})