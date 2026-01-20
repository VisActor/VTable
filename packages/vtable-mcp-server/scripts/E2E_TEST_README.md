# 完整链路端到端测试说明

## 概述

`e2e-test.js` 是一个完整的端到端测试脚本，用于验证 VTable MCP 的完整通信链路。

## 测试流程

1. **创建 VTable 实例**（Node.js 环境）
   - 使用 `@visactor/vtable` 创建 ListTable 实例
   - 设置 `mode: 'node'` 以支持 Node.js 环境

2. **注册工具**
   - 设置全局 VTable 实例（`global.__vtable_instance`）
   - 注册所有 VTable MCP 工具

3. **启动 MCP Server**
   - 启动独立的测试服务器（默认端口 3001）
   - 等待服务器完全启动

4. **建立 WebSocket 连接**（模拟浏览器端）
   - 连接到服务器的 WebSocket 端点
   - 发送工具列表到服务器

5. **通过 HTTP 调用工具**
   - 发送 `tools/call` 请求到服务器
   - 服务器转发到 WebSocket 客户端

6. **模拟浏览器端执行工具**
   - WebSocket 客户端接收工具调用
   - 执行对应的工具 `execute` 方法
   - 返回结果到服务器

7. **验证 VTable 实例状态**
   - 检查单元格值是否正确修改
   - 检查表格信息是否正确
   - 检查记录是否正确添加

## 前置要求

### 1. 构建依赖包

```bash
# 构建 vtable
cd ../../vtable
npm run build

# 构建 vtable-mcp
cd ../vtable-mcp
npm run build

# 构建 vtable-mcp-server
cd ../vtable-mcp-server
npm run build
```

### 2. 安装依赖

VTable 在 Node.js 环境中需要以下依赖：

**必需依赖：**
- `canvas`: 用于 Node.js 环境的 Canvas 实现

```bash
cd packages/vtable-mcp-server
npm install canvas
```

**可选依赖：**
- `@resvg/resvg-js`: 用于 SVG 渲染（如果未安装，测试会使用 mock）

```bash
npm install @resvg/resvg-js
```

或者如果使用 pnpm：

```bash
# 必需
pnpm add canvas

# 可选（推荐，以获得完整功能）
pnpm add @resvg/resvg-js
```

**注意：** 如果未安装 `@resvg/resvg-js`，测试脚本会自动使用一个简单的 mock，这通常足够用于测试基本功能。

## 使用方法

### 基本用法

```bash
cd packages/vtable-mcp-server
npm run test:e2e
```

### 环境变量

- `TEST_PORT`: 测试端口（默认 3001，避免与开发服务器冲突）
- `SERVER_START_TIMEOUT`: 服务器启动超时（默认 10000ms）
- `TEST_TIMEOUT`: 测试超时（默认 30000ms）

示例：

```bash
TEST_PORT=3002 npm run test:e2e
```

## 测试用例

### 1. set_cell_data
- 设置单元格值
- 验证值是否正确修改

### 2. get_cell_data
- 获取单元格值
- 验证返回值是否正确

### 3. get_table_info
- 获取表格信息（行数、列数）
- 验证信息是否准确

### 4. add_record
- 添加记录（仅 ListTable）
- 验证行数是否正确增加

## 测试输出

测试会输出详细的执行日志：

```
🚀 VTable MCP 完整链路端到端测试开始
============================================================

🧪 创建 VTable 实例...
   ✓ VTable 实例创建成功 (3 行, 4 列)
   ✓ 全局 VTable 实例已设置
✅ 创建 VTable 实例 - 通过

🧪 注册工具...
   ✓ 工具已注册到全局实例
✅ 注册工具 - 通过

🧪 启动 MCP Server...
   服务器进程已启动
✅ 启动 MCP Server - 通过

🧪 建立 WebSocket 连接并发送工具列表...
   WebSocket 连接已建立
   ✓ 已发送 34 个工具到服务器
✅ 建立 WebSocket 连接并发送工具列表 - 通过

🧪 测试 set_cell_data 工具...
   修改前 (0,0) 的值: 1
   📨 收到工具调用: set_cell_data
   ✓ 工具执行成功: set_cell_data
   修改后 (0,0) 的值: E2E-Test-Value
   ✓ 单元格值已正确修改
✅ 测试 set_cell_data 工具 - 通过

...

============================================================
📊 测试总结:
   通过: 4 项
   失败: 0 项

✨ 所有测试均通过！完整链路工作正常
```

## 故障排查

### 1. VTable 构建文件不存在

错误：
```
VTable 构建文件不存在: .../vtable/cjs/index.js
```

解决：
```bash
cd ../../vtable
npm run build
```

### 2. canvas 模块未找到

错误：
```
Cannot find module 'canvas'
```

解决：
```bash
npm install canvas
```

### 3. 端口被占用

错误：
```
端口 3001 已被占用
```

解决：
- 使用 `TEST_PORT` 环境变量指定其他端口
- 或关闭占用端口的进程

### 4. 工具注册表文件不存在

错误：
```
工具注册表文件不存在: .../vtable-mcp/cjs/plugins/vtable-tool-registry.js
```

解决：
```bash
cd ../../vtable-mcp
npm run build
```

## 与现有测试的区别

| 测试脚本 | 用途 | 特点 |
|---------|------|------|
| `validate.js` | 服务器验证 | 验证服务器启动、健康检查、WebSocket 连接 |
| `mcp-smoke.js` | 冒烟测试 | 快速验证基本功能 |
| `e2e-test.js` | 端到端测试 | **完整链路测试，包括 VTable 实例创建和状态验证** |

## 注意事项

1. **测试环境隔离**：使用独立的测试端口（3001），避免与开发服务器（3000）冲突
2. **异步执行**：工具执行是异步的，测试中需要适当的等待时间
3. **资源清理**：测试结束后会自动清理服务器和 WebSocket 连接
4. **Node.js 环境**：VTable 实例需要在 Node.js 模式下运行，需要 canvas 支持

## 扩展测试

可以添加更多测试用例：

```javascript
// 在 runE2ETest 函数中添加
await testUpdateRecord();
await testDeleteRecord();
await testSetRangeData();
await testGetRangeData();
await testSetCellStyle();
```

每个测试用例都应该：
1. 调用工具
2. 等待执行完成
3. 验证 VTable 实例状态

