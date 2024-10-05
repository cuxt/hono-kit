// routes/bing.ts
import { Hono } from 'hono';

const bing = new Hono();

bing.get('/img', async (c) => {
  return c.json(await dailyImg());
});

async function dailyImg () {
  const url = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';

  const res = await fetch(url);
  const data = await res.json() as {
    images: {
      url: string,
      copyright: string,
      title: string
    }[]
  };

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return {
    url: 'https://global.bing.com' + data.images[0].url,
    copyright: data.images[0].copyright,
    title: data.images[0].title
  };
}

export { bing };