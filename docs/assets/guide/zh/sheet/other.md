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