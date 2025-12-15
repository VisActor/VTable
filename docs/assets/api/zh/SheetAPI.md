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
  importFileToSheet: () => void
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
具体使用方式：

```
  import { WorkSheetEventType } from '@visactor/vtable-sheet';
  
  // 使用WorkSheet实例监听事件
  worksheet.on(WorkSheetEventType.CELL_CLICK, (args) => {
    console.log('单元格被选中：', args);
  });
 
```

支持的事件类型：

```
export enum WorkSheetEventType {
  // 单元格事件
  CELL_CLICK = 'cell-click',
  CELL_VALUE_CHANGED = 'cell-value-changed',

  // 选择范围事件
  SELECTION_CHANGED = 'selection-changed',
  SELECTION_END = 'selection-end'
}
```
**如果想要监听VTable组件的各个事件，可以通过接口获取到VTable的实例，然后通过实例监听事件**
具体使用方式：
```
  const tableInstance = sheetInstance.activeWorkSheet.tableInstance;// 获取激活的工作表的实例
  tableInstance.on('mousedown_cell', (args) => console.log(CLICK_CELL, args));
```

### CELL_CLICK

单元格点击事件

事件回传参数：

```
{
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 单元格内容 */
  value?: CellValue;
  /** 单元格DOM元素 */
  cellElement?: HTMLElement;
  /** 原始事件对象 */
  originalEvent?: MouseEvent | KeyboardEvent;
}
```

### CELL_VALUE_CHANGED

单元格值变更事件

事件回传参数：

```
{
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 新值 */
  newValue: CellValue;
  /** 旧值 */
  oldValue: CellValue;
  /** 单元格DOM元素 */
  cellElement?: HTMLElement;
  /** 是否由用户操作引起 */
  isUserAction?: boolean;
  /** 是否由公式计算引起 */
  isFormulaCalculation?: boolean;
}
```

### SELECTION_CHANGED

选择范围变更事件

事件回传参数：

```
{
  /** 选择区域 */
  ranges?: Array<{
    start: {
      row: number;
      col: number;
    };
    end: {
      row: number;
      col: number;
    };
  }>;
  /** 选择的单元格数据 */
  cells?: Array<
    Array<{
      row: number;
      col: number;
      value?: CellValue;
    }>
  >;
  /** 原始事件对象 */
  originalEvent?: MouseEvent | KeyboardEvent;
}
```

### SELECTION_END

选择结束事件（拖拽选择完成时触发）

事件回传参数：

```
{
  /** 选择区域 */
  ranges?: Array<{
    start: {
      row: number;
      col: number;
    };
    end: {
      row: number;
      col: number;
    };
  }>;
  /** 选择的单元格数据 */
  cells?: Array<
    Array<{
      row: number;
      col: number;
      value?: CellValue;
    }>
  >;
  /** 原始事件对象 */
  originalEvent?: MouseEvent | KeyboardEvent;
}
```
