# VTable-Sheet 样式配置指南

VTable-Sheet 提供了丰富的样式配置选项，使您能够根据需求自定义表格的外观。本指南将详细介绍如何通过 `theme` 配置来调整表格样式。

## 主题配置入口

在 VTable-Sheet 中，样式可通过全局 `theme` 属性进行配置，也可以通过 `sheet` 的 `theme` 属性进行配置。

如果同时配置了全局和sheet的 `theme` 属性，则以sheet的 `theme` 为准。

以下是一个基本的主题配置示例：

```typescript
const options = {
  // 其他配置...
  theme: {
    rowSeriesNumberCellStyle: {
      // 行序号单元格样式
    },
    colSeriesNumberCellStyle: {
      // 列序号单元格样式
    },
    menuStyle: {
      // 菜单样式
    },
    tableTheme: {
      // 表格主题
    }
  }
};
```

## 主题配置详解

### 行序号和列序号单元格样式

您可以通过 `rowSeriesNumberCellStyle` 和 `colSeriesNumberCellStyle` 来定制行列序号的样式：

```typescript
theme: {
  rowSeriesNumberCellStyle: {
    bgColor: '#f5f5f5',
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#333333',
    textAlign: 'center',
    textBaseline: 'middle'
  },
  colSeriesNumberCellStyle: {
    bgColor: '#f5f5f5',
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#333333',
    textAlign: 'center',
    textBaseline: 'middle'
  }
}
```

### 菜单样式配置

`menuStyle` 属性用于配置表格相关菜单的样式（待实现！）：

```typescript
theme: {
  menuStyle: {
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#333333',
    padding: [8, 16, 8, 16], // 上、右、下、左内边距
    bgColor: '#ffffff'
  }
}
```

### 表格主题配置

`tableTheme` 是 VTable-Sheet 的表格区域样式配置，它完全对应于 VTable 的主题系统，具体参考：[VTable 主题配置](../theme_and_style/theme)。

不过需要注意的事，会自动忽略 `tableTheme` 中的 `frameStyle` 样式。

其中，VTable中的内置主题如ARCO，DARK ARCO等，也同样适用。

## 自定义主题示例

下面是一个完整的主题配置示例，展示了如何创建一个自定义的 VTable-Sheet 主题：

```javascript livedemo template=vtable

// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// import { VTable } from '@visactor/vtable-gantt';
// 容器
const container = document.getElementById(CONTAINER_ID);
// 创建表格实例
const sheet = new VTableSheet.VTableSheet(container, {
  sheets: [
    // 销售数据表格页
    {
      sheetKey: 'sales',
      sheetTitle: '销售数据',
      columns: [
        { title: '产品', width: 120 },
        { title: '一季度', width: 100 },
        { title: '二季度', width: 100 },
        { title: '三季度', width: 100 },
        { title: '四季度', width: 100 },
        { title: '总计', width: 100 }
      ],
      data: [
        ['笔记本电脑', 1200, 1500, 1800, 2000, 6500],
        ['智能手机', 2500, 2800, 3000, 3500, 11800],
        ['平板电脑', 900, 950, 1100, 1300, 4250],
        ['智能手表', 500, 650, 800, 950, 2900],
      ],
      active: true,
      theme: {
        tableTheme: VTableSheet.TYPES.VTableThemes.ARCO.extends({
          bodyStyle: {
            color: 'red'
          }
        })
      },
      frozenRowCount: 1,
      frozenColCount: 1
    },
    
    // 库存数据表格页
    {
      sheetKey: 'inventory',
      sheetTitle: '库存数据',
      columns: [
        { title: '产品', width: 120 },
        { title: '库存数量', width: 100 },
        { title: '安全库存', width: 100 },
        { title: '补货点', width: 100 },
        { title: '库存状态', width: 100 }
      ],
      data: [
        ['笔记本电脑', 150, 50, 75, '正常'],
        ['智能手机', 320, 100, 150, '充足'],
        ['平板电脑', 80, 40, 60, '警告'],
        ['智能手表', 35, 30, 45, '不足'],
      ]
    },
    
    // 员工数据表格页
    {
      sheetKey: 'employees',
      sheetTitle: '员工数据',
      columns: [
        { title: '姓名', width: 100 },
        { title: '部门', width: 120 },
        { title: '职位', width: 120 },
        { title: '入职日期', width: 120 },
        { title: '工资', width: 100 }
      ],
      data: [
        ['张三', '技术部', '工程师', '2022-01-15', 12000],
        ['李四', '市场部', '经理', '2020-06-20', 18000],
        ['王五', '技术部', '高级工程师', '2021-03-10', 15000],
        ['赵六', '人力资源', '专员', '2022-09-01', 9000]
      ],
      theme: {
        tableTheme: VTableSheet.TYPES.VTableThemes.BRIGHT
      }
    }
  ],
  theme: {
    // 行序号单元格样式
    rowSeriesNumberCellStyle: {
      bgColor: '#f0f0f0',
      color: '#666666',
      fontSize: 12,
      textAlign: 'center'
    },
    
    // 列序号单元格样式
    colSeriesNumberCellStyle: {
      bgColor: '#f0f0f0',
      color: '#666666',
      fontSize: 12,
      textAlign: 'center'
    },
    
    // 菜单样式
    menuStyle: {
      fontFamily: 'Microsoft YaHei',
      fontSize: 13,
      color: '#333333',
      padding: [10, 15, 10, 15],
      bgColor: '#ffffff'
    },
    
    // 表格主题
    tableTheme: {
      bgColor: '#ffffff',
      color: '#333333',
      fontFamily: 'Microsoft YaHei',
      fontSize: 13,
      
      // 表头样式
      headerStyle: {
        bgColor: '#e6f7ff',
        color: '#0066cc',
        fontSize: 14,
        fontWeight: 'bold'
      },
      
      // 边框样式
      borderLineWidth: 1,
      borderColor: '#d9d9d9',
      
      // 行交替颜色
      underlayBackgroundColor: 'transparent',
      stripeRowBackgroundColor: '#fafafa',
      
      // 选中单元格样式
      selectionStyle: {
        cellBorderLineWidth: 2,
        cellBorderColor: '#1890ff'
      },
      
      // 悬停样式
      hoverStyle: {
        rowBgColor: '#e6f7ff'
      }
    }
  }
});
window['sheetInstance'] = sheet;
```

通过以上配置，您可以完全控制 VTable-Sheet 的视觉呈现，创建符合您应用设计风格的表格界面。
