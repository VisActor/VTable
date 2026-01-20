#!/usr/bin/env node
/**
 * VTable MCP Server - stdio 版本
 * Cursor 通过 stdin/stdout 通信（标准 MCP 方式）
 * 使用统一MCP工具定义系统
 */
import * as readline from 'readline';
import { mcpToolRegistry } from '../../vtable-mcp/cjs/index.js';

const VTABLE_API_URL = 'http://localhost:3000/mcp';

// 创建 stdio 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// 从统一工具注册表获取工具定义
const tools = mcpToolRegistry.getExportableTools().map(tool => {
  const jsonSchemaTool = mcpToolRegistry.getJsonSchemaTools().find(t => t.name === tool.name);
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: jsonSchemaTool?.inputSchema || { type: 'object' }
  };
});

// 处理请求
rl.on('line', async (line: string) => {
  try {
    const request: unknown = JSON.parse(line);
    if (!request || typeof request !== 'object') {
      return;
    }
    const req = request as { method?: string; params?: unknown; id?: unknown };
    const { method, params, id } = req;

    if (method === 'initialize') {
      // 初始化响应
      respond({
        jsonrpc: '2.0',
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'vtable-mcp-server',
            version: '0.1.0'
          }
        },
        id
      });
    } else if (method === 'tools/list') {
      // 返回工具列表
      respond({
        jsonrpc: '2.0',
        result: { tools },
        id
      });
    } else if (method === 'tools/call') {
      // 调用工具
      if (!params || typeof params !== 'object') {
        return;
      }
      const p = params as { name?: string; arguments?: Record<string, unknown> };
      const toolName = p.name;
      const toolArgs = p.arguments;
      if (!toolName || typeof toolName !== 'string') {
        return;
      }

      try {
        // 同名同参：不做 toolName 或参数结构映射，仅补全 sessionId
        const mcpToolName = toolName;
        const mcpParams = {
          ...(toolArgs || {}),
          sessionId: 'default'
        };

        // 调用 HTTP MCP Server
        const response = await fetch(VTABLE_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: mcpToolName,
              arguments: mcpParams
            },
            id: 1
          })
        });

        const result = await response.json();

        respond({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: `Success: ${JSON.stringify(result)}`
              }
            ]
          },
          id
        });
      } catch (error: unknown) {
        const err = error as { message?: string };
        respond({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: err?.message || 'Unknown error'
          },
          id
        });
      }
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('[stdio MCP] Error:', err?.message || 'Unknown error');
  }
});

function respond(message: unknown) {
  console.log(JSON.stringify(message));
}

console.error('[stdio MCP] VTable MCP Server started (stdio mode)');
