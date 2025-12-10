#!/usr/bin/env node
/**
 * VTable MCP Server - stdio 版本
 * Cursor 通过 stdin/stdout 通信（标准 MCP 方式）
 * 使用统一MCP工具定义系统
 */
import * as readline from 'readline';
import { mcpToolRegistry, MCP_TOOL_MAPPINGS } from '../../vtable-mcp/cjs/index.js';

const VTABLE_API_URL = 'http://localhost:3000/mcp';

// 创建 stdio 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// 从统一工具注册表获取工具定义
const tools = mcpToolRegistry.getExportableTools().map((tool: any) => {
  const jsonSchemaTool = mcpToolRegistry.getJsonSchemaTools().find((t: any) => t.name === tool.name);
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: jsonSchemaTool?.inputSchema || { type: 'object' },
  };
});

// 处理请求
rl.on('line', async (line: string) => {
  try {
    const request = JSON.parse(line);
    const { jsonrpc, method, params, id } = request;

    if (method === 'initialize') {
      // 初始化响应
      respond({
        jsonrpc: '2.0',
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'vtable-mcp-server',
            version: '0.1.0',
          },
        },
        id,
      });
    } else if (method === 'tools/list') {
      // 返回工具列表
      respond({
        jsonrpc: '2.0',
        result: { tools },
        id,
      });
    } else if (method === 'tools/call') {
      // 调用工具
      const { name: toolName, arguments: toolArgs } = params;

      try {
        // 使用统一工具注册表进行名称映射和参数转换
        const mcpToolName = MCP_TOOL_MAPPINGS.getServerToolName(toolName);
        const mcpParams = MCP_TOOL_MAPPINGS.transformParameters(toolName, {
          ...toolArgs,
          sessionId: 'default', // 添加默认会话ID
        });

        // 调用 HTTP MCP Server
        const response = await fetch(VTABLE_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: mcpToolName,
              arguments: mcpParams,
            },
            id: 1,
          }),
        });

        const result = await response.json();

        respond({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: `Success: ${JSON.stringify(result)}`,
              },
            ],
          },
          id,
        });
      } catch (error: any) {
        respond({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: error.message,
          },
          id,
        });
      }
    }
  } catch (error: any) {
    console.error('[stdio MCP] Error:', error.message);
  }
});

function respond(message: any) {
  console.log(JSON.stringify(message));
}

console.error('[stdio MCP] VTable MCP Server started (stdio mode)');