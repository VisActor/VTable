/**
 * MCP 客户端
 *
 * 负责管理 WebSocket 连接和工具执行。
 *
 * 职责：
 * - 管理 WebSocket 连接到 MCP 服务器
 * - 维护工具注册表
 * - 处理工具调用并执行工具的 execute 方法
 * - 发送工具列表到服务器
 *
 * 使用示例：
 * ```typescript
 * // 1. 创建 MCP 客户端
 * const mcpClient = new MCPClient({
 *   serverUrl: 'http://localhost:3000',
 *   sessionId: 'default'
 * });
 *
 * // 2. 创建工具注册表，传入客户端
 * const toolRegistry = new VTableToolRegistry(mcpClient);
 *
 * // 3. 初始化工具注册表（注册工具）
 * toolRegistry.onInit(tableInstance);
 *
 * // 4. 初始化客户端（建立连接）
 * mcpClient.onInit(tableInstance);
 * ```
 */

import { McpToolRegistry } from '../mcp-tool-registry';

export interface MCPClientOptions {
  /** MCP 服务器 URL */
  serverUrl: string;
  /** 会话 ID */
  sessionId?: string;
  /** 连接状态变化回调 */
  onStatusChange?: (connected: boolean, message: string) => void;
  /** 日志回调 */
  onLog?: (message: string, type?: 'info' | 'success' | 'error') => void;
}

/**
 * MCP 客户端类
 */
export class MCPClient {
  private toolRegistry: McpToolRegistry;
  private wsConnection: WebSocket | null = null;
  private serverUrl: string;
  private sessionId: string;
  private onStatusChange?: (connected: boolean, message: string) => void;
  private onLog?: (message: string, type?: 'info' | 'success' | 'error') => void;
  private tableInstance: any = null;

  constructor(options: MCPClientOptions) {
    this.toolRegistry = new McpToolRegistry();
    this.serverUrl = options.serverUrl;
    this.sessionId = options.sessionId || 'default';
    this.onStatusChange = options.onStatusChange;
    this.onLog = options.onLog;
  }

  /**
   * 获取工具注册表
   * 供其他插件使用
   */
  getToolRegistry(): McpToolRegistry {
    return this.toolRegistry;
  }

  /**
   * 初始化插件
   * 建立 WebSocket 连接并发送工具列表
   */
  async onInit(tableInstance: any): Promise<void> {
    this.tableInstance = tableInstance;

    // 设置全局实例供工具使用
    (globalThis as any).__vtable_instance = tableInstance;

    await this.connect();
  }

