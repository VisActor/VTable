# VTable Sheet 事件系统设计指南

## 📋 概述

VTable Sheet 采用**三层事件架构**，清晰地划分不同级别的事件职责：

```
┌─────────────────────────────────────────────┐
│         SpreadSheet 层事件                   │
│  (电子表格应用级别)                           │
│  - Sheet 管理 (添加/删除/切换)                │
│  - 导入/导出                                  │
│  - 跨 Sheet 操作                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         WorkSheet 层事件                     │
│  (单个工作表级别)                             │
│  - 工作表状态                                 │
│  - 公式计算                                   │
│  - 数据加载/排序/筛选                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Table 层事件                         │
│  (表格交互级别 - 从 tableInstance 中转)       │
│  - 单元格交互 (点击/双击/选择)                │
│  - 编辑操作                                   │
│  - 行列调整                                   │
└─────────────────────────────────────────────┘
```

## 🎯 设计原则

### 1. 事件命名约定

使用命名空间前缀区分不同层级的事件：

- **Table 层**: `table:事件名` (例如: `table:click_cell`)
- **WorkSheet 层**: `worksheet:事件名` (例如: `worksheet:formula_calculate_end`)
- **SpreadSheet 层**: `spreadsheet:事件名` (例如: `spreadsheet:sheet_added`)

### 2. 事件冒泡策略

```
Table 事件 → WorkSheet 包装 → SpreadSheet 可选监听
```

- **Table 层事件**：直接从 VTable 的 tableInstance 中转，带上 `sheetKey` 信息
- **WorkSheet 层事件**：由 WorkSheet 实例触发，不向上冒泡
- **SpreadSheet 层事件**：由 VTableSheet 主实例触发

### 3. 类型安全

所有事件都有完整的 TypeScript 类型定义：

```typescript
// 事件类型枚举
enum TableEventType { ... }
enum WorkSheetEventType { ... }
enum SpreadSheetEventType { ... }

// 事件数据接口
interface TableCellClickEvent { ... }
interface FormulaCalculateEvent { ... }
interface SheetAddedEvent { ... }

// 事件映射（用于类型推断）
interface TableEventMap { ... }
interface WorkSheetEventMap { ... }
interface SpreadSheetEventMap { ... }
```

## 📚 事件分类详解

### 第一层：Table 层事件

这些事件直接从底层 VTable 的 `tableInstance` 中转而来，代表用户与表格的直接交互。

#### 单元格交互事件

```typescript
import { TableEventType } from '@visactor/vtable-sheet';

sheet.on(TableEventType.CLICK_CELL, (event) => {
  console.log(`点击了 Sheet ${event.sheetKey} 的单元格`, event.row, event.col);
});

sheet.on(TableEventType.DBLCLICK_CELL, (event) => {
  console.log('双击单元格', event);
});

sheet.on(TableEventType.CONTEXTMENU_CELL, (event) => {
  console.log('右键菜单', event);
});
```

#### 选择事件

```typescript
sheet.on(TableEventType.SELECTED_CHANGED, (event) => {
  console.log('选择范围改变', event.ranges);
});

sheet.on(TableEventType.DRAG_SELECT_END, (event) => {
  console.log('拖拽选择完成', event);
});
```

#### 编辑事件

```typescript
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  console.log(`单元格 [${event.row}, ${event.col}] 的值从 ${event.oldValue} 变为 ${event.newValue}`);
});

sheet.on(TableEventType.COPY_DATA, (event) => {
  console.log('复制了数据', event);
});

sheet.on(TableEventType.PASTED_DATA, (event) => {
  console.log('粘贴了数据', event);
});
```

#### 数据操作事件

```typescript
sheet.on(TableEventType.ADD_RECORD, (event) => {
  console.log(`在 Sheet ${event.sheetKey} 的索引 ${event.index} 处添加了 ${event.count} 行`);
});

sheet.on(TableEventType.DELETE_RECORD, (event) => {
  console.log('删除了行', event);
});

sheet.on(TableEventType.ADD_COLUMN, (event) => {
  console.log('添加了列', event);
});
```

