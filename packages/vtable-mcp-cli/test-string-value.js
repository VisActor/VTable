#!/usr/bin/env node
/**
 * 测试字符串值参数的工具调用
 */

const { MCP_TOOL_MAPPINGS, mcpToolRegistry } = require('../vtable-mcp/cjs/index.js');

// 模拟 Cursor 发送的工具调用请求
const simulateToolCall = (toolName, args) => {
  console.log('\n=== 模拟工具调用 ===');
  console.log('工具名称:', toolName);
  console.log('参数:', JSON.stringify(args, null, 2));

  try {
    // 步骤1: 将服务器端工具名称转换为客户端工具名称
    const clientToolName = MCP_TOOL_MAPPINGS.getClientToolName(toolName);
    console.log('客户端工具名称:', clientToolName);

    // 步骤2: 再次转换为服务器端工具名称（用于验证）
    const serverTool = MCP_TOOL_MAPPINGS.getServerToolName(clientToolName);
    console.log('服务器端工具名称:', serverTool);

    // 步骤3: 转换参数
    const serverParams = MCP_TOOL_MAPPINGS.transformParameters(clientToolName, args);
    console.log('转换后的参数:', JSON.stringify(serverParams, null, 2));

    // 步骤4: 构建完整的请求体
    const requestBody = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: serverTool,
        arguments: {
          sessionId: 'default',
          ...serverParams,
        },
      },
      id: 1,
    };

    // 步骤5: 序列化为 JSON
    const jsonString = JSON.stringify(requestBody);
    console.log('JSON 字符串长度:', jsonString.length);
    console.log('JSON 字符串前100字符:', jsonString.substring(0, 100));

    // 步骤6: 验证可以正确解析
    const parsed = JSON.parse(jsonString);
    console.log('✅ JSON 解析成功');

    return { success: true, requestBody, jsonString };
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('错误堆栈:', error.stack);
    return { success: false, error: error.message };
  }
};

// 测试不同的值类型
console.log('测试 1: 字符串值 "fff"');
simulateToolCall('set_cell_data', { row: 0, col: 0, value: 'fff' });

console.log('\n测试 2: 数字值 123');
simulateToolCall('set_cell_data', { row: 0, col: 0, value: 123 });

console.log('\n测试 3: 字符串值 "test"');
simulateToolCall('set_cell_data', { row: 0, col: 0, value: 'test' });

console.log('\n测试 4: 特殊字符 "hello world"');
simulateToolCall('set_cell_data', { row: 0, col: 0, value: 'hello world' });

console.log('\n测试 5: 包含引号的字符串');
simulateToolCall('set_cell_data', { row: 0, col: 0, value: 'test "quote"' });

console.log('\n测试 6: 空字符串');
simulateToolCall('set_cell_data', { row: 0, col: 0, value: '' });

