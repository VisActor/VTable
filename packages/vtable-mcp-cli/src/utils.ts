/**
 * 工具函数
 * @module utils
 */

/**
 * 安全的 JSON 解析
 */
export function safeJsonParse(text: string): { success: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(text);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 验证 JSON-RPC 请求格式
 */
export function validateJsonRpcRequest(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid JSON-RPC request: not an object' };
  }

  if (data.jsonrpc !== '2.0') {
    return { valid: false, error: 'Invalid JSON-RPC request: missing or invalid jsonrpc field' };
  }

  if (!data.method || typeof data.method !== 'string') {
    return { valid: false, error: 'Invalid JSON-RPC request: missing or invalid method field' };
  }

  return { valid: true };
}

/**
 * 创建错误对象
 */
export function createJsonRpcError(
  code: number,
  message: string,
  data?: any
): { code: number; message: string; data?: any } {
  return { code, message, ...(data && { data }) };
}

/**
 * 标准 JSON-RPC 错误码
 */
export const JSON_RPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR: -32000
} as const;

/**
 * 验证工具调用参数
 */
export function validateToolCallParams(params: any): { valid: boolean; error?: string } {
  if (!params || typeof params !== 'object') {
    return { valid: false, error: 'Invalid params: not an object' };
  }

  if (!params.name || typeof params.name !== 'string') {
    return { valid: false, error: 'Invalid params: missing or invalid name field' };
  }

  if (!params.arguments || typeof params.arguments !== 'object') {
    return { valid: false, error: 'Invalid params: missing or invalid arguments field' };
  }

  return { valid: true };
}
