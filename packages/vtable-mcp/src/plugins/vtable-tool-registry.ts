/**
 * VTable 工具注册表
 *
 * 负责将 VTable 的表格操作能力注册为 MCP 工具。
 *
 * 职责：
 * - 导入所有 VTable 表格工具定义
 * - 将工具注册到 MCP 客户端的工具注册表
 * - 不负责连接管理（由 MCPClient 负责）
 * - 不负责消息路由（由 MCPClient 负责）
 *
 * 协作模式：
 * 这个类依赖 MCPClient：
 * - 通过构造函数接收 MCPClient 实例
 * - 通过 mcpClient.getToolRegistry() 获取工具注册表
 * - 将自己的工具注册上去
 *
 * 这种设计实现了职责分离：
 * - MCPClient：管基础设施（连接、消息）
 * - VTableToolRegistry：管业务逻辑（工具定义）
 */

import { allVTableTools } from './tools';

/**
 * VTable 工具注册表类
 *
 * 使用示例：
 * ```typescript
 * // 1. 先创建 MCP 客户端
 * const mcpClient = new MCPClient({...});
 *
 * // 2. 创建工具注册表，传入客户端
 * const toolRegistry = new VTableToolRegistry(mcpClient);
 *
 * // 3. 初始化，注册所有工具
 * toolRegistry.onInit(tableInstance);
 *
 * // 4. 启动客户端的连接
 * mcpClient.onInit(tableInstance);
 * ```
 */
export class VTableToolRegistry {
  /**
   * MCP 客户端引用
   *
   * 通过这个引用访问工具注册表，实现协作。
   * 使用 any 类型以避免循环依赖问题。
   */
  private _mcpClient: any;

  /**
   * 构造函数
   *
   * @param mcpClient - MCPClient 实例
   *
   * 依赖注入模式：
   * 通过构造函数注入 MCP 客户端，而不是在内部创建，
   * 这样实现了：
   * - 类解耦
   * - 易于测试
   * - 配置灵活
   */
  constructor(mcpClient: any) {
    this._mcpClient = mcpClient;
  }

  /**
   * 初始化方法，由MCPClient调用
   *
   * 在这个方法中注册所有 VTable 表格操作工具。
   *
   * 注册流程：
   * 1. 从 MCP 客户端获取工具注册表
   * 2. 遍历 allVTableTools 数组
   * 3. 逐个注册工具
   *
   * 这个方法应该在 MCPClient.onInit() 之前调用，
   * 确保连接建立时工具已经注册好。
   *
   * @param table - VTable 实例（虽然这里不直接使用，但保持接口一致性）
   */
  onInit(): void {
    // 获取 MCP 客户端的工具注册表
    const toolRegistry = this._mcpClient.getToolRegistry();

    console.log('[VTable Sheet MCP] Registering tools...');

    // 注册所有工具
    // 工具定义已经包含 execute 方法，直接注册
    allVTableTools.forEach((tool: any) => {
      // 将工具定义转换为 IMcpToolDefinition 格式
      toolRegistry.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        category: tool.category || 'cell', // 默认分类为 cell
        exportable: true,
        execute: tool.execute // 保留 execute 方法
      });
    });

    console.log(`[VTable Sheet MCP] Registered ${allVTableTools.length} tools`);
  }

  /**
   * 清理方法（可选）
   *
   * 如果需要在销毁时做清理工作，可以实现这个方法。
   * 当前实现为空，因为工具注册不需要特殊清理。
   */
  onDispose?(): void {
    // 如果需要，可以在这里：
    // - 移除注册的工具
    // - 清理资源
    // - 取消订阅
  }
}