#### 调整大小事件

```typescript
sheet.on(TableEventType.RESIZE_COLUMN_END, (event) => {
  console.log(`列 ${event.index} 调整为宽度 ${event.size}`);
});

sheet.on(TableEventType.RESIZE_ROW_END, (event) => {
  console.log(`行 ${event.index} 调整为高度 ${event.size}`);
});
```

### 第二层：WorkSheet 层事件

工作表级别的状态和操作事件，主要关注单个工作表的生命周期和数据处理。

#### 工作表状态事件

```typescript
import { WorkSheetEventType } from '@visactor/vtable-sheet';

// 获取特定工作表实例
const worksheet = sheet.getActiveSheet();

worksheet.on(WorkSheetEventType.READY, (event) => {
  console.log(`工作表 ${event.sheetKey} 初始化完成`);
});

worksheet.on(WorkSheetEventType.ACTIVATED, (event) => {
  console.log(`工作表 ${event.sheetKey} 被激活`);
});

worksheet.on(WorkSheetEventType.DEACTIVATED, (event) => {
  console.log(`工作表 ${event.sheetKey} 被停用`);
});
```

#### 公式相关事件（重点）

公式事件属于 WorkSheet 层，因为：
- ✅ 公式计算在单个 sheet 内进行
- ✅ 便于监控单个 sheet 的公式性能
- ✅ 用户关心"这个 sheet 的公式何时计算完成"

```typescript
// 公式计算开始
worksheet.on(WorkSheetEventType.FORMULA_CALCULATE_START, (event) => {
  console.log(`Sheet ${event.sheetKey} 开始计算 ${event.formulaCount} 个公式`);
});

// 公式计算结束
worksheet.on(WorkSheetEventType.FORMULA_CALCULATE_END, (event) => {
  console.log(`Sheet ${event.sheetKey} 公式计算完成，耗时 ${event.duration}ms`);
});

// 公式错误
worksheet.on(WorkSheetEventType.FORMULA_ERROR, (event) => {
  console.error(`Sheet ${event.sheetKey} 单元格 [${event.cell.row}, ${event.cell.col}] 公式错误:`, event.error);
  console.error('出错的公式:', event.formula);
});

// 公式添加
worksheet.on(WorkSheetEventType.FORMULA_ADDED, (event) => {
  console.log(`在 [${event.cell.row}, ${event.cell.col}] 添加了公式: ${event.formula}`);
});

// 公式移除
worksheet.on(WorkSheetEventType.FORMULA_REMOVED, (event) => {
  console.log(`移除了 [${event.cell.row}, ${event.cell.col}] 的公式`);
});

// 公式依赖关系改变
worksheet.on(WorkSheetEventType.FORMULA_DEPENDENCY_CHANGED, (event) => {
  console.log('公式依赖关系发生变化');
});
```

#### 数据操作事件

```typescript
worksheet.on(WorkSheetEventType.DATA_LOADED, (event) => {
  console.log(`加载了 ${event.rowCount} 行 × ${event.colCount} 列数据`);
});

worksheet.on(WorkSheetEventType.DATA_SORTED, (event) => {
  console.log('数据已排序');
});

worksheet.on(WorkSheetEventType.DATA_FILTERED, (event) => {
  console.log('数据已筛选');
});

worksheet.on(WorkSheetEventType.RANGE_DATA_CHANGED, (event) => {
  console.log(`范围 ${event.range} 的数据发生了批量变更`);
  console.log('变更的单元格:', event.changes);
});
```

#### 编辑状态事件

