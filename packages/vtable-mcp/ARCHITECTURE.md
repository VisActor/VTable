# VTable MCP 架构说明

## 组件关系图

```
┌─────────────────┐
│   Cursor AI     │  (AI 客户端，如 Cursor、Claude)
└────────┬────────┘
         │ stdio (JSON-RPC)
         ↓
┌─────────────────┐
│ vtable-mcp-cli  │  (命令行工具，可选)
└────────┬────────┘
         │ HTTP POST (JSON-RPC)
         ↓
┌─────────────────┐
│ vtable-mcp-    │  (Node.js 服务器，运行在 localhost:3000)
│    server       │
└────────┬────────┘
         │ WebSocket (ws://localhost:3000/mcp)
         ↓
┌─────────────────┐
│   MCPClient     │  (浏览器中的客户端，vtable-mcp/src/plugins/mcp-client.ts)
│  (浏览器)       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  VTable 实例    │  (浏览器中的表格组件)
└─────────────────┘
```

## 各组件职责

## 工具（MCP tools）定义与执行：三层拆分

这套工程里，“一个 MCP tool”会同时出现在 **3 个位置**，分别承担不同职责：

1. **浏览器执行层（真正干活）**：`packages/vtable-mcp/src/plugins/tools/*`
   - **包含 `execute()`**，直接调用浏览器里的 VTable 实例（`globalThis.__vtable_instance`）。
   - `inputSchema` 是 **Zod schema**，用于浏览器端在执行前做参数校验。

2. **浏览器注册层（把工具塞进 MCPClient 的 registry）**：`packages/vtable-mcp/src/plugins/vtable-tool-registry.ts`
   - 把 `plugins/tools` 里聚合的 `allVTableTools` 注册到 `MCPClient` 内部的 `McpToolRegistry`。
   - 这是浏览器端“工具可执行”的关键，否则 MCPClient 收到 `tool_call` 时找不到 tool。

3. **工具元数据/Schema 层（host 展示与 server tools/list）**：`packages/vtable-mcp/src/mcp-tool-registry.ts`
   - 提供“统一的工具定义元数据”（tool name/description/inputSchema/category/exportable）。
   - 主要用于 **MCP host（Cursor 等）展示工具列表 & 参数 schema**、以及 **server 的 `tools/list`** 输出 schema。
   - 注意：这里的工具通常 **不负责执行**（不需要 `execute`），执行仍然发生在浏览器端。

> 一句话：**`plugins/tools` 负责执行，`vtable-tool-registry` 负责注册，`mcp-tool-registry` 负责给 host/server 提供 schema 与元数据。**

### 1. MCPClient (浏览器端)
**位置**: `packages/vtable-mcp/src/plugins/mcp-client.ts`

**职责**:
- ✅ 在浏览器中运行
- ✅ 通过 WebSocket 连接到 `vtable-mcp-server`
- ✅ 维护工具注册表（注册所有可用的工具）
- ✅ **接收**服务器转发的工具调用请求（`tool_call` 消息）
- ✅ 执行工具的 `execute` 方法
- ✅ 发送工具执行结果回服务器（`tool_result` 消息）
- ✅ 发送工具列表到服务器（`tools_list` 消息）

**关键方法**:
- `onInit()`: 建立 WebSocket 连接
- `handleToolCall()`: 处理服务器转发的工具调用
- `callTool()`: 直接调用本地工具（用于页面按钮）

### 2. vtable-mcp-server (服务器端)
**位置**: `packages/vtable-mcp-server/src/mcp-compliant-server.ts`（核心实现）

> 注：`packages/vtable-mcp-server/src/index.ts` 仅作为历史入口的兼容保留，会直接加载 `mcp-compliant-server.ts`，不再承载实现逻辑。

**职责**:
- ✅ 运行在 Node.js 服务器（默认 localhost:3000）
- ✅ 提供 HTTP 接口 `/mcp`（JSON-RPC 协议）
- ✅ 管理 WebSocket 服务器（`ws://localhost:3000/mcp`）
- ✅ 管理多个会话（sessionId）
- ✅ **接收**来自 `vtable-mcp-cli` 的 HTTP 请求
- ✅ **转发**工具调用请求到对应的浏览器客户端（通过 WebSocket）
- ✅ **接收**浏览器客户端的工具执行结果
- ✅ 提供健康检查接口 `/health`

