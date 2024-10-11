// middleware/auth.ts
import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
};
