# 拖拽表头换位

在复杂数据表格中，列的顺序可能会影响我们对数据的分析和理解。有时我们需要在列之间进行对比，而这些列在初始表格中可能相距较远，拖拽表头换位功能就能够让我们快速调列顺序，提高数据分析效率。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20e.gif)

## 开启换位功能

默认情况下，VTable 的拖拽表头换位功能处于关闭状态。要启用此功能，需要将 `dragHeaderMode` 设置为 `'all'`、`'column'` 或 `'row'`。其中：

- `'all'` 表示所有表头均可换位
- `'none'` 表示不可换位
- `'column'` 表示只有列表头可换位
- `'row'` 表示只有行表头换位

```javascript
const table = new VTable.ListTable({
  dragHeaderMode: 'all'
});
```

配置好 `dragHeaderMode` 之后，您就可以拖拽表头进行换位了。

## 换位标记线样式配置

我们可以为换位标记线配置样式，以便更好地呈现表格的外观。通过设置 `theme.dragHeaderSplitLine`，可以实现这一功能，具体配置项有：

- `'lineColor'` 拖拽标记线的颜色
- `'lineWidth'` 拖拽标记线的线宽
- `'shadowBlockColor'` 拖拽时阴影区域的颜色

以下是一个配置示例：

```javascript
const table = new VTable.ListTable({
  theme: {
    dragHeaderSplitLine: {
      lineColor: 'red',
      lineWidth: 2,
      shadowBlockColor: 'rgba(255,0,0,0.3)'
    }
  }
});
```

在这个示例中，我们将拖拽表头换位的标记线颜色设置为红色，并设置了边框线宽为 2，以及透明度为 0.3 的红色阴影。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090c.png)

## 禁止某一列换位

有时候，我们不希望某些列参与拖拽换位。针对这种需求，VTable 提供了针对列的配置项 columns.dragHeader。通过为某一列配置 `columns.dragHeader: false`，可以禁止该列拖拽换位。

    const table = new VTable.ListTable({
      columns: [
        { title: '日期', cellType: 'text', dragHeader: true },
        { title: '销量', cellType: 'text', dragHeader: false },
        { title: '销售额', cellType: 'text', dragHeader: true }
      ]
    });

如上述代码，“销量”列不可拖拽换位。

## 限制冻结列的拖拽

拖拽表头移动位置 针对冻结部分的规则根据业务场景选择不同的效果，如可以禁止拖拽冻结列，或者调整冻结列的数量。

可以通过下面的配置进行约束(仅针对 ListTable 生效)：

```
拖拽表头移动位置 针对冻结部分的规则  默认为fixedFrozenCount
frozenColDragHeaderMode?: 'disabled' | 'adjustFrozenCount' | 'fixedFrozenCount';
```

不同规则描述如下：

- "disabled"（禁止调整冻结列位置）：不允许其他列的表头移入冻结列，也不允许冻结列移出，冻结列保持不变。
- "adjustFrozenCount"（根据交互结果调整冻结数量）：允许其他列的表头移入冻结列，及冻结列移出，并根据拖拽的动作调整冻结列的数量。当其他列的表头被拖拽进入冻结列位置时，冻结列数量增加；当其他列的表头被拖拽移出冻结列位置时，冻结列数量减少。
- "fixedFrozenCount"（可调整冻结列，并维持冻结数量不变）：允许自由拖拽其他列的表头移入或移出冻结列位置，同时保持冻结列的数量不变。

至此，我们已经介绍了 VTable 的拖拽表头换位功能，括拖拽表头换位功能的开启、拖拽表头换位标记线的样式配置以及某一列是否可以拖拽。通过掌握这些功能，您可以更便捷地在 VTable 中进行数据分析与处理。

## 移动数据顺序

**ListTable 数据换位说明：**

针对基本表格 ListTable 的应用场景中，我们可能需要将数据顺序进行调整。VTable 提供了 `rowSeriesNumber` 行序号配置，在`IRowSeriesNumber`中有个 `dragOrder` 属性，当设置为 `true` 时，会在序号单元格中显示拖拽的图标，您可以通过拖拽来调整数据的顺序。具体可以参考[教程](../basic_function/row_series_number)。

### 在树形结构中拖拽换位

如果是树形结构展示结构，我们内部限制了只能同父级节点之中拖拽换位。如果想要更灵活的调整方式可以传入 dataSource 对象，并传入对象上的两个方法`canChangeOrder`和`changeOrder`。