```typescript
worksheet.on(WorkSheetEventType.EDIT_START, (event) => {
  console.log(`开始编辑单元格 [${event.cell.row}, ${event.cell.col}]`);
});

worksheet.on(WorkSheetEventType.EDIT_END, (event) => {
  console.log(`结束编辑单元格 [${event.cell.row}, ${event.cell.col}]`);
});

worksheet.on(WorkSheetEventType.EDIT_CANCEL, (event) => {
  console.log('取消编辑');
});
```

### 第三层：SpreadSheet 层事件

电子表格应用级别的事件，管理整个电子表格的生命周期和多 sheet 操作。

#### 生命周期事件

```typescript
import { SpreadSheetEventType } from '@visactor/vtable-sheet';

sheet.on(SpreadSheetEventType.READY, () => {
  console.log('电子表格初始化完成');
});

sheet.on(SpreadSheetEventType.DESTROYED, () => {
  console.log('电子表格已销毁');
});
```

#### Sheet 管理事件

```typescript
// 添加 Sheet
sheet.on(SpreadSheetEventType.SHEET_ADDED, (event) => {
  console.log(`新增了 Sheet: ${event.sheetTitle} (key: ${event.sheetKey})`);
  console.log(`在索引 ${event.index} 位置`);
});

// 删除 Sheet
sheet.on(SpreadSheetEventType.SHEET_REMOVED, (event) => {
  console.log(`删除了 Sheet: ${event.sheetTitle}`);
});

// 重命名 Sheet
sheet.on(SpreadSheetEventType.SHEET_RENAMED, (event) => {
  console.log(`Sheet 重命名: ${event.oldTitle} → ${event.newTitle}`);
});

// 激活 Sheet (切换 Sheet)
sheet.on(SpreadSheetEventType.SHEET_ACTIVATED, (event) => {
  console.log(`从 ${event.previousSheetTitle} 切换到 ${event.sheetTitle}`);
});

// Sheet 移动
sheet.on(SpreadSheetEventType.SHEET_MOVED, (event) => {
  console.log(`Sheet ${event.sheetKey} 从索引 ${event.fromIndex} 移动到 ${event.toIndex}`);
});
```

#### 导入/导出事件

```typescript
// 导入开始
sheet.on(SpreadSheetEventType.IMPORT_START, (event) => {
  console.log(`开始导入 ${event.fileType} 文件`);
});

// 导入完成
sheet.on(SpreadSheetEventType.IMPORT_COMPLETED, (event) => {
  console.log(`导入完成，共 ${event.sheetCount} 个 Sheet`);
});

// 导入错误
sheet.on(SpreadSheetEventType.IMPORT_ERROR, (event) => {
  console.error('导入失败:', event.error);
});

// 导出开始
sheet.on(SpreadSheetEventType.EXPORT_START, (event) => {
  console.log(`开始导出为 ${event.fileType}`);
  console.log(`导出 ${event.allSheets ? '所有' : '当前'} Sheet`);
});

// 导出完成
sheet.on(SpreadSheetEventType.EXPORT_COMPLETED, (event) => {
  console.log('导出完成');
});
```

#### 跨 Sheet 操作事件

```typescript
// 跨 Sheet 引用更新
sheet.on(SpreadSheetEventType.CROSS_SHEET_REFERENCE_UPDATED, (event) => {
  console.log(`Sheet ${event.sourceSheetKey} 的跨 Sheet 引用已更新`);
  console.log('影响的目标 Sheet:', event.targetSheetKeys);
  console.log('影响的公式数量:', event.affectedFormulaCount);
});

// 跨 Sheet 公式计算
sheet.on(SpreadSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START, () => {
  console.log('开始跨 Sheet 公式计算');
});

sheet.on(SpreadSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END, () => {
  console.log('跨 Sheet 公式计算完成');
});
```

## 💡 使用示例

### 示例 1: 监听所有单元格编辑

