# 代码清理建议：spreadsheet-events.ts

## 🔍 问题

`packages/vtable-sheet/src/ts-types/spreadsheet-events.ts` 文件中的大部分内容**不再使用**，成为了死代码。

## 📊 使用情况分析

### ❌ 不再使用的内容

#### 1. TableEventType 枚举（约 100 行）

```typescript
export enum TableEventType {
  CLICK_CELL = 'table:click_cell',
  DBLCLICK_CELL = 'table:dblclick_cell',
  // ... 等等
}
```

**原因：** 统一事件系统后，直接使用 VTable 的原生事件字符串

```typescript
// ❌ 之前（不再使用）
sheet.on(TableEventType.CLICK_CELL, handler);

// ✅ 现在
sheet.onTableEvent('click_cell', handler);
```

#### 2. WorkSheetEventType 枚举

```typescript
export enum WorkSheetEventType {
  ACTIVATED = 'worksheet:activated',
  FORMULA_CALCULATE_START = 'worksheet:formula_calculate_start',
  // ... 等等
}
```

**原因：** WorkSheet 不再继承 EventTarget，不再触发这些事件

#### 3. SpreadSheetEventType 枚举

```typescript
export enum SpreadSheetEventType {
  SHEET_ADDED = 'spreadsheet:sheet_added',
  SHEET_REMOVED = 'spreadsheet:sheet_removed',
  // ... 等等
}
```

**原因：** VTableSheet 层面没有实现这些事件的触发

#### 4. 大量事件类型接口

```typescript
export interface TableCellClickEvent { /* ... */ }
export interface TableSelectionChangedEvent { /* ... */ }
export interface TableCellValueChangeEvent { /* ... */ }
// ... 等等几十个接口
```

**原因：** 直接使用 VTable 的原生事件对象，不需要包装

#### 5. 事件映射类型

```typescript
export interface TableEventHandlersEventArgumentMap {
  [TableEventType.CLICK_CELL]: TableCellClickEvent;
  [TableEventType.DBLCLICK_CELL]: TableCellClickEvent;
  // ... 等等
}
```

**原因：** 不再使用类型化的事件处理

### ✅ 仍在使用的内容

#### 1. WorkSheetEventType（部分）

```typescript
export enum WorkSheetEventType {
  CELL_CLICK = 'cell-selected',
  CELL_VALUE_CHANGED = 'cell-value-changed',
  SELECTION_CHANGED = 'selection-changed',
  SELECTION_END = 'selection-end'
}
```

**使用位置：** `WorkSheet.ts` 内部使用（用于 WorkSheet 内部事件触发）

#### 2. 基础事件接口（部分）

```typescript
export interface CellClickEvent { /* ... */ }
export interface CellValueChangedEvent { /* ... */ }
export interface SelectionChangedEvent { /* ... */ }
```

**使用位置：** `WorkSheet.ts` 内部类型定义

## 📝 检测结果

```bash
# 搜索 TableEventType 使用（除定义外）
grep -r "TableEventType\." packages/vtable-sheet/src --exclude="spreadsheet-events.ts"
# 结果：0 个匹配

# 搜索 TableEventHandlersEventArgumentMap 使用
grep -r "TableEventHandlersEventArgumentMap" packages/vtable-sheet/src
# 结果：0 个匹配

# 搜索 SpreadSheetEventType 使用（除定义外）
grep -r "SpreadSheetEventType\." packages/vtable-sheet/src --exclude="spreadsheet-events.ts"
# 结果：0 个匹配
```

**结论：** 这些类型和枚举只在定义文件内部使用，没有被实际代码引用。

## 🗑️ 清理建议

### 方案 1：完全删除不使用的代码（推荐）

删除 `spreadsheet-events.ts` 中以下内容：

1. ❌ `TableEventType` 枚举及相关类型（约 300+ 行）
2. ❌ `WorkSheetEventType` 枚举中未使用的事件（保留 4 个仍在使用的）
3. ❌ `SpreadSheetEventType` 枚举及相关类型（约 100+ 行）
4. ❌ 所有 `Table*Event` 接口（约 100+ 行）
5. ❌ `TableEventHandlersEventArgumentMap` 类型

**保留内容：**

```typescript
/**
 * WorkSheet 内部事件类型（仅供内部使用）
 */
export enum WorkSheetEventType {
  CELL_CLICK = 'cell-selected',
  CELL_VALUE_CHANGED = 'cell-value-changed',
  SELECTION_CHANGED = 'selection-changed',
  SELECTION_END = 'selection-end'
}

// 相关的基础事件接口
export interface CellClickEvent { /* ... */ }
export interface CellValueChangedEvent { /* ... */ }
export interface SelectionChangedEvent { /* ... */ }
```

