#!/usr/bin/env node
/**
 * MCP HTTP smoke test (directly calls vtable-mcp-server /mcp)
 *
 * Usage:
 *   node scripts/mcp-smoke-http.js
 *
 * Env:
 *   MCP_SERVER_URL    default: http://localhost:3000
 *   VTABLE_SESSION_ID default: default
 */

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';
const SESSION_ID = process.env.VTABLE_SESSION_ID || 'default';

async function main() {
  const endpoint = `${MCP_SERVER_URL}/mcp`;
  // eslint-disable-next-line no-console
  console.log('[mcp-smoke-http] endpoint:', endpoint);
  // eslint-disable-next-line no-console
  console.log('[mcp-smoke-http] session:', SESSION_ID);

  const setRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'set_cell_data',
        arguments: { sessionId: SESSION_ID, items: [{ row: 0, col: 0, value: 'hello' }] }
      },
      id: 1
    })
  });
  const setJson = await setRes.json();
  // eslint-disable-next-line no-console
  console.log('[mcp-smoke-http] set_cell_data:', JSON.stringify(setJson, null, 2));

  const getRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get_cell_data',
        arguments: { sessionId: SESSION_ID, cells: [{ row: 0, col: 0 }] }
      },
      id: 2
    })
  });
  const getJson = await getRes.json();
  // eslint-disable-next-line no-console
  console.log('[mcp-smoke-http] get_cell_data:', JSON.stringify(getJson, null, 2));

  try {
    const text = getJson?.result?.content?.[0]?.text;
    if (typeof text === 'string') {
      // eslint-disable-next-line no-console
      console.log('[mcp-smoke-http] parsed tool_result:', JSON.parse(text));
    }
  } catch {
    // ignore
  }
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('[mcp-smoke-http] failed:', err.message);
  process.exit(1);
});


