#!/usr/bin/env node
/**
 * VTable MCP CLI - stdio MCP Server
 *
 * This is a standard stdio mode MCP Server that allows AI assistants (like Cursor, Claude)
 * to control VTable through the Model Context Protocol.
 *
 * Architecture:
 * ```
 * Cursor AI
 *     ↓ stdin/stdout (JSON-RPC)
 * vtable-mcp-cli (this process)
 *     ↓ HTTP
 * VTable MCP Server (localhost:3000/mcp)
 *     ↓ WebSocket
 * VTable Instance (browser)
 * ```
 *
 * Communication Protocol:
 * - Input (stdin): JSON-RPC requests sent by Cursor
 * - Output (stdout): JSON-RPC responses returned to Cursor
 * - Error (stderr): Log information, does not affect stdio communication
 *
 * Environment Variables:
 * - VTABLE_API_URL: VTable MCP Server address (default: http://localhost:3000/mcp)
 * - VTABLE_SESSION_ID: Session ID (default: default)
 *
 * @module vtable-mcp-cli
 */

import * as readline from 'readline';
// Use unified MCP tool definitions (single source of truth)
import { mcpToolRegistry } from '../../vtable-mcp/cjs/index.js';
import { MCP_CONFIG, getDefaultServerUrl } from '../../vtable-mcp/cjs/config.js';

/**
 * Configuration constants
 */
const CONFIG = {
  /** VTable MCP Server API address */
  API_URL: process.env.VTABLE_API_URL || getDefaultServerUrl(),

  /** Default session ID */
  SESSION_ID: process.env.VTABLE_SESSION_ID || MCP_CONFIG.DEFAULT_SESSION_ID
} as const;

/**
 * Create stdio interface
 *
 * - terminal: false indicates this is not an interactive terminal, but for inter-process communication
 * - input: process.stdin - read from standard input
 * - output: process.stdout - write to standard output
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/**
 * MCP tool definitions
 *
 * Uses shared tool metadata (from @visactor/vtable-mcp)
 *
 * These tools are exposed to Cursor AI.
 * Tool definitions are generated directly from shared metadata, identical to browser side.
 *
 * Unified naming principles:
 * - ✅ CLI and browser use the same tool names
 * - ✅ Use the same parameter format
 * - ✅ No mapping and transformation needed
 *
 * Examples:
 * - set_cell_data: set cell (same for CLI and browser)
 * - get_cell_data: get cell (same for CLI and browser)
 */

/**
 * Generate CLI tool list from unified tool registry
 *
 * 单一真相来源：直接使用核心 registry 生成的 JSON Schema tools。
 */
const TOOLS = mcpToolRegistry.getJsonSchemaTools();

/**
 * Validate JSON-RPC request structure
 */
function isValidJsonRpcRequest(req: any): boolean {
  if (!req || typeof req !== 'object') {
    return false;
  }

  // Check required JSON-RPC fields
  if (req.jsonrpc !== '2.0') {
    return false;
  }

  if (!req.method || typeof req.method !== 'string') {
    return false;
  }

  // Validate ID if present (can be string, number, or null)
  if ('id' in req && req.id !== null && typeof req.id !== 'string' && typeof req.id !== 'number') {
    return false;
  }

  // Validate params if present
  if ('params' in req && req.params !== null && typeof req.params !== 'object') {
    return false;
  }

  return true;
}

/**
 * Handle MCP requests
 *
 * Listen to each line of stdin input, parse as JSON-RPC requests and handle them.
 *
 * Supported MCP methods:
 * - initialize: MCP handshake and capability negotiation
 * - tools/list: return available tool list
 * - tools/call: execute tool calls
 */
rl.on('line', async (line: string) => {
  try {
    // Parse JSON-RPC request
    let req: any;
    try {
      req = JSON.parse(line);
    } catch (parseError: any) {
      console.error('[VTable MCP] Parse error:', parseError.message);
      return; // Don't respond to malformed JSON
    }

    // Validate JSON-RPC structure
    if (!isValidJsonRpcRequest(req)) {
      console.error('[VTable MCP] Invalid JSON-RPC request structure');
      if (req && req.id !== undefined) {
        respond({
          jsonrpc: '2.0',
          error: {
            code: MCP_CONFIG.ERROR_CODES.INVALID_REQUEST,
            message: 'Invalid JSON-RPC request format'
          },
          id: req.id
        });
      }
      return;
    }

    // Route to appropriate handler
    if (req.method === 'initialize') {
      handleInitialize(req);
    } else if (req.method === 'tools/list') {
      handleToolsList(req);
    } else if (req.method === 'tools/call') {
      await handleToolsCall(req);
    } else {
      // Unknown method, return error (only if has id)
      if (req.id !== undefined) {
        respond({
          jsonrpc: '2.0',
          error: {
            code: MCP_CONFIG.ERROR_CODES.METHOD_NOT_FOUND,
            message: `Method not found: ${req.method}`
          },
          id: req.id
        });
      }
    }
  } catch (error: any) {
    // Parse error, log but don't return response (avoid format errors)
    console.error('[VTable MCP] Parse error:', error.message);
  }
});