### 方案 2：标记为废弃（过渡方案）

如果担心破坏兼容性，可以先标记为 `@deprecated`：

```typescript
/**
 * @deprecated 统一事件系统后不再使用，请使用 VTableSheet.onTableEvent()
 */
export enum TableEventType {
  // ...
}
```

然后在下一个大版本中删除。

## 📊 清理收益

| 项目 | 删除前 | 删除后 | 减少 |
|------|--------|--------|------|
| 文件行数 | ~534 行 | ~100 行 | -434 行 (81%) |
| 事件枚举 | 3 个 | 1 个 | -2 个 |
| 事件接口 | ~30 个 | ~3 个 | -27 个 |
| 类型映射 | 3 个 | 0 个 | -3 个 |

### 其他收益

1. ✅ **代码更清晰** - 移除死代码，减少困惑
2. ✅ **维护成本降低** - 不需要维护不使用的代码
3. ✅ **构建体积减小** - 减少导出的类型定义
4. ✅ **文档更准确** - TypeScript 类型提示更准确

## 🔄 迁移指南（如果有外部用户）

如果有外部用户在使用这些枚举（虽然不应该），提供迁移指南：

### 之前（使用枚举）

```typescript
import { VTableSheet, TableEventType } from '@visactor/vtable-sheet';

const sheet = new VTableSheet(container, options);

// ❌ 不再支持
sheet.on(TableEventType.CLICK_CELL, (event) => {
  console.log('点击', event);
});
```

### 现在（使用字符串）

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';

const sheet = new VTableSheet(container, options);

// ✅ 推荐方式
sheet.onTableEvent('click_cell', (event) => {
  console.log(`Sheet ${event.sheetKey} 被点击`, event);
});
```

## 🎯 执行步骤

### 1. 确认影响范围

```bash
# 检查是否有外部包引用
grep -r "from '@visactor/vtable-sheet'" packages/
grep -r "TableEventType" packages/ --exclude-dir=vtable-sheet
grep -r "SpreadSheetEventType" packages/ --exclude-dir=vtable-sheet
```

### 2. 更新文档

删除或更新文档中对这些枚举的引用：
- `docs/event-usage-examples.zh-CN.md`
- `docs/event-implementation-plan.zh-CN.md`
- `docs/event-system-guide.md`
- `docs/最终方案.md`

### 3. 清理代码

创建一个简化版的 `spreadsheet-events.ts`：

```typescript
/**
 * WorkSheet 内部事件类型
 * 
 * 注意：这些事件仅供 WorkSheet 内部使用
 * 外部用户应该使用 VTableSheet.onTableEvent() 监听 VTable 的原生事件
 */

import type { CellCoord, CellRange, CellValue } from './base';

/**
 * WorkSheet 内部事件类型枚举
 */
export enum WorkSheetEventType {
  /** 单元格点击 */
  CELL_CLICK = 'cell-selected',
  /** 单元格值改变 */
  CELL_VALUE_CHANGED = 'cell-value-changed',
  /** 选择范围改变 */
  SELECTION_CHANGED = 'selection-changed',
  /** 选择结束 */
  SELECTION_END = 'selection-end'
}

/**
 * 单元格点击事件
 */
export interface CellClickEvent {
  row: number;
  col: number;
  value: CellValue;
  cellElement?: HTMLElement;
  originalEvent?: Event;
}

/**
 * 单元格值改变事件
 */
export interface CellValueChangedEvent {
  row: number;
  col: number;
  oldValue: CellValue;
  newValue: CellValue;
}

/**
 * 选择范围改变事件
 */
export interface SelectionChangedEvent {
  row: number;
  col: number;
  ranges?: CellRange[];
  cells?: any[][];
  originalEvent?: Event;
}
```

### 4. 验证

```bash
# 构建检查
cd packages/vtable-sheet
npm run build

# 类型检查
npm run type-check

# 测试
npm run test
```

## ✅ 结论

**建议立即清理这些不使用的代码：**

1. ✅ 减少约 430+ 行死代码
2. ✅ 简化类型定义
3. ✅ 避免用户误用
4. ✅ 降低维护成本
5. ✅ 使代码库更清晰

**没有破坏性影响：**
- ❌ 源代码中没有实际引用
- ❌ 只在文档示例中使用（需要更新文档）
- ❌ 不会影响现有功能

---

**建议：立即清理！** 🧹

