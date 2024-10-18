// routes/msg.ts
import { Context, Hono } from "hono";
import * as msgUtils from "../utils/msg";
import { hmac } from "../utils/utils";

export const msg = new Hono();

msg.post('/:user/:channel', async (c) => {
  const { user, channel } = c.req.param();

  switch (channel.toLowerCase()) {
    case 'corp':
      return await corp(c, user);
    case 'email':
      return await email(c, user);
    default:
      return c.json({
        error: `channel ${channel} not supported`
      }, 400);
  };
});

async function corp (c: Context, user: string) {
  const channel = `CORP_${user.toUpperCase()}`;

  let { from, title, desc, content } = await c.req.json();

  if (!from) {
    from = await c.env[channel] || 'CORP_ADMIN';
  };

  try {
    const data = await msgUtils.corp(from, title, desc, content);

    if (data.errcode === 0) {
      return c.json(data);
    } else {
      return c.json({
        error: data.errmsg
      }, 400);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Power by Aliyun
async function email (c: Context, user: string) {
  const ACCESS_ID = await c.env.ALIYUN_ACCESS_ID;
  const ACCESS_KEY = await c.env.ALIYUN_ACCESS_KEY;
  const REGION = 'cn-hangzhou';
  const DM_API_URL = 'https://dm.aliyuncs.com/';

  let { from, title, desc, content, to } = await c.req.json();
  if (!from) {
    from = user === 'admin' ? 'admin@mail.xbxin.com' : 'admin@mail.662000.xyz';
  };

  // *********** 签名 ***********
  const params = {
    Action: 'SingleSendMail',
    AccountName: from,
    AddressType: '1',
    ReplyToAddress: 'false',
    ToAddress: to,
    Subject: title,
    HtmlBody: content,
    Format: 'JSON',
    Version: '2015-11-23',
    AccessKeyId: ACCESS_ID,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: new Date().toISOString(),
    SignatureVersion: '1.0',
    SignatureNonce: Math.random().toString(36).substring(2),
    RegionId: REGION,
  }

  // 对请求参数按键名进行排序
  const sortedKeys = Object.keys(params).sort() as Array<keyof typeof params>;
  const canonicalizedQueryString = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');


  // 构造待签名的字符串
  const stringToSign = `POST&%2F&${encodeURIComponent(canonicalizedQueryString)}`;
  const signature = await hmac(stringToSign, ACCESS_KEY + '&', 'base64', 'sha1');

  // 添加签名到请求参数中
  const payload = {
    ...params,
    Signature: signature as string,
  };

  // 发起 POST 请求
  const url = `${DM_API_URL}`;
  // 处理响应
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload).toString(),
    });
    const data = await response.json() as {
      RequestId: string;
      EnvId: string;
    };
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
}