  /**
   * 连接到 MCP 服务器
   */
  private async connect(): Promise<void> {
    try {
      this.log(`正在连接到MCP服务器: ${this.serverUrl}`, 'info');

      // 1. 检查HTTP服务器状态
      const response = await fetch(`${this.serverUrl}/health`);
      const data = await response.json();

      if (data.status === 'ok') {
        this.log(`HTTP服务器连接成功，会话: ${this.sessionId}`, 'success');
        this.log(`可用会话: ${data.sessions?.join(', ') || '无'}`, 'info');
      } else {
        throw new Error('服务器状态异常');
      }

      // 2. 建立WebSocket连接
      const wsUrl = this.serverUrl.replace('http://', 'ws://').replace('https://', 'wss://');
      this.wsConnection = new WebSocket(`${wsUrl}/mcp?session_id=${this.sessionId}`);

      this.wsConnection.onopen = () => {
        this.updateStatus(`已连接到MCP服务器 (${this.serverUrl})`, true);
        this.log(`WebSocket连接已建立，会话ID: ${this.sessionId}`, 'success');

        // 发送工具列表
        this.sendToolsList();
      };

      this.wsConnection.onmessage = event => {
        try {
          const message = JSON.parse(event.data);
          this.log(`收到WebSocket消息: ${message.type}`, 'info');

          if (message.type === 'tool_call') {
            this.handleToolCall(message);
          }
        } catch (error) {
          this.log(`WebSocket消息解析错误: ${error}`, 'error');
        }
      };

      this.wsConnection.onerror = error => {
        this.updateStatus(`WebSocket连接错误`, false);
        this.log(`WebSocket连接错误: ${error}`, 'error');
      };

      this.wsConnection.onclose = () => {
        this.updateStatus(`WebSocket连接已关闭`, false);
        this.log(`WebSocket连接已关闭`, 'info');
        this.wsConnection = null;
      };
    } catch (error) {
      this.updateStatus(`连接失败: ${error}`, false);
      this.log(`连接失败: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * 发送工具列表到服务器
   */
  private sendToolsList(): void {
    if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
      return;
    }

    // 从工具注册表获取所有工具
    const tools = this.toolRegistry.getAllTools().map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: this.toolRegistry['zodToJsonSchema'](tool.inputSchema)
    }));

    this.wsConnection.send(
      JSON.stringify({
        type: 'tools_list',
        tools: tools
      })
    );

    this.log(`已发送 ${tools.length} 个工具到服务器`, 'info');
  }

  /**
   * 修复被序列化的参数
   * 如果数组被序列化为字符串，尝试解析为数组
   */
  private fixSerializedParams(params: any): any {
    if (!params || typeof params !== 'object') {
      return params;
    }

    const fixed: any = {};
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        // 尝试解析字符串化的数组或对象
        try {
          // 先尝试直接 JSON.parse
          const parsed = JSON.parse(value);
          // 如果解析成功，使用解析后的值（可能是数组或对象）
          // 并且递归处理解析后的值，以防它内部还有字符串化的内容
          if (Array.isArray(parsed)) {
            fixed[key] = parsed.map(item =>
              typeof item === 'object' && item !== null ? this.fixSerializedParams(item) : item
            );
            continue;
          } else if (typeof parsed === 'object' && parsed !== null) {
            fixed[key] = this.fixSerializedParams(parsed);
            continue;
          }
        } catch {
          // JSON.parse 失败，可能是使用了单引号，尝试修复
          try {
            // 尝试将单引号替换为双引号
            // 使用正则表达式匹配键名和字符串值，将单引号替换为双引号
            const fixedJson = value.replace(/'/g, '"');
            const parsed = JSON.parse(fixedJson);
            if (Array.isArray(parsed)) {
              fixed[key] = parsed.map(item =>
                typeof item === 'object' && item !== null ? this.fixSerializedParams(item) : item
              );
              continue;
            } else if (typeof parsed === 'object' && parsed !== null) {
              fixed[key] = this.fixSerializedParams(parsed);
              continue;
            }
          } catch {
            // 仍然无法解析，尝试使用 Function 构造函数（更安全 than eval）
            try {
              // 使用 Function 构造函数来解析，避免 eval 的安全问题
              const parsed = new Function('return ' + value)();
              if (Array.isArray(parsed)) {
                fixed[key] = parsed.map(item =>
                  typeof item === 'object' && item !== null ? this.fixSerializedParams(item) : item
                );
                continue;
              } else if (typeof parsed === 'object' && parsed !== null) {
                fixed[key] = this.fixSerializedParams(parsed);
                continue;
              }
            } catch {
              // 所有解析方法都失败，保持原值
            }
          }
        }
      }
      // 递归处理嵌套对象
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        fixed[key] = this.fixSerializedParams(value);
      } else if (Array.isArray(value)) {
        // 递归处理数组中的元素
        fixed[key] = value.map(item =>
          typeof item === 'object' && item !== null ? this.fixSerializedParams(item) : item
        );
      } else {
        fixed[key] = value;
      }
    }
    return fixed;
  }

  /**
   * 处理工具调用 【服务器转发到客户端】
   * 查找工具并执行其 execute 方法
   */
  private async handleToolCall(message: any): Promise<void> {
    try {
      const { toolName, params, callId } = message;
      this.log(`收到工具调用: ${toolName}`, 'info');

      // 从工具注册表获取工具定义
      const tool = this.toolRegistry.getTool(toolName);

      if (!tool) {
        throw new Error(`未知工具: ${toolName}`);
      }

      // 修复参数：如果数组被序列化为字符串，尝试解析
      const fixedParams = this.fixSerializedParams(params);

      // 验证参数
      const validatedParams = tool.inputSchema.parse(fixedParams);

      // 执行工具
      let result: any;
      if (tool.execute) {
        // 如果工具定义中有 execute 方法，直接调用
        result = await tool.execute(validatedParams);
      } else {
        throw new Error(`工具 ${toolName} 没有 execute 方法`);
      }

      // 发送响应
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(
          JSON.stringify({
            type: 'tool_result',
            callId,
            result: {
              content: [{ type: 'text', text: JSON.stringify(result) }]
            }
          })
        );
      }

      this.log(`✓ 工具调用成功: ${toolName}`, 'success');
    } catch (error: any) {
      this.log(`✗ 工具调用失败: ${error.message}`, 'error');

      // 发送错误响应
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(
          JSON.stringify({
            type: 'tool_result',
            callId: message.callId,
            result: {
              error: {
                code: -32603,
                message: error.message
              }
            }
          })
        );
      }
    }
  }

  /**
   * 通过 WebSocket 调用工具
   *
   * 直接调用本地注册的工具，不通过服务器转发
   *
   * @param toolName - 工具名称
   * @param params - 工具参数
   * @returns 工具执行结果
   */
  async callTool(toolName: string, params: any): Promise<any> {
    if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接');
    }

    // 从工具注册表获取工具定义
    const tool = this.toolRegistry.getTool(toolName);

    if (!tool) {
      throw new Error(`未知工具: ${toolName}`);
    }

    // 验证参数
    const validatedParams = tool.inputSchema.parse(params);

    // 执行工具
    if (!tool.execute) {
      throw new Error(`工具 ${toolName} 没有 execute 方法`);
    }

    try {
      const result = await tool.execute(validatedParams);
      this.log(`✓ 工具调用成功: ${toolName}`, 'success');
      return result;
    } catch (error: any) {
      this.log(`✗ 工具调用失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    this.updateStatus('已断开MCP服务器连接', false);
    this.log('已断开MCP服务器连接', 'info');
  }

  /**
   * 更新连接状态
   */
  private updateStatus(message: string, connected: boolean): void {
    if (this.onStatusChange) {
      this.onStatusChange(connected, message);
    }
  }

  /**
   * 记录日志
   */
  private log(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    if (this.onLog) {
      this.onLog(message, type);
    }
    console.log(`[${type}] ${message}`);
  }
}
