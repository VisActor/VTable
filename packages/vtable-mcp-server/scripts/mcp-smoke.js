#!/usr/bin/env node
/**
 * MCP smoke test utility for vtable-mcp-server
 *
 * Goals:
 * - Unify historical ad-hoc test scripts (previously: test-websocket.js / test-vtable-client*.js / test-full-flow.js)
 * - Provide a single entry that can test:
 *   - ws-only connect + tools_list
 *   - ws "vtable client" simulation (respond tool_call -> tool_result)
 *   - full flow (ws client + http tools/call and verify response)
 *
 * Usage:
 *   node scripts/mcp-smoke.js ws
 *   node scripts/mcp-smoke.js vtable-client
 *   node scripts/mcp-smoke.js full
 *
 * Options via env:
 *   MCP_WS_URL       default: ws://localhost:3000/mcp
 *   MCP_HTTP_URL     default: http://localhost:3000/mcp
 *   MCP_SESSION_ID   default: default
 *   MCP_CLOSE_MS     default: 5000 (ws-only auto close)
 *   MCP_TIMEOUT_MS   default: 15000
 */

const WebSocket = require('ws');

function getEnvInt(name, fallback) {
  const v = parseInt(process.env[name] || '', 10);
  return Number.isFinite(v) ? v : fallback;
}

const MODE = process.argv[2] || 'full';

const WS_URL = process.env.MCP_WS_URL || 'ws://localhost:3000/mcp';
const HTTP_URL = process.env.MCP_HTTP_URL || 'http://localhost:3000/mcp';
const SESSION_ID = process.env.MCP_SESSION_ID || process.env.VTABLE_SESSION_ID || 'default';
const CLOSE_MS = getEnvInt('MCP_CLOSE_MS', 5000);
const TIMEOUT_MS = getEnvInt('MCP_TIMEOUT_MS', 15000);

async function getFetch() {
  if (typeof fetch === 'function') return fetch;
  // node-fetch is already a dependency in this package
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('node-fetch');
}

function log(...args) {
  // eslint-disable-next-line no-console
  console.log('[mcp-smoke]', ...args);
}

function sendToolsList(ws, { sessionId, tools }) {
  const msg = {
    type: 'tools_list',
    tools,
    sessionId
  };
  ws.send(JSON.stringify(msg));
}

function defaultToolsList() {
  // Minimal tool schema used by legacy scripts. Not used by real browser plugin,
  // but sufficient for server-side tools/list cache and ws handshake tests.
  return [
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
  ];
}

function testTool() {
  return [
    {
      name: 'test_tool',
      description: 'A test tool for validation',
      inputSchema: {
        type: 'object',
        properties: { message: { type: 'string', description: 'Test message' } },
        required: ['message']
      }
    }
  ];
}

function withTimeout(promise, label) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);
    promise
      .then(v => {
        clearTimeout(t);
        resolve(v);
      })
      .catch(e => {
        clearTimeout(t);
        reject(e);
      });
  });
}

async function httpToolCall({ toolName, toolArgs, id = 'smoke-call-1' }) {
  const _fetch = await getFetch();
  const body = {
    jsonrpc: '2.0',
    id,
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: { sessionId: SESSION_ID, ...(toolArgs || {}) }
    }
  };
  const resp = await _fetch(HTTP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await resp.json();
  return { status: resp.status, json };
}

async function runWsOnly() {
  log('mode=ws', 'ws=', WS_URL, 'session=', SESSION_ID);
  const ws = new WebSocket(`${WS_URL}?session_id=${encodeURIComponent(SESSION_ID)}`);
  ws.on('open', () => {
    log('ws open');
    sendToolsList(ws, { sessionId: SESSION_ID, tools: defaultToolsList() });
    log('sent tools_list');
    setTimeout(() => {
      log('closing');
      ws.close();
    }, CLOSE_MS);
  });
  ws.on('message', data => {
    try {
      const msg = JSON.parse(data.toString());
      log('ws message', msg);
    } catch {
      log('ws message (non-json)', data.toString());
    }
  });
  ws.on('error', err => log('ws error', err.message));
  ws.on('close', () => log('ws closed'));
}

async function runVTableClientSim({ wsPortHint }) {
  log('mode=vtable-client', 'ws=', WS_URL, 'session=', SESSION_ID, wsPortHint ? `(hint=${wsPortHint})` : '');
  const ws = new WebSocket(`${WS_URL}?session_id=${encodeURIComponent(SESSION_ID)}`);
  ws.on('open', () => {
    log('ws open');
    sendToolsList(ws, { sessionId: SESSION_ID, tools: defaultToolsList() });
    log('sent tools_list');
  });
  ws.on('message', data => {
    const msg = JSON.parse(data.toString());
    log('ws message', msg);
    if (msg.type === 'tool_call') {
      setTimeout(() => {
        const result = {
          type: 'tool_result',
          callId: msg.callId,
          result: {
            success: true,
            message: `Successfully executed ${msg.toolName}`,
            data: { processed: msg.params, timestamp: new Date().toISOString() }
          }
        };
        ws.send(JSON.stringify(result));
        log('sent tool_result', { callId: msg.callId });
      }, 300);
    }
  });
  ws.on('error', err => log('ws error', err.message));
  ws.on('close', () => log('ws closed'));
}

async function runFullFlow() {
  log('mode=full', 'ws=', WS_URL, 'http=', HTTP_URL, 'session=', SESSION_ID);

  // 1) Connect as a simulated client and respond to tool_call.
  const ws = new WebSocket(`${WS_URL}?session_id=${encodeURIComponent(SESSION_ID)}`);
  const opened = new Promise(resolve => ws.on('open', resolve));

  ws.on('message', data => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'tool_call') {
      const result = {
        type: 'tool_result',
        callId: msg.callId,
        result: {
          success: true,
          message: `Processed: ${msg.params?.message}`,
          timestamp: new Date().toISOString()
        }
      };
      ws.send(JSON.stringify(result));
    }
  });

  await withTimeout(opened, 'ws open');
  sendToolsList(ws, { sessionId: SESSION_ID, tools: testTool() });
  log('ws ready (tools_list sent)');

  // 2) Call tools/call over HTTP and expect server to return tool_result (after patch).
  await new Promise(r => setTimeout(r, 200));
  const { status, json } = await withTimeout(
    httpToolCall({
      toolName: 'test_tool',
      toolArgs: { message: 'Hello from mcp-smoke full-flow!' },
      id: 'full-flow-1'
    }),
    'http tools/call'
  );

  log('http status', status);
  log('http response', JSON.stringify(json, null, 2));

  ws.close();
  // Exit for CI-like usage
  setTimeout(() => process.exit(0), 50);
}

async function main() {
  if (MODE === 'ws') return runWsOnly();
  if (MODE === 'vtable-client') return runVTableClientSim({});
  if (MODE === 'full') return runFullFlow();

  // legacy aliases
  if (MODE === 'test-websocket') return runWsOnly();
  if (MODE === 'test-vtable-client') return runVTableClientSim({});
  if (MODE === 'test-full-flow') return runFullFlow();

  log('Unknown mode:', MODE);
  log('Supported:', 'ws | vtable-client | full');
  process.exit(2);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('[mcp-smoke] failed:', err);
  process.exit(1);
});


