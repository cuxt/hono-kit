import { Hono } from 'hono';
import { auth } from './auth';
import { bilibili } from './bilibili';
import { bing } from './bing';
import { chat } from './chat';
import { cloudflare } from './cloudflare';
import { github } from './github';
import { msg } from './msg';

const router = new Hono();

const routes = [
  { path: '/auth', handler: auth },
  { path: '/bilibili', handler: bilibili },
  { path: '/bing', handler: bing },
  { path: '/chat', handler: chat },
  { path: '/cloudflare', handler: cloudflare },
  { path: '/github', handler: github },
  { path: '/msg', handler: msg }
];

routes.forEach(route => {
  router.route(route.path, route.handler);
});

export { router };
