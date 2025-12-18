import { z } from 'zod';

/**
 * Unified MCP Tool Definition System
 *
 * This module provides a centralized registry for all MCP tools across the VTable ecosystem.
 * It eliminates duplication and provides consistent tool definitions for:
 * - CLI packages (vtable-mcp-cli)
 * - Server packages (vtable-mcp-server)
 * - Direct MCP configuration (mcp.json)
 */

export interface IMcpToolDefinition {
  /** Unique tool identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** Input schema using Zod */
  inputSchema: z.ZodObject<any>;
  /** Tool category for organization */
  category: 'cell' | 'style' | 'table' | 'data';
  /** Server-side tool name mapping */
  serverName?: string;
  /** Whether this tool is available for external configuration */
  exportable: boolean;
  /** Tool execution function */
  execute?: (params: any) => Promise<any> | any;
}

export interface IMcpToolMapping {
  /** Client-side tool name */
  clientName: string;
  /** Server-side tool name */
  serverName: string;
  /** Parameter transformation function */
  transformParams?: (params: any) => any;
}

/**
 * Centralized MCP Tool Registry
 */
export class McpToolRegistry {
  private tools: Map<string, IMcpToolDefinition> = new Map();
  private mappings: Map<string, IMcpToolMapping> = new Map();

  constructor() {
    this.initializeDefaultTools();
  }

  /**
   * Register a new MCP tool
   */
  registerTool(definition: IMcpToolDefinition): void {
    this.tools.set(definition.name, definition);

    // Auto-create mapping if serverName is provided
    if (definition.serverName) {
      this.mappings.set(definition.name, {
        clientName: definition.name,
        serverName: definition.serverName
      });
    }
  }

  /**
   * Register a tool name mapping
   */
  registerMapping(mapping: IMcpToolMapping): void {
    this.mappings.set(mapping.clientName, mapping);
  }

  /**
   * Get tool definition by name
   */
  getTool(name: string): IMcpToolDefinition | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all tool definitions
   */
  getAllTools(): IMcpToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get exportable tools for external configuration
   */
  getExportableTools(): IMcpToolDefinition[] {
    return this.getAllTools().filter(tool => tool.exportable);
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: IMcpToolDefinition['category']): IMcpToolDefinition[] {
    return this.getAllTools().filter(tool => tool.category === category);
  }

  /**
   * Get server-side tool name for a client tool
   */
  getServerToolName(clientName: string): string {
    const mapping = this.mappings.get(clientName);
    return mapping?.serverName || clientName;
  }

  /**
   * Get client-side tool name for a server tool (reverse lookup)
   */
  getClientToolName(serverName: string): string {
    // Search through mappings to find the client name
    for (const [clientName, mapping] of this.mappings.entries()) {
      if (mapping.serverName === serverName) {
        return clientName;
      }
    }
    return serverName; // Return as-is if no mapping found
  }

  /**
   * Transform client parameters to server parameters
   */
  transformParameters(clientName: string, clientParams: any): any {
    const mapping = this.mappings.get(clientName);
    if (mapping?.transformParams) {
      return mapping.transformParams(clientParams);
    }
    return clientParams;
  }

