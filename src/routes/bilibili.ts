// routes/bilibili.ts
import { Context, Hono } from 'hono'

export const bilibili = new Hono()

bilibili.post('/subtitle', async (c) => {
  try {
    const subtitle = await getSubtitle(c) as any;
    return c.json(subtitle)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

async function getSubtitle (c: Context) {
  const { bvid, sessdata } = await c.req.json()

  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    "cookie": `SESSDATA=${sessdata};`,
  }

  const { aid, cid } = await getAidCid(bvid, headers);

  const subtitleUrl = await getSubtitleUrl(aid, cid, headers);
  if (!subtitleUrl) {
    throw new Error('Failed to fetch subtitle URL');
  }

  return await fetch(subtitleUrl, { headers })
    .then(res => res.json())
    .then(json => {
      return json;
    })
    .catch(err => {
      console.log(err);
    });
}

async function getAidCid (bvid: string, headers: any) {
  const url = `https://www.bilibili.com/video/${bvid}`;
  const regex = /window\.__INITIAL_STATE__=(.*?);\(function/;

  try {
    const res = await fetch(url, { headers });
    const text = await res.text();

    const match = text.match(regex);
    if (match && match[1]) {
      const json = JSON.parse(match[1]);
      const aid = json.videoData?.aid;
      const cid = json.videoData?.cid;

      if (aid && cid) {
        return { aid, cid };
      } else {
        throw new Error('Failed to fetch AID and CID');
      }
    } else {
      throw new Error('Failed to match regex');
    }
  } catch (err) {
    throw err;
  }
}

async function getSubtitleUrl (aid: string, cid: string, headers: any) {
  const url = `https://api.bilibili.com/x/player/wbi/v2?aid=${aid}&cid=${cid}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json() as any;
  console.log(data);
  
  return 'https:' + data.data.subtitle.subtitles[0].subtitle_url;
}
