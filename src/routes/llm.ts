// routes/llm.ts
import { Context, Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { info } from "../utils/auth";

export const llm = new Hono();

llm.get('/num', async (c: Context) => {
  const list = await c.env.OPENAI_TOKEN;
  return c.json(list.length);
})

llm.post('/share', authMiddleware, async (c: Context) => {
  const token = c.req.header('Authorization')?.split(' ')[1] || '';
  const { user } = await c.req.json();
  const list = await c.env.OPENAI_TOKEN;
  const baseurl = 'https://chat.xbxin.com/auth/login_share?token=';

  const userInfo = await info(c, token);
  const userRole = userInfo.role;
  let userName = userInfo.name;

  if (userRole === 'guest') {
    userName = 'guest' + generateRandomHex(8);
  }

  const userID = (user + 1) ? user % list.length : Math.floor(Math.random() * list.length);

  const refreshToken = list[userID];

  try {
    const accessToken = await getAccessToken(refreshToken);

    const shareToken = await getShareToken(accessToken, userRole, userName);

    return c.json(baseurl + shareToken);
  } catch (error: any) {
    return c.json({ error: error.message });
  }
})

async function getShareToken (accessToken: string, role: string, name: string) {
  const url = 'https://chat.oaifree.com/token/register';
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };

  const data = {
    unique_name: name,
    access_token: accessToken,
    expires_in: 0, // 过期秒数
    site_limit: 'https://chat.xbxin.com', // 站点限制
    gpt35_limit: '-1', // gpt3.5限制
    gpt4_limit: '-1', // gpt4限制
    show_conversations: role === 'admin' ? 'true' : 'false', // 会话隔离
    temporary_chat: 'false', // 强制临时会话
    reset_limit: 'true', //重置次数
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: Object.keys(data as any)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent((data as any)[key])}`)
      .join('&'),
  });

  if (response.ok) {
    const json = await response.json() as { token_key: string };
    if (json.token_key) {
      return json.token_key;
    } else {
      throw new Error('Failed to generate share token, response: ' + JSON.stringify(json));
    }
  } else {
    throw new Error(`Error generating share token: ${response.statusText}`);
  }
}


async function getAccessToken (refreshToken: string) {
  const url = 'https://token.oaifree.com/api/auth/refresh';
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const data = `refresh_token=${refreshToken}`;

  const response = await fetch(url, { method: 'POST', headers, body: data });
  if (response.ok) {
    const json = await response.json() as { access_token: string };
    if (json.access_token) {
      return json.access_token;
    } else {
      throw new Error('Failed to generate access token, response: ' + JSON.stringify(json));
    }
  } else {
    throw new Error('Failed to get access token');
  }
}

function generateRandomHex (length: number): string {
  let result = '';
  const characters = '0123456789abcdef';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
