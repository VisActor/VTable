# VTable MCP CLI 验证指南

## 快速验证

### 1. 基础验证（推荐）
```bash
npm run validate  # 快速验证所有核心功能
```

### 2. 完整验证
```bash
npm run test        # 运行完整测试套件
```

### 3. 手动验证步骤

#### 步骤1：构建项目
```bash
npm run build
```

#### 步骤2：验证CLI构建
```bash
# 检查构建输出
ls -la dist/
ls -la bin/

# 验证可执行权限
chmod +x bin/vtable-mcp.js
```

#### 步骤3：验证工具定义加载
```bash
# 测试工具定义
node -e "
const { mcpToolRegistry } = require('./dist/index.js');
const tools = mcpToolRegistry.getExportableTools().map(t => t.name);
console.log('可用工具:', tools.join(', '));
console.log('工具数量:', tools.length);
"
```

#### 步骤4：验证JSON-RPC协议
```bash
# 测试基本协议处理
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node bin/vtable-mcp.js

# 测试错误处理
echo 'invalid json' | node bin/vtable-mcp.js
```

#### 步骤5：验证与Server集成
```bash
# 确保server正在运行
# 然后测试CLI连接
VTABLE_API_URL=http://localhost:3001/mcp VTABLE_SESSION_ID=test echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node bin/vtable-mcp.js
```

## 验证内容

### ✅ 自动验证项目
- **CLI构建**：检查构建输出和可执行文件
- **工具定义加载**：验证工具定义正确加载
- **JSON-RPC协议**：测试协议解析和响应
- **错误处理**：验证各种错误情况的处理
- **Server集成**：测试与服务器的集成（可选）

### 🔍 手动验证项目
- **stdio通信**：验证stdin/stdout通信正常
- **环境变量**：测试环境变量配置
- **超时处理**：验证超时机制
- **并发处理**：测试多请求并发处理

## 常见问题

### 构建失败
```bash
# 清理并重新构建
rm -rf dist
npm run build

# 检查TypeScript错误
npm run build 2>&1 | grep -i error
```

### 工具加载失败
```bash
# 检查vtable-mcp依赖
ls -la node_modules/@visactor/vtable-mcp/

# 验证路径配置
cat tsconfig.json | grep -A5 -B5 vtable-mcp
```

### JSON解析错误
```bash
# 验证输入格式
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq .

# 检查CLI输出
DEBUG=1 echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node bin/vtable-mcp.js
```

### Server连接失败
```bash
# 检查server状态
curl http://localhost:3001/health

# 验证网络连通性
telnet localhost 3001

# 检查防火墙设置
```

## 验证输出说明

### 成功输出
```
🔍 VTable MCP CLI 验证开始
==================================================
🧪 CLI构建验证...
✅ CLI构建验证 - 通过
🧪 工具定义加载验证...
   成功加载 5 个工具: set_cell_data, get_cell_data, get_table_info, set_cell_style, get_cell_style
✅ 工具定义加载验证 - 通过
🧪 JSON-RPC协议验证...
✅ JSON-RPC协议验证 - 通过
🧪 错误处理验证...
✅ 错误处理验证 - 通过
🧪 Server集成验证...
✅ Server集成验证 - 通过
==================================================
📊 验证总结:
   通过: 5 项
   失败: 0 项
✨ 所有验证均通过！CLI运行正常
```

### 失败输出
```
❌ 验证失败: [具体错误信息]
💡 建议:
   1. 确保已运行: npm run build
   2. 检查依赖是否正确安装
   3. 验证server是否正在运行
   4. 查看详细错误信息
```

## 生产环境验证

### 1. 安装验证
```bash
# 全局安装验证
npm install -g @visactor/vtable-mcp-cli
vtable-mcp --version

# 本地安装验证
npx @visactor/vtable-mcp-cli --version
```

### 2. 功能验证
```bash
# 测试基本功能
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npx @visactor/vtable-mcp-cli

# 测试环境变量
VTABLE_API_URL=http://your-server/mcp npx @visactor/vtable-mcp-cli
```

### 3. 集成验证
```bash
# 在Cursor中配置
# 测试AI工具调用
# 验证响应格式
```

## 故障排查

### 1. 查看详细日志
```bash
# 启用调试模式
DEBUG=vtable-mcp:* node bin/vtable-mcp.js

# 查看stderr输出
echo 'test' | node bin/vtable-mcp.js 2>&1
```

### 2. 依赖问题
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查依赖版本
npm list @visactor/vtable-mcp
```

### 3. 权限问题
```bash
# 修复执行权限
chmod +x bin/vtable-mcp.js

# 检查文件权限
ls -la bin/vtable-mcp.js
```

### 4. 路径问题
```bash
# 验证导入路径
node -e "console.log(require.resolve('@visactor/vtable-mcp'))"

# 检查TypeScript配置
cat tsconfig.json
```

## 性能验证

### 1. 响应时间测试
```bash
# 测试响应时间
time echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node bin/vtable-mcp.js
```

### 2. 内存使用测试
```bash
# 监控内存使用
node --inspect bin/vtable-mcp.js
# 使用Chrome DevTools进行性能分析
```

### 3. 并发测试
```bash
# 并发请求测试
for i in {1..10}; do
  echo '{"jsonrpc":"2.0","id":'$i',"method":"tools/list"}' | node bin/vtable-mcp.js &
done
wait
```