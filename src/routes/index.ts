// routes/index.ts
import { Hono } from 'hono';
import { auth } from './auth';
import { bilibili } from './bilibili';
import { bing } from './bing';

const router = new Hono();

router.route('/auth', auth);
router.route('/bilibili', bilibili);
router.route('/bing', bing);

export { router };
