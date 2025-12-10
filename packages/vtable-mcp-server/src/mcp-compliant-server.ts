/**
 * VTable MCP WebSocket 服务器（MCP 协议兼容版）
 *
 * 这个服务器充当 Cursor AI 和浏览器中 VTable 实例之间的桥梁。
 *
 * 架构角色：
 * ```
 * Cursor AI (通过 vtable-mcp-cli)
 *     ↓ HTTP POST (JSON-RPC)
 * 本服务器 (端口 3000)
 *     ↓ WebSocket
 * VTable 实例（浏览器）
 * ```
 *
 * 主要功能：
 * 1. 接收 AI 的工具调用（HTTP）
 * 2. 通过 WebSocket 转发给对应的 VTable 实例
 * 3. 管理多个 session（多用户支持）
 * 4. 提供健康检查接口
 *
 * 端点：
 * - POST /mcp - MCP 协议接口（JSON-RPC）
 * - GET /health - 健康检查
 * - ws://localhost:3000/mcp - WebSocket 连接
 *
 * @module mcp-compliant-server
 */

import express from 'express';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { mcpToolRegistry } from '../../vtable-mcp/cjs/index.js';

/**
 * Express 应用和基础配置
 */
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// 中间件
app.use(cors());  // 允许跨域（VTable 可能在不同端口）
app.use(express.json());  // 解析 JSON 请求体

/**
 * Session 管理
 *
 * 使用 Map 存储每个 session 的 WebSocket 连接。
 * key: sessionId (如 "default", "user123")
 * value: WebSocket 连接对象
 *
 * 这样实现了多用户隔离：不同 session 的消息互不干扰。
 */
const sessions = new Map<string, WebSocket>();

/**
 * 工具列表缓存
 *
 * 存储每个 session 的工具列表。
 * 当 VTable 实例连接时，会发送工具列表，我们缓存起来。
 * 当 AI 请求 tools/list 时，直接返回缓存的列表。
 */
const sessionTools = new Map<string, any[]>();

/**
 * WebSocket 服务器
 *
 * noServer: true 表示不自动创建 HTTP 服务器，
 * 而是手动处理 upgrade 事件，这样可以和 Express 共用端口。
 */
const wss = new WebSocketServer({ noServer: true });

/**
 * WebSocket 连接事件处理
 *
 * 当浏览器中的 VTable 实例连接时触发。
 */
wss.on('connection', (ws: WebSocket, request: any) => {
  // 从 URL 参数提取 session_id
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const sessionId = url.searchParams.get('session_id') || 'default';

  console.log(`[MCP Server] VTable client connected: session_id=${sessionId}`);

  // 存储连接
  sessions.set(sessionId, ws);

  /**
   * 接收来自 VTable 的消息
   *
   * 主要消息类型：
   * - tools_list: VTable 发送的工具列表
   * - tool_result: 工具执行结果
   */
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      // 缓存工具列表
      if (message.type === 'tools_list') {
        sessionTools.set(sessionId, message.tools || []);
        console.log(`[MCP Server] Cached ${message.tools?.length || 0} tools for ${sessionId}`);
      }

      // 可以在这里处理 tool_result，用于异步响应
    } catch (error) {
      console.error('[MCP Server] Message parse error:', error);
    }
  });

  /**
   * WebSocket 连接关闭
   */
  ws.on('close', () => {
    console.log(`[MCP Server] VTable client disconnected: ${sessionId}`);
    sessions.delete(sessionId);
    sessionTools.delete(sessionId);
  });

  /**
   * WebSocket 错误
   */
  ws.on('error', (error) => {
    console.error(`[MCP Server] WebSocket error for ${sessionId}:`, error.message);
  });
});

/**
 * MCP 协议接口（HTTP POST）
 *
 * 这是 vtable-mcp-cli 调用的接口。
 * 支持标准的 JSON-RPC 2.0 协议。
 */
app.post('/mcp', async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  // 验证 JSON-RPC 版本
  if (jsonrpc !== '2.0') {
    return res.json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' },
      id: null,
    });
  }

  /**
   * tools/list - 返回工具列表
   */
  if (method === 'tools/list') {
    const sessionId = params?.sessionId || 'default';
    const tools = sessionTools.get(sessionId) || [];

    // 使用统一工具注册表获取工具模式
    const toolSchemas: Record<string, any> = {};
    const jsonSchemaTools = mcpToolRegistry.getJsonSchemaTools();

    jsonSchemaTools.forEach(tool => {
      // 获取服务器端工具名称
      const serverToolName = mcpToolRegistry.getServerToolName(tool.name);
      toolSchemas[serverToolName] = tool.inputSchema;
    });

    return res.json({
      jsonrpc: '2.0',
      result: {
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description || '',
          inputSchema: toolSchemas[tool.name] || {
            type: 'object',
            properties: {},
          },
        })),
      },
      id,
    });
  }

  /**
   * tools/call - 执行工具
   */
  if (method === 'tools/call') {
    const { name: toolName, arguments: toolArgs } = params;

    // 从参数中提取 sessionId
    const sessionId = toolArgs?.sessionId || 'default';

    // 查找对应的 WebSocket 连接
    const wsClient = sessions.get(sessionId);

    if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32001,
          message: `Session "${sessionId}" not found or not connected`
        },
        id,
      });
    }

    // 生成调用 ID 用于追踪
    const callId = uuidv4();

    // 从参数中移除 sessionId，只发送工具需要的参数
    const { sessionId: _, ...actualParams } = toolArgs || {};

    // 通过 WebSocket 发送给 VTable 实例
    wsClient.send(JSON.stringify({
      type: 'tool_call',
      toolName,
      params: actualParams,
      callId,
    }));

    // 简化实现：立即返回成功
    // 生产环境应该等待 VTable 的 tool_result 响应
    return res.json({
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: `Tool "${toolName}" called successfully`,
          },
        ],
      },
      id,
    });
  }

  // 未知方法
  return res.json({
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: `Method not found: ${method}`
    },
    id,
  });
});

/**
 * 健康检查接口
 *
 * 用于监控和调试，返回当前状态。
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sessions: Array.from(sessions.keys()),
    tools: Object.fromEntries(sessionTools),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 启动 HTTP 服务器
 */
const server = app.listen(PORT, () => {
  console.log(`[MCP Server] Running on port ${PORT}`);
  console.log(`[MCP Server] MCP Protocol Endpoint: http://localhost:${PORT}/mcp`);
  console.log(`[MCP Server] WebSocket Endpoint: ws://localhost:${PORT}/mcp`);
  console.log(`[MCP Server] Health Check: http://localhost:${PORT}/health`);
});

/**
 * 处理 WebSocket Upgrade
 *
 * 当浏览器请求 WebSocket 连接时，
 * HTTP 服务器会触发 upgrade 事件，我们在这里处理。
 */
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);

  // 只处理 /mcp 路径的 WebSocket upgrade
  if (url.pathname === '/mcp') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    // 其他路径拒绝
    socket.destroy();
  }
});

/**
 * 优雅关闭
 *
 * 收到 SIGTERM 信号时（如 Ctrl+C），优雅地关闭服务器。
 */
process.on('SIGTERM', () => {
  console.log('[MCP Server] Received SIGTERM, shutting down gracefully...');

  // 关闭所有 WebSocket 连接
  sessions.forEach((ws, sessionId) => {
    console.log(`[MCP Server] Closing session: ${sessionId}`);
    ws.close();
  });

  // 关闭 HTTP 服务器
  server.close(() => {
    console.log('[MCP Server] Server closed');
    process.exit(0);
  });
});

console.log('[MCP Server] VTable MCP Server starting...');