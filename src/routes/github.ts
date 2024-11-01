// routes/github.ts
import { Context, Hono } from "hono";

export const github = new Hono();

github.post('/commit', async (c: Context) => {
  const { repo } = await c.req.json();
  const url = `https://api.github.com/repos/${repo}/commits`;
  const headers = {
    Authorization: `token ${await c.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json() as any;
    return c.json(data);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
})

github.get('/releases/:owner/:repo', async (c: Context) => {
  const { owner, repo } = c.req.param();
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  console.log(url)
  const headers = {
    Authorization: `token ${await c.env.GITHUB_TOKEN}`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json() as {
      tag_name: string;
      assets: { browser_download_url: string }[];
      body: string
    };

    return c.json({
      version: data.tag_name,
      url: data.assets[0].browser_download_url,
      changelog: data.body
    });

  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
})