  /**
   * Get tool definitions as JSON schema for MCP configuration
   */
  getJsonSchemaTools(): Array<{
    name: string;
    description: string;
    inputSchema: any;
  }> {
    return this.getExportableTools().map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: this.zodToJsonSchema(tool.inputSchema)
    }));
  }

  /**
   * Convert Zod schema to JSON schema
   */
  zodToJsonSchema(zodSchema: z.ZodObject<any>): any {
    // Basic conversion - can be enhanced with proper zod-to-json-schema library
    const shape = zodSchema.shape;
    const properties: any = {};
    const required: string[] = [];

    Object.entries(shape).forEach(([key, schema]: [string, any]) => {
      if (schema instanceof z.ZodNumber) {
        properties[key] = { type: 'number' };
      } else if (schema instanceof z.ZodString) {
        properties[key] = { type: 'string' };
      } else if (schema instanceof z.ZodBoolean) {
        properties[key] = { type: 'boolean' };
      } else if (schema instanceof z.ZodAny) {
        properties[key] = {}; // 不指定 type，允许任意类型（字符串、数字、布尔值、null 等）
      } else if (schema instanceof z.ZodObject) {
        properties[key] = this.zodToJsonSchema(schema);
      } else {
        properties[key] = { type: 'object' };
      }

      if (!schema.isOptional()) {
        required.push(key);
      }
    });

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    };
  }

  /**
   * Initialize default VTable MCP tools
   */
  private initializeDefaultTools(): void {
    // Cell operations
    this.registerTool({
      name: 'set_cell_value',
      description: 'Set the value of a cell in VTable',
      inputSchema: z.object({
        row: z.number(),
        col: z.number(),
        value: z.any()
      }),
      category: 'cell',
      serverName: 'set_cell_data',
      exportable: true
    });

    this.registerTool({
      name: 'get_cell_value',
      description: 'Get the value of a cell from VTable',
      inputSchema: z.object({
        row: z.number(),
        col: z.number()
      }),
      category: 'cell',
      serverName: 'get_cell_data',
      exportable: true
    });

    this.registerTool({
      name: 'set_cell_style',
      description: 'Set the style of a cell in VTable',
      inputSchema: z.object({
        row: z.number(),
        col: z.number(),
        style: z.object({})
      }),
      category: 'style',
      serverName: 'set_cell_style',
      exportable: true
    });

    this.registerTool({
      name: 'get_cell_style',
      description: 'Get the style of a cell from VTable',
      inputSchema: z.object({
        row: z.number(),
        col: z.number()
      }),
      category: 'style',
      serverName: 'get_cell_style',
      exportable: true
    });

    // Table operations
    this.registerTool({
      name: 'get_table_info',
      description: 'Get VTable information',
      inputSchema: z.object({}),
      category: 'table',
      exportable: true
    });

    // Register parameter transformations
    this.registerCellTransformations();
  }

  /**
   * Register cell operation parameter transformations
   */
  private registerCellTransformations(): void {
    // set_cell_value -> set_cell_data transformation
    this.registerMapping({
      clientName: 'set_cell_value',
      serverName: 'set_cell_data',
      transformParams: params => ({
        sessionId: 'default',
        items: [{ row: params.row, col: params.col, value: params.value }]
      })
    });

    // get_cell_value -> get_cell_data transformation
    this.registerMapping({
      clientName: 'get_cell_value',
      serverName: 'get_cell_data',
      transformParams: params => ({
        sessionId: 'default',
        cells: [{ row: params.row, col: params.col }]
      })
    });

    // set_cell_style transformation
    this.registerMapping({
      clientName: 'set_cell_style',
      serverName: 'set_cell_style',
      transformParams: params => ({
        sessionId: 'default',
        items: [{ row: params.row, col: params.col, style: params.style }]
      })
    });

    // get_cell_style transformation
    this.registerMapping({
      clientName: 'get_cell_style',
      serverName: 'get_cell_style',
      transformParams: params => ({
        sessionId: 'default',
        cells: [{ row: params.row, col: params.col }]
      })
    });
  }
}

/**
 * Global MCP Tool Registry instance
 */
export const mcpToolRegistry = new McpToolRegistry();

/**
 * Export for direct use in mcp.json configuration
 */
export const MCP_TOOL_DEFINITIONS = mcpToolRegistry.getJsonSchemaTools();

/**
 * Export tool mappings for CLI and server packages
 */
export const MCP_TOOL_MAPPINGS = {
  getServerToolName: (clientName: string) => mcpToolRegistry.getServerToolName(clientName),
  getClientToolName: (serverName: string) => mcpToolRegistry.getClientToolName(serverName),
  transformParameters: (clientName: string, params: any) => mcpToolRegistry.transformParameters(clientName, params),
  getAllTools: () => mcpToolRegistry.getAllTools(),
  getExportableTools: () => mcpToolRegistry.getExportableTools()
};
