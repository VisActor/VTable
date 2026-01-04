#!/usr/bin/env node
/**
 * VTable MCP WebSocket Server (MCP Protocol Compatible)
 *
 * This server acts as a bridge between Cursor AI and VTable instances in the browser.
 *
 * Architecture:
 * ```
 * Cursor AI (via vtable-mcp-cli)
 *     ↓ HTTP POST (JSON-RPC)
 * This server (port 3000)
 *     ↓ WebSocket
 * VTable instance (browser)
 * ```
 *
 * Main functions:
 * 1. Receive AI tool calls (HTTP)
 * 2. Forward to corresponding VTable instance via WebSocket
 * 3. Manage multiple sessions (multi-user support)
 * 4. Provide health check interface
 *
 * Endpoints:
 * - POST /mcp - MCP 协议入口（JSON-RPC 2.0）
 *   - 调用方：通常是 Cursor / `vtable-mcp-cli` 之类的 MCP Client
 *   - 用途：发起 `tools/list` / `tools/call` 等请求；服务端会把 `tools/call` 转发给对应 session 的 WebSocket 客户端（浏览器里的 VTable 实例）
 *   - 示例：`POST http://localhost:3000/mcp`，body: `{ jsonrpc:"2.0", method:"tools/list", params:{ sessionId:"default" }, id:"1" }`
 *
 * - GET /health - 健康检查/调试接口
 *   - 调用方：运维探活、脚本验证、开发自检
 *   - 用途：确认服务是否存活、当前连接的 sessions、缓存的 tools 等运行态信息
 *   - 示例：`GET http://localhost:3000/health`
 *
 * - ws://localhost:3000/mcp - WebSocket 连接（浏览器端 VTable 实例接入）
 *   - 调用方：浏览器页面（demo 或业务页面）里的 VTable 实例
 *   - 用途：建立长连接并上报 `tools_list`；接收来自 server 的 `tool_call` 并在页面中执行
 *   - 示例：`ws://localhost:3000/mcp?session_id=default`
 *
 * @module mcp-compliant-server
 */

import express from 'express';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { mcpToolRegistry } from '../../vtable-mcp/cjs/index.js';
import { MCP_CONFIG } from '../../vtable-mcp/cjs/config.js';

/**
 * Express app and basic configuration
 */
const app = express();
const PORT = parseInt(process.env.PORT || MCP_CONFIG.DEFAULT_SERVER_PORT.toString(), 10);

// Middleware
app.use(cors()); // Allow cross-origin (VTable may be on different port)
app.use(express.json()); // Parse JSON request body

/**
 * Session management
 *
 * Use Map to store WebSocket connections for each session.
 * key: sessionId (e.g., "default", "user123")
 * value: WebSocket connection object
 *
 * This implements multi-user isolation: messages from different sessions don't interfere.
 */
const sessions = new Map<string, WebSocket>();

/**
 * Tool list cache
 *
 * Store tool list for each session.
 * When VTable instance connects, it sends tool list which we cache.
 * When AI requests tools/list, return the cached list directly.
 */
const sessionTools = new Map<string, Array<{ name: string; description?: string; inputSchema?: unknown }>>();

/**
 * Pending tool calls (HTTP -> WS -> HTTP)
 *
 * When we forward a `tools/call` request to the browser via WebSocket, we generate a `callId`.
 * The browser will respond with `{ type: "tool_result", callId, result }`.
 *
 * We keep a pending map so the HTTP request can await the browser execution result.
 */
type PendingToolCall = {
  sessionId: string;
  toolName: string;
  resolve: (result: any) => void;
  reject: (err: Error) => void;
  timeout: NodeJS.Timeout;
};

const pendingToolCalls = new Map<string, PendingToolCall>();

const TOOL_CALL_TIMEOUT_MS = parseInt(process.env.MCP_TOOL_TIMEOUT_MS || '15000', 10);

function waitForToolResult(callId: string, sessionId: string, toolName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingToolCalls.delete(callId);
      reject(
        new Error(
          `Tool call timeout after ${TOOL_CALL_TIMEOUT_MS}ms: ${toolName} (session=${sessionId}, callId=${callId})`
        )
      );
    }, TOOL_CALL_TIMEOUT_MS);

    pendingToolCalls.set(callId, { sessionId, toolName, resolve, reject, timeout });
  });
}

