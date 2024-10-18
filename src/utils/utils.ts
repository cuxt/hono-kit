// src/utils/utils.ts
import crypto, { BinaryToTextEncoding } from 'node:crypto';

export function generateRandomHex (length: number): string {
  let result = '';
  const characters = '0123456789abcdef';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function makeMd5 (str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function hmac (message: string | Buffer, secret: string | Buffer = "", encoding?: BinaryToTextEncoding, algorithm = 'sha256') {
  const hmac = crypto.createHmac(algorithm, secret);

  // 如果 message 是 string 或 Buffer，直接处理
  if (typeof message === 'string' || Buffer.isBuffer(message)) {
    const digest = hmac.update(message).digest();
    return encoding ? digest.toString(encoding) : digest; // 根据 encoding 是否传入返回不同
  }
}

// 通用hash函数
export async function getHash (message: string, encoding: BinaryToTextEncoding = "hex") {
  const hash = crypto.createHash("sha256");
  return hash.update(message).digest(encoding);
}

