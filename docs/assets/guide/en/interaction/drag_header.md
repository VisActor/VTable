# Drag the head to transpose

In complex data tables, the order of columns may affect our analysis and understanding of the data. Sometimes we need to compare columns, and these columns may be far apart in the original table. The drag-and-drop header transposition function allows us to quickly adjust the order of columns and improve the efficiency of data analytics.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20e.gif)

## Turn on transposition function

By default, VTable's drag-and-drop header transposition feature is turned off. To enable this feature, you need to `dragHeaderMode` Set to `'all'`,`'column'` or `'row'`Where:

- `'all'` Indicates that all headers can be transposed
- `'none'` Indicates non-commutative
- `'column'` Indicates that only the list header can be transposed
- `'row'` Indicates that only row headers are transposed

```javascript
const table = new VTable.ListTable({
  dragHeaderMode: 'all'
});
```

Configured `dragHeaderMode` After that, you can drag and drop the header to transpose.

## Transposition marker line style configuration

We can style the transposition markers to better render the appearance of the table. by setting `theme.dragHeaderSplitLine`, this function can be realized, and the specific configuration items are:

- `'lineColor'` Drag and drop the color of the marker line
- `'lineWidth'` Drag and drop the line width of the marker line
- `'shadowBlockColor'` Color of Shadow Region when dragging

Here is an example configuration:

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

In this example, we set the color of the marker line for dragging and dragging the header to transpose to red, with a border line width of 2 and a red shadow with a transparency of 0.3.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090c.png)

## Prohibit the transposition of a column

Sometimes, we don't want certain columns to participate in drag-and-drop transposition. For this requirement, VTable provides a column-specific configuration item columns.dragHeader. By configuring a column `columns.dragHeader: false`, you can prohibit the column from dragging and transposing.

    const table = new VTable.ListTable({
      columns: [
        { title: '日期', cellType: 'text', dragHeader: true },
        { title: '销量', cellType: 'text', dragHeader: false },
        { title: '销售额', cellType: 'text', dragHeader: true }
      ]
    });

As with the above code, the "Sales" column cannot be dragged and transposed.

## Restrict dragging of frozen columns

Drag and drop the table header to move the position. Select different effects according to the business scenario for the rules of the frozen part. For example, you can prohibit dragging of frozen columns, or adjust the number of frozen columns.

Constraints can be made through the following configuration (only valid for ListTable):

```
Drag the table header to move the position. Rules for frozen parts. The default is fixedFrozenCount.
frozenColDragHeaderMode?: 'disabled' | 'adjustFrozenCount' | 'fixedFrozenCount';
```

The different rules are described below:

- "disabled" (disables adjusting the position of frozen columns): The headers of other columns are not allowed to be moved into the frozen column, nor are the frozen columns allowed to be moved out. The frozen column remains unchanged.
- "adjustFrozenCount" (adjust the number of frozen columns based on the interaction results): allows the headers of other columns to move into the frozen column, and the frozen column to move out, and adjusts the number of frozen columns based on the dragging action. When the headers of other columns are dragged into the frozen column position, the number of frozen columns increases; when the headers of other columns are dragged out of the frozen column position, the number of frozen columns decreases.
- "fixedFrozenCount" (can adjust frozen columns and keep the number of frozen columns unchanged): Allows you to freely drag the headers of other columns into or out of the frozen column position while keeping the number of frozen columns unchanged.

So far, we have introduced the drag-and-drop header transposition function of VTable, including the activation of the drag-and-drop header transposition function, the style configuration of the drag-and-drop header transposition mark line, and whether a certain column can be dragged. By mastering these functions, you can more easily perform data analytics and processing in VTable.

## Adjusting Data Order

**ListTable Data Reordering Explanation:**

In the application scenario of the basic table ListTable, we may need to adjust the order of the data. VTable provides the `rowSeriesNumber` row number configuration, and in `IRowSeriesNumber`, there is a `dragOrder` property. When set to `true`, it will display the drag icon in the row number cell, allowing you to adjust the order of the data through dragging. For specific details, please refer to the [tutorial](../basic_function/row_series_number).

