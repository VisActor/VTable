{{ target: sheet-api }}

# Sheet API

## Methods

VTableSheet组件支持的方法如下：

### activateSheet(Function)

激活指定sheet

```
  activateSheet: (sheetKey: string) => void
```

### addSheet(Function)

添加新的sheet

```
  addSheet: (sheet: ISheetDefine) => void
```

### removeSheet(Function)

删除指定sheet

```
  removeSheet: (sheetKey: string) => void
```

### getSheetCount(Function)

获取工作表数量

```
  getSheetCount: () => number
```

### getSheet(Function)

获取指定工作表定义

```
  getSheet: (sheetKey: string) => ISheetDefine | null
```

### getAllSheets(Function)

获取所有工作表定义

```
  getAllSheets: () => ISheetDefine[]
```

### getActiveSheet(Function)

获取当前活动的WorkSheet实例

```
  getActiveSheet: () => WorkSheet | null
```

### saveToConfig(Function)

保存所有数据为配置

```
  saveToConfig: () => IVTableSheetOptions
```

### exportSheetToFile(Function)

导出当前sheet到文件

```
  exportSheetToFile: (fileType: 'csv' | 'xlsx', allSheets: boolean = true) => void
```

### importFileToSheet(Function)

导入文件到当前sheet

```
  /** clearExisting 是否清除现有的 sheet（默认 true 表示替换模式）.设置false表示追加模式 */
  importFileToSheet: (options: { clearExisting?: boolean } = { clearExisting: true }) => void
```

### exportData(Function)

导出指定sheet的数据

```
  exportData: (sheetKey: string) => any[][]
```

### exportAllData(Function)

导出所有sheet的数据

```
  exportAllData: () => any[][]
```

### resize(Function)

调整表格大小

```
  resize: () => void
```

### release(Function)

释放资源

```
  release: () => void
```

### getContainer(Function)

获取容器元素

```
  getContainer: () => HTMLElement
```

### getFormulaManager(Function)

获取公式管理器

```
  getFormulaManager: () => FormulaManager
```

## Events

表格事件列表，可以根据实际需要，监听所需事件，实现自定义业务。
### 用法
VTableSheet 提供统一的事件系统，支持两类事件类型的监听：

 1. 监听 VTable 表格事件
通过 `onTableEvent` 方法监听底层 VTable 实例的事件。

此方法监听的是 VTable 实例的事件，淑慧类型和VTable支持的类型完全统一，在VTable事件回传参数基础上附带了 sheetKey 属性，方便业务处理。：

```typescript
import * as VTable from '@visactor/vtable';

// 监听单元格点击事件
sheetInstance.onTableEvent(VTable.TABLE_EVENT_TYPE.CLICK_CELL, (event) => {
  console.log('点击了单元格', event.sheetKey, event.row, event.col);
});

// 监听单元格值变更事件
sheetInstance.onTableEvent(VTable.TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, (event) => {
  console.log('单元格值变更:', event.value, '位置:', event.row, event.col);
});
```

 2. 监听电子表格级别事件
通过 `on` 方法监听电子表格级别的事件：

```typescript
import { VTableSheetEventType } from '@visactor/vtable-sheet';

// 监听公式计算事件
sheetInstance.on(VTableSheetEventType.FORMULA_ADDED, (event) => {
  console.log('公式添加了', event.sheetKey);
});

// 监听工作表切换事件
sheetInstance.on(VTableSheetEventType.SHEET_ACTIVATED, (event) => {
  console.log('工作表激活了', event.sheetKey, event.sheetTitle);
});
```


### 完整事件类型枚举

```typescript
export enum VTableSheetEventType {

  // ===== 数据操作事件 =====
  DATA_LOADED = 'data_loaded',

  // ===== 电子表格生命周期 =====
  SPREADSHEET_READY = 'spreadsheet_ready',
  SPREADSHEET_DESTROYED = 'spreadsheet_destroyed',
  SPREADSHEET_RESIZED = 'spreadsheet_resized',

  // ===== Sheet 管理事件 =====
  SHEET_ADDED = 'sheet_added',
  SHEET_REMOVED = 'sheet_removed',
  SHEET_RENAMED = 'sheet_renamed',
  SHEET_ACTIVATED = 'sheet_activated',
  SHEET_DEACTIVATED = 'sheet_deactivated',
  SHEET_MOVED = 'sheet_moved',
  SHEET_VISIBILITY_CHANGED = 'sheet_visibility_changed',

  // ===== 导入导出事件 =====
  IMPORT_START = 'import_start',
  IMPORT_COMPLETED = 'import_completed',
  IMPORT_ERROR = 'import_error',
  EXPORT_START = 'export_start',
  EXPORT_COMPLETED = 'export_completed',
  EXPORT_ERROR = 'export_error',


  // ===== 公式相关事件 =====
  FORMULA_CALCULATE_START = 'formula_calculate_start',
  FORMULA_CALCULATE_END = 'formula_calculate_end',
  FORMULA_ERROR = 'formula_error',
  FORMULA_DEPENDENCY_CHANGED = 'formula_dependency_changed',
  FORMULA_ADDED = 'formula_added',
  FORMULA_REMOVED = 'formula_removed',
}
```
