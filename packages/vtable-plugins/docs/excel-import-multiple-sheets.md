# Excel 多 Sheet 导入功能

## 概述

`ExcelImportPlugin` 现在支持导入 Excel 文件中的多个 sheet，特别适用于 VTable-sheet 组件。

## 新增接口

### SheetData

单个 sheet 的数据结构：

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

### MultiSheetImportResult

多 sheet 导入结果：

```typescript
interface MultiSheetImportResult {
  /** 所有 sheet 的数据 */
  sheets: SheetData[];
}
```

### ExcelImportOptions 新增选项

```typescript
interface ExcelImportOptions {
  // ... 其他选项
  
  /** 是否导入所有sheet，默认false（仅导入第一个sheet） */
  importAllSheets?: boolean;
  
  /** 指定要导入的sheet索引数组（从0开始），不指定则导入所有 */
  sheetIndices?: number[];
}
```

## 使用方法

### 方法1：使用插件实例

```typescript
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 创建插件实例
const importPlugin = new ExcelImportPlugin({
  autoTable: false, // 不自动替换表格数据
  importAllSheets: true // 导入所有 sheet
});

// 调用导入方法
const result = await importPlugin.importMultipleSheets();

// result.sheets 包含所有 sheet 的数据
console.log(`成功导入 ${result.sheets.length} 个 sheet`);
result.sheets.forEach(sheet => {
  console.log(`Sheet: ${sheet.sheetTitle}, 行数: ${sheet.rowCount}, 列数: ${sheet.columnCount}`);
});
```

### 方法2：使用静态方法

```typescript
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 假设你已经有了一个 File 对象
const file = ...; // 从 input[type="file"] 获取

// 导入所有 sheet
const result = await ExcelImportPlugin.importExcelMultipleSheets(file, {
  importAllSheets: true
});

// 或者只导入指定的 sheet（例如第 0、2、3 个 sheet）
const result2 = await ExcelImportPlugin.importExcelMultipleSheets(file, {
  sheetIndices: [0, 2, 3]
});
```

### 方法3：与 VTable-sheet 集成

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 创建按钮触发导入
const importButton = document.createElement('button');
importButton.textContent = '导入 Excel';
importButton.onclick = async () => {
  // 创建文件选择器
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    try {
      // 导入多个 sheet
      const result = await ExcelImportPlugin.importExcelMultipleSheets(file);
      
      // 将导入的数据转换为 VTableSheet 需要的格式
      const sheets = result.sheets.map(sheet => ({
        sheetTitle: sheet.sheetTitle,
        sheetKey: sheet.sheetKey,
        data: sheet.data,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount,
        active: false // 第一个 sheet 会被设置为 active
      }));
      
      // 设置第一个 sheet 为活动状态
      if (sheets.length > 0) {
        sheets[0].active = true;
      }
      
      // 创建或更新 VTableSheet
      const sheetInstance = new VTableSheet(document.getElementById('container')!, {
        sheets: sheets,
        showSheetTab: true,
        showToolbar: true
      });
      
      console.log(`成功导入 ${sheets.length} 个 sheet`);
    } catch (error) {
      console.error('导入失败:', error);
    }
  };
  
  input.click();
};

document.body.appendChild(importButton);
```

### 方法4：完整的 VTableSheet 示例

```typescript
import { VTableSheet, TYPES } from '@visactor/vtable-sheet';
import * as VTablePlugins from '@visactor/vtable-plugins';

// 创建 VTableSheet 实例
const sheetInstance = new VTableSheet(document.getElementById('vTable')!, {
  sheets: [
    {
      rowCount: 100,
      columnCount: 26,
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet1',
      data: [],
      active: true
    }
  ],
  showSheetTab: true,
  showToolbar: true
});

// 创建导入按钮
const importExcelButton = document.createElement('button');
importExcelButton.textContent = '导入 Excel (多 Sheet)';
importExcelButton.style.cssText = 'margin: 10px; padding: 8px 16px;';