**关键功能**:
- HTTP POST `/mcp`: 接收 AI 客户端的工具调用请求
- WebSocket Server: 与浏览器中的 MCPClient 建立连接
- Session 管理: 支持多用户隔离

### 3. vtable-mcp-cli (可选，用于 AI 客户端)
**位置**: `packages/vtable-mcp-cli/src/index.ts`

**职责**:
- ✅ 通过 stdio 与 AI 客户端（如 Cursor）通信
- ✅ 将 AI 客户端的请求转换为 HTTP 请求
- ✅ 调用 `vtable-mcp-server` 的 HTTP 接口
- ✅ 返回结果给 AI 客户端

## 通信流程

### 场景 1: AI 客户端调用工具（完整流程）

```
1. Cursor AI 发送工具调用请求
   ↓
2. vtable-mcp-cli 接收（通过 stdio）
   ↓
3. vtable-mcp-cli 发送 HTTP POST 到 vtable-mcp-server
   POST http://localhost:3000/mcp
   {
     "jsonrpc": "2.0",
     "method": "tools/call",
     "params": {
       "name": "set_cell_data",
       "arguments": { "items": [...] }
     }
   }
   ↓
4. vtable-mcp-server 接收 HTTP 请求
   ↓
5. vtable-mcp-server 通过 WebSocket 转发到 MCPClient
   {
     "type": "tool_call",
     "toolName": "set_cell_data",
     "params": { "items": [...] },
     "callId": "xxx"
   }
   ↓
6. MCPClient 接收 tool_call 消息
   ↓
7. MCPClient.handleToolCall() 执行工具
   - 从工具注册表获取工具定义
   - 验证参数
   - 调用工具的 execute() 方法
   ↓
8. MCPClient 发送执行结果回服务器
   {
     "type": "tool_result",
     "callId": "xxx",
     "result": { ... }
   }
   ↓
9. vtable-mcp-server 接收结果（可选，当前实现是立即返回）
   ↓
10. vtable-mcp-cli 返回结果给 Cursor AI
```

### 场景 2: 页面按钮调用工具（简化流程）

```
1. 用户点击页面按钮
   ↓
2. main.ts 调用 mcpClient.callTool()
   ↓
3. MCPClient 直接执行本地工具（不通过服务器）
   - 从工具注册表获取工具定义
   - 验证参数
   - 调用工具的 execute() 方法
   ↓
4. 返回结果给页面
```

## 关键区别

| 特性 | MCPClient | vtable-mcp-server |
|------|-----------|-------------------|
| **运行环境** | 浏览器 | Node.js 服务器 |
| **连接方向** | WebSocket 客户端 | WebSocket 服务器 |
| **主要职责** | 执行工具 | 转发请求 |
| **工具注册** | ✅ 维护工具注册表 | ❌ 只缓存工具列表 |
| **工具执行** | ✅ 执行 execute() | ❌ 不执行 |
| **会话管理** | ❌ 单个连接 | ✅ 管理多个会话 |

## 为什么需要两个组件？

1. **MCPClient (浏览器)**:
   - 工具必须在浏览器中执行（因为需要访问 VTable 实例）
   - 直接操作 DOM 和 VTable API

2. **vtable-mcp-server (服务器)**:
   - 作为桥梁连接 AI 客户端和浏览器
   - AI 客户端无法直接访问浏览器，需要通过服务器转发
   - 支持多用户、多会话管理

## 总结

- **MCPClient**: 浏览器中的"执行者"，负责实际执行工具
- **vtable-mcp-server**: 服务器中的"转发者"，负责在 AI 客户端和浏览器之间转发消息

它们通过 WebSocket 双向通信：
- 服务器 → 客户端: 转发工具调用请求
- 客户端 → 服务器: 发送工具列表和执行结果

---

## 关键文件详解（你提到的 5 个文件/目录）