```typescript
import { VTableSheet, TableEventType } from '@visactor/vtable-sheet';

const sheet = new VTableSheet(container, options);

// 在 SpreadSheet 级别统一监听所有 sheet 的编辑事件
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  // 自动保存
  saveToServer({
    sheetKey: event.sheetKey,
    row: event.row,
    col: event.col,
    value: event.newValue
  });
});
```

### 示例 2: 监听公式计算性能

```typescript
import { WorkSheetEventType } from '@visactor/vtable-sheet';

const worksheet = sheet.getActiveSheet();

worksheet.on(WorkSheetEventType.FORMULA_CALCULATE_START, () => {
  console.time('公式计算');
});

worksheet.on(WorkSheetEventType.FORMULA_CALCULATE_END, (event) => {
  console.timeEnd('公式计算');
  console.log(`计算了 ${event.formulaCount} 个公式，耗时 ${event.duration}ms`);
});

worksheet.on(WorkSheetEventType.FORMULA_ERROR, (event) => {
  // 显示错误提示
  showErrorNotification(`公式错误: ${event.error}`, {
    cell: `${event.cell.row},${event.cell.col}`,
    formula: event.formula
  });
});
```

### 示例 3: 追踪 Sheet 操作历史

```typescript
import { SpreadSheetEventType } from '@visactor/vtable-sheet';

const operationHistory = [];

sheet.on(SpreadSheetEventType.SHEET_ADDED, (event) => {
  operationHistory.push({
    type: 'add_sheet',
    sheetKey: event.sheetKey,
    sheetTitle: event.sheetTitle,
    timestamp: Date.now()
  });
});

sheet.on(SpreadSheetEventType.SHEET_REMOVED, (event) => {
  operationHistory.push({
    type: 'remove_sheet',
    sheetKey: event.sheetKey,
    timestamp: Date.now()
  });
});

sheet.on(SpreadSheetEventType.SHEET_RENAMED, (event) => {
  operationHistory.push({
    type: 'rename_sheet',
    sheetKey: event.sheetKey,
    oldTitle: event.oldTitle,
    newTitle: event.newTitle,
    timestamp: Date.now()
  });
});
```

### 示例 4: 实现协同编辑

```typescript
import { TableEventType, SpreadSheetEventType } from '@visactor/vtable-sheet';

// 监听本地编辑，广播给其他用户
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  websocket.send({
    type: 'cell_edit',
    sheetKey: event.sheetKey,
    row: event.row,
    col: event.col,
    value: event.newValue,
    userId: currentUserId
  });
});

// 接收其他用户的编辑
websocket.onmessage = (msg) => {
  if (msg.userId !== currentUserId) {
    const ws = sheet.getSheet(msg.sheetKey);
    ws.setCellValue(msg.col, msg.row, msg.value);
  }
};

// 监听 Sheet 结构变化
sheet.on(SpreadSheetEventType.SHEET_ADDED, (event) => {
  websocket.send({
    type: 'sheet_added',
    sheetKey: event.sheetKey,
    sheetTitle: event.sheetTitle
  });
});
```

## 🎨 最佳实践

### 1. 选择合适的事件层级

- **需要监听单个 sheet 的事件** → 使用 WorkSheet 层事件
- **需要监听所有 sheet 的通用事件** → 使用 SpreadSheet 层监听 Table 事件
- **需要监听 sheet 管理操作** → 使用 SpreadSheet 层事件

### 2. 避免事件处理函数中的耗时操作

```typescript
// ❌ 不推荐：在事件处理中执行耗时操作
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  // 同步的大量计算会阻塞 UI
  heavyCalculation(event.newValue);
});

// ✅ 推荐：使用异步或防抖
import { debounce } from 'lodash';

const debouncedSave = debounce((data) => {
  saveToServer(data);
}, 500);

sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  debouncedSave(event);
});
```

### 3. 记得清理事件监听器

```typescript
// 保存处理函数的引用，以便后续移除
const handleCellClick = (event) => {
  console.log('Cell clicked', event);
};

sheet.on(TableEventType.CLICK_CELL, handleCellClick);

// 在组件卸载时移除监听器
onUnmount(() => {
  sheet.off(TableEventType.CLICK_CELL, handleCellClick);
});
```

