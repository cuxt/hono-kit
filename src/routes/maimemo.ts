// routes/maieomo.ts
import { Context, Hono } from 'hono'

export const maimemo = new Hono()

// GET /id?spelling=<spelling>
// 获取单词对应的 id
maimemo.get('/id', async (c: Context) => {
  const baseurl = 'https://open.maimemo.com/open/api/v1/vocabulary'
  const { spelling } = c.req.query()
  const key = await c.env.MAIMEMO;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`
  }

  const res = await fetch(`${baseurl}/?spelling=${spelling}`, { headers })

  const data = await res.json() as {
    errors: string[],
    data: {
      voc: {
        id: string,
        spelling: string
      }
    },
    success: boolean
  };
  console.log(data);

  return c.json({ id: data.data.voc?.id, spelling: data.data.voc?.spelling });
})
