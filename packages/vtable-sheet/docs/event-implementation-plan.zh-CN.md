# VTable Sheet 事件机制实现方案

## 📋 执行摘要

基于你的想法，我建议采用**三层事件架构**，明确划分职责：

1. **Table 层** - 中转 tableInstance 的事件（单元格交互）
2. **WorkSheet 层** - 工作表级别事件（公式计算、数据处理）  
3. **SpreadSheet 层** - 电子表格级别事件（Sheet 管理、导入导出）

## ✅ 你的想法评估

| 你的想法 | 评估结果 | 说明 |
|---------|---------|------|
| 中转 tableInstance 事件 | ✅ **正确且必要** | 这是最基础的交互层，用户需要监听 |
| WorkSheet 层独立事件 | ✅ **有必要** | 工作表状态、公式计算等需要这一层 |
| SpreadSheet 层事件 | ✅ **非常重要** | Sheet 管理操作必须在这一层 |
| 公式事件归属 | 📝 **建议调整** | 单 sheet 公式 → WorkSheet 层<br>跨 sheet 公式 → SpreadSheet 层 |

## 🎯 核心建议

### 1. 公式事件的归属

**建议：分层处理**

```typescript
// ✅ WorkSheet 层：单个 sheet 的公式计算
worksheet.on('worksheet:formula_calculate_end', (event) => {
  console.log(`Sheet ${event.sheetKey} 计算完成，耗时 ${event.duration}ms`);
});

worksheet.on('worksheet:formula_error', (event) => {
  console.error(`公式错误: ${event.error}`);
});

// ✅ SpreadSheet 层：跨 sheet 的公式操作
spreadsheet.on('spreadsheet:cross_sheet_reference_updated', (event) => {
  console.log(`Sheet ${event.sourceSheetKey} 引用了其他 sheet`);
});
```

**理由：**
- ✅ 单个 sheet 的公式计算是独立的
- ✅ 用户关心"这个 sheet 何时计算完成"，不是整个应用
- ✅ 便于性能监控和调试
- ✅ 跨 sheet 引用在 SpreadSheet 层更合理

### 2. 不要合并所有事件类型

**❌ 不推荐：全部归为一种**

```typescript
// 不好的设计
sheet.on('event', (event) => {
  switch(event.type) {
    case 'cell_click': ...
    case 'sheet_added': ...
    case 'formula_error': ...
  }
});
```

**理由：**
- ❌ 失去类型安全
- ❌ 难以维护
- ❌ 用户难以按需监听
- ❌ 事件处理逻辑混乱

**✅ 推荐：分层分类**

```typescript
// 清晰的层次结构
spreadsheet.on(TableEventType.CLICK_CELL, handler);        // Table 层
worksheet.on(WorkSheetEventType.FORMULA_ERROR, handler);   // WorkSheet 层
spreadsheet.on(SpreadSheetEventType.SHEET_ADDED, handler); // SpreadSheet 层
```

## 🏗️ 具体实现步骤

### 步骤 1: 让 VTableSheet 继承事件系统

```typescript
// src/components/vtable-sheet.ts
import { TypedEventTarget } from '../event/typed-event-target';
import type { 
  SpreadSheetEventMap, 
  TableEventMap,
  TableEventType 
} from '../ts-types';

// 合并 SpreadSheet 自己的事件和中转的 Table 事件
type VTableSheetEventMap = SpreadSheetEventMap & TableEventMap;

export default class VTableSheet extends TypedEventTarget<VTableSheetEventMap> {
  // ... 现有代码 ...
  
  constructor(container: HTMLElement, options: IVTableSheetOptions) {
    super();  // 调用父类构造函数
    // ... 现有初始化代码 ...
  }
}
```

### 步骤 2: 在 WorkSheet 中中转 Table 事件

