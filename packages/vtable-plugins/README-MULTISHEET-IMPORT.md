# Excel 多 Sheet 导入 - 快速开始

## 🚀 快速开始

### 安装

```bash
npm install @visactor/vtable-plugins
```

### 基础使用

```typescript
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 创建插件实例
const plugin = new ExcelImportPlugin();

// 弹出文件选择框，导入所有 sheet
const result = await plugin.importMultipleSheets();

// 查看结果
console.log(result.sheets); // SheetData[]
```

## 📋 常见场景

### 场景 1: 导入所有 Sheet 到 VTable-sheet

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 创建导入按钮
const button = document.createElement('button');
button.textContent = '导入 Excel';
button.onclick = async () => {
  try {
    // 导入所有 sheet
    const result = await ExcelImportPlugin.importExcelMultipleSheets(fileObject);
    
    // 转换格式
    const sheets = result.sheets.map((sheet, idx) => ({
      sheetTitle: sheet.sheetTitle,
      sheetKey: sheet.sheetKey,
      data: sheet.data,
      rowCount: sheet.rowCount,
      columnCount: sheet.columnCount,
      active: idx === 0
    }));
    
    // 创建表格
    new VTableSheet(container, { sheets });
  } catch (error) {
    console.error('导入失败', error);
  }
};
```

### 场景 2: 只导入指定的 Sheet

```typescript
// 只导入第 1 和第 3 个 sheet（索引从 0 开始）
const result = await plugin.importMultipleSheets({
  sheetIndices: [0, 2]
});
```

### 场景 3: 处理文件选择

```typescript
function selectAndImportExcel() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const result = await ExcelImportPlugin.importExcelMultipleSheets(file);
    
    // 处理 result.sheets
    processSheets(result.sheets);
  };
  
  input.click();
}
```

## 🔧 API 参考

### ExcelImportPlugin 类

#### 实例方法

**`importMultipleSheets(options?)`**

弹出文件选择框，导入多个 sheet。

参数：
- `options.importAllSheets`: boolean - 是否导入所有 sheet（默认 true）
- `options.sheetIndices`: number[] - 指定要导入的 sheet 索引

返回：`Promise<MultiSheetImportResult>`

#### 静态方法

**`ExcelImportPlugin.importExcelMultipleSheets(file, options?)`**

直接从 File 对象导入多个 sheet。

参数：
- `file`: File - Excel 文件对象
- `options`: ExcelImportOptions - 导入选项

返回：`Promise<MultiSheetImportResult>`

### 类型定义

#### SheetData

```typescript
interface SheetData {
  sheetTitle: string;      // sheet 名称
  sheetKey: string;        // 唯一标识（自动生成）
  data: unknown[][];       // 二维数组数据
  columnCount: number;     // 列数
  rowCount: number;        // 行数
}
```

#### MultiSheetImportResult

```typescript
interface MultiSheetImportResult {
  sheets: SheetData[];     // 所有导入的 sheet
}
```

## 💡 提示和技巧

### 1. 数据格式

导入的数据是二维数组格式，直接兼容 VTable-sheet：

```typescript
const sheet = result.sheets[0];
// sheet.data = [
//   ['姓名', '年龄', '城市'],
//   ['张三', 25, '北京'],
//   ['李四', 30, '上海']
// ]
```

### 2. Sheet Key 生成

每个 sheet 会自动生成唯一的 key：

```typescript
// 格式: sheet_时间戳_索引
// 例如: sheet_1702345678901_0
```

### 3. 空 Sheet 处理

空 sheet 会返回空数组：

```typescript
{
  sheetTitle: "EmptySheet",
  sheetKey: "sheet_xxx_0",
  data: [],
  rowCount: 0,
  columnCount: 0
}
```

### 4. 特殊单元格

自动处理以下类型：
- ✅ 富文本 → 纯文本
- ✅ 公式 → 计算结果
- ✅ 超链接 → 链接文本
- ✅ 日期 → ISO 字符串

### 5. 错误处理

```typescript
try {
  const result = await plugin.importMultipleSheets();
  // 成功处理
} catch (error) {
  if (error.message === '未选择文件') {
    // 用户取消
  } else if (error.message.includes('只支持 Excel 文件')) {
    // 文件类型错误
  } else {
    // 其他错误
  }
}
```

## 📝 完整示例

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import { ExcelImportPlugin } from '@visactor/vtable-plugins';

// 创建容器
const container = document.getElementById('table-container');

// 创建导入功能
async function importAndCreateTable() {
  // 创建文件输入
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  
  return new Promise((resolve, reject) => {
    input.onchange = async (e) => {
      try {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('未选择文件'));
          return;
        }
        
        // 显示加载状态
        showLoading('正在导入...');
        
        // 导入所有 sheet
        const result = await ExcelImportPlugin.importExcelMultipleSheets(file, {
          importAllSheets: true,
          batchSize: 1000,
          enableBatchProcessing: true
        });
        
        // 转换为 VTableSheet 格式
        const sheets = result.sheets.map((sheet, index) => ({
          sheetTitle: sheet.sheetTitle,
          sheetKey: sheet.sheetKey,
          data: sheet.data,
          rowCount: sheet.rowCount,
          columnCount: sheet.columnCount,
          active: index === 0,
          filter: true, // 启用筛选
          showHeader: true
        }));
        
        // 创建 VTableSheet
        const sheetInstance = new VTableSheet(container, {
          sheets: sheets,
          showSheetTab: true,
          showToolbar: true,
          showFormulaBar: true,
          VTablePluginModules: [
            {
              module: ExcelImportPlugin
            }
          ]
        });
        
        hideLoading();
        showSuccess(`成功导入 ${sheets.length} 个 sheet！`);
        resolve(sheetInstance);
        
      } catch (error) {
        hideLoading();
        showError(`导入失败: ${error.message}`);
        reject(error);
      }
    };
    
    input.click();
  });
}

// 使用
const importButton = document.querySelector('#import-btn');
importButton.addEventListener('click', importAndCreateTable);
```

## ⚠️ 注意事项

1. **文件类型限制**: 仅支持 .xlsx 和 .xls 格式
2. **浏览器兼容性**: 需要支持 File API 和 Promise
3. **内存使用**: 大文件可能占用较多内存
4. **数据格式**: 返回的是二维数组，不是对象数组

## 🔗 相关链接

- [详细文档](./docs/excel-import-multiple-sheets.md)
- [完整示例](./examples/import-multiple-sheets-example.html)
- [更新日志](./CHANGELOG-MULTISHEET.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