### 1) `packages/vtable-mcp/src/plugins/tools/*`
- **是什么**：浏览器端工具实现集合（每个文件一类能力，如单元格、范围、选区、滚动等）。
- **做什么**：
  - 定义 `name/description/inputSchema/execute`
  - `execute()` 内部直接调用 VTable API（通过 `globalThis.__vtable_instance`）
- **与 MCP/页面关系**：
  - 页面必须先初始化 VTable，并由 `MCPClient.onInit()` 注入全局实例：
    - `(globalThis as any).__vtable_instance = tableInstance`
  - 随后 MCPClient 收到 server 转发来的 `tool_call`，会从 registry 取到对应工具并执行。

### 2) `packages/vtable-mcp/src/plugins/vtable-tool-registry.ts`
- **是什么**：浏览器端“工具注册器”。
- **做什么**：
  - import `allVTableTools`（来自 `plugins/tools/index.ts`）
  - 逐个 `toolRegistry.registerTool({ ...tool, execute })`
- **与 MCP/页面关系**：
  - 必须在 `MCPClient.onInit()` 建立连接前调用 `toolRegistry.onInit()`，保证工具已经注册。
  - 否则 server 转发 `tool_call` 到浏览器时，会报 `未知工具`。

### 3) `packages/vtable-mcp/src/mcp-tool-registry.ts`
- **是什么**：统一工具注册表（工具元数据 + Zod schema + 导出 JSON schema）。
- **做什么**：
  - `initializeDefaultTools()` **从 `plugins/tools` 派生**所有“对外可见”的工具定义（name/description/inputSchema/category/exportable），避免重复维护。
  - `getJsonSchemaTools()` 将 Zod schema 转成 JSON schema（给 MCP host / server tools/list 用）。
- **与 MCP/页面关系**：
  - **Cursor host**：最终看到的 tools 列表/参数 schema 来源于这里（通常经由 CLI 或 server 的 `tools/list`）。
  - **vtable-mcp-server**：在 `tools/list` 时会用这里的 schema 给每个 tool 补 `inputSchema`。
  - **浏览器端**：`MCPClient` 内部也使用 `McpToolRegistry` 做参数校验与工具存取；但“真正执行的 execute”来自 `plugins/tools` 注册进去的版本。

### 4) `packages/vtable-mcp/src/mcp-config.ts`
- **是什么**：给外部（例如 Cursor `mcp.json`）提供“可直接使用”的工具 schema 导出。
- **做什么**：
  - `getMcpServerConfig()`：导出一个包含 tools 的 server 描述对象
  - 注意：工具定义应直接使用 `mcpToolRegistry.getJsonSchemaTools()` 获取
- **与 MCP/页面关系**：
  - 它本质是“配置/导出层”，不参与运行时执行。
  - 用于让 host/集成方更方便地拿到工具清单与 schema。

### 5) `packages/vtable-mcp/src/mcp-tool-registry.ts` 是唯一真相来源（无额外 CLI 影子定义）
- **结论**：本项目选择 **零历史负担的最优路径：同名同参、无 mapping、单一真相来源**。
- **做法**：
  - `vtable-mcp-cli` 的 `tools/list` 直接使用 `mcpToolRegistry.getJsonSchemaTools()`。
  - CLI 的 `tools/call` 不做名称/参数转换，仅附加 `sessionId` 作为 transport 参数。

---

## 统一工具定义：是否需要 mapping？

### 现在是否还需要 mapping？
如果我们坚持 **统一原则**：
- tool name：CLI / server / browser **完全一致**
- 参数结构：CLI / server / browser **完全一致**（`sessionId` 仅作为 transport 层参数，不混进工具业务参数）

那么 **mapping 不再是必需品**，CLI 只需要把 `tools/call` 原样转发给 server，server 再原样转发给浏览器 MCPClient 即可。

### 什么时候才需要 mapping？
仅当你需要“兼容旧名字/旧参数”或做“跨版本桥接”时才引入 mapping。本项目明确 **没有历史负担**，因此不引入。

### 我们当前仓库的落地建议
- **单一真相来源**：只维护 `plugins/tools/*`（工具实现 + Zod `inputSchema`），`mcp-tool-registry.ts` 从它派生并生成 JSON schema。
- **转发原则**：CLI / server **不改 toolName、不改参数结构**，只追加 `sessionId`（transport 参数）。

