# Excel 多 Sheet 导入功能使用指南

## 概述

`ExcelImportPlugin` 插件现已支持导入 Excel 文件的多个 sheet，特别适用于 VTable-sheet 组件。

## 功能特性

- ✅ 支持导入 Excel 所有 sheets
- ✅ 支持指定导入特定 sheets（通过索引）
- ✅ 自动解析每个 sheet 的数据为二维数组
- ✅ 保留原 sheet 名称
- ✅ 自动生成唯一的 sheet key
- ✅ 支持大文件批量处理
- ✅ 处理富文本、公式、超链接等特殊单元格

## 数据结构

### SheetData 接口

```typescript
interface SheetData {
  /** sheet 名称 */
  sheetTitle: string;
  /** sheet 唯一标识（自动生成） */
  sheetKey: string;
  /** 列定义（可选） */
  columns?: ColumnsDefine;
  /** 数据 (二维数组格式，用于 VTable-sheet) */
  data: unknown[][];
  /** 列数 */
  columnCount: number;
  /** 行数 */
  rowCount: number;
}
```

### MultiSheetImportResult 接口

```typescript
interface MultiSheetImportResult {
  /** 所有 sheet 的数据 */
  sheets: SheetData[];
}
```

## 使用方法

### 方法 1: 自动模式 - 一键导入（最简单）✨

**插件会自动识别 VTable-sheet 环境并导入所有 sheets！**

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import * as VTablePlugins from '@visactor/vtable-plugins';

// 1. 创建 VTable-sheet 实例并注册插件
const sheetInstance = new VTableSheet(container, {
  showSheetTab: true,
  sheets: [{ /* 初始配置 */ }],
  VTablePluginModules: [
    {
      module: VTablePlugins.ExcelImportPlugin
      // 无需额外配置！插件会自动识别 VTable-sheet
    }
  ]
});

// 2. 获取插件实例
const excelPlugin = sheetInstance.getPlugin('excel-import-plugin');

// 3. 一行代码搞定！
// 插件自动：
// - 导入所有 sheets
// - 转换数据格式
// - 更新 VTable-sheet
await excelPlugin.importFile();
```

**就是这么简单！无需手动处理数据转换！** 🎉

### 方法 2: 高级模式 - 导入指定的 sheets

如果需要更多控制（例如只导入特定的 sheets），可以使用 `importMultipleSheets` 方法：

```typescript
// 只导入前 3 个 sheet（索引 0, 1, 2）
const result = await excelPlugin.importMultipleSheets({
  sheetIndices: [0, 1, 2]
});

console.log(`成功导入 ${result.sheets.length} 个 sheet`);

// 手动处理结果（如果需要自定义逻辑）
const sheetsConfig = result.sheets.map((sheetData, index) => ({
  sheetKey: sheetData.sheetKey,
  sheetTitle: sheetData.sheetTitle,
  rowCount: Math.max(sheetData.rowCount, 100),
  columnCount: Math.max(sheetData.columnCount, 26),
  data: sheetData.data,
  active: index === 0,
  filter: true
}));

sheetInstance.updateOption({
  sheets: sheetsConfig
});
```

### 方法 3: 使用静态方法（不依赖插件实例）

```typescript
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 需要先获取 File 对象（例如通过 input[type=file]）
const file = /* File 对象 */;

const result = await ExcelImportPlugin.importExcelMultipleSheets(file, {
  sheetIndices: [0, 1, 2]  // 可选：指定要导入的 sheet
});

// 处理导入结果
result.sheets.forEach(sheet => {
  console.log(`Sheet: ${sheet.sheetTitle}`);
  console.log(`数据行数: ${sheet.rowCount}`);
  console.log(`数据列数: ${sheet.columnCount}`);
});
```

## 配置选项

### ExcelImportOptions

```typescript
interface ExcelImportOptions {
  /** 是否导入所有 sheet，默认 false（仅导入第一个 sheet） */
  importAllSheets?: boolean;
  
  /** 指定要导入的 sheet 索引数组（从 0 开始），不指定则导入所有 */
  sheetIndices?: number[];
  
  /** 批处理大小，默认 1000 行 */
  batchSize?: number;
  
  /** 是否启用分批处理，默认 true */
  enableBatchProcessing?: boolean;
  
  /** 异步处理延迟时间(ms)，默认 5ms */
  asyncDelay?: number;
}
```

## 完整示例

### 示例 1: 最简单的方式（自动模式）

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import * as VTablePlugins from '@visactor/vtable-plugins';

function createSheetWithImport() {
  // 创建 sheet 实例
  const sheetInstance = new VTableSheet(document.getElementById('container')!, {
    showSheetTab: true,
    showFormulaBar: true,
    sheets: [
      {
        rowCount: 100,
        columnCount: 26,
        sheetKey: 'default',
        sheetTitle: '默认Sheet',
        data: [],
        active: true
      }
    ],
    VTablePluginModules: [
      {
        module: VTablePlugins.ExcelImportPlugin
        // 无需配置！自动识别 VTable-sheet
      }
    ]
  });

  // 创建导入按钮
  const importBtn = document.createElement('button');
  importBtn.textContent = '导入 Excel';
  importBtn.onclick = async () => {
    try {
      const plugin = sheetInstance.getPlugin('excel-import-plugin');

      // ✨ 一行代码搞定！
      // 插件自动导入所有 sheets 并更新 VTable-sheet
      await plugin.importFile();

      alert('导入成功！');
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + (error as Error).message);
    }
  };

  document.body.appendChild(importBtn);

  return sheetInstance;
}

// 调用
createSheetWithImport();
```

### 示例 2: 高级模式（手动控制）

