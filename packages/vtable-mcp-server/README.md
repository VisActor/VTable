# @visactor/vtable-mcp-server

VTable MCP WebSocket 服务器，作为 AI 客户端（如 Cursor）和浏览器中 VTable 实例之间的桥梁。

## 安装

```bash
npm install @visactor/vtable-mcp-server
# 或
pnpm add @visactor/vtable-mcp-server
# 或
yarn add @visactor/vtable-mcp-server
```

## 快速开始

### 方式 1: 使用命令行工具（推荐）

安装后，可以直接使用 `vtable-mcp-server` 命令：

```bash
# 启动服务器（默认端口 3000）
npx vtable-mcp-server

# 或全局安装后直接使用
npm install -g @visactor/vtable-mcp-server
vtable-mcp-server

# 指定端口
PORT=3002 vtable-mcp-server
```

> **重要提示**：如果修改了服务器端口，需要在 Cursor 的 MCP 配置文件中同步更新 `VTABLE_API_URL` 环境变量（见下方"配置 Cursor MCP"部分）。

### 方式 2: 在项目中使用

```bash
# 在 package.json 中添加脚本
npm install @visactor/vtable-mcp-server --save-dev
```

然后在 `package.json` 中添加：

```json
{
  "scripts": {
    "mcp-server": "vtable-mcp-server"
  }
}
```

运行：

```bash
npm run mcp-server
```

### 方式 3: 直接运行文件

```bash
node node_modules/@visactor/vtable-mcp-server/dist/mcp-compliant-server.js
```

## 配置

### 服务器环境变量

- `PORT`: 服务器端口（默认: 3000）
- `MCP_TOOL_TIMEOUT_MS`: 工具调用超时时间（默认: 15000ms）

示例：

```bash
PORT=3002 MCP_TOOL_TIMEOUT_MS=20000 vtable-mcp-server
```

### 配置 Cursor MCP

如果修改了服务器端口，需要在 Cursor 的 MCP 配置文件中同步更新 `VTABLE_API_URL` 环境变量。

在 Cursor 的 MCP 配置文件（通常是 `~/.cursor/mcp.json` 或项目中的 `mcp.json`）中：

```json
{
  "mcpServers": {
    "vtable": {
      "command": "node",
      "args": ["path/to/vtable-mcp-cli/bin/vtable-mcp.js"],
      "env": {
        "VTABLE_API_URL": "http://localhost:3002/mcp",
        "VTABLE_SESSION_ID": "default"
      }
    }
  }
}
```

**关键配置项**：
- `VTABLE_API_URL`: 必须与服务器启动的端口一致
  - 默认端口 3000: `http://localhost:3000/mcp`
  - 自定义端口 3002: `http://localhost:3002/mcp`
- `VTABLE_SESSION_ID`: 会话 ID（默认: `default`）

**示例场景**：

1. **服务器使用默认端口 3000**：
   ```json
   "VTABLE_API_URL": "http://localhost:3000/mcp"
   ```

2. **服务器使用自定义端口 3002**：
   ```json
   "VTABLE_API_URL": "http://localhost:3002/mcp"
   ```

3. **服务器运行在远程主机**：
   ```json
   "VTABLE_API_URL": "http://your-server.com:3000/mcp"
   ```

## 端点

启动后，服务器提供以下端点：

- **HTTP POST `/mcp`**: MCP 协议入口（JSON-RPC 2.0）
  - 用于接收 AI 客户端的工具调用请求
  - 示例：`POST http://localhost:3000/mcp`

- **GET `/health`**: 健康检查接口
  - 用于检查服务器状态和当前会话
  - 示例：`GET http://localhost:3000/health`

- **WebSocket `ws://localhost:3000/mcp`**: WebSocket 连接
  - 浏览器中的 VTable 实例通过此端点连接
  - 示例：`ws://localhost:3000/mcp?session_id=default`

## 使用场景

### 完整流程

```
Cursor AI 
  ↓ (stdio JSON-RPC)
vtable-mcp-cli 
  ↓ (HTTP POST)
vtable-mcp-server (本包)
  ↓ (WebSocket)
浏览器中的 VTable 实例
```

### 验证服务器运行

```bash
# 健康检查
curl http://localhost:3000/health

# 测试 MCP 协议
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test",
    "method": "tools/list",
    "params": {"sessionId": "default"}
  }'
```

## 开发

### 本地开发

```bash
# 克隆仓库
git clone <repo-url>
cd vtable-mcp/packages/vtable-mcp-server

# 安装依赖
pnpm install

# 开发模式运行
pnpm run dev

# 构建
pnpm run build

# 生产模式运行
pnpm start

# 运行示例
pnpm run dev:demo
```

## 相关包

- `@visactor/vtable-mcp`: 核心 MCP 客户端和工具定义
- `@visactor/vtable-mcp-cli`: MCP CLI 工具（用于连接 Cursor AI）

## License

MIT

