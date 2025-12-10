const WebSocket = require('ws');

console.log('[Test] 测试完整通信链路...');

// 1. 首先创建WebSocket连接（模拟VTable实例）
const ws = new WebSocket('ws://localhost:3001/mcp?session_id=full-test');

ws.on('open', function open() {
  console.log('[Test] WebSocket连接已建立');

  // 2. 发送工具列表到服务器
  const toolsMessage = {
    type: 'tools_list',
    tools: [
      {
        name: 'test_tool',
        description: 'A test tool for validation',
        inputSchema: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Test message' }
          },
          required: ['message']
        }
      }
    ],
    sessionId: 'full-test'
  };

  ws.send(JSON.stringify(toolsMessage));
  console.log('[Test] 已发送工具列表');
});

ws.on('message', function message(data) {
  const response = JSON.parse(data.toString());
  console.log('[Test] 收到WebSocket消息:', response);

  if (response.type === 'connected') {
    console.log('[Test] 连接确认，sessionId:', response.sessionId);

    // 3. 测试HTTP API调用
    setTimeout(() => {
      testHTTPToolCall();
    }, 1000);
  }

  if (response.type === 'tool_call') {
    console.log('[Test] 收到工具调用:', response);

    // 4. 模拟工具执行并返回结果
    const result = {
      type: 'tool_result',
      callId: response.callId,
      result: {
        success: true,
        message: `Processed: ${response.params?.message}`,
        timestamp: new Date().toISOString()
      }
    };

    ws.send(JSON.stringify(result));
    console.log('[Test] 已发送工具执行结果');
  }
});

ws.on('error', function error(err) {
  console.error('[Test] WebSocket错误:', err.message);
});

ws.on('close', function close() {
  console.log('[Test] WebSocket连接已关闭');
});

// 测试HTTP工具调用
async function testHTTPToolCall() {
  console.log('[Test] 测试HTTP工具调用...');

  try {
    const response = await fetch('http://localhost:3001/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test-call-1',
        method: 'tools/call',
        params: {
          name: 'test_tool',
          arguments: {
            sessionId: 'full-test',
            message: 'Hello from HTTP test!'
          }
        }
      })
    });

    const result = await response.json();
    console.log('[Test] HTTP调用结果:', result);

  } catch (error) {
    console.error('[Test] HTTP调用失败:', error.message);
  }
}

// 等待测试完成后再退出
setTimeout(() => {
  console.log('[Test] 测试完成，关闭连接');
  ws.close();
  process.exit(0);
}, 15000);