#!/usr/bin/env node

/**
 * Test complete MCP tool call flow
 */

const MCP_SERVER_URL = 'http://localhost:3002';
const SESSION_ID = 'default';

async function testToolCall() {
  console.log('🧪 Testing complete MCP tool call flow...');

  // Test calling a tool through the MCP server
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'set_cell_data',
          arguments: {
            sessionId: SESSION_ID,
            items: [
              { row: 2, col: 2, value: 'MCP Test Value' }
            ]
          }
        },
        id: 1
      }),
    });

    const result = await response.json();
    console.log('✅ Tool call result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.log('❌ Tool call failed:', error.message);
  }
}

testToolCall();