### 4. 使用类型安全的事件系统

```typescript
// TypeScript 会自动推断事件数据类型
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  // event 的类型自动推断为 TableCellValueChangeEvent
  console.log(event.sheetKey);  // ✅ 类型安全，有自动补全
  console.log(event.oldValue);  // ✅
  console.log(event.newValue);  // ✅
  // console.log(event.unknown); // ❌ TypeScript 编译错误
});
```

## 🔧 实现建议

### WorkSheet 中转 Table 事件

```typescript
// 在 WorkSheet.ts 中
private _setupEventListeners(): void {
  this.tableInstance.on('click_cell', (event: any) => {
    // 包装事件，添加 sheetKey 信息
    const wrappedEvent: TableCellClickEvent = {
      sheetKey: this.getKey(),
      row: event.row,
      col: event.col,
      value: event.value,
      originalEvent: event.originalEvent
    };
    
    // 向上传递到 VTableSheet
    this.vtableSheet.emit(TableEventType.CLICK_CELL, wrappedEvent);
  });
}
```

### VTableSheet 触发 SpreadSheet 事件

```typescript
// 在 VTableSheet.ts 中
addSheet(sheet: ISheetDefine): void {
  this.sheetManager.addSheet(sheet);
  
  // 触发事件
  this.emit(SpreadSheetEventType.SHEET_ADDED, {
    sheetKey: sheet.sheetKey,
    sheetTitle: sheet.sheetTitle,
    index: this.sheetManager.getAllSheets().length - 1
  });
  
  this.updateSheetTabs();
  this.updateSheetMenu();
}
```

## 📊 事件参考速查表

| 层级 | 事件数量 | 主要用途 | 示例 |
|------|---------|----------|------|
| Table 层 | ~30 个 | 单元格交互、编辑、数据操作 | `table:click_cell`, `table:change_cell_value` |
| WorkSheet 层 | ~15 个 | 工作表状态、公式计算、数据处理 | `worksheet:formula_calculate_end` |
| SpreadSheet 层 | ~15 个 | Sheet 管理、导入导出、跨 Sheet 操作 | `spreadsheet:sheet_added` |

## 🤔 常见问题

### Q1: 公式相关事件应该在哪一层？

**A**: 在 WorkSheet 层。原因：
- 单个 sheet 的公式计算是独立的
- 便于监控单个 sheet 的性能
- 用户关心的是"这个 sheet 何时计算完成"
- 跨 sheet 的公式引用可以在 SpreadSheet 层触发专门的事件

### Q2: 是否需要中转所有的 VTable 事件？

**A**: 不需要。应该中转**用户可能需要的高频和重要事件**：
- ✅ 中转：单元格交互、编辑、数据变更、调整大小
- ❌ 不中转：内部渲染事件、性能优化相关的低级事件

### Q3: 事件是否会影响性能？

**A**: 正常使用不会。注意：
- 事件系统本身很轻量
- 避免在事件处理函数中执行耗时操作
- 对高频事件（如 `mousemove`）使用节流/防抖
- 及时移除不再需要的监听器

### Q4: 如何实现事件的条件监听？

```typescript
// 只监听特定 sheet 的事件
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  if (event.sheetKey === 'sheet1') {
    // 只处理 sheet1 的事件
    handleSheet1CellChange(event);
  }
});
```

## 🚀 下一步

1. ✅ 定义事件类型和接口 (已完成)
2. ⏳ 在 WorkSheet 中实现 Table 事件中转
3. ⏳ 在 VTableSheet 中实现 SpreadSheet 事件
4. ⏳ 在 FormulaManager 中添加公式事件触发
5. ⏳ 编写完整的单元测试
6. ⏳ 完善 API 文档和使用示例


