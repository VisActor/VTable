#!/usr/bin/env node

/**
 * 测试Cursor MCP连接
 * 模拟Cursor的stdio MCP客户端行为
 */

const { spawn } = require('child_process');

console.log('🧪 测试Cursor MCP连接...');

// 启动vtable-mcp-cli进程
const cli = spawn('node', ['/Users/bytedance/code/VTable-fork/packages/vtable-mcp-cli/dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

// 捕获输出
cli.stdout.on('data', (data) => {
  output += data.toString();
  console.log('📤 STDOUT:', data.toString().trim());
});

cli.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('📤 STDERR:', data.toString().trim());
});

// 发送initialize请求
function sendRequest(request) {
  const jsonStr = JSON.stringify(request);
  console.log('📥 发送请求:', jsonStr);
  cli.stdin.write(jsonStr + '\n');
}

// 等待启动
setTimeout(() => {
  console.log('\n📋 发送initialize请求...');
  sendRequest({
    jsonrpc: '2.0',
    method: 'initialize',
    params: {},
    id: 1
  });
}, 1000);

// 发送tools/list请求
setTimeout(() => {
  console.log('\n📋 发送tools/list请求...');
  sendRequest({
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 2
  });
}, 2000);

// 关闭连接
setTimeout(() => {
  console.log('\n📋 关闭连接...');
  cli.stdin.end();
}, 3000);

// 处理进程退出
cli.on('close', (code) => {
  console.log(`\n✅ 进程退出，代码: ${code}`);

  if (output.includes('tools')) {
    console.log('✅ MCP连接测试成功！');
  } else {
    console.log('❌ MCP连接测试失败');
  }
});

cli.on('error', (error) => {
  console.error('❌ 进程错误:', error);
});