/**
 * MCP Configuration Export for VTable
 *
 * This file provides MCP tool definitions that can be directly used
 * in mcp.json configuration files for Cursor, Claude, and other MCP clients.
 *
 * Usage in mcp.json:
 * ```json
 * {
 *   "mcpServers": {
 *     "vtable": {
 *       "command": "node",
 *       "args": ["path/to/vtable-mcp-cli"],
 *       "tools": ["vtable_set_cell", "vtable_get_cell", "vtable_get_info"]
 *     }
 *   }
 * }
 * ```
 */

import { mcpToolRegistry } from './mcp-tool-registry';

/**
 * Get MCP tool definitions for configuration
 */
export function getMcpConfigTools() {
  return mcpToolRegistry.getJsonSchemaTools();
}

/**
 * Get complete MCP server configuration
 */
export function getMcpServerConfig() {
  const tools = getMcpConfigTools();

  return {
    name: 'VTable MCP Server',
    version: '1.0.0',
    description: 'MCP server for controlling VTable spreadsheet component',
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
}

/**
 * Export for direct import in mcp.json
 * Usage: import { MCP_CONFIG_TOOLS } from '@visactor/vtable-mcp/mcp-config'
 */
export const MCP_CONFIG_TOOLS = getMcpConfigTools();

/**
 * Export server mappings for advanced configuration
 */
// 同名同参：不再提供任何 mapping/参数转换能力
export const MCP_SERVER_MAPPINGS = {};

// Default export for convenience
export default {
  tools: MCP_CONFIG_TOOLS,
  mappings: MCP_SERVER_MAPPINGS,
  getMcpServerConfig
};
