# 高级功能

本章介绍VTable-Sheet的一些高级功能和用法，包括单元格合并、冻结行列、自定义主题和样式等。

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

也可以通过API动态设置单元格合并：

```typescript
// 获取活动表格页
const activeSheet = sheetInstance.getActiveSheet();

// 合并单元格
activeSheet.mergeCells({
  start: { col: 1, row: 2 },
  end: { col: 3, row: 4 }
}, '合并后的内容');

// 取消单元格合并
activeSheet.unmergeCells({
  start: { col: 1, row: 2 },
  end: { col: 3, row: 4 }
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

也可以通过API动态设置冻结行列：

```typescript
// 获取活动表格页
const activeSheet = sheetInstance.getActiveSheet();

// 设置冻结行和列
activeSheet.setFrozenRowCount(2);  // 冻结前2行
activeSheet.setFrozenColCount(1);  // 冻结前1列

// 取消冻结
activeSheet.setFrozenRowCount(0);
activeSheet.setFrozenColCount(0);
```

## 自定义主题和样式

VTable-Sheet支持自定义主题和样式，可以在配置中设置：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 设置全局主题
  theme: {
    // 行号单元格样式
    rowSeriesNumberCellStyle: {
      text: {
        fill: 'blue'
      }
    },
    // 列号单元格样式
    colSeriesNumberCellStyle: {
      text: {
        fill: 'blue'
      }
    },
    // 表格主题
    tableTheme: TYPES.VTableThemes.ARCO.extends({
      // 自定义表格样式
      bodyStyle: {
        color: 'gray'
      },
      headerStyle: {
        bgColor: '#f0f0f0',
        fontWeight: 'bold'
      }
    })
  },
  sheets: [
    // 表格配置...
  ]
});
```

也可以为单个表格页或单元格设置样式：

```typescript
// 为单个表格页设置样式
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      // 表格页级别样式
      style: {
        headerStyle: {
          bgColor: '#e6f7ff',
          fontWeight: 'bold'
        },
        bodyStyle: {
          bgColor: '#ffffff',
          fontSize: 14
        }
      },
      // 其他配置...
    }
  ]
});

// 为单个单元格设置样式
const activeSheet = sheetInstance.getActiveSheet();
activeSheet.setCellStyle(1, 2, {
  bgColor: '#ffe7e7',
  fontWeight: 'bold',
  text: {
    fill: 'red'
  }
});
```

## 条件格式

可以使用条件格式功能，根据单元格的值应用不同的样式：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      // 其他配置...
      conditionalFormats: [
        {
          // 条件：大于100
          condition: {
            type: 'greaterThan',
            value: 100
          },
          // 满足条件时应用的样式
          style: {
            bgColor: '#e6fffb',
            text: {
              fill: '#13c2c2'
            }
          },
          // 应用范围
          range: {
            start: { col: 1, row: 1 },
            end: { col: 4, row: 10 }
          }
        },
        {
          // 条件：小于0
          condition: {
            type: 'lessThan',
            value: 0
          },
          // 满足条件时应用的样式
          style: {
            bgColor: '#fff1f0',
            text: {
              fill: '#f5222d'
            }
          },
          // 应用范围
          range: {
            start: { col: 1, row: 1 },
            end: { col: 4, row: 10 }
          }
        }
      ]
    }
  ]
});
```

也可以通过API动态设置条件格式：

```typescript
const activeSheet = sheetInstance.getActiveSheet();

// 添加条件格式
activeSheet.addConditionalFormat({
  condition: {
    type: 'between',
    min: 50,
    max: 100
  },
  style: {
    bgColor: '#fff7e6',
    text: {
      fill: '#fa8c16'
    }
  },
  range: {
    start: { col: 2, row: 5 },
    end: { col: 6, row: 15 }
  }
});

// 移除条件格式
activeSheet.removeConditionalFormat(formatId);
```

## 数据验证

可以为单元格设置数据验证规则，确保用户输入符合要求：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      // 其他配置...
      dataValidations: [
        {
          // 数值范围验证
          type: 'range',
          min: 0,
          max: 100,
          // 应用范围
          range: {
            start: { col: 1, row: 1 },
            end: { col: 1, row: 10 }
          },
          // 错误提示信息
          errorMessage: '请输入0-100之间的数值'
        },
        {
          // 列表验证
          type: 'list',
          values: ['选项1', '选项2', '选项3'],
          // 应用范围
          range: {
            start: { col: 2, row: 1 },
            end: { col: 2, row: 10 }
          },
          // 显示下拉列表
          showDropdown: true
        },
        {
          // 日期验证
          type: 'date',
          min: '2023-01-01',
          max: '2023-12-31',
          // 应用范围
          range: {
            start: { col: 3, row: 1 },
            end: { col: 3, row: 10 }
          }
        }
      ]
    }
  ]
});
```

## 自定义单元格渲染

