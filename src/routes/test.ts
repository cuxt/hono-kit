import { Context, Hono } from 'hono';
import { write, read } from '../utils/kv';

export const test = new Hono();

interface Message {
  username: string;
  message: string;
}

let messages: Message[] = [];

// 接收消息
test.post('/send', async (c: Context) => {
  const { username, message: userMessage }: { username: string; message: string } = await c.req.json();
  messages.push({ username, message: userMessage });
  await write(c, 'TEST_MSG', JSON.stringify(messages));
  return c.json(messages);
});

// 获取消息
test.get('/messages', async (c: Context) => {
  if (messages.length === 0) {
    console.log('messages is empty');
    messages = JSON.parse(await read(c, 'TEST_MSG')) || [];
  }
  return c.json(messages);
});

// 返回聊天室 HTML 页面
test.get('/', (c: Context) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="zh">

    <head>
      <meta charset="UTF-8">
      <title>聊天室</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }

        #chat {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          height: 400px;
          overflow-y: auto;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        input[type="text"] {
          padding: 10px;
          width: calc(100% - 22px);
          margin-top: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
        }

        button:hover {
          background-color: #0056b3;
        }

        p {
          margin: 0;
          padding: 5px 0;
        }

        .message {
          padding: 8px;
          margin: 5px 0;
          border-radius: 5px;
        }

        .message .username {
          font-weight: bold;
        }

        .message.user1 {
          background-color: #e7f3fe;
        }

        .message.user2 {
          background-color: #d4edda;
        }
      </style>
    </head>

    <body>
      <div id="chat"></div>
      <input id="username" placeholder="用户名" type="text">
      <input id="message" placeholder="消息" type="text">
      <button id="send">发送</button>

      <script>
        const chatDiv = document.getElementById('chat');
        const usernameInput = document.getElementById('username');
        const messageInput = document.getElementById('message');
        const sendButton = document.getElementById('send');
        const baseURL = \`\${window.location.origin}/test\`;

        function fetchMessages () {
          fetch(baseURL + '/messages')
            .then(response => response.json())
            .then(data => {
              // console.log(data); // 调试输出
              if (data.status === "success" && Array.isArray(data.data)) {
                chatDiv.innerHTML = data.data.map((msg, index) => \`
                  <div class="message \${index % 2 === 0 ? 'user1' : 'user2'}">
                    <span class="username">\${msg.username}:</span> \${msg.message}
                  </div>
                \`).join('');
              } else {
                console.error("返回的数据格式不正确:", data);
              }
            })
            .catch(err => console.error("获取消息时出错:", err));
        }

        sendButton.addEventListener('click', () => {
          const username = usernameInput.value;
          const message = messageInput.value;

          fetch(baseURL + '/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, message }),
          }).then(() => {
            messageInput.value = '';
            fetchMessages(); // 发送后更新聊天内容
          });
        });

        // 定时获取消息
        setInterval(fetchMessages, 1000);
      </script>
    </body>

    </html>
  `);
});
