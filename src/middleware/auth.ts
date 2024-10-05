// middleware/auth.ts
import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization');

  if (!token || token !== 'Bearer your-secure-token') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
};
