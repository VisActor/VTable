import { z } from 'zod';
import { allVTableTools } from './plugins/tools';

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
  inputSchema: z.ZodObject<z.ZodRawShape>;
  /** Tool category for organization */
  category: 'cell' | 'style' | 'table' | 'data';
  /** Whether this tool is available for external configuration */
  exportable: boolean;
  /** Tool execution function */
  execute?: (params: unknown) => Promise<unknown> | unknown;
}

/**
 * Centralized MCP Tool Registry
 */
export class McpToolRegistry {
  private tools: Map<string, IMcpToolDefinition> = new Map();

  constructor() {
    this.initializeDefaultTools();
  }

  /**
   * Register a new MCP tool
   */
  registerTool(definition: IMcpToolDefinition): void {
    this.tools.set(definition.name, definition);
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
   * Get tool definitions as JSON schema for MCP configuration
   */
  getJsonSchemaTools(): Array<{
    name: string;
    description: string;
    inputSchema: unknown;
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
  zodToJsonSchema(zodSchema: z.ZodTypeAny): unknown {
    const unwrap = (schema: z.ZodTypeAny): z.ZodTypeAny => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cur: any = schema;
      // Optional / Nullable / Default / Effects 都尽量取内部 schema
      while (cur?._def?.innerType) {
        cur = cur._def.innerType;
      }
      while (cur?._def?.schema) {
        cur = cur._def.schema;
      }
      while (cur?._def?.type) {
        cur = cur._def.type;
      }
      return cur as z.ZodTypeAny;
    };

    const toSchema = (schema: z.ZodTypeAny): unknown => {
      const s = unwrap(schema);

      if (s instanceof z.ZodString) return { type: 'string' };
      if (s instanceof z.ZodNumber) return { type: 'number' };
      if (s instanceof z.ZodBoolean) return { type: 'boolean' };
      if (s instanceof z.ZodAny || s instanceof z.ZodUnknown) return {};
      if (s instanceof z.ZodNull) return { type: 'null' };
      if (s instanceof z.ZodUndefined) return {};

      if (s instanceof z.ZodLiteral) {
        return { enum: [s.value] };
      }

      if (s instanceof z.ZodEnum) {
        return { type: 'string', enum: s.options };
      }

      if (s instanceof z.ZodUnion) {
        return { oneOf: s.options.map((opt: z.ZodTypeAny) => toSchema(opt)) };
      }

      if (s instanceof z.ZodArray) {
        return { type: 'array', items: toSchema(s.element) };
      }

      if (s instanceof z.ZodObject) {
        // Zod 内部 shape 类型较复杂，这里只用于生成 JSON schema，不做严格类型推断
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shape: Record<string, z.ZodTypeAny> = (s as any).shape;
        const properties: Record<string, unknown> = {};
        const required: string[] = [];
        Object.entries(shape).forEach(([key, child]) => {
          properties[key] = toSchema(child);
          if (typeof child?.isOptional === 'function' && !child.isOptional()) {
            required.push(key);
          }
        });
        return { type: 'object', properties, required: required.length ? required : undefined };
      }

      // fallback
      return { type: 'object' };
    };

    return toSchema(zodSchema);
  }

  /**
   * Initialize default VTable MCP tools
   */
  private initializeDefaultTools(): void {
    // 无历史负担的最优结构：以浏览器端执行层（plugins/tools）的工具定义为唯一真相来源。
    // 这样保证：工具名、参数结构（Zod schema）、描述都不重复、不漂移。
    allVTableTools.forEach(
      (tool: { name: string; description: string; inputSchema: z.ZodObject<z.ZodRawShape>; category?: string }) => {
        this.registerTool({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          category: (tool.category || 'cell') as IMcpToolDefinition['category'],
          exportable: true
          // 注意：这里不强制挂 execute。执行由浏览器端 VTableToolRegistry 注册的工具来负责。
        });
      }
    );
  }

  /**
   * Register cell operation parameter transformations
   */
  private registerCellTransformations(): void {
    // 同名同参：不注册任何 tool name / params 映射
  }
}

/**
 * Global MCP Tool Registry instance
 */
export const mcpToolRegistry = new McpToolRegistry();
