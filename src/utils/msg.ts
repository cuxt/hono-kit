// utils/msg.ts

// 企业微信
async function corp (from: string, title: string, desc: string, content: string) {
  const msg = {
    msgtype: 'text',
    text: {
      content: `${title}\n${desc}\n\n${content}`,
    },
  }
  
  try {
    const response = await fetch(from, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msg),
    });

    if (!response) {
      throw new Error('Failed to send message');
    }


    const data = await response.json() as { errcode: number, errmsg: string };
    const { errcode, errmsg } = data;
    return data;

  } catch (error: any) {
    throw new Error(`Error sending message: ${error.message}`);
  }
};

export { corp };