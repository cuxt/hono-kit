import { Context, Hono } from 'hono'
import { cors } from 'hono/cors';
import { router } from './routes/index';
import { responseMiddleware } from './middleware/meta'

const app = new Hono<{ Bindings: CloudflareBindings }>()
app.use('*', cors());

app.use('*', responseMiddleware);


app.get('/', (c: Context) => c.json({ message: 'Welcome to HonoKit API!' }));


// 挂载路由管理器
app.route('/', router);

// 健康检查路由
app.get('/health', (c: Context) => c.json({ status: 'OK' }));

// 404 未找到路由
app.notFound((c: Context) => c.json({ error: '404 - Not Found' }, 404));

// 其他错误处理
app.onError((err: Error, c: Context) => {
  console.error(err)
  return c.json({ error: `An unexpected error occurred: ${err.message}` }, 500)
})

// 启动应用
export default app;