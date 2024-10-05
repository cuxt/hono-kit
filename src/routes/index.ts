// routes/index.ts
import { Hono } from 'hono';
import { tools } from './tools';

const router = new Hono();

router.route('/tools', tools);

export { router };