```typescript
function createSheetWithAdvancedImport() {
  const sheetInstance = new VTableSheet(document.getElementById('container')!, {
    showSheetTab: true,
    VTablePluginModules: [
      { module: VTablePlugins.ExcelImportPlugin }
    ]
  });

  const importBtn = document.createElement('button');
  importBtn.textContent = '导入指定 Sheets';
  importBtn.onclick = async () => {
    try {
      const plugin = sheetInstance.getPlugin('excel-import-plugin');

      // 只导入前 3 个 sheet
      const result = await plugin.importMultipleSheets({
        sheetIndices: [0, 1, 2]
      });

      console.log(`成功导入 ${result.sheets.length} 个 sheet`);

      // 手动处理数据（添加自定义逻辑）
      const sheetsConfig = result.sheets.map((sheetData, index) => ({
        sheetKey: sheetData.sheetKey,
        sheetTitle: sheetData.sheetTitle,
        rowCount: Math.max(sheetData.rowCount, 100),
        columnCount: Math.max(sheetData.columnCount, 26),
        data: sheetData.data,
        active: index === 0,
        filter: true // 添加自定义配置
      }));

      // 更新 sheet
      sheetInstance.updateOption({
        sheets: sheetsConfig
      });

      alert(`成功导入 ${result.sheets.length} 个 Sheet!`);
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + (error as Error).message);
    }
  };

  document.body.appendChild(importBtn);

  return sheetInstance;
}
```

## 数据处理

### 特殊单元格处理

插件会自动处理以下特殊类型的单元格：

1. **富文本**: 提取纯文本内容
2. **公式**: 返回计算结果
3. **超链接**: 提取链接文本
4. **日期**: 转换为 ISO 字符串格式
5. **空单元格**: 返回 `null`

### 示例数据格式

导入后的数据格式：

```javascript
{
  sheets: [
    {
      sheetTitle: "销售数据",
      sheetKey: "sheet_1702345678901_0",
      data: [
        ["产品", "数量", "价格"],      // 第 1 行（表头）
        ["产品A", 100, 29.99],        // 第 2 行
        ["产品B", 200, 19.99],        // 第 3 行
        // ...
      ],
      rowCount: 100,
      columnCount: 3
    },
    {
      sheetTitle: "库存数据",
      sheetKey: "sheet_1702345678901_1",
      data: [
        ["仓库", "产品", "库存"],
        ["仓库A", "产品A", 50],
        // ...
      ],
      rowCount: 50,
      columnCount: 3
    }
  ]
}
```

## 错误处理

```typescript
try {
  const result = await excelPlugin.importMultipleSheets();
  // 处理成功
} catch (error) {
  if (error.message === '未选择文件') {
    // 用户取消了文件选择
  } else if (error.message === '只支持 Excel 文件（.xlsx, .xls）') {
    // 文件格式错误
  } else if (error.message === 'Excel 文件无有效工作表') {
    // Excel 文件为空或损坏
  } else {
    // 其他错误
    console.error('导入失败:', error);
  }
}
```

## 性能优化

对于大型 Excel 文件，插件会自动进行批量处理：

- 默认每批处理 1000 行
- 批次之间有 5ms 的延迟，避免阻塞 UI
- 可以通过 `batchSize` 和 `asyncDelay` 选项调整

```typescript
const result = await excelPlugin.importMultipleSheets({
  batchSize: 500,        // 减小批次大小
  asyncDelay: 10,        // 增加延迟时间
  enableBatchProcessing: true
});
```

## 注意事项

1. **文件格式**: 只支持 `.xlsx` 和 `.xls` 格式的 Excel 文件
2. **浏览器兼容性**: 需要浏览器支持 `FileReader` API
3. **内存占用**: 导入大量 sheet 会占用较多内存，建议按需导入
4. **数据格式**: 返回的 `data` 是二维数组，适合 VTable-sheet 使用
5. **自动更新**: `autoTable` 选项对多 sheet 导入无效，需要手动调用 `updateOption`

## 与单 sheet 导入的区别

| 特性 | 单 Sheet 导入 | 多 Sheet 导入 |
|------|---------------|---------------|
| 方法 | `importFile()` | `importMultipleSheets()` |
| 返回类型 | `ImportResult` | `MultiSheetImportResult` |
| 数据格式 | `records` (对象数组) | `data` (二维数组) |
| 列配置 | 自动生成 `columns` | 不生成（VTable-sheet 不需要） |
| 自动更新 | 支持 `autoTable` | 需要手动更新 |
| 适用场景 | ListTable | VTable-sheet |

## 常见问题

### Q: 如何只导入第一个和第三个 sheet？

```typescript
const result = await excelPlugin.importMultipleSheets({
  sheetIndices: [0, 2]  // 索引从 0 开始
});
```

### Q: 如何获取 sheet 的原始名称？

```typescript
const result = await excelPlugin.importMultipleSheets();
result.sheets.forEach(sheet => {
  console.log('Sheet 名称:', sheet.sheetTitle);
});
```

### Q: 导入的数据没有列定义怎么办？

多 sheet 导入模式下，数据是二维数组格式，VTable-sheet 会自动处理。如果需要列定义，可以根据第一行数据自己生成：

```typescript
const firstRow = sheetData.data[0];
const columns = firstRow.map((header, index) => ({
  title: String(header),
  field: `col${index}`
}));
```

### Q: 能否在导入时过滤空白 sheet？

可以在处理结果时过滤：

```typescript
const result = await excelPlugin.importMultipleSheets();
const nonEmptySheets = result.sheets.filter(sheet => 
  sheet.rowCount > 0 && sheet.columnCount > 0
);
```

## 更多资源

- [ExcelImportPlugin API 文档](./api-reference.md)
- [VTable-sheet 文档](https://visactor.io/vtable-sheet)
- [完整示例代码](../examples/excel-multi-sheet-import/)

