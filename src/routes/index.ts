import { Hono } from 'hono';
import { auth } from './auth';
import { bilibili } from './bilibili';
import { bing } from './bing';
import { chat } from './chat';
import { cloudflare } from './cloudflare';
import { github } from './github';
import { kv } from './kv';
import { llm } from './llm';
import { msg } from './msg';
import { ths } from './ths';
import { tts } from './tts';

const router = new Hono();

const routes = [
  { path: '/auth', handler: auth },
  { path: '/bilibili', handler: bilibili },
  { path: '/bing', handler: bing },
  { path: '/chat', handler: chat },
  { path: '/cloudflare', handler: cloudflare },
  { path: '/github', handler: github },
  { path: '/kv', handler: kv },
  { path: '/llm', handler: llm },
  { path: '/msg', handler: msg },
  { path: '/ths', handler: ths },
  { path: '/tts', handler: tts },
];

routes.forEach(route => {
  router.route(route.path, route.handler);
});

export { router };
