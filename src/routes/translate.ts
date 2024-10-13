import { Context, Hono } from "hono";
import crypto, { BinaryToTextEncoding } from 'node:crypto';

export const translate = new Hono();

translate.post('/tencent', async (c: Context) => {
  const SECRET_ID = await c.env.TENCENT_SECRET_ID;
  const SECRET_KEY = await c.env.TENCENT_SECRET_KEY;
  const { text, source, target, action } = await c.req.json();

  try {
    const TOKEN = "";

    const host = "tmt.tencentcloudapi.com";
    const service = "tmt";
    const region = "na-toronto";
    const version = "2018-03-21";
    const timestamp = Math.floor(Date.now() / 1000);
    const date = getDate(timestamp);

    const payload = JSON.stringify({
      SourceText: text,
      Source: source || "auto",
      Target: target || "zh",
      ProjectId: 0
    });

    // ************* 步骤 1：拼接规范请求串 *************
    const signedHeaders = "content-type;host";
    const hashedRequestPayload = await getHash(payload);
    console.log("hashedRequestPayload:", hashedRequestPayload);

    const httpRequestMethod = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "";
    const canonicalHeaders = "content-type:application/json; charset=utf-8\n" + "host:" + host + "\n";

    const canonicalRequest =
      httpRequestMethod +
      "\n" +
      canonicalUri +
      "\n" +
      canonicalQueryString +
      "\n" +
      canonicalHeaders +
      "\n" +
      signedHeaders +
      "\n" +
      hashedRequestPayload;

    console.log("canonicalRequest:\n", canonicalRequest);

    // ************* 步骤 2：拼接待签名字符串 *************
    const algorithm = "TC3-HMAC-SHA256";
    const hashedCanonicalRequest = await getHash(canonicalRequest);
    const credentialScope = `${date}/${service}/tc3_request`;
    const stringToSign =
      algorithm +
      "\n" +
      timestamp +
      "\n" +
      credentialScope +
      "\n" +
      hashedCanonicalRequest;

    console.log(stringToSign);

    // ************* 步骤 3：计算签名 *************
    const kDate = await sha256(date, "TC3" + SECRET_KEY);
    const kService = await sha256(service, kDate);
    const kSigning = await sha256("tc3_request", kService);
    const signature = await sha256(stringToSign, kSigning, "hex");

    console.log('kDate:', kDate);
    console.log('kService:', kService);
    console.log('kSigning:', kSigning);
    console.log('signature:', signature);

    // ************* 步骤 4：拼接 Authorization *************
    const authorization = `${algorithm} Credential=${SECRET_ID}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    console.log("Authorization: ", authorization);

    // ************* 步骤 5：构造并发起请求 *************
    const headers: { [key: string]: any } = {
      Authorization: authorization,
      "Content-Type": "application/json; charset=utf-8",
      Host: host,
      "X-TC-Action": action || "TextTranslate",
      "X-TC-Timestamp": timestamp,
      "X-TC-Version": version
    };

    if (region) {
      headers["X-TC-Region"] = region;
    }

    if (TOKEN) {
      headers["X-TC-Token"] = TOKEN;
    }

    // 发起请求到腾讯云翻译 API
    const response = await fetch(`https://${host}`, {
      method: httpRequestMethod,
      headers,
      body: payload
    });

    const result = await response.json() as {
      Response: {
        RequestId: string,
        Source: string,
        Target: string,
        TargetText: string
      }
    };

    return c.json({
      targetText: result.Response.TargetText,
      target: result.Response.Target,
      sourceText: text,
      source: result.Response.Source,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, { status: 500 });
  }
});

// sha256哈希函数
async function sha256 (message: string | Buffer, secret: string | Buffer = "", encoding?: BinaryToTextEncoding) {
  const hmac = crypto.createHmac("sha256", secret);

  // 如果 message 是 string 或 Buffer，直接处理
  if (typeof message === 'string' || Buffer.isBuffer(message)) {
    const digest = hmac.update(message).digest();
    return encoding ? digest.toString(encoding) : digest; // 根据 encoding 是否传入返回不同格式
  } else {
    throw new Error("Invalid message type, expected string or Buffer");
  }
}

// 通用hash函数
async function getHash (message: string, encoding: BinaryToTextEncoding = "hex") {
  const hash = crypto.createHash("sha256");
  return hash.update(message).digest(encoding);
}

// 获取UTC日期
function getDate (timestamp: number) {
  const date = new Date(timestamp * 1000);
  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + date.getUTCDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