```typescript
// src/core/WorkSheet.ts
import { TypedEventTarget } from '../event/typed-event-target';
import type { WorkSheetEventMap, TableEventType } from '../ts-types';

export class WorkSheet extends TypedEventTarget<WorkSheetEventMap> {
  
  private _setupEventListeners(): void {
    // 中转重要的 VTable 事件
    
    // 1. 单元格点击
    this.tableInstance.on('click_cell', (event: any) => {
      this.vtableSheet.emit(TableEventType.CLICK_CELL, {
        sheetKey: this.getKey(),
        row: event.row,
        col: event.col,
        value: event.value,
        originalEvent: event.originalEvent
      });
    });
    
    // 2. 单元格值改变
    this.tableInstance.on('change_cell_value', (event: any) => {
      this.vtableSheet.emit(TableEventType.CHANGE_CELL_VALUE, {
        sheetKey: this.getKey(),
        row: event.row,
        col: event.col,
        oldValue: event.rawValue,
        newValue: event.changedValue
      });
    });
    
    // 3. 选择改变
    this.tableInstance.on('selected_changed', (event: any) => {
      this.vtableSheet.emit(TableEventType.SELECTED_CHANGED, {
        sheetKey: this.getKey(),
        ranges: event.ranges,
        cells: event.cells
      });
    });
    
    // 4. 添加/删除行
    this.tableInstance.on('add_record', (event: any) => {
      this.vtableSheet.emit(TableEventType.ADD_RECORD, {
        sheetKey: this.getKey(),
        type: 'add',
        index: event.recordIndex,
        count: event.recordCount
      });
    });
    
    this.tableInstance.on('delete_record', (event: any) => {
      this.vtableSheet.emit(TableEventType.DELETE_RECORD, {
        sheetKey: this.getKey(),
        type: 'delete',
        index: Math.min(...event.rowIndexs.flat()),
        count: event.deletedCount
      });
    });
    
    // 5. 添加/删除列
    this.tableInstance.on('add_column', (event: any) => {
      this.vtableSheet.emit(TableEventType.ADD_COLUMN, {
        sheetKey: this.getKey(),
        type: 'add',
        index: event.columnIndex,
        count: event.columnCount
      });
    });
    
    // 6. 调整列宽/行高
    this.tableInstance.on('resize_column_end', (event: any) => {
      this.vtableSheet.emit(TableEventType.RESIZE_COLUMN_END, {
        sheetKey: this.getKey(),
        index: event.col,
        size: event.width
      });
    });
    
    this.tableInstance.on('resize_row_end', (event: any) => {
      this.vtableSheet.emit(TableEventType.RESIZE_ROW_END, {
        sheetKey: this.getKey(),
        index: event.row,
        size: event.height
      });
    });
    
    // 7. 排序完成
    this.tableInstance.on('after_sort', (event: any) => {
      this.vtableSheet.emit(TableEventType.AFTER_SORT, {
        sheetKey: this.getKey(),
        field: event.field,
        order: event.order
      });
    });
    
    // 8. 复制/粘贴数据
    this.tableInstance.on('copy_data', (event: any) => {
      this.vtableSheet.emit(TableEventType.COPY_DATA, {
        sheetKey: this.getKey(),
        ...event
      } as any);
    });
    
    this.tableInstance.on('pasted_data', (event: any) => {
      this.vtableSheet.emit(TableEventType.PASTED_DATA, {
        sheetKey: this.getKey(),
        ...event
      } as any);
    });
    
    // ... 根据需要中转更多事件
  }
}
```

### 步骤 3: 在 VTableSheet 中触发 SpreadSheet 事件

