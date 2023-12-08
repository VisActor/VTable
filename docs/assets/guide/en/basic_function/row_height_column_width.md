# row height and column width

In the field of data analytics, tables are a common way of presenting data. Correctly setting the row height and column width of a table is important to improve the readability and aesthetics of data. This tutorial will focus on the table row height and column width calculation function in VTable, and learn how to correctly configure row height and column width to meet actual needs.

# Row height configuration

## Default row height

In VTable, you can set a uniform default row height value for the entire table. The default row height can be passed `defaultRowHeight` Configuration items to set. The following code example shows how to set the default line height to 50:

```javascript
const table = new VTable.ListTable({
  defaultRowHeight: 50});
```

## Header default row height

In addition to the default row height setting, VTable also supports setting the row height of the table header. pass `defaultHeaderRowHeight` The configuration item can be set as an array, which corresponds to the height of the header rows of each level, or a numerical value can set the height of each row of the table uniformly. The following code example shows how to set the height of the first-level header row to 30 and the height of the second-level header row to 40:

```javascript
const table = new VTable.ListTable({
  defaultHeaderRowHeight: [30, 40],
});
```

# Column width configuration

## Default column width

In VTable, you can set a uniform default column width value. The default column width can be passed through `defaultColWidth` Configuration item to set. The following code example shows how to set the column width to 100:

```javascript
const table = new VTable.ListTable({
  defaultColWidth: 100,
});
```
## Default Column Width for Row Header

In addition to setting the default column width, VTable also supports setting the column width specifically for the row header. This can be achieved using the `defaultHeaderColWidth` configuration option, which can be an array representing the widths of each level of row header columns. The following code example demonstrates how to set the column width to 50 for the first-level row header column and 60 for the second-level row header column:

```javascript
const table = new VTable.ListTable({
  defaultHeaderColWidth: [50, 60],
});
```

Please note that this configuration only applies to row headers. If you have column headers, this configuration option will not be considered (the logic will be based on the widths defined in the body section).

Specifically:
- For transposed basic tables, if you configure `defaultHeaderColWidth: [50, 'auto']`, it means that the first column of the transposed table header has a width of 50, and the second column adjusts its width based on the content of the cells.
- For pivot tables, if you configure `defaultHeaderColWidth: [50, 'auto']`, it means that the first column of the row header (first-level dimension) has a width of 50, and the second column (second-level dimension) adjusts its width based on the content of the cells.

## Column width limit: maxWidth + minWidth

In the process of configuring column widths, you may encounter scenarios where you need to limit the maximum or minimum column width of a column. VTable provides `maxWidth` and `maxWidth` Configuration items to limit the maximum and minimum column widths for each column. The following code example shows how to set a column to a maximum column width of 200 and a minimum column width of 50:

```javascript
const table = new VTable.ListTable({
  columns: [
    {
      // ...其他配置项
      maxWidth: 200,
      minWidth: 50,
    },
  ],
});
```

## Column width limit: limitMaxAutoWidth

When using "Auto Width Mode", it may be necessary to limit the calculated maximum column width. pass `limitMaxAutoWidth` The configuration item can be set to avoid display abnormalities caused by the excessive width of a column.`limitMaxAutoWidth` The configuration item supports setting a specific value or Boolean type, and if set to true or not, use 450 to limit the maximum column width. For example, setting the limit maximum column width to 500:

```javascript
 table = new VTable.ListTable({
  // ...其他配置项
  limitMaxAutoWidth: 500,
});
```
## Column width limit configuration: limitMinWidth

When dragging the column width, it is easy to drag the width to 0. This may cause certain interaction problems when dragging it back again, or the functional restrictions should not drag it into a hidden column. In this case, you can configure `limitMinWidth` Limit the minimum column width, for example, limit the minimum draggable width to 20.

Note: If set to true, the column width will be limited to a minimum of 10px when dragging to change the column width. If set to false, there will be no limit. Or set it directly to some numeric value. Default is 10px.

```javascript
 table = new VTable.ListTable({
  // ...Other configuration items
  limitMinWidth: 20,
});
```

# Influence of line wrapping on line height

## AutoWrapText

In VTable, you can set the line wrapping function for cells. The line wrapping function passes `autoWrapText` Configuration items are set.

AutoWrapText can be set globally:

```javascript
const table = new VTable.ListTable({
  // ...其他配置项
  autoWrapText: true,
});
```

Configure line wrapping for a column of cells:

```javascript
const table = new VTable.ListTable({
  columns: [
    {
      // ...其他配置项
      style: {
        autoWrapText: true,
      },
    },
  ],
});
```

## Automatically calculate row height based on content (autoRowHeight)

When the contents of some column cells are longer and wrap, the cells may need a larger row height to display the content. by setting `autoRowHeight` for `true`, VTable can automatically calculate row heights based on content, based on fontSize and lineHeight(font height)，include padding. The following code example shows how to configure the entire table to automatically calculate row heights based on content:

```javascript
const table = new VTable.ListTable({
  columns: [
    {
      // ...其他配置项
      style: {
        fontSize: 18,
        lineHeight: 24
      },
    },
  ]
  autoRowHeight: true,
});
```

# Table width mode

In VTable, the calculation mode of table column width can be configured as `standard`(Standard mode),`adaptive`(Adaptive container width mode) or `autoWidth`(Auto width mode).

*   Standard mode: form use`width` The width specified by the property is used as the column width. If not specified, the default column width set by'defaultColWidth will be used.
*   Adaptive container width mode: In adaptive container width mode, the table uses the width of the container to allocate column widths (the ratio of each column width is based on the width value in standard mode).
*   AutoWidth mode (autoWidth): In automatic width mode, the column width is automatically calculated based on the contents of the column header and body cells, ignoring the set `width` Properties and `defaultColWidth`.

So far, we have introduced the calculation functions of table row height and column width in VTable, including row height, column width configuration, and table width mode. By mastering these functions, you can more conveniently display and analyze data in VTable, and realize various practical needs.

# Row height mode

The calculation mode of table row height `heightMode` can also be configured as `standard` (standard mode), `adaptive` (adaptive container width mode) or `autoHeight` (automatic row height mode).

- Standard mode (standard): Use `defaultRowHeight` and `defaultHeaderRowHeight` as the row height.
- Adaptive container height mode (adaptive): Use the height of the container to allocate the height of each row.
- Automatic line height mode (autoHeight): Automatically calculate line height based on content, based on fontSize and lineHeight(font height)，include padding. The related configuration item `autoWrapText` automatically wraps lines, and can calculate the line height based on the multi-line text content after line wrapping.

# FAQ
## Setting Adaptive Content for Specific Columns to Calculate Column Width
If you don't want to calculate the column width for every column, you can use the `width` property in the `columns` configuration instead of setting `widthMode: 'autoWidth'`.

## Adapting Column Width Based on Header Content
If you only need to calculate the width based on the header content, you can use `columnWidthComputeMode: 'only-header'`. However, you need to use it in conjunction with `widthMode: 'autoWidth'`.

So far, we have introduced the table row height and column width calculation function in VTable, including row height, column width configuration, and table width mode. By mastering these functions, you can display and analyze data in VTable more conveniently to meet various practical needs.