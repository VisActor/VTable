const WebSocket = require('ws');

console.log('[Test] 开始测试WebSocket连接...');

// 创建WebSocket连接
const ws = new WebSocket('ws://localhost:3001/mcp?session_id=test-session');

ws.on('open', function open() {
  console.log('[Test] WebSocket连接已建立');

  // 发送工具列表
  const toolsMessage = {
    type: 'tools_list',
    tools: [
      {
        name: 'set_cell_data',
        description: 'Set cell data',
        inputSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  row: { type: 'number' },
                  col: { type: 'number' },
                  value: { description: 'Cell value' }
                },
                required: ['row', 'col', 'value']
              }
            }
          },
          required: ['items']
        }
      }
    ],
    sessionId: 'test-session'
  };

  ws.send(JSON.stringify(toolsMessage));
  console.log('[Test] 已发送工具列表');
});

ws.on('message', function message(data) {
  const response = JSON.parse(data.toString());
  console.log('[Test] 收到消息:', response);
});

ws.on('error', function error(err) {
  console.error('[Test] WebSocket错误:', err.message);
});

ws.on('close', function close() {
  console.log('[Test] WebSocket连接已关闭');
});

// 5秒后关闭连接
setTimeout(() => {
  console.log('[Test] 主动关闭连接');
  ws.close();
}, 5000);