/**
 * WebSocket server
 *
 * noServer: true means don't automatically create HTTP server,
 * instead manually handle upgrade event, so it can share port with Express.
 */
const wss = new WebSocketServer({ noServer: true });

/**
 * WebSocket connection event handler
 *
 * Triggered when VTable instance in browser connects.
 */
wss.on('connection', (ws: WebSocket, request: { url?: string; headers: { host: string } }) => {
  // Extract session_id from URL parameters
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const sessionId = url.searchParams.get('session_id') || 'default';

  console.log(`[MCP Server] VTable client connected: session_id=${sessionId}`);

  // Store connection
  sessions.set(sessionId, ws);

  /**
   * Receive messages from VTable
   *
   * Main message types:
   * - tools_list: Tool list sent by VTable
   * - tool_result: Tool execution result
   */
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      // Cache tool list
      if (message.type === 'tools_list') {
        sessionTools.set(sessionId, message.tools || []);
        console.log(`[MCP Server] Cached ${message.tools?.length || 0} tools for ${sessionId}`);
      }

      // Resolve pending tool calls
      if (message.type === 'tool_result' && message.callId) {
        const pending = pendingToolCalls.get(message.callId);
        if (pending) {
          // Best-effort session validation (avoid cross-session mix-ups)
          if (pending.sessionId !== sessionId) {
            console.warn(
              `[MCP Server] tool_result session mismatch: expected=${pending.sessionId}, actual=${sessionId}, callId=${message.callId}`
            );
          }
          clearTimeout(pending.timeout);
          pendingToolCalls.delete(message.callId);
          pending.resolve(message.result);
        }
      }
    } catch (error) {
      console.error('[MCP Server] Message parse error:', error);
    }
  });

  /**
   * WebSocket connection closed
   */
  ws.on('close', () => {
    console.log(`[MCP Server] VTable client disconnected: ${sessionId}`);
    sessions.delete(sessionId);
    sessionTools.delete(sessionId);

    // Reject any pending calls for this session
    for (const [callId, pending] of pendingToolCalls.entries()) {
      if (pending.sessionId === sessionId) {
        clearTimeout(pending.timeout);
        pendingToolCalls.delete(callId);
        pending.reject(
          new Error(`Session "${sessionId}" disconnected before tool "${pending.toolName}" returned (callId=${callId})`)
        );
      }
    }
  });

  /**
   * WebSocket error
   */
  ws.on('error', error => {
    console.error(`[MCP Server] WebSocket error for ${sessionId}:`, error.message);
  });
});

/**
 * MCP protocol interface (HTTP POST)
 *
 * This is the interface called by vtable-mcp-cli.
 * Supports standard JSON-RPC 2.0 protocol.
 */
