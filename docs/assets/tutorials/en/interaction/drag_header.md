# Drag the head to transpose

In complex data tables, the order of columns may affect our analysis and understanding of the data. Sometimes we need to compare columns, and these columns may be far apart in the original table. The drag-and-drop header transposition function allows us to quickly adjust the order of columns and improve the efficiency of data analytics.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20e.gif)

## Turn on transposition function

By default, VTable's drag-and-drop header transposition feature is turned off. To enable this feature, you need to `dragHeaderMode` Set to `'all'`,`'column'` or `'row'`Where:

*   `'all'` Indicates that all headers can be transposed
*   `'none'` Indicates non-commutative
*   `'column'` Indicates that only the list header can be transposed
*   `'row'` Indicates that only row headers are transposed

```javascript
const table = new VTable.ListTable({
  dragHeaderMode: 'all'
});
```

Configured `dragHeaderMode` After that, you can drag and drop the header to transpose.

## Transposition marker line style configuration

We can style the transposition markers to better render the appearance of the table. by setting `theme.dragHeaderSplitLine`, this function can be realized, and the specific configuration items are:

*   `'lineColor'` Drag and drop the color of the marker line
*   `'lineWidth'` Drag and drop the line width of the marker line
*   `'shadowBlockColor'` Color of Shadow Region when dragging

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
        { title: '日期', columnType: 'text', dragHeader: true },
        { title: '销量', columnType: 'text', dragHeader: false },
        { title: '销售额', columnType: 'text', dragHeader: true }
      ]
    });

As with the above code, the "Sales" column cannot be dragged and transposed.

So far, we have introduced the drag-and-drop header transposition function of VTable, including the activation of the drag-and-drop header transposition function, the style configuration of the drag-and-drop header transposition mark line, and whether a certain column can be dragged. By mastering these functions, you can more easily perform data analytics and processing in VTable.
