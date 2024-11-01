import { Hono } from 'hono';

import { test } from './test';
import { auth } from './auth';
import { bilibili } from './bilibili';
import { bing } from './bing';
import { chat } from './chat';
import { cloudflare } from './cloudflare';
import { github } from './github';
import { kv } from './kv';
import { llm } from './llm';
import { maimemo } from './maimemo';
import { msg } from './msg';
import { ths } from './ths';
import { translate } from './translate';
import { tts } from './tts';
import { ws } from './ws';

const router = new Hono();

const routes = [
  { path: '/test', handler: test },
  { path: '/auth', handler: auth },
  { path: '/bilibili', handler: bilibili },
  { path: '/bing', handler: bing },
  { path: '/chat', handler: chat },
  { path: '/cloudflare', handler: cloudflare },
  { path: '/github', handler: github },
  { path: '/kv', handler: kv },
  { path: '/llm', handler: llm },
  { path: '/maimemo', handler: maimemo },
  { path: '/msg', handler: msg },
  { path: '/ths', handler: ths },
  { path: '/translate', handler: translate },
  { path: '/tts', handler: tts },
  { path: '/ws', handler: ws },
];

routes.forEach(route => {
  router.route(route.path, route.handler);
});

export { router };
