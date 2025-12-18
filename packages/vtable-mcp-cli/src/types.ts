/**
 * MCP JSON-RPC 类型定义
 * @module types
 */

/**
 * JSON-RPC 请求接口
 */
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: any;
}

/**
 * JSON-RPC 响应接口
 */
export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: any;
  error?: JsonRpcError;
}

/**
 * JSON-RPC 错误接口
 */
export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}

/**
 * MCP 工具调用参数
 */
export interface MCPToolCallParams {
  name: string;
  arguments: any;
}

/**
 * MCP 初始化参数
 */
export interface MCPInitializeParams {
  protocolVersion: string;
  capabilities: any;
}

/**
 * 配置接口
 */
export interface CLIConfig {
  apiUrl: string;
  sessionId: string;
  timeout: number;
}

/**
 * HTTP 错误响应
 */
export interface HttpErrorResponse {
  error?: {
    code: number;
    message: string;
  };
}

/**
 * JSON-RPC HTTP 响应
 */
export interface JsonRpcHttpResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
