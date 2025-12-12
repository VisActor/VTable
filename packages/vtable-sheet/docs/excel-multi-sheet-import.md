# Excel 多 Sheet 导入功能

## 功能概述

VTable-sheet 现在支持从 Excel 文件一次性导入多个工作表（sheet）。这个功能基于 `ExcelImportPlugin` 插件实现，可以轻松地将整个 Excel 工作簿导入到 VTable-sheet 中。

## 使用方法

### 基本用法

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';

// 创建 VTableSheet 实例
const sheetInstance = new VTableSheet(document.getElementById('container')!, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    // 初始 sheet 配置
  ]
});

// 导入多个 sheet（追加模式）
const result = await sheetInstance.importExcelMultipleSheets({
  clearExisting: false, // 保留现有 sheet，追加新的
  activateFirstSheet: true // 导入后激活第一个导入的 sheet
});

if (result.success) {
  console.log('成功导入的工作表:', result.importedSheets);
  console.log('消息:', result.message);
}
```

### 替换模式

```typescript
// 导入多个 sheet（替换模式 - 清除现有所有 sheet）
const result = await sheetInstance.importExcelMultipleSheets({
  clearExisting: true, // 清除所有现有 sheet
  activateFirstSheet: true
});
```

### 指定导入特定的 Sheet

```typescript
// 只导入 Excel 文件中的第 1、2、4 个 sheet（索引从 0 开始）
const result = await sheetInstance.importExcelMultipleSheets({
  clearExisting: false,
  sheetIndices: [0, 1, 3], // 导入第 1、2、4 个 sheet
  activateFirstSheet: true
});
```

## API 参数

### `importExcelMultipleSheets(options?)`

#### 参数 `options`

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `clearExisting` | `boolean` | `false` | 是否清除现有的所有 sheet。<br>- `true`: 清除所有现有 sheet，只保留导入的<br>- `false`: 追加模式，保留现有 sheet |
| `sheetIndices` | `number[]` | `undefined` | 指定要导入的 sheet 索引数组（从 0 开始）。<br>- 不指定：导入所有 sheet<br>- 指定数组：只导入指定索引的 sheet |
| `activateFirstSheet` | `boolean` | `true` | 导入后是否自动激活第一个导入的 sheet |

#### 返回值

返回一个 `Promise`，resolve 时返回对象：

```typescript
{
  success: boolean;           // 是否成功
  importedSheets: string[];   // 导入的 sheet key 列表
  message: string;            // 提示消息
}
```

## 功能特性

### 1. 自动处理重复名称

如果导入的 sheet 名称与现有 sheet 冲突，系统会自动添加后缀（如 `Sheet1_1`, `Sheet1_2`）确保唯一性。

### 2. 保留数据格式

导入时会保留 Excel 中的：
- 单元格数据值
- 富文本（转换为纯文本）
- 公式计算结果
- 超链接文本
- 日期格式（转换为 ISO 字符串）

### 3. 自动调整尺寸

每个导入的 sheet 会自动设置：
- 行数：至少 100 行（或 Excel 中的实际行数，取较大值）
- 列数：至少 10 列（或 Excel 中的实际列数，取较大值）

### 4. 用户友好的提示

- 导入成功：显示成功导入的工作表数量
- 导入失败：显示具体的错误信息
- 所有提示都通过 snackbar 组件显示

## 在主菜单中集成

可以在 VTableSheet 的主菜单中添加导入多个 sheet 的选项：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container')!, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [...],
  mainMenu: {
    items: [
      {
        name: '导入多个sheet',
        description: '从Excel文件导入多个工作表',
        onClick: async () => {
          const result = await sheetInstance.importExcelMultipleSheets({
            clearExisting: false,
            activateFirstSheet: true
          });
          if (result.success) {
            console.log('导入成功:', result);
          }
        }
      },
      {
        name: '导入多个sheet（替换现有）',
        description: '从Excel文件导入多个工作表（清除现有sheet）',
        onClick: async () => {
          if (confirm('确定要清除所有现有工作表并导入新的工作表吗？')) {
            const result = await sheetInstance.importExcelMultipleSheets({
              clearExisting: true,
              activateFirstSheet: true
            });
            if (result.success) {
              console.log('导入成功:', result);
            }
          }
        }
      }
    ]
  }
});
```

