#!/usr/bin/env node
/**
 * MCP stdio smoke test for vtable-mcp-cli
 *
 * This script spawns `dist/index.js` (stdio MCP server) and simulates a MCP client:
 * - initialize
 * - tools/list
 *
 * Optional (when MCP server is running and VTABLE_API_URL points to it):
 * - tools/call set_cell_data + get_cell_data to verify end-to-end
 *
 * Usage:
 *   node scripts/mcp-smoke-stdio.js
 *   MCP_SMOKE_CALL=1 VTABLE_API_URL=http://localhost:3000/mcp node scripts/mcp-smoke-stdio.js
 *
 * Env:
 *   VTABLE_API_URL       default: http://localhost:3000/mcp
 *   VTABLE_SESSION_ID    default: default
 *   MCP_SMOKE_CALL       default: 0 (set to 1 to do set/get call)
 *   MCP_TIMEOUT_MS       default: 15000
 */

const path = require('path');
const { spawn } = require('child_process');

const CLI_ENTRY = path.join(__dirname, '..', 'dist', 'index.js');
const API_URL = process.env.VTABLE_API_URL || 'http://localhost:3000/mcp';
const SESSION_ID = process.env.VTABLE_SESSION_ID || 'default';
const DO_CALL = process.env.MCP_SMOKE_CALL === '1';
const TIMEOUT_MS = Number.isFinite(Number(process.env.MCP_TIMEOUT_MS)) ? Number(process.env.MCP_TIMEOUT_MS) : 15000;

function log(...args) {
  // eslint-disable-next-line no-console
  console.log('[mcp-smoke-stdio]', ...args);
}

function parseCliWrappedResult(resp) {
  // CLI returns: { result: { content: [{ type:'text', text: JSON.stringify(serverJsonRpc) }] } }
  const outerText = resp?.result?.content?.[0]?.text;
  if (typeof outerText !== 'string') return null;
  const serverJson = JSON.parse(outerText);
  if (serverJson?.error) {
    const msg = serverJson.error?.message || 'Server error';
    throw new Error(`Server JSON-RPC Error: ${msg}`);
  }
  const innerText = serverJson?.result?.content?.[0]?.text;
  return typeof innerText === 'string' ? JSON.parse(innerText) : serverJson?.result;
}

async function main() {
  log('spawn', CLI_ENTRY);
  log('VTABLE_API_URL', API_URL);
  log('VTABLE_SESSION_ID', SESSION_ID);
  log('MCP_SMOKE_CALL', DO_CALL ? '1' : '0');

  const child = spawn(process.execPath, [CLI_ENTRY], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, VTABLE_API_URL: API_URL, VTABLE_SESSION_ID: SESSION_ID }
  });

  child.stderr.on('data', d => process.stderr.write(d));

  let buf = '';
  const pending = new Map();
  child.stdout.on('data', d => {
    buf += d.toString('utf8');
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      if (msg && msg.id !== undefined && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    }
  });

  function send(req) {
    return new Promise((resolve, reject) => {
      pending.set(req.id, resolve);
      child.stdin.write(JSON.stringify(req) + '\n');
      setTimeout(() => {
        if (pending.has(req.id)) {
          pending.delete(req.id);
          reject(new Error(`Timeout waiting response id=${req.id}`));
        }
      }, TIMEOUT_MS);
    });
  }

  const initResp = await send({ jsonrpc: '2.0', method: 'initialize', params: {}, id: 1 });
  if (initResp.error) throw new Error(initResp.error.message || 'initialize failed');
  log('initialize ok');

  const toolsResp = await send({ jsonrpc: '2.0', method: 'tools/list', params: {}, id: 2 });
  if (toolsResp.error) throw new Error(toolsResp.error.message || 'tools/list failed');
  const tools = toolsResp?.result?.tools || [];
  log('tools/list ok, tools=', tools.length);

  if (DO_CALL) {
    const setResp = await send({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: 'set_cell_data', arguments: { items: [{ row: 0, col: 0, value: 'hello' }] } },
      id: 3
    });
    if (setResp.error) throw new Error(setResp.error.message || 'tools/call set_cell_data failed');
    log('set_cell_data result:', parseCliWrappedResult(setResp));

    const getResp = await send({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: 'get_cell_data', arguments: { cells: [{ row: 0, col: 0 }] } },
      id: 4
    });
    if (getResp.error) throw new Error(getResp.error.message || 'tools/call get_cell_data failed');
    log('get_cell_data result:', parseCliWrappedResult(getResp));
  }

  child.kill();
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('[mcp-smoke-stdio] failed:', err.message);
  process.exit(1);
});


