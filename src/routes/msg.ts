// routes/msg.ts
import { Context, Hono } from "hono";
import * as msgUtils from "../utils/msg";

const msg = new Hono();

msg.post('/:user/:channel', async (c) => {
  const { user, channel } = c.req.param();

  switch (channel.toLowerCase()) {
    case 'corp':
      return await corp(c, user);
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

  console.log(from);
  try {
    const data = await msgUtils.corp(from, title, desc, content);
    console.log(data);

    // return c.json(data);
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

export { msg };