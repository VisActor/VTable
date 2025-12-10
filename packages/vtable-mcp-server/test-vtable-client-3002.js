const WebSocket = require('ws');

console.log('[VTable Client] 模拟VTable实例连接...');

const ws = new WebSocket('ws://localhost:3002/mcp?session_id=default');

ws.on('open', function open() {
  console.log('[VTable Client] 已连接到MCP服务器');

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
    sessionId: 'default'
  };

  ws.send(JSON.stringify(toolsMessage));
  console.log('[VTable Client] 已发送工具列表');
});

ws.on('message', function message(data) {
  const message = JSON.parse(data.toString());
  console.log('[VTable Client] 收到消息:', message);

  if (message.type === 'tool_call') {
    console.log(`[VTable Client] 收到工具调用: ${message.toolName}`, message.params);

    // 模拟工具执行
    setTimeout(() => {
      const result = {
        type: 'tool_result',
        callId: message.callId,
        result: {
          success: true,
          message: `Successfully executed ${message.toolName}`,
          data: {
            processed: message.params,
            timestamp: new Date().toISOString()
          }
        }
      };

      ws.send(JSON.stringify(result));
      console.log('[VTable Client] 已发送执行结果');
    }, 1000);
  }
});

ws.on('error', function error(err) {
  console.error('[VTable Client] 错误:', err.message);
});

ws.on('close', function close() {
  console.log('[VTable Client] 连接已关闭');
});

// 保持连接运行
process.on('SIGINT', () => {
  console.log('[VTable Client] 正在关闭...');
  ws.close();
  process.exit(0);
});