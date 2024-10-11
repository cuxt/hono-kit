// src/utils/kv.ts

import { Context } from "hono";

// 获取所有键
export async function list (c: Context) {
  const store = await c.env.api;

  const keys = await store.list();
  return keys.keys.map((key: { name: any; }) => key.name);
}

export async function read (c: Context, key: string) {
  const store = await c.env.api;

  const data = await store.get(key);
  return data;
}

// 写入数据
export async function write (c: Context, key: string, value: string) {
  const store = await c.env.api;
  
  await store.put(key, value);
  return true;
}