app.post('/mcp', async (req, res) => {
  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request: request body must be a JSON object'
        },
        id: null
      });
    }

    const { jsonrpc, method, params, id } = req.body;

    // Validate JSON-RPC version
    if (jsonrpc !== '2.0') {
      return res.json({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' },
        id: id || null
      });
    }

    // Validate method
    if (!method || typeof method !== 'string') {
      return res.json({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid Request: method is required and must be a string' },
        id: id || null
      });
    }

    /**
     * tools/list - Return tool list
     */
    if (method === 'tools/list') {
      const sessionId = params?.sessionId || 'default';
      const tools = sessionTools.get(sessionId) || [];

      // Use unified tool registry to get tool schemas
      const toolSchemas: Record<string, unknown> = {};
      const jsonSchemaTools = mcpToolRegistry.getJsonSchemaTools();

      jsonSchemaTools.forEach(tool => {
        // 同名同参：tool.name 即为 server/browse/cli 的统一名称
        toolSchemas[tool.name] = tool.inputSchema;
      });

      return res.json({
        jsonrpc: '2.0',
        result: {
          tools: tools.map(tool => ({
            name: tool.name,
            description: tool.description || '',
            inputSchema: toolSchemas[tool.name] || {
              type: 'object',
              properties: {}
            }
          }))
        },
        id
      });
    }

    /**
     * tools/call - Execute tool
     */
    if (method === 'tools/call') {
      const { name: toolName, arguments: toolArgs } = params || {};

      if (!toolName || typeof toolName !== 'string') {
        return res.json({
          jsonrpc: '2.0',
          error: { code: -32602, message: 'Invalid params: tool name is required' },
          id
        });
      }

      // Extract sessionId from parameters
      const sessionId = toolArgs?.sessionId || 'default';

      // Find corresponding WebSocket connection
      const wsClient = sessions.get(sessionId);

      if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
        return res.json({
          jsonrpc: '2.0',
          error: {
            code: -32001,
            message: `Session "${sessionId}" not found or not connected`
          },
          id
        });
      }

      // Generate call ID for tracking
      const callId = uuidv4();

      // Remove sessionId from parameters, only send parameters needed by tool
      const { sessionId: _, ...actualParams } = toolArgs || {};
      console.log('sessionId', _);

      // Create pending promise BEFORE sending (avoid race if browser responds fast)
      const resultPromise = waitForToolResult(callId, sessionId, toolName);

      // Send to VTable instance via WebSocket
      wsClient.send(
        JSON.stringify({
          type: 'tool_call',
          toolName,
          params: actualParams,
          callId
        })
      );

      // Await browser execution result
      try {
        const toolResult = await resultPromise;

        // Browser-side MCP client sends either:
        // - { content: [...] }
        // - { error: { code, message, ... } }
        if (toolResult?.error) {
          return res.json({
            jsonrpc: '2.0',
            error: {
              code: toolResult.error.code ?? -32603,
              message: toolResult.error.message ?? 'Tool execution failed',
              data: toolResult.error
            },
            id
          });
        }

        return res.json({
          jsonrpc: '2.0',
          result: toolResult,
          id
        });
      } catch (error: any) {
        return res.json({
          jsonrpc: '2.0',
          error: {
            code: -32002,
            message: error?.message || 'Tool call timed out'
          },
          id
        });
      }
    }

    // Unknown method
    return res.json({
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: `Method not found: ${method}`
      },
      id
    });
  } catch (error) {
    console.error('[MCP Server] Error processing request:', error);
    return res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error instanceof Error ? error.message : 'Unknown error'
      },
      id: req.body?.id || null
    });
  }
});

/**
 * Health check interface
 *
 * Used for monitoring and debugging, returns current status.
 */
app.get(MCP_CONFIG.HEALTH_ENDPOINT, (req, res) => {
  res.json({
    status: 'ok',
    sessions: Array.from(sessions.keys()),
    tools: Object.fromEntries(sessionTools),
    timestamp: new Date().toISOString()
  });
});

/**
 * Start HTTP server
 */
const server = app.listen(PORT, () => {
  console.log(`[MCP Server] Running on port ${PORT}`);
  console.log(`[MCP Server] MCP Protocol Endpoint: http://localhost:${PORT}/mcp`);
  console.log(`[MCP Server] WebSocket Endpoint: ws://localhost:${PORT}/mcp`);
  console.log(`[MCP Server] Health Check: http://localhost:${PORT}/health`);
});

/**
 * Handle WebSocket Upgrade
 *
 * When browser requests WebSocket connection,
 * HTTP server triggers upgrade event, we handle it here.
 */
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);

  // Only handle WebSocket upgrade for /mcp path
  if (url.pathname === MCP_CONFIG.WEBSOCKET_PATH) {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  } else {
    // Reject other paths
    socket.destroy();
  }
});

/**
 * Graceful shutdown
 *
 * When receiving SIGTERM signal (e.g., Ctrl+C), gracefully close server.
 */
process.on('SIGTERM', () => {
  console.log('[MCP Server] Received SIGTERM, shutting down gracefully...');

  // Close all WebSocket connections
  sessions.forEach((ws, sessionId) => {
    console.log(`[MCP Server] Closing session: ${sessionId}`);
    ws.close();
  });

  // Close HTTP server
  server.close(() => {
    console.log('[MCP Server] Server closed');
    process.exit(0);
  });
});

console.log('[MCP Server] VTable MCP Server starting...');
