// routes/kv.ts
import { Context, Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { role } from "../utils/auth";
import { list, read, write } from "../utils/kv";

export const kv = new Hono();

kv.use('*', async function (c: Context, next: () => any) {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';

  const userRole = await role(c, token)
  if (userRole !== 1) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});


kv.get('/list', authMiddleware, async (c: Context) => {
  const data = await list(c);
  return c.json(data);
})

kv.post('/read', authMiddleware, async (c: Context) => {
  const { key } = await c.req.json();
  const data = await read(c, key);
  return c.json(data);
})

kv.post('/write', authMiddleware, async (c: Context) => {
  const { key, value } = await c.req.json();
  const data = await write(c, key, value);
  return c.json(data);
})