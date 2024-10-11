// middleware/meta.ts
import { Context, Next } from 'hono';
import { formatDate } from '../utils/date';
import packageInfo from '../../package.json';

// 定义通用的响应接口
interface ApiResponse<T = any> {
  status: 'success' | 'fail';
  data: T | null;
  timestamp: string;
  version: string;
  error?: {
    code: number;
    details: string;
  };
}

export const responseMiddleware = async (c: Context, next: Next) => {
  await next();

  const res = c.res;
  const statusCode = res.status;

  // 检查是否是 JSON 格式的响应
  if (res && res.headers.get('content-type')?.includes('application/json')) {
    const body = await res.json();

    const isError = statusCode >= 400; // 判断是否为错误响应

    // 如果没有错误，构建标准化的成功响应
    const formattedResponse: ApiResponse = {
      status: isError ? 'fail' : 'success', // 错误时设置为 fail
      data: body ?? null,
      timestamp: formatDate(new Date()),
      version: packageInfo.version,
    };

    // 返回新的 JSON 响应
    c.res = new Response(JSON.stringify(formattedResponse), {
      status: res.status,
      headers: res.headers,
    });
  } else {
    // 非 JSON 响应不做修改，原样返回
    c.res = res;
  }
};