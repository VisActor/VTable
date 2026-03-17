# 高级功能

本章介绍VTable-Sheet的一些其他用法，如单元格合并、冻结行列、自定义主题和样式等，因为VTable-Sheet是基于VTable的，所以VTable的配置项也可以在VTable-Sheet中使用。（其他用法请参考VTable的使用教程）这里举例说明一些常见的用法。

## 单元格合并

VTable-Sheet支持合并单元格，可以在配置中设置单元格合并：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      // 其他配置...
      cellMerge: [
        {
          text: '合并单元格',  // 合并后显示的文本
          range: {
            start: {
              col: 0,  // 起始列索引
              row: 0   // 起始行索引
            },
            end: {
              col: 2,  // 结束列索引
              row: 1   // 结束行索引
            },
            isCustom: true  // 标记为自定义合并
          }
        },
        // 可以定义多个合并区域
        {
          text: '另一个合并区域',
          range: {
            start: { col: 3, row: 3 },
            end: { col: 4, row: 5 },
            isCustom: true
          }
        }
      ]
    }
  ]
});
```

## 冻结行列

可以设置表格的冻结行和冻结列，使表格滚动时特定的行或列保持可见：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      // 冻结前1行和前2列
      frozenRowCount: 1,
      frozenColCount: 2,
      // 其他配置...
    }
  ]
});
```

## 撤销 / 重做（历史记录）

VTable-Sheet 提供工作簿级别的撤销/重做能力，覆盖：
- 单个 sheet 内的编辑（单元格值修改、增删行列、调整行高列宽、表头拖拽、合并/取消合并、筛选/排序等）
- sheet 管理操作（新增/删除/重命名/排序）

### UI 按钮

撤销/重做按钮默认开启：当 `mainMenu.show` 为 `true` 时按钮显示在菜单栏；否则会在左上角单独渲染撤销/重做区域。

```ts
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  undoRedo: { show: true },
  sheets: [/* ... */]
});
```

隐藏撤销/重做按钮：

```ts
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  undoRedo: { show: false },
  sheets: [/* ... */]
});
```

### 快捷键

- Ctrl/Cmd + Z：撤销
- Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y：重做

### 自定义历史深度

VTable-Sheet 内部基于 `HistoryPlugin` 采集表格层操作，并汇总进工作簿历史栈。可通过 `VTablePluginModules` 自定义 `HistoryPlugin` 的配置：

```ts
import { HistoryPlugin } from '@visactor/vtable-plugins';

const sheetInstance = new VTableSheet(document.getElementById('container'), {
  VTablePluginModules: [
    {
      module: HistoryPlugin,
      moduleOptions: {
        maxHistory: 200,
        enableCompression: false
      }
    }
  ],
  sheets: [/* ... */]
});
```
