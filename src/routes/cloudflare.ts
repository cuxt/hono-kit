// routes/cloudflare.ts
import { Context, Hono } from "hono";

const cloudflare = new Hono();

cloudflare.post('/graphql', async (c: Context) => {
  const url = 'https://api.cloudflare.com/client/v4/graphql';
  const headers = {
    Authorization: `Bearer ${await c.env.GRAPHQL_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const { query } = await c.req.json();

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const datetimeGeq = sevenDaysAgo.toISOString().split('.')[0] + 'Z';
  const datetimeLeq = now.toISOString().split('.')[0] + 'Z';

  const payload = {
    operationName: 'GetLocationsSparkline',
    variables: {
      accountTag: await c.env.CLOUDFLARE_ACCOUNT_ID,
      filter: {
        clientCountryName_in: ['CN', 'US', 'HK', 'JP', 'KR', 'DE', 'SG', 'NL', 'GB', 'IE'],
        datetime_geq: datetimeGeq,
        datetime_leq: datetimeLeq,
      },
    },
    query: query,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    const { data } = await response.json() as any;
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
})

export { cloudflare }