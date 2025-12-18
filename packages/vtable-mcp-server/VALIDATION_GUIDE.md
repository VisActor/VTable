# VTable MCP Server 验证指南

## 快速验证

### 1. 基础验证（推荐）
```bash
pnpm run validate:simple  # 快速验证所有核心功能
```

### 2. 完整验证
```bash
pnpm run validate         # 完整验证流程（包含边界测试）
```

### 3. 手动验证步骤

#### 步骤1：构建项目
```bash
pnpm run build
```

#### 步骤2：启动服务器
```bash
pnpm run dev  # 开发模式（server）
# 或
pnpm start    # 生产模式（server）
```

#### 步骤3：验证健康检查
```bash
curl http://localhost:3000/health
```

#### 步骤4：验证WebSocket连接
```bash
# 使用wscat（需要安装：npm install -g wscat）
wscat -c ws://localhost:3000/mcp?session_id=test
> {"type":"tools_list","tools":[],"sessionId":"test"}
```

#### 步骤5：验证MCP协议
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test",
    "method": "tools/list",
    "params": {"sessionId": "test"}
  }'
```

## 前端验证页面（Demo）

本仓库已将前端验证页面放入：

- `packages/vtable-mcp-server/examples`

请务必区分 **demo 启动命令** 与 **server 启动命令**：

### 1）启动 Server（端口默认 3000）

```bash
pnpm run dev
```

如需修改端口：

```bash
PORT=3002 pnpm run dev
```

### 2）启动 Demo（端口默认 3001）

方式A：在本包内一键启动 demo（推荐）

```bash
pnpm run dev:demo
```

启动后浏览器打开 `http://localhost:3001`，点击“连接MCP服务器”即可。

## 验证内容

### ✅ 自动验证项目
- **服务器启动**：检查进程是否正常启动
- **健康检查**：验证健康检查接口可用性
- **WebSocket连接**：测试WebSocket连接和消息传递
- **MCP协议**：验证JSON-RPC协议处理
- **错误处理**：测试各种错误情况的处理

### 🔍 手动验证项目
- **工具调用**：验证工具调用的完整链路
- **会话管理**：测试多session隔离
- **性能测试**：验证并发处理能力
- **内存使用**：检查内存泄漏

## 常见问题

### 端口被占用
```bash
# 查找占用进程
lsof -i :3001
# 或
netstat -an | grep 3001

# 使用不同端口
PORT=3002 pnpm run dev
```

### 构建失败
```bash
# 清理并重新构建
rm -rf dist
pnpm run build
```

### WebSocket连接失败
```bash
# 检查防火墙设置
# 验证WebSocket支持
# 检查浏览器控制台错误
```

## 验证输出说明

### 成功输出
```
🔍 VTable MCP Server 验证开始
==================================================
📋 步骤1: 验证构建文件...
✅ 构建文件存在
🚀 步骤2: 启动服务器...
✅ 服务器启动成功
🏥 步骤3: 验证健康检查接口...
✅ 健康检查正常
🔗 步骤4: 验证WebSocket连接...
✅ WebSocket连接成功
📡 步骤5: 验证MCP协议...
✅ MCP协议响应正常
==================================================
✨ 所有验证均通过！服务器运行正常
```

### 失败输出
```
❌ 验证失败: [具体错误信息]
💡 建议:
   1. 确保已运行: npm run build
   2. 检查端口是否被占用
   3. 查看服务器日志获取详细信息
```

## 生产环境验证

### 1. 基础功能验证
```bash
# 健康检查
curl https://your-server.com/health

# WebSocket连接
wscat -c wss://your-server.com/mcp?session_id=prod-test
```

### 2. 性能验证
```bash
# 并发连接测试
# 使用工具如 artillery, k6 等进行负载测试
```

### 3. 监控验证
```bash
# 检查监控指标
# 验证日志收集
# 确认告警机制
```

## 故障排查

### 1. 查看详细日志
```bash
# 设置调试环境变量
DEBUG=mcp:* pnpm run dev
```

### 2. 网络问题
```bash
# 测试端口连通性
telnet localhost 3001

# 检查网络配置
netstat -an | grep 3001
```

### 3. 依赖问题
```bash
# 重新安装依赖
rm -rf node_modules
pnpm install
```