# Excel 多 Sheet 导入 - 快速上手

## 🚀 最简单的方式

只需 **3 步** 即可实现 Excel 多 sheet 导入：

```typescript
// 1. 引入插件
import { VTableSheet } from '@visactor/vtable-sheet';
import * as VTablePlugins from '@visactor/vtable-plugins';

// 2. 注册插件
const sheetInstance = new VTableSheet(container, {
  VTablePluginModules: [
    { module: VTablePlugins.ExcelImportPlugin }
  ]
});

// 3. 一行代码导入
const plugin = sheetInstance.getPlugin('excel-import-plugin');
await plugin.importFile(); // ✨ 自动导入所有 sheets！
```

## 💡 核心特性

### 自动智能识别
- ✅ 插件会自动检测你使用的是 VTable-sheet 还是 ListTable
- ✅ VTable-sheet: 自动导入所有 sheets
- ✅ ListTable: 保持原有单 sheet 导入

### 零配置使用
- ✅ 无需手动转换数据格式
- ✅ 无需手动调用 `updateOption`
- ✅ 无需编写数据处理逻辑

### 完全向后兼容
- ✅ 原有代码无需修改
- ✅ 所有旧功能正常工作
- ✅ 可选使用新功能

## 📖 使用示例

### 示例 1: 基础用法（推荐）

```typescript
// 创建按钮
const importBtn = document.createElement('button');
importBtn.textContent = '导入 Excel';
importBtn.onclick = async () => {
  const plugin = sheetInstance.getPlugin('excel-import-plugin');
  
  // 一行代码，自动处理一切！
  await plugin.importFile();
  
  alert('导入成功！');
};
```

### 示例 2: 高级用法（自定义控制）

```typescript
// 只导入前 3 个 sheet
const result = await plugin.importMultipleSheets({
  sheetIndices: [0, 1, 2]
});

// 自定义处理
const sheetsConfig = result.sheets.map((sheet, index) => ({
  ...sheet,
  filter: true, // 添加筛选功能
  active: index === 0
}));

sheetInstance.updateOption({ sheets: sheetsConfig });
```

## 🎯 对比说明

### 之前（复杂）
```typescript
// 1. 导入数据
const result = await plugin.importMultipleSheets();

// 2. 手动转换格式（15+ 行代码）
const sheetsConfig = result.sheets.map((sheetData, index) => ({
  sheetKey: sheetData.sheetKey,
  sheetTitle: sheetData.sheetTitle,
  rowCount: Math.max(sheetData.rowCount, 100),
  columnCount: Math.max(sheetData.columnCount, 26),
  data: sheetData.data,
  active: index === 0,
  filter: true
}));

// 3. 手动更新
sheetInstance.updateOption({ sheets: sheetsConfig });
```

### 现在（简单）
```typescript
// 一行代码搞定！
await plugin.importFile();
```

**代码量减少 95%！** 🎉

## 📋 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `autoTable` | `boolean` | `true` | 是否自动更新表格 |
| `importAllSheets` | `boolean` | `false` | 是否导入所有 sheets |
| `sheetIndices` | `number[]` | - | 指定导入的 sheet 索引 |
| `batchSize` | `number` | `1000` | 批处理大小 |

## 🔍 API 参考

### `importFile()`
智能导入方法，自动识别表格类型：
- **VTable-sheet**: 导入所有 sheets 并自动更新
- **ListTable**: 导入单个 sheet

**返回**: `Promise<ImportResult | MultiSheetImportResult>`

### `importMultipleSheets(options?)`
手动导入多个 sheets（高级用法）

**参数**:
- `options.sheetIndices?: number[]` - 指定要导入的 sheet 索引

**返回**: `Promise<MultiSheetImportResult>`

## ❓ 常见问题

### Q1: 如何只导入特定的 sheets？
```typescript
await plugin.importMultipleSheets({
  sheetIndices: [0, 2, 4] // 只导入第 0, 2, 4 个 sheet
});
```

### Q2: 如何禁用自动更新？
```typescript
const sheetInstance = new VTableSheet(container, {
  VTablePluginModules: [
    {
      module: VTablePlugins.ExcelImportPlugin,
      moduleOptions: {
        autoTable: false // 禁用自动更新
      }
    }
  ]
});
```

### Q3: 导入的数据格式是什么？
```typescript
{
  sheets: [
    {
      sheetTitle: "Sheet1",           // Sheet 名称
      sheetKey: "sheet_123456789_0",  // 唯一标识
      data: [                         // 二维数组
        ["A1", "B1", "C1"],
        ["A2", "B2", "C2"]
      ],
      rowCount: 100,                  // 行数
      columnCount: 10                 // 列数
    }
  ]
}
```

### Q4: 支持哪些文件格式？
- ✅ `.xlsx` (Excel 2007+)
- ✅ `.xls` (Excel 97-2003)

## 📚 相关文档

- [完整使用指南](./docs/excel-multi-sheet-import-guide.md)
- [功能更新说明](./docs/excel-multi-sheet-import-changelog.md)
- [完整示例代码](../vtable-sheet/examples/excel-multi-sheet-import/)

## 💬 技术支持

如有问题或建议:
- GitHub Issues: https://github.com/VisActor/VTable/issues
- 官方文档: https://visactor.io/vtable

---

**享受简化的开发体验！** ✨