importExcelButton.onclick = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  input.style.display = 'none';
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    try {
      // 显示加载状态
      importExcelButton.textContent = '导入中...';
      importExcelButton.disabled = true;
      
      // 导入所有 sheet
      const result = await VTablePlugins.ExcelImportPlugin.importExcelMultipleSheets(file, {
        importAllSheets: true
      });
      
      // 转换为 VTableSheet 格式
      const importedSheets = result.sheets.map((sheet, index) => ({
        sheetTitle: sheet.sheetTitle,
        sheetKey: `imported_${sheet.sheetKey}`,
        data: sheet.data,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount,
        active: index === 0,
        filter: true // 可选：启用筛选功能
      }));
      
      // 重新创建 VTableSheet 实例
      const newSheetInstance = new VTableSheet(document.getElementById('vTable')!, {
        sheets: importedSheets,
        showSheetTab: true,
        showToolbar: true,
        VTablePluginModules: [
          {
            module: VTablePlugins.TableExportPlugin
          }
        ]
      });
      
      console.log(`✅ 成功导入 ${importedSheets.length} 个 sheet`);
      alert(`成功导入 ${importedSheets.length} 个 sheet！`);
      
    } catch (error) {
      console.error('❌ 导入失败:', error);
      alert(`导入失败: ${error.message}`);
    } finally {
      // 恢复按钮状态
      importExcelButton.textContent = '导入 Excel (多 Sheet)';
      importExcelButton.disabled = false;
      document.body.removeChild(input);
    }
  };
  
  document.body.appendChild(input);
  input.click();
};

document.body.appendChild(importExcelButton);
```

## 特性说明

### 1. 自动处理特殊单元格类型

插件会自动处理以下特殊类型的单元格：

- **富文本**：提取纯文本内容
- **公式**：使用计算结果值
- **超链接**：提取链接文本
- **日期**：转换为 ISO 字符串格式

### 2. 灵活的 Sheet 选择

```typescript
// 导入所有 sheet
await plugin.importMultipleSheets({ importAllSheets: true });

// 只导入第 1、3、5 个 sheet（索引从 0 开始）
await plugin.importMultipleSheets({ sheetIndices: [0, 2, 4] });
```

### 3. 性能优化

- 支持大文件分批处理
- 异步处理避免 UI 阻塞
- 可配置批处理大小和延迟时间

### 4. 错误处理

```typescript
try {
  const result = await plugin.importMultipleSheets();
  // 处理成功
} catch (error) {
  if (error.message === '未选择文件') {
    // 用户取消了文件选择
  } else if (error.message === '只支持 Excel 文件（.xlsx, .xls）') {
    // 文件类型不正确
  } else {
    // 其他错误
  }
}
```

### 5. 空 Sheet 处理

如果某个 sheet 是空的，会返回：

```typescript
{
  sheetTitle: "Sheet名称",
  sheetKey: "自动生成的key",
  data: [],
  columnCount: 0,
  rowCount: 0
}
```

## 与单 Sheet 导入的区别

| 特性 | 单 Sheet 导入 | 多 Sheet 导入 |
|------|--------------|--------------|
| 方法 | `importFile()` | `importMultipleSheets()` |
| 返回类型 | `ImportResult` | `MultiSheetImportResult` |
| 数据格式 | `records` (对象数组) | `data` (二维数组) |
| 列定义 | 必须有 | 可选 |
| 自动更新表格 | 支持 | 不支持（需手动） |
| 适用场景 | ListTable | VTable-sheet |

## 注意事项

1. 多 sheet 导入目前只支持 Excel 文件（.xlsx, .xls）
2. `importMultipleSheets` 不会自动更新表格，需要手动创建或更新 VTableSheet 实例
3. SheetKey 会自动生成（格式：`sheet_时间戳_索引`），确保唯一性
4. 数据格式是二维数组，直接兼容 VTable-sheet 的 `data` 字段

## 完整示例代码

完整的示例代码请参考：
- `packages/vtable-sheet/examples/sheet/sheet.ts`
- `packages/vtable-plugins/examples/import-multiple-sheets.html`

## API 参考

### ExcelImportPlugin.importMultipleSheets(options?)

导入多个 sheet。

**参数：**
- `options` (可选): `Partial<ExcelImportOptions>`

**返回：**
- `Promise<MultiSheetImportResult>`

### ExcelImportPlugin.importExcelMultipleSheets(file, options?)

静态方法，直接从文件导入多个 sheet。

**参数：**
- `file`: `File` - Excel 文件对象
- `options` (可选): `ExcelImportOptions`

**返回：**
- `Promise<MultiSheetImportResult>`

