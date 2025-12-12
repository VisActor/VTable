# Excel 多 Sheet 导入功能更新说明

## 🎉 新功能：智能自动导入

`ExcelImportPlugin` 现已支持智能识别 VTable-sheet 环境并自动导入 Excel 的所有 sheets！

## ✨ 主要改进

### 1. 自动识别 VTable-sheet

插件现在能够自动检测当前表格实例是 `VTable-sheet` 还是 `ListTable`：

- **VTable-sheet**: 自动导入所有 sheets 并更新
- **ListTable**: 保持原有的单 sheet 导入行为

### 2. 超简单的使用方式

**之前（复杂）：**

```typescript
// 需要手动处理数据转换
const result = await plugin.importMultipleSheets();
const sheetsConfig = result.sheets.map((sheetData, index) => ({
  sheetKey: sheetData.sheetKey,
  sheetTitle: sheetData.sheetTitle,
  rowCount: Math.max(sheetData.rowCount, 100),
  columnCount: Math.max(sheetData.columnCount, 26),
  data: sheetData.data,
  active: index === 0
}));
sheetInstance.updateOption({ sheets: sheetsConfig });
```

**现在（简单）：**

```typescript
// 一行代码搞定！
await plugin.importFile();
```

### 3. 向后兼容

- 原有的 `importMultipleSheets()` 方法仍然可用（高级用法）
- 原有的 ListTable 单 sheet 导入功能完全不受影响
- 所有现有代码无需修改

## 技术实现

### 新增私有属性

```typescript
private _isVTableSheet: boolean = false;
```

### 新增检测方法

```typescript
private _detectVTableSheet(instance: ListTable): boolean {
  // 通过检查实例特征判断是否为 VTable-sheet
  const inst = instance as unknown as Record<string, unknown>;
  return !!(
    inst &&
    typeof inst.updateOption === 'function' &&
    inst.options &&
    typeof inst.options === 'object' &&
    inst.options !== null &&
    Array.isArray((inst.options as Record<string, unknown>).sheets)
  );
}
```

### 新增自动导入方法

```typescript
private async _importForVTableSheet(): Promise<MultiSheetImportResult> {
  // 1. 导入所有 sheets
  const result = await this._importMultipleSheetsFromFileDialog({
    ...this.options,
    importAllSheets: true
  });

  // 2. 自动转换数据格式
  const sheetsConfig = result.sheets.map((sheetData, index) => ({
    sheetTitle: sheetData.sheetTitle,
    sheetKey: sheetData.sheetKey,
    data: sheetData.data,
    rowCount: Math.max(sheetData.rowCount, 100),
    columnCount: Math.max(sheetData.columnCount, 26),
    active: index === 0,
    filter: true
  }));

  // 3. 自动更新 VTable-sheet
  sheetInstance.updateOption({ sheets: sheetsConfig });

  return result;
}
```

### 更新的 importFile 方法

```typescript
async importFile(): Promise<ImportResult | MultiSheetImportResult> {
  if (this._isVTableSheet) {
    return this._importForVTableSheet(); // 自动处理多 sheet
  }
  return this.import('file'); // 原有单 sheet 逻辑
}
```

## 使用示例

### 基本用法（自动模式）

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import * as VTablePlugins from '@visactor/vtable-plugins';

const sheetInstance = new VTableSheet(container, {
  VTablePluginModules: [
    { module: VTablePlugins.ExcelImportPlugin }
  ]
});

const plugin = sheetInstance.getPlugin('excel-import-plugin');

// 自动导入所有 sheets
await plugin.importFile();
```

### 高级用法（手动控制）

```typescript
// 只导入指定的 sheets
const result = await plugin.importMultipleSheets({
  sheetIndices: [0, 1, 2]
});

// 手动处理结果
const sheetsConfig = result.sheets.map((sheetData, index) => ({
  // 自定义配置...
}));

sheetInstance.updateOption({ sheets: sheetsConfig });
```

## API 变更

### 新增接口

| 方法/属性 | 类型 | 说明 |
|----------|------|------|
| `_isVTableSheet` | `private boolean` | 标识当前是否为 VTable-sheet |
| `_detectVTableSheet()` | `private method` | 检测实例类型 |
| `_importForVTableSheet()` | `private method` | VTable-sheet 自动导入 |

### 更新的方法

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `importFile()` | `Promise<ImportResult \| MultiSheetImportResult>` | 智能识别并导入 |

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `importAllSheets` | `boolean` | `false` | 是否导入所有 sheets |
| `sheetIndices` | `number[]` | `undefined` | 指定要导入的 sheet 索引 |

## 优势对比

### 代码量

| 使用方式 | 代码行数 | 复杂度 |
|----------|----------|--------|
| 旧方式（手动） | ~15 行 | 中等 |
| 新方式（自动） | 1 行 | 极低 |

### 用户体验

- ✅ 无需了解数据转换细节
- ✅ 无需手动调用 `updateOption`
- ✅ 自动处理所有配置
- ✅ 智能识别表格类型

## 兼容性

- ✅ 完全向后兼容
- ✅ 不影响现有 ListTable 功能
- ✅ 不影响现有 `importMultipleSheets()` 方法
- ✅ 支持所有现有配置选项

## 示例文件

- 完整示例：`packages/vtable-sheet/examples/excel-multi-sheet-import/`
- 使用指南：`packages/vtable-plugins/docs/excel-multi-sheet-import-guide.md`

## 未来计划

- [ ] 支持导入时的进度回调
- [ ] 支持导入前的预览功能
- [ ] 支持更多的自定义配置选项
- [ ] 支持导入时的数据验证

## 反馈

如有问题或建议，请在 GitHub 上提交 issue:
https://github.com/VisActor/VTable/issues