```typescript
// src/components/vtable-sheet.ts

/**
 * 激活指定 sheet
 */
activateSheet(sheetKey: string): void {
  const oldSheetKey = this.sheetManager.getActiveSheet()?.sheetKey;
  const oldSheet = this.activeWorkSheet;
  
  // 设置活动 sheet
  this.sheetManager.setActiveSheet(sheetKey);
  const sheetDefine = this.sheetManager.getSheet(sheetKey);
  
  if (!sheetDefine) return;
  
  // 停用旧 sheet
  if (oldSheet) {
    oldSheet.emit(WorkSheetEventType.DEACTIVATED, {
      sheetKey: oldSheet.getKey(),
      sheetTitle: oldSheet.getTitle()
    });
  }
  
  // ... 现有的激活逻辑 ...
  
  // 激活新 sheet
  this.activeWorkSheet.emit(WorkSheetEventType.ACTIVATED, {
    sheetKey: sheetKey,
    sheetTitle: sheetDefine.sheetTitle
  });
  
  // 触发 SpreadSheet 层事件
  this.emit(SpreadSheetEventType.SHEET_ACTIVATED, {
    sheetKey: sheetKey,
    sheetTitle: sheetDefine.sheetTitle,
    previousSheetKey: oldSheetKey,
    previousSheetTitle: oldSheet?.getTitle()
  });
}

/**
 * 添加新 sheet
 */
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

/**
 * 删除 sheet
 */
removeSheet(sheetKey: string): void {
  if (this.sheetManager.getSheetCount() <= 1) {
    showSnackbar('至少保留一个工作表', 1300);
    return;
  }
  
  const sheet = this.sheetManager.getSheet(sheetKey);
  const index = this.sheetManager.getAllSheets().findIndex(s => s.sheetKey === sheetKey);
  
  // ... 现有删除逻辑 ...
  
  // 触发事件
  if (sheet) {
    this.emit(SpreadSheetEventType.SHEET_REMOVED, {
      sheetKey: sheetKey,
      sheetTitle: sheet.sheetTitle,
      index: index
    });
  }
}

/**
 * 导入文件
 */
async importFileToSheet(options: { clearExisting?: boolean } = {}): Promise<any> {
  // 触发导入开始事件
  this.emit(SpreadSheetEventType.IMPORT_START, {
    fileType: 'xlsx',  // 或根据实际文件类型
    allSheets: true
  });
  
  try {
    const result = await (this as any)._importFile?.(options);
    
    // 触发导入完成事件
    this.emit(SpreadSheetEventType.IMPORT_COMPLETED, {
      fileType: 'xlsx',
      sheetCount: result?.sheets?.length || 0
    });
    
    return result;
  } catch (error) {
    // 触发导入错误事件
    this.emit(SpreadSheetEventType.IMPORT_ERROR, {
      fileType: 'xlsx',
      error: error as Error
    });
    throw error;
  }
}

/**
 * 导出文件
 */
exportSheetToFile(fileType: 'csv' | 'xlsx', allSheets: boolean = true): void {
  // 触发导出开始事件
  this.emit(SpreadSheetEventType.EXPORT_START, {
    fileType: fileType,
    allSheets: allSheets,
    sheetCount: allSheets ? this.getSheetCount() : 1
  });
  
  try {
    // ... 现有导出逻辑 ...
    
    // 触发导出完成事件
    this.emit(SpreadSheetEventType.EXPORT_COMPLETED, {
      fileType: fileType,
      allSheets: allSheets,
      sheetCount: allSheets ? this.getSheetCount() : 1
    });
  } catch (error) {
    // 触发导出错误事件
    this.emit(SpreadSheetEventType.EXPORT_ERROR, {
      fileType: fileType,
      allSheets: allSheets,
      error: error as Error
    });
  }
}
```

### 步骤 4: 在 FormulaManager 中添加公式事件

