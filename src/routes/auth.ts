// routes/auth.ts
import { Context, Hono } from 'hono';
import * as authUtils from '../utils/auth';
import { authMiddleware } from '../middleware/auth';

export const auth = new Hono();

// 注册
auth.post('/register', async (c: Context) => {
  const { username, email, password } = await c.req.json();
  try {
    const token = await authUtils.register(c, username, email, password);
    return c.json({ token });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 登录
auth.post('/login', async (c: Context) => {
  const { username, password } = await c.req.json();

  try {
    const token = await authUtils.login(c, username, password);
    return c.json({ token });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 获取用户信息
auth.get('/info', authMiddleware, async (c: Context) => {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';

  try {
    const info = await authUtils.info(c, token) as {
      name: string,
      avatar: string,
      email: string,
      registrationDate: string,
      accountId: number,
      role: string,
      quota: number,
      usedQuota: number,
      requestCount: number,
      group: string,
      affCode: string,
      inviterId: number,
    };
    return c.json({ ...info });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 修改密码
auth.post('/changePassword', authMiddleware, async (c: Context) => {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';
  const { oldPassword, newPassword } = await c.req.json();

  try {
    await authUtils.changePassword(c, token, oldPassword, newPassword);
    return c.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

auth.get('/users', authMiddleware, async (c: Context) => {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';

  try {
    const users = await authUtils.users(c, token);
    return c.json({ users });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})

// 切换用户激活信息
auth.post('/active', authMiddleware, async (c: Context) => {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';
  const { id } = await c.req.json();

  try {
    await authUtils.active(c, token, id);
    return c.json({ message: 'Active changed successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})
