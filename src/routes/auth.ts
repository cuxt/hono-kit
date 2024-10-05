// routes/auth.ts
import { Hono } from 'hono';
import * as authUtils from '../utils/auth';

const auth = new Hono();

// 注册
auth.post('/register', async (c) => {
  try {
    const token = await authUtils.register(c);
    return c.json({ token });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }

});

// 登录
auth.post('/login', async (c) => {
  try {
    const token = await authUtils.login(c);
    return c.json({ token });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 获取用户信息
auth.get('/info', async (c) => {
  try {
    const info = await authUtils.info(c) as {
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
})

export { auth }