/**
 * Handle initialize request
 *
 * MCP protocol handshake step, returns server information and capabilities.
 *
 * @param req - JSON-RPC request object
 */
function handleInitialize(req: any): void {
  respond({
    jsonrpc: '2.0',
    result: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {} // Declare tool capability support
      },
      serverInfo: {
        name: 'vtable-mcp-cli',
        version: '1.0.0'
      }
    },
    id: req.id
  });
}

/**
 * Handle tools/list request
 *
 * Returns list of all available tools.
 * Cursor will call this interface to discover available tools.
 *
 * @param req - JSON-RPC request object
 */
function handleToolsList(req: any): void {
  respond({
    jsonrpc: '2.0',
    result: {
      tools: TOOLS
    },
    id: req.id
  });
}

/**
 * Handle tools/call request
 *
 * Core logic for executing tool calls:
 * 1. Convert Cursor's tool call to VTable MCP Server format
 * 2. Send to VTable MCP Server via HTTP
 * 3. Wait for execution result
 * 4. Return to Cursor
 *
 * @param req - JSON-RPC request object
 */
async function handleToolsCall(req: any): Promise<void> {
  try {
    // Validate request structure
    if (!req.params || typeof req.params !== 'object') {
      throw new Error('Invalid request: missing params object');
    }

    const { name, arguments: args } = req.params;

    // Validate tool name
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid tool name: must be a non-empty string');
    }

    // Validate arguments
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments: must be an object');
    }

    // Debug logs
    console.error(`[VTable MCP CLI] Received tool call: ${name}`);
    console.error(`[VTable MCP CLI] Arguments:`, JSON.stringify(args, null, 2));

    // Check if tool exists in our registry
    const toolExists = TOOLS.some(tool => tool.name === name);
    if (!toolExists) {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Forward tool call to VTable MCP Server
    const result = await callVTableAPI(name, args);

    // Return success response
    respond({
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result)
          }
        ]
      },
      id: req.id
    });
  } catch (error: any) {
    // Log detailed error information
    console.error(`[VTable MCP CLI] Tool call error:`, error.message);
    console.error(`[VTable MCP CLI] Error stack:`, error.stack);

    // Return error response
    respond({
      jsonrpc: '2.0',
      error: {
        code: MCP_CONFIG.ERROR_CODES.SERVER_ERROR,
        message: error.message
      },
      id: req.id
    });
  }
}

/**
 * Call VTable MCP Server API
 *
 * Forward stdio MCP tool calls to VTable MCP Server.
 * Uses unified tool registry for parameter transformation
 *
 * @param toolName - Tool name (client format)
 * @param args - Tool parameters (client format)
 * @returns VTable MCP Server response
 * @throws If connection fails or API returns error
 */
async function callVTableAPI(toolName: string, args: any): Promise<any> {
  // 统一命名/统一参数：不做任何 toolName 或参数结构的映射转换
  const serverTool = toolName;
  const finalParams = { ...args, sessionId: CONFIG.SESSION_ID };

  // Build request body
  const requestBody = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: serverTool,
      arguments: finalParams
    },
    id: 1
  };

  // Debug logs (output to stderr, doesn't affect stdio communication)
  console.error(`[VTable MCP CLI] Calling tool: ${toolName}`);
  console.error(`[VTable MCP CLI] Request params:`, JSON.stringify(finalParams, null, 2));

  // Call HTTP API with timeout and retry logic
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 10000; // 10 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const jsonResponse = (await response.json()) as any;

      // Check error field in JSON-RPC response
      // Server might return HTTP 200, but JSON-RPC response contains error
      if (jsonResponse.error) {
        throw new Error(`JSON-RPC Error [${jsonResponse.error.code}]: ${jsonResponse.error.message}`);
      }

      return jsonResponse;
    } catch (error: any) {
      console.error(`[VTable MCP CLI] API call attempt ${attempt} failed:`, error.message);

      if (attempt === MAX_RETRIES) {
        throw new Error(`API call failed after ${MAX_RETRIES} attempts: ${error.message}`);
      }

      // Wait before retry (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.error(`[VTable MCP CLI] Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error('API call failed: Max retries exceeded');
}

/**
 * Send JSON-RPC response
 *
 * Send response to Cursor via stdout.
 * Must be standard JSON-RPC 2.0 format.
 *
 * Note:
 * - Use console.log to output to stdout
 * - Must be single-line JSON (no line breaks)
 * - Don't use console.error here (will interfere with stdio communication)
 *
 * @param msg - Response message object
 */
function respond(msg: any): void {
  console.log(JSON.stringify(msg));
}

/**
 * Startup logs
 *
 * Use console.error to output to stderr, won't interfere with stdio communication.
 * Cursor will display this information in the logs panel.
 */
console.error('[VTable MCP CLI] Started successfully');
console.error('[VTable MCP CLI] Protocol: stdio (JSON-RPC 2.0)');
console.error('[VTable MCP CLI] Tools:', TOOLS.map(t => t.name).join(', '));
console.error('[VTable MCP CLI] Target API:', CONFIG.API_URL);
console.error('[VTable MCP CLI] Session ID:', CONFIG.SESSION_ID);
console.error('[VTable MCP CLI] Waiting for requests...');
