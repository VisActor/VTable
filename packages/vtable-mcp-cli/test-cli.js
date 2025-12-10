#!/usr/bin/env node

/**
 * Test script for vtable-mcp-cli
 * Simulates Cursor's MCP client behavior
 */

const { spawn } = require('child_process');

console.log('🧪 Testing vtable-mcp-cli...');

// Start the vtable-mcp-cli process
const cli = spawn('node', ['/Users/bytedance/code/VTable-fork/packages/vtable-mcp-cli/dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

// Capture stdout
cli.stdout.on('data', (data) => {
  output += data.toString();
  console.log('📤 STDOUT:', data.toString().trim());
});

// Capture stderr
cli.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('📤 STDERR:', data.toString().trim());
});

// Send a request function
function sendRequest(request) {
  const jsonStr = JSON.stringify(request);
  console.log('📥 Sending request:', jsonStr);
  cli.stdin.write(jsonStr + '\n');
}

// Test sequence
setTimeout(() => {
  console.log('\n📋 Sending initialize request...');
  sendRequest({
    jsonrpc: '2.0',
    method: 'initialize',
    params: {},
    id: 1
  });
}, 1000);

setTimeout(() => {
  console.log('\n📋 Sending tools/list request...');
  sendRequest({
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 2
  });
}, 2000);

setTimeout(() => {
  console.log('\n📋 Closing connection...');
  cli.stdin.end();
}, 3000);

// Handle process exit
cli.on('close', (code) => {
  console.log(`\n✅ Process exited with code: ${code}`);

  if (output.includes('set_cell_data') && output.includes('get_cell_data')) {
    console.log('✅ Tools are properly loaded!');
  } else {
    console.log('❌ Tools not found in output');
  }
});

cli.on('error', (error) => {
  console.error('❌ Process error:', error);
});