```typescript
// src/managers/formula-manager.ts

/**
 * 设置单元格公式
 */
setCellContent(cell: CellAddress, content: string): void {
  const isFormula = content.startsWith('=');
  const worksheet = this.vtableSheet.workSheetInstances.get(cell.sheet);
  
  if (!worksheet) return;
  
  try {
    if (isFormula) {
      // 计算开始
      worksheet.emit(WorkSheetEventType.FORMULA_CALCULATE_START, {
        sheetKey: cell.sheet,
        formulaCount: 1
      });
      
      const startTime = Date.now();
      
      // 设置公式
      this.formulaEngine.setCellFormula(cell, content);
      
      // 计算结束
      const duration = Date.now() - startTime;
      worksheet.emit(WorkSheetEventType.FORMULA_CALCULATE_END, {
        sheetKey: cell.sheet,
        formulaCount: 1,
        duration: duration
      });
      
      // 触发公式添加事件
      worksheet.emit(WorkSheetEventType.FORMULA_ADDED, {
        sheetKey: cell.sheet,
        cell: { row: cell.row, col: cell.col },
        formula: content
      });
      
    } else {
      // 移除公式（如果之前是公式）
      if (this.isCellFormula(cell)) {
        this.formulaEngine.removeCellFormula(cell);
        
        worksheet.emit(WorkSheetEventType.FORMULA_REMOVED, {
          sheetKey: cell.sheet,
          cell: { row: cell.row, col: cell.col }
        });
      }
      
      // 设置普通值
      // ...
    }
  } catch (error) {
    // 触发公式错误事件
    worksheet.emit(WorkSheetEventType.FORMULA_ERROR, {
      sheetKey: cell.sheet,
      cell: cell,
      formula: content,
      error: error as Error
    });
  }
}

/**
 * 重新计算所有公式
 */
rebuildAndRecalculate(): void {
  const activeSheet = this.vtableSheet.getActiveSheet();
  if (!activeSheet) return;
  
  const sheetKey = activeSheet.getKey();
  const formulaCount = this.getAllFormulaCells(sheetKey).length;
  
  // 计算开始
  activeSheet.emit(WorkSheetEventType.FORMULA_CALCULATE_START, {
    sheetKey: sheetKey,
    formulaCount: formulaCount
  });
  
  const startTime = Date.now();
  
  try {
    this.formulaEngine.rebuildDependencyGraph();
    this.formulaEngine.recalculateAll();
    
    // 计算结束
    const duration = Date.now() - startTime;
    activeSheet.emit(WorkSheetEventType.FORMULA_CALCULATE_END, {
      sheetKey: sheetKey,
      formulaCount: formulaCount,
      duration: duration
    });
  } catch (error) {
    console.error('公式计算失败:', error);
  }
}

/**
 * 更新跨 Sheet 引用
 */
private updateCrossSheetReferences(sourceSheetKey: string, targetSheetKeys: string[]): void {
  // 触发跨 Sheet 引用更新事件
  this.vtableSheet.emit(SpreadSheetEventType.CROSS_SHEET_REFERENCE_UPDATED, {
    sourceSheetKey: sourceSheetKey,
    targetSheetKeys: targetSheetKeys,
    affectedFormulaCount: this.calculateAffectedFormulaCount(sourceSheetKey, targetSheetKeys)
  });
}
```

### 步骤 5: 更新类型定义导出

```typescript
// src/ts-types/index.ts
export * from './base';
export * from './event';
export * from './formula';
export * from './filter';
export * from './sheet';
export * from './spreadsheet-events';  // 新增

// src/index.ts  
export { VTableSheet, TYPES, VTable, ISheetDefine, IVTableSheetOptions };

// 导出事件类型
export {
  TableEventType,
  WorkSheetEventType,
  SpreadSheetEventType,
  type TableCellClickEvent,
  type FormulaCalculateEvent,
  type SheetAddedEvent,
  // ... 其他事件类型
} from './ts-types';
```

## 📊 优先级建议

### 第一阶段：核心事件（必须实现）

1. **Table 层**
   - ✅ `CLICK_CELL` - 单元格点击
   - ✅ `CHANGE_CELL_VALUE` - 单元格值改变
   - ✅ `SELECTED_CHANGED` - 选择改变
   - ✅ `ADD_RECORD` / `DELETE_RECORD` - 行操作
   - ✅ `ADD_COLUMN` / `DELETE_COLUMN` - 列操作

2. **WorkSheet 层**
   - ✅ `FORMULA_CALCULATE_END` - 公式计算完成
   - ✅ `FORMULA_ERROR` - 公式错误
   - ✅ `ACTIVATED` / `DEACTIVATED` - 激活/停用

