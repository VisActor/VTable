/**
 * Shared configuration constants for VTable MCP packages
 * This ensures consistency across CLI, server, and core packages
 */

export const MCP_CONFIG = {
  // Default ports
  DEFAULT_SERVER_PORT: 3000,
  DEFAULT_CLI_PORT: 3000, // CLI connects to server, so uses same port

  // Default URLs
  DEFAULT_SERVER_URL: 'http://localhost:3000',
  DEFAULT_MCP_ENDPOINT: '/mcp',

  // Default session settings
  DEFAULT_SESSION_ID: 'default',

  // API endpoints
  HEALTH_ENDPOINT: '/health',
  TOOL_CALL_ENDPOINT: '/mcp/tool-call',

  // WebSocket path
  WEBSOCKET_PATH: '/mcp',

  // Protocol settings
  JSON_RPC_VERSION: '2.0',
  MCP_PROTOCOL_VERSION: '2024-11-05',

  // Error codes
  ERROR_CODES: {
    PARSE_ERROR: -32700,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    INVALID_PARAMS: -32602,
    INTERNAL_ERROR: -32603,
    SERVER_ERROR: -32000
  }
} as const;

// Helper functions
export function getDefaultServerUrl(): string {
  return `${MCP_CONFIG.DEFAULT_SERVER_URL}${MCP_CONFIG.DEFAULT_MCP_ENDPOINT}`;
}

export function getHealthCheckUrl(port: number = MCP_CONFIG.DEFAULT_SERVER_PORT): string {
  return `http://localhost:${port}${MCP_CONFIG.HEALTH_ENDPOINT}`;
}

export function getWebSocketUrl(port: number = MCP_CONFIG.DEFAULT_SERVER_PORT): string {
  return `ws://localhost:${port}${MCP_CONFIG.WEBSOCKET_PATH}`;
}
