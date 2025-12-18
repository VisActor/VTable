/**
 * CLI 专用工具定义
 *
 * 这个文件只包含工具定义和映射，不依赖 zod 运行时。
 * 用于保持 CLI 包的轻量级，避免打包 zod 等依赖。
 */

/**
 * 工具定义接口（简化版，不依赖 Zod）
 */
export interface IMcpToolDefinition {
  name: string;
  description: string;
  inputSchema: any; // JSON Schema 格式，不是 Zod
  category: 'cell' | 'style' | 'table' | 'data';
  serverName?: string;
  exportable: boolean;
}

/**
 * 工具映射接口
 */
export interface IMcpToolMapping {
  clientName: string;
  serverName: string;
  transformParams?: (params: any) => any;
}

/**
 * 默认工具定义（JSON Schema 格式）
 */
export const TOOL_DEFINITIONS: IMcpToolDefinition[] = [
  {
    name: 'set_cell_value',
    description: 'Set the value of a cell in VTable',
    inputSchema: {
      type: 'object',
      properties: {
        row: { type: 'number' },
        col: { type: 'number' },
        value: {} // 不指定 type，允许任意类型（字符串、数字、布尔值、null 等）
      },
      required: ['row', 'col']
    },
    category: 'cell',
    serverName: 'set_cell_data',
    exportable: true
  },
  {
    name: 'get_cell_value',
    description: 'Get the value of a cell from VTable',
    inputSchema: {
      type: 'object',
      properties: {
        row: { type: 'number' },
        col: { type: 'number' }
      },
      required: ['row', 'col']
    },
    category: 'cell',
    serverName: 'get_cell_data',
    exportable: true
  },
  {
    name: 'set_cell_style',
    description: 'Set the style of a cell in VTable',
    inputSchema: {
      type: 'object',
      properties: {
        row: { type: 'number' },
        col: { type: 'number' },
        style: { type: 'object' }
      },
      required: ['row', 'col', 'style']
    },
    category: 'style',
    serverName: 'set_cell_style',
    exportable: true
  },
  {
    name: 'get_cell_style',
    description: 'Get the style of a cell from VTable',
    inputSchema: {
      type: 'object',
      properties: {
        row: { type: 'number' },
        col: { type: 'number' }
      },
      required: ['row', 'col']
    },
    category: 'style',
    serverName: 'get_cell_style',
    exportable: true
  },
  {
    name: 'get_table_info',
    description: 'Get VTable information',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    category: 'table',
    exportable: true
  }
];

/**
 * 工具映射
 */
export const TOOL_MAPPINGS: IMcpToolMapping[] = [
  {
    clientName: 'set_cell_value',
    serverName: 'set_cell_data',
    transformParams: params => ({
      sessionId: 'default',
      items: [{ row: params.row, col: params.col, value: params.value }]
    })
  },
  {
    clientName: 'get_cell_value',
    serverName: 'get_cell_data',
    transformParams: params => ({
      sessionId: 'default',
      cells: [{ row: params.row, col: params.col }]
    })
  },
  {
    clientName: 'set_cell_style',
    serverName: 'set_cell_style',
    transformParams: params => ({
      sessionId: 'default',
      items: [{ row: params.row, col: params.col, style: params.style }]
    })
  },
  {
    clientName: 'get_cell_style',
    serverName: 'get_cell_style',
    transformParams: params => ({
      sessionId: 'default',
      cells: [{ row: params.row, col: params.col }]
    })
  }
];

/**
 * 工具映射辅助函数
 */
export const MCP_TOOL_MAPPINGS = {
  getServerToolName: (clientName: string): string => {
    const mapping = TOOL_MAPPINGS.find(m => m.clientName === clientName);
    return mapping?.serverName || clientName;
  },
  getClientToolName: (serverName: string): string => {
    const mapping = TOOL_MAPPINGS.find(m => m.serverName === serverName);
    return mapping?.clientName || serverName;
  },
  transformParameters: (clientName: string, params: any): any => {
    const mapping = TOOL_MAPPINGS.find(m => m.clientName === clientName);
    if (mapping?.transformParams) {
      return mapping.transformParams(params);
    }
    return params;
  },
  getAllTools: () => TOOL_DEFINITIONS,
  getExportableTools: () => TOOL_DEFINITIONS.filter(t => t.exportable)
};

/**
 * 工具注册表（简化版，用于 CLI）
 */
export const mcpToolRegistry = {
  getExportableTools: () => TOOL_DEFINITIONS.filter(t => t.exportable),
  getJsonSchemaTools: () =>
    TOOL_DEFINITIONS.filter(t => t.exportable).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
};
