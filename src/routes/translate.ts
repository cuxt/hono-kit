import { Context, Hono } from "hono";
import { getHash, makeMd5, hmac } from "../utils/utils";
import { getDate } from "../utils/date";

export const translate = new Hono();

translate.post('/tencent', async (c: Context) => {
  const ACCESS_ID = await c.env.TENCENT_ACCESS_ID;
  const ACCESS_KEY = await c.env.TENCENT_ACCESS_KEY;
  const { text, source, target } = await c.req.json();

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
    const kDate = await hmac(date, "TC3" + ACCESS_KEY);
    const kService = await hmac(service, kDate);
    const kSigning = await hmac("tc3_request", kService);
    const signature = await hmac(stringToSign, kSigning, "hex");

    console.log('kDate:', kDate);
    console.log('kService:', kService);
    console.log('kSigning:', kSigning);
    console.log('signature:', signature);

    // ************* 步骤 4：拼接 Authorization *************
    const authorization = `${algorithm} Credential=${ACCESS_ID}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    console.log("Authorization: ", authorization);

    // ************* 步骤 5：构造并发起请求 *************
    const headers: { [key: string]: any } = {
      Authorization: authorization,
      "Content-Type": "application/json; charset=utf-8",
      Host: host,
      "X-TC-Action": "TextTranslate",
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
      sourceText: text,
      target: result.Response.Target,
      source: result.Response.Source,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, { status: 500 });
  }
});

translate.post('/niutrans', async (c: Context) => {
  const { text, source, target } = await c.req.json();
  const url = 'https://api.niutrans.com/NiuTransServer/translation';
  const payload = {
    from: source || 'auto',
    to: target,
    apikey: await c.env.NIUTRANS_KEY,
    src_text: text
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json() as {
      tgt_text: string,
      from: string,
      to: string
    };
    return c.json({
      targetText: result.tgt_text,
      sourceText: text,
      target: result.to,
      source: result.from
    });
  } catch (error: any) {
    return c.json({ error: error.message }, { status: 500 });
  }
})

translate.post('/baidu', async (c: Context) => {
  const { text, source, target } = await c.req.json();

  const baiduTrans = await c.env.BAIDU_TRANS;
  const transString = baiduTrans[Math.floor(Math.random() * baiduTrans.length)];
  const trans = JSON.parse(transString);

  const appid = trans.appid;
  const appkey = trans.secret;

  const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';

  // 随机生成 salt
  const salt = Math.floor(Math.random() * (65536 - 32768 + 1)) + 32768;

  // 计算 md5
  const sign = await makeMd5(`${appid}${text}${salt}${appkey}`);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const payload = {
    appid: appid,
    q: text,
    from: source || 'auto',
    to: target || 'zh',
    salt: salt.toString(),
    sign: sign,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams(payload),
    });

    const result = await response.json() as {
      from: string,
      to: string,
      trans_result: {
        src: string,
        dst: string
      }[]
    };
    return c.json({
      targetText: result.trans_result[0].dst,
      sourceText: text,
      target: result.to,
      source: result.from
    });
  } catch (error: any) {
    return c.json({ error: error.message }, { status: 500 });
  }
})

translate.post('/google', async (c: Context) => {
  const { text, source, target } = await c.req.json();
  const url = 'https://translate.googleapis.com/translate_a/single';

  const payload = {
    client: 'gtx',
    sl: source || 'auto',
    tl: target || 'zh',
    dt: 't',
    q: text,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload),
    });

    const result = await response.json() as [
      [
        string[]
      ],
      string,
      string,
      string,
      string,
      string,
      number,
    ];
    return c.json({
      targetText: result[0][0][0],
      sourceText: result[0][0][1],
      target: target || 'zh',
      source: result[2] || source || 'auto'
    });
  } catch (error: any) {
    return c.json({ error: error.message }, { status: 500 });
  }
})

translate.post('/deepl', async (c: Context) => {
  const { text, source, target } = await c.req.json();
  const key = await c.env.DEEPL_KEY;
  const url = `https://deeplx.missuo.ru/translate?key=${key}`;

  const payload = {
    text: text,
    source_lang: source || 'auto',
    target_lang: target || 'zh',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json() as {
      alternatives: string[],
      data: string,
      source_lang: string,
      target_lang: string
    };
    return c.json({
      targetText: result.data,
      sourceText: text,
      target: result.target_lang,
      source: result.source_lang,
      alternatives: result.alternatives
    });
  } catch (error: any) {
    return c.json({ error: error.message }, { status: 500 });
  }
})