## 在按钮中使用

```html
<button id="import-btn">导入 Excel 多个 Sheet</button>

<script>
document.getElementById('import-btn').addEventListener('click', async () => {
  const result = await sheetInstance.importExcelMultipleSheets({
    clearExisting: false,
    activateFirstSheet: true
  });
  
  if (result.success) {
    alert(`成功导入 ${result.importedSheets.length} 个工作表！`);
  } else {
    alert(`导入失败: ${result.message}`);
  }
});
</script>
```

## 支持的文件格式

- `.xlsx` (Excel 2007 及以上版本)
- `.xls` (Excel 97-2003)

## 注意事项

1. **文件大小限制**：大文件可能需要较长的处理时间
2. **浏览器兼容性**：需要支持现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
3. **内存占用**：导入大量数据时注意浏览器内存占用
4. **异步操作**：导入是异步操作，需要使用 `await` 或 `.then()` 处理结果

## 完整示例

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';
import * as VTablePlugins from '@visactor/vtable-plugins';

// 创建 VTableSheet 实例
const sheetInstance = new VTableSheet(document.getElementById('container')!, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      sheetKey: 'default',
      sheetTitle: '默认工作表',
      data: [[1, 2, 3]],
      active: true
    }
  ],
  // 必须包含 ExcelImportPlugin
  VTablePluginModules: [
    {
      module: VTablePlugins.ExcelImportPlugin,
      moduleOptions: {}
    }
  ]
});

// 使用导入功能
async function importExcel() {
  try {
    const result = await sheetInstance.importExcelMultipleSheets({
      clearExisting: false,
      activateFirstSheet: true
    });
    
    if (result.success) {
      console.log('✅ 导入成功！');
      console.log('导入的工作表:', result.importedSheets);
      
      // 可以进一步操作导入的 sheet
      result.importedSheets.forEach(sheetKey => {
        const sheet = sheetInstance.getSheet(sheetKey);
        console.log(`Sheet ${sheetKey}:`, sheet);
      });
    } else {
      console.error('❌ 导入失败:', result.message);
    }
  } catch (error) {
    console.error('❌ 导入出错:', error);
  }
}

// 在按钮点击或其他事件中调用
document.getElementById('import-btn')?.addEventListener('click', importExcel);
```

## 常见问题

### Q: 导入后原有的 sheet 会被删除吗？

A: 默认不会。使用 `clearExisting: false`（默认值）时，新导入的 sheet 会追加到现有 sheet 列表中。只有设置 `clearExisting: true` 时才会清除现有的所有 sheet。

### Q: 可以选择性导入某些 sheet 吗？

A: 可以。使用 `sheetIndices` 参数指定要导入的 sheet 索引数组。例如 `sheetIndices: [0, 2]` 只导入第 1 个和第 3 个 sheet。

### Q: 导入的 sheet 名称重复怎么办？

A: 系统会自动处理重复名称，在原名称后添加 `_1`、`_2` 等后缀确保唯一性。

### Q: 支持哪些 Excel 功能？

A: 当前支持导入：
- 单元格数据（文本、数字、日期等）
- 富文本（转换为纯文本）
- 公式的计算结果（不保留公式本身）
- 超链接的文本内容

暂不支持：
- 单元格样式（颜色、字体等）
- 图片和图表
- 合并单元格
- 数据验证规则

## 更新日志

### v1.0.0
- ✨ 新增 `importExcelMultipleSheets` 方法
- ✨ 支持追加和替换两种导入模式
- ✨ 支持选择性导入指定 sheet
- ✨ 自动处理重复名称
- ✨ 用户友好的提示信息