以下是一个示例,通过复制 dataSource，可以实现拖拽顺序时不严格约束同父级之间移动位置，而是可以跨父级移动位置，但是约定只能移动到层级相同的位置上：

```javascript livedemo template=vtable
let tableInstance;
const dataSource = new VTable.data.CachedDataSource({
  records: [
    {
      类别: '办公用品',
      销售额: '129.696',
      数量: '2',
      利润: '60.704',
      children: [
        {
          类别: '信封', // 对应原子类别
          销售额: '125.44',
          数量: '2',
          利润: '42.56',
          children: [
            {
              类别: '黄色信封',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '白色信封',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        },
        {
          类别: '器具', // 对应原子类别
          销售额: '1375.92',
          数量: '3',
          利润: '550.2',
          children: [
            {
              类别: '订书机',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '计算器',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        }
      ]
    },
    {
      类别: '技术',
      销售额: '229.696',
      数量: '20',
      利润: '90.704',
      children: [
        {
          类别: '设备', // 对应原子类别
          销售额: '225.44',
          数量: '5',
          利润: '462.56'
        },
        {
          类别: '配件', // 对应原子类别
          销售额: '375.92',
          数量: '8',
          利润: '550.2'
        },
        {
          类别: '复印机', // 对应原子类别
          销售额: '425.44',
          数量: '7',
          利润: '34.56'
        },
        {
          类别: '电话', // 对应原子类别
          销售额: '175.92',
          数量: '6',
          利润: '750.2'
        }
      ]
    },
    {
      类别: '家具',
      销售额: '129.696',
      数量: '2',
      利润: '-60.704',
      children: [
        {
          类别: '桌子', // 对应原子类别
          销售额: '125.44',
          数量: '2',
          利润: '42.56',
          children: [
            {
              类别: '黄色桌子',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '白色桌子',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        },
        {
          类别: '椅子', // 对应原子类别
          销售额: '1375.92',
          数量: '3',
          利润: '550.2',
          children: [
            {
              类别: '老板椅',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '沙发椅',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        }
      ]
    }
  ],
  canChangeOrder(sourceIndex, targetIndex) {
    let sourceIndexs = tableInstance.getRecordIndexByCell(0, sourceIndex + tableInstance.columnHeaderLevelCount);
    if (typeof sourceIndexs === 'number') {
      sourceIndexs = [sourceIndexs];
    }
    let targetIndexs = tableInstance.getRecordIndexByCell(0, targetIndex + tableInstance.columnHeaderLevelCount);
    if (typeof targetIndexs === 'number') {
      targetIndexs = [targetIndexs];
    }
    if (sourceIndexs.length === targetIndexs.length) {
      return true;
    } else if (targetIndexs.length + 1 === sourceIndexs.length) {
      return true;
    }
    return false;
  },
  changeOrder(sourceIndex, targetIndex) {
    const record = tableInstance.getRecordByCell(0, sourceIndex + tableInstance.columnHeaderLevelCount);
    let sourceIndexs = tableInstance.getRecordIndexByCell(0, sourceIndex + tableInstance.columnHeaderLevelCount);
    if (typeof sourceIndexs === 'number') {
      sourceIndexs = [sourceIndexs];
    }
    let targetIndexs = tableInstance.getRecordIndexByCell(0, targetIndex + tableInstance.columnHeaderLevelCount);
    if (typeof targetIndexs === 'number') {
      targetIndexs = [targetIndexs];
    }
    if (sourceIndexs.length === targetIndexs.length) {
      tableInstance.deleteRecords([sourceIndexs]);
      tableInstance.addRecord(record, targetIndexs);
    } else if (targetIndexs.length + 1 === sourceIndexs.length) {
      tableInstance.deleteRecords([sourceIndexs]);
      targetIndexs.push(0);
      tableInstance.addRecord(record, targetIndexs);
    }
  }
});
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      field: '类别',
      tree: true,
      title: '类别',
      width: 'auto',
      sort: true
    },
    {
      field: '销售额',
      title: '销售额',
      width: 'auto',
      sort: true
    },
    {
      field: '利润',
      title: '利润',
      width: 'auto',
      sort: true
    }
  ],
  showPin: true, //显示VTable内置冻结列图标
  widthMode: 'standard',
  allowFrozenColCount: 2,
  dataSource,
  rowSeriesNumber: {
    dragOrder: true
  },
  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,
  hierarchyTextStartAlignment: true,
  sortState: {
    field: '销售额',
    order: 'asc'
  },
  theme: VTable.themes.BRIGHT,
  defaultRowHeight: 32
};

tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```
