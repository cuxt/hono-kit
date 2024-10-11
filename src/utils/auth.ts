// utils/auth.ts

import { Context } from "hono";

// 注册
export async function register (c: Context, username: string, email: string, password: string) {
  const stmt = await c.env.DB.prepare(
    'INSERT INTO DEV_USERS (username, user_status, email, password, access_token, inviter_id) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const token = crypto.randomUUID();

  try {
    await stmt.bind(
      username,
      1,
      email,
      password,
      token,
      1
    ).run();
    return token;
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      await init(c);
      throw new Error('Please try again.')
    }

    throw error;
  }
}

export async function login (c: Context, username: string, password: string) {
  const stmt = await c.env.DB.prepare('SELECT * FROM DEV_USERS WHERE username = ? AND password = ?');

  const result = await stmt.bind(username, password).first();

  if (!result) {
    throw new Error('Username or password is incorrect');
  }

  // 未激活
  if (result.user_status === 0) {
    throw new Error('Account not activated');
  }

  return result.access_token;
}

export async function info (c: Context, token: string) {
  const stmt = await c.env.DB.prepare('SELECT * FROM DEV_USERS WHERE access_token = ?');

  const result = await stmt.bind(token).first();

  if (!result) {
    throw new Error('User not found');
  }

  return {
    name: result.username,
    avatar: `https://avator.bxin.top/api/face?id=${result.id}`,
    email: result.email,
    registrationDate: result.created_at,
    accountId: result.id,
    role: result.role == 1 ? 'admin' : result.role >= 4 ? 'guest' : 'user',
    quota: result.quota,
    usedQuota: result.used_quota,
    requestCount: result.request_count,
    group: result.group,
    affCode: result.aff_code,
    inviterId: result.inviter_id,
  };
}

export async function role (c: Context, token: string) {
  const stmt = await c.env.DB.prepare(`SELECT role FROM DEV_USERS WHERE access_token = ?`);
  const result = await stmt.bind(token).first();

  if (!result) {
    return c.env.ROOT_TOKEN === token ? 1 : 4;
  }

  return result.role;
}

export async function changePassword (c: Context, token: string, oldPassword: string, newPassword: string) {
  const stmt = c.env.DB.prepare('SELECT password FROM DEV_USERS WHERE access_token = ?');
  try {
    const result = await stmt.bind(token).first();
    if (result && result.password === oldPassword) {
      const updateStmt = c.env.DB.prepare('UPDATE DEV_USERS SET password = ? WHERE access_token = ?');
      await updateStmt.bind(newPassword, token).run();
      return;
    } else {
      throw new Error('Password or username is incorrect');
    }
  } catch (error: any) {
    throw new Error('An unexpected error occurred: ' + error.message);
  }
}

export async function users (c: Context, token: string) {
  const userRole = await role(c, token);
  if (userRole !== 1) {
    throw new Error('Permission denied');
  }

  const stmt = await c.env.DB.prepare('SELECT * FROM DEV_USERS');

  const result = await stmt.all();

  return result.results;
}

export async function active (c: Context, token: string, id: number) {
  const userRole = await role(c, token);
  if (userRole !== 1 || id === 1) {
    throw new Error('Permission denied');
  }

  const stmt = c.env.DB.prepare('UPDATE DEV_USERS SET user_status = CASE WHEN user_status = 1 THEN 0 ELSE 1 END WHERE id = ?');

  try {
    await stmt.bind(id).run();

    return;
  } catch (error: any) {
    throw new Error('An unexpected error occurred: ' + error.message);
  }
}

async function init (c: Context) {
  const query = `
    CREATE TABLE IF NOT EXISTS DEV_USERS (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        username      TEXT CONSTRAINT uni_users_username UNIQUE,
        password      TEXT NOT NULL,
        display_name  TEXT,
        role          BIGINT DEFAULT 3,
        user_status   BIGINT DEFAULT 1,
        email         TEXT,
        github_id     TEXT,
        wechat_id     TEXT,
        lark_id       TEXT,
        access_token  CHAR(36),
        quota         BIGINT DEFAULT 0,
        used_quota    BIGINT DEFAULT 0,
        request_count BIGINT DEFAULT 0,
        "group"       VARCHAR(32) DEFAULT 'default',
        aff_code      VARCHAR(32),
        inviter_id    BIGINT
    );
  `;

  try {
    await c.env.DB.prepare(query).run();
    console.log('init success');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}