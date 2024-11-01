// routes/ws.ts
import { Context, Hono } from "hono";

export const ws = new Hono();

ws.get("/", (c: Context) => {
  const webSocketPair = new WebSocketPair();
  const client = webSocketPair[0];
  const server = webSocketPair[1];

  server.accept();

  server.addEventListener('message', async (event) => {
    const model = "@hf/thebloke/llama-2-13b-chat-awq";
    const answer = await c.env.AI.run(model, {
      prompt: event.data,
      stream: false
    });

    // 确保 answer 是字符串类型
    const response = typeof answer === 'string' ? answer : JSON.stringify(answer.response);

    console.log('Received message:', event.data);
    console.log('Answer:', response);

    server.send(response);
  });


  server.addEventListener('close', () => {
    console.log('Connection closed');
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
})

ws.get("/test", (c) => {
  return c.html(
    `
    <!DOCTYPE html>
    <html lang="zh">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WebSocket 测试</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #e9ecef; /* 更柔和的背景色 */
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        h1 {
          color: #343a40;
          text-align: center;
          margin: 20px 0;
          font-size: 2rem; /* 增加标题字体大小 */
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
        }

        #container {
          flex: 1;
          max-width: 800px;
          width: 100%;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          transition: transform 0.3s; /* 添加平滑过渡效果 */
        }

        #container:hover {
          transform: scale(1.02); /* 悬停时轻微放大 */
        }

        #messages {
          margin-top: 20px;
          flex: 1;
          overflow-y: auto;
          border: 1px solid #ced4da;
          border-radius: 8px;
          padding: 15px;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          transition: border-color 0.3s;
        }

        #messages:hover {
          border-color: #28a745; /* 鼠标悬停时改变边框颜色 */
        }

        .message {
          padding: 10px;
          border-radius: 8px;
          margin: 5px 0;
          max-width: 80%;
          line-height: 1.5;
          transition: background-color 0.3s;
        }

        .user-message {
          align-self: flex-end;
          background-color: #d4edda;
          color: #155724;
        }

        .server-message {
          align-self: flex-start;
          background-color: #cce5ff;
          color: #004085;
        }

        .input-container {
          display: flex;
          margin-top: 10px;
        }

        input[type="text"] {
          flex: 1;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          transition: border-color 0.3s;
          margin-right: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        input[type="text"]:focus {
          border-color: #28a745;
          outline: none;
          box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
        }

        button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          background-color: #28a745;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        button:hover {
          background-color: #218838;
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      </style>
    </head>

    <body>
      <div id="container">
        <h1>WebSocket 测试</h1>
        <div id="messages"></div>
        <div class="input-container">
          <input type="text" id="messageInput" placeholder="输入消息..." />
          <button id="sendButton">发送</button>
        </div>
      </div>

      <script>
        let ws;
        const reconnectInterval = 2000; // 重连时间间隔（毫秒）

        function connectWebSocket() {
          ws = new WebSocket('wss://api.xbxin.com/ws');

          ws.onopen = () => {
            console.log('WebSocket 已连接');
          };

          ws.onmessage = (event) => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += \`<div class="message server-message">服务端: \${event.data}</div>\`;
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // 滚动到底部
          };

          ws.onclose = () => {
            console.log('WebSocket 已关闭，尝试重新连接...');
            setTimeout(connectWebSocket, reconnectInterval); // 设置重连
          };

          ws.onerror = (error) => {
            console.error('WebSocket 错误:', error);
            ws.close(); // 出现错误时关闭连接并触发重连
          };
        }

        document.getElementById('sendButton').addEventListener('click', () => {
          const input = document.getElementById('messageInput');
          if (input.value.trim()) {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += \`<div class="message user-message">客户端: \${input.value}</div>\`;
            ws.send(input.value);
            input.value = '';
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // 滚动到底部
          }
        });

        // 初始化 WebSocket 连接
        connectWebSocket();
      </script>
    </body>

    </html>
    `
  );
});
