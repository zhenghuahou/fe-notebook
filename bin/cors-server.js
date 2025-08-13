/**
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2025-05-22 15:01:26
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2025-08-13 14:25:41
 * @FilePath: /fe-notebook/bin/cors-server.js
 * @Description: CORS 服务器 - 用于开发环境的跨域请求支持
 */

import httpServer from 'http-server';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES Module 中替代 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建支持CORS的http-server
const server = httpServer.createServer({
  root: join(__dirname, 'public'),
  cors: {
    origin: '*', // 允许所有来源，生产环境建议设置具体域名
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`CORS服务器运行在 http://localhost:${PORT}`);
  console.log('注意：后端服务需要配置CORS头才能正常工作');
}); 