可以通过自定义单元格渲染器来创建复杂的单元格内容：

```typescript
// 定义自定义单元格渲染器
const customCellRenderer = {
  draw: (ctx, cell, x, y, width, height, style, table) => {
    // 绘制自定义单元格内容
    ctx.save();
    
    // 绘制背景
    ctx.fillStyle = style.bgColor || '#ffffff';
    ctx.fillRect(x, y, width, height);
    
    // 绘制文本
    if (cell && cell.value !== undefined) {
      ctx.fillStyle = style.textStyle?.fill || '#333333';
      ctx.font = `${style.textStyle?.fontWeight || 'normal'} ${style.textStyle?.fontSize || 12}px ${style.textStyle?.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cell.value.toString(), x + width / 2, y + height / 2);
    }
    
    // 绘制边框
    ctx.strokeStyle = style.borderColor || '#e8e8e8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    ctx.restore();
    
    return true;  // 返回true表示已处理
  }
};

// 注册自定义单元格渲染器
VTable.register.cellRenderer('customCell', customCellRenderer);

// 在表格中使用自定义单元格渲染器
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      columns: [
        {
          title: '自定义列',
          cellType: 'customCell'  // 使用自定义渲染器
        },
        // 其他列...
      ],
      // 其他配置...
    }
  ]
});
```

## 键盘导航和快捷键

VTable-Sheet支持键盘导航和多种快捷键：

| 快捷键 | 功能 |
|-------|------|
| 方向键 | 在单元格间移动 |
| Tab | 移动到右侧单元格 |
| Shift+Tab | 移动到左侧单元格 |
| Enter | 确认编辑/移动到下一行 |
| Shift+Enter | 移动到上一行 |
| F2 | 进入编辑模式 |
| Esc | 取消编辑/取消选择 |
| Ctrl+C | 复制选中内容 |
| Ctrl+V | 粘贴内容 |
| Ctrl+X | 剪切选中内容 |
| Ctrl+Z | 撤销操作 |
| Ctrl+Y | 重做操作 |
| Delete | 删除选中内容 |

可以自定义或扩展快捷键：

```typescript
// 创建表格实例
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 其他配置...
});

// 添加自定义快捷键处理
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'b') {
    // Ctrl+B快捷键：将选中单元格设置为粗体
    event.preventDefault();
    
    const activeSheet = sheetInstance.getActiveSheet();
    const selection = activeSheet.getSelection();
    
    if (selection) {
      for (let row = selection.start.row; row <= selection.end.row; row++) {
        for (let col = selection.start.col; col <= selection.end.col; col++) {
          activeSheet.setCellStyle(row, col, {
            fontWeight: 'bold'
          });
        }
      }
    }
  }
});
```

## 性能优化

处理大型数据集时，可以使用以下技巧来优化性能：

1. **虚拟滚动**：VTable-Sheet默认使用虚拟滚动技术，只渲染可见区域的单元格。

2. **延迟加载**：对于特别大的数据集，可以使用延迟加载策略：

```typescript
// 创建初始表格
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '大数据表',
      // 初始只设置表格结构，不加载全部数据
      rowCount: 10000,  // 总行数
      columnCount: 100, // 总列数
      data: [],         // 初始为空
      // 其他配置...
    }
  ]
});

// 根据滚动位置加载数据
sheetInstance.on('scroll', (event) => {
  const { visibleRowRange, visibleColRange } = event;
  
  // 加载可见区域周围的数据
  loadDataChunk(
    Math.max(0, visibleRowRange.start - 50),
    Math.min(10000, visibleRowRange.end + 50),
    Math.max(0, visibleColRange.start - 10),
    Math.min(100, visibleColRange.end + 10)
  );
});

// 加载数据块
function loadDataChunk(rowStart, rowEnd, colStart, colEnd) {
  // 模拟从服务器获取数据
  fetchDataFromServer(rowStart, rowEnd, colStart, colEnd).then(data => {
    // 更新表格数据
    const activeSheet = sheetInstance.getActiveSheet();
    activeSheet.updateData(data, rowStart, colStart);
  });
}
```

3. **减少重绘**：批量更新数据和样式，减少重绘次数：

```typescript
// 批量更新多个单元格
const updateBatch = [];

for (let row = 0; row < 100; row++) {
  for (let col = 0; col < 5; col++) {
    updateBatch.push({
      row,
      col,
      value: `新值(${row},${col})`,
      style: { bgColor: row % 2 === 0 ? '#f9f9f9' : '#ffffff' }
    });
  }
}

// 一次性更新所有单元格
activeSheet.batchUpdateCells(updateBatch);
```

通过这些高级功能和优化技巧，可以充分发挥VTable-Sheet的强大功能，创建功能丰富、性能优异的电子表格应用。

【注：此处需要添加高级功能使用效果的截图，如单元格合并、冻结行列、条件格式等】