3. **SpreadSheet 层**
   - ✅ `SHEET_ADDED` / `SHEET_REMOVED` - Sheet 添加/删除
   - ✅ `SHEET_ACTIVATED` - Sheet 切换
   - ✅ `READY` - 初始化完成

### 第二阶段：增强功能（建议实现）

1. **Table 层**
   - `RESIZE_COLUMN_END` / `RESIZE_ROW_END` - 调整大小
   - `COPY_DATA` / `PASTED_DATA` - 复制粘贴
   - `AFTER_SORT` - 排序完成

2. **WorkSheet 层**
   - `FORMULA_ADDED` / `FORMULA_REMOVED` - 公式添加/移除
   - `DATA_LOADED` / `DATA_SORTED` / `DATA_FILTERED` - 数据操作

3. **SpreadSheet 层**
   - `SHEET_RENAMED` / `SHEET_MOVED` - Sheet 重命名/移动
   - `IMPORT_*` / `EXPORT_*` - 导入/导出事件
   - `CROSS_SHEET_REFERENCE_UPDATED` - 跨 Sheet 引用

### 第三阶段：完善功能（可选实现）

1. 更多 Table 事件中转（根据用户反馈）
2. 编辑状态事件 (`EDIT_START` / `EDIT_END`)
3. 范围数据批量变更事件
4. 性能监控相关事件

## 💡 使用示例

```typescript
import { VTableSheet, TableEventType, WorkSheetEventType, SpreadSheetEventType } from '@visactor/vtable-sheet';

const sheet = new VTableSheet(container, {
  sheets: [/* ... */]
});

// 1. 监听所有 sheet 的单元格编辑
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  console.log(`Sheet ${event.sheetKey} 的单元格 [${event.row}, ${event.col}] 值改变`);
  autoSave(event);
});

// 2. 监听公式计算完成
const worksheet = sheet.getActiveSheet();
worksheet.on(WorkSheetEventType.FORMULA_CALCULATE_END, (event) => {
  console.log(`公式计算完成，耗时 ${event.duration}ms`);
});

// 3. 监听 Sheet 切换
sheet.on(SpreadSheetEventType.SHEET_ACTIVATED, (event) => {
  console.log(`从 ${event.previousSheetTitle} 切换到 ${event.sheetTitle}`);
  updateUI(event.sheetKey);
});

// 4. 监听公式错误
worksheet.on(WorkSheetEventType.FORMULA_ERROR, (event) => {
  showError(`公式错误: ${event.error}`, event.cell);
});

// 5. 监听 Sheet 添加
sheet.on(SpreadSheetEventType.SHEET_ADDED, (event) => {
  console.log(`新增了 Sheet: ${event.sheetTitle}`);
});
```

## 🎯 总结

### 你的想法的优点

1. ✅ **事件分层** - 思路完全正确，这是最佳实践
2. ✅ **中转 tableInstance** - 必要且重要
3. ✅ **SpreadSheet 层事件** - 对于 Sheet 管理至关重要

### 需要调整的地方

1. 📝 **公式事件归属** - 建议分层：单 sheet → WorkSheet 层，跨 sheet → SpreadSheet 层
2. 📝 **不要合并事件类型** - 保持三层架构，不要全部归为一种
3. 📝 **WorkSheet 层有必要** - 工作表级别的状态和操作需要这一层

### 实现优先级

**第一阶段（核心功能）：**
- Table 层：单元格交互、编辑、数据操作
- WorkSheet 层：公式计算、激活状态
- SpreadSheet 层：Sheet 管理

**第二/三阶段：**
- 根据用户反馈和实际需求逐步完善

## 📝 下一步行动

1. ✅ 事件类型定义（已完成）
2. ⏳ 让 VTableSheet 继承 TypedEventTarget
3. ⏳ 在 WorkSheet 中实现 Table 事件中转
4. ⏳ 在 VTableSheet 中实现 SpreadSheet 事件
5. ⏳ 在 FormulaManager 中添加公式事件
6. ⏳ 编写测试用例
7. ⏳ 更新 API 文档

希望这个方案对你有帮助！有任何问题随时问我。


