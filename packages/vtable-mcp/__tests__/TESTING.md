# 测试文档

## 测试必要性评估

### ✅ 有必要做单测

**原因：**

1. **工具执行是核心功能**
   - 工具是 MCP 协议的核心，负责与 VTable 实例交互
   - 涉及数据操作、样式设置等关键业务逻辑
   - 需要确保工具执行的正确性和可靠性

2. **参数验证需要测试**
   - 使用 Zod schema 进行运行时类型检查
   - 需要验证各种边界情况和错误输入
   - 确保参数验证逻辑正确

3. **错误处理需要测试**
   - VTable 实例不存在的情况
   - 非 ListTable 类型检查
   - API 方法缺失的情况
   - 参数不匹配的情况

4. **回归测试**
   - 工具定义可能频繁变更
   - 需要确保修改不会破坏现有功能
   - 提供快速反馈机制

## 测试覆盖范围

### 已完成的测试

#### 1. `operate-data.test.ts` ✅
- ✅ `add_record`: 添加单条记录（无/有 recordIndex，支持 number/number[]）
- ✅ `add_records`: 添加多条记录
- ✅ `delete_records`: 删除记录（支持 number[] 和 number[][]）
- ✅ `update_records`: 更新记录（包括长度匹配验证）
- ✅ 参数验证（Zod schema）
- ✅ 错误处理（实例不存在、非 ListTable、方法缺失）

#### 2. `cell-operations.test.ts` ✅
- ✅ `set_cell_data`: 设置单元格值（单个/批量，支持多种类型）
- ✅ `get_cell_data`: 读取单元格值（单个/批量）
- ✅ `get_table_info`: 获取表格信息
- ✅ 参数验证（Zod schema）
- ✅ 错误处理

#### 3. `range-operations.test.ts` ✅
- ✅ `get_range_data`: 读取区域数据（包括范围规范化、maxCells 限制）
- ✅ `set_range_data`: 设置区域数据（包括不规则数组处理）
- ✅ `clear_range`: 清空区域
- ✅ 参数验证
- ✅ 错误处理（范围过大等）

#### 4. `style-operations.test.ts` ✅
- ✅ `set_cell_style`: 设置单元格样式（单个/批量，支持所有样式属性）
- ✅ `get_cell_style`: 获取单元格样式
- ✅ `set_range_style`: 设置区域样式
- ✅ 参数验证
- ✅ 错误处理

### 待完成的测试

以下工具文件可以按需添加测试（优先级较低，因为核心工具已覆盖）：

- `selection-operations.ts`: 选择操作工具
- `view-operations.ts`: 视图操作工具
- `dimension-operations.ts`: 维度操作工具
- `export-operations.ts`: 导出操作工具
- `merge-operations.ts`: 合并单元格工具

### 集成测试

- `mcp-client.test.ts`: MCP 客户端测试（WebSocket 连接、工具调用等）
- `vtable-tool-registry.test.ts`: 工具注册表测试

## 测试工具函数

### `test-utils.ts`

提供以下工具函数：

- `createMockListTable()`: 创建 Mock ListTable 实例
- `createMockBaseTable()`: 创建 Mock BaseTable 实例
- `setGlobalVTableInstance()`: 设置全局 VTable 实例
- `clearGlobalVTableInstance()`: 清除全局 VTable 实例
- `setupMockTable()`: 设置 Mock 实例（测试前）
- `cleanupMockTable()`: 清理 Mock 实例（测试后）

## 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage
```

## 测试覆盖率目标

- **分支覆盖率**: 60%+
- **函数覆盖率**: 60%+
- **行覆盖率**: 60%+
- **语句覆盖率**: 60+

## 测试最佳实践

1. **每个测试只测试一个功能点**
2. **使用描述性的测试名称**
3. **测试正常流程和错误流程**
4. **测试边界情况**
5. **使用 Mock 隔离依赖**
6. **保持测试独立（不依赖执行顺序）**

## 注意事项

1. **VTable 实例获取方式**
   - 工具通过 `globalThis.__vtable_instance` 获取实例
   - 测试时需要设置全局实例

2. **ListTable vs BaseTable**
   - `operate-data` 工具仅支持 ListTable
   - 需要验证 `isListTable()` 返回 true

3. **参数顺序**
   - VTable API 使用 `(col, row)` 顺序
   - 工具参数使用 `{ row, col }` 顺序
   - 测试时需要验证正确的参数传递

4. **异步执行**
   - 所有工具的 `execute` 方法都是异步的
   - 测试时需要使用 `await`



