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