### Dragging and Reordering in Tree Structures

If it is a tree structure display, we internally limit it to only allow dragging and reordering within the same parent node. If you want a more flexible adjustment method, you can pass in the `dataSource` object and pass in the two methods `canChangeOrder` and `changeOrder` on the object.

Here is an example, by copying the `dataSource`, you can implement dragging order without strictly constraining movement between the same parent level, but instead allowing movement across parent levels, but only to positions with the same level:

```javascript livedemo template=vtable
let tableInstance;
const dataSource = new VTable.data.CachedDataSource({
  records: [
    {
      Category: 'Office Supplies',
      Sales: '129.696',
      Quantity: '2',
      Profit: '60.704',
      children: [
        {
          Category: 'Envelope', // Corresponding atomic category
          Sales: '125.44',
          Quantity: '2',
          Profit: '42.56',
          children: [
            {
              Category: 'Yellow Envelope',
              Sales: '125.44',
              Quantity: '2',
              Profit: '42.56'
            },
            {
              Category: 'White Envelope',
              Sales: '1375.92',
              Quantity: '3',
              Profit: '550.2'
            }
          ]
        },
        {
          Category: 'Tools', // Corresponding atomic category
          Sales: '1375.92',
          Quantity: '3',
          Profit: '550.2',
          children: [
            {
              Category: 'Stapler',
              Sales: '125.44',
              Quantity: '2',
              Profit: '42.56'
            },
            {
              Category: 'Calculator',
              Sales: '1375.92',
              Quantity: '3',
              Profit: '550.2'
            }
          ]
        }
      ]
    },
    {
      Category: 'Technology',
      Sales: '229.696',
      Quantity: '20',
      Profit: '90.704',
      children: [
        {
          Category: 'Equipment', // Corresponding atomic category
          Sales: '225.44',
          Quantity: '5',
          Profit: '462.56'
        },
        {
          Category: 'Accessories', // Corresponding atomic category
          Sales: '375.92',
          Quantity: '8',
          Profit: '550.2'
        },
        {
          Category: 'Photocopier', // Corresponding atomic category
          Sales: '425.44',
          Quantity: '7',
          Profit: '34.56'
        },
        {
          Category: 'Phone', // Corresponding atomic category
          Sales: '175.92',
          Quantity: '6',
          Profit: '750.2'
        }
      ]
    },
    {
      Category: 'Furniture',
      Sales: '129.696',
      Quantity: '2',
      Profit: '-60.704',
      children: [
        {
          Category: 'Table', // Corresponding atomic category
          Sales: '125.44',
          Quantity: '2',
          Profit: '42.56',
          children: [
            {
              Category: 'Yellow Table',
              Sales: '125.44',
              Quantity: '2',
              Profit: '42.56'
            },
            {
              Category: 'White Table',
              Sales: '1375.92',
              Quantity: '3',
              Profit: '550.2'
            }
          ]
        },
        {
          Category: 'Chair', // Corresponding atomic category
          Sales: '1375.92',
          Quantity: '3',
          Profit: '550.2',
          children: [
            {
              Category: 'Executive Chair',
              Sales: '125.44',
              Quantity: '2',
              Profit: '42.56'
            },
            {
              Category: 'Sofa Chair',
              Sales: '1375.92',
              Quantity: '3',
              Profit: '550.2'
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
      field: 'Category',
      tree: true,
      title: 'Category',
      width: 'auto',
      sort: true
    },
    {
      field: 'Sales',
      title: 'Sales',
      width: 'auto',
      sort: true
    },
    {
      field: 'Profit',
      title: 'Profit',
      width: 'auto',
      sort: true
    }
  ],
  showPin: true, // Display VTable's built-in frozen column icon
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
    field: 'Sales',
    order: 'asc'
  },
  theme: VTable.themes.BRIGHT,
  defaultRowHeight: 32
};

tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```
