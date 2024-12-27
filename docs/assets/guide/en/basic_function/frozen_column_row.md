# Freeze Columns and Rows

In data analysis applications, the amount of data in a table is usually very large, which means that there are many columns in the table horizontally. When users horizontally scroll the table, it may cause the columns of key information to be "scrolled out" of the visible range. In order to keep these key information columns visible during horizontal scrolling, we need to "freeze" these columns or rows. The freeze column and row function can make data analysis easier and clearer.

Note: This function is only supported in the basic table ListTable.

## Set Left Frozen Columns

Freezing the left column is the most common freezing requirement. Compared with the freezing in other directions, this is also the most comprehensive freezing ability supported by VTable.
f
The relevant configuration items are as follows:

- `frozenColCount`: Number of frozen columns, default is 0.
- `allowFrozenColCount`: Number of columns allowed to be operated, that is, the number of columns before which the freeze operation button will appear, default is 0.
- `showFrozenIcon`: Whether to display the fixed column icon, default is `true`.
- `maxFrozenWidth`: Maximum freeze width, default is '80%'.
- `unfreezeAllOnExceedsMaxWidth`: When the column width exceeds the maximum freeze width, whether to automatically unfreeze all, default is `true`.

Here is a configuration example:

```javascript
const listTable = new ListTable({
  // ...other configuration items
  frozenColCount: 2,
  allowFrozenColCount: 4,
  showFrozenIcon: true
});
```

In this example, we set the number of frozen columns to 2, which means that the first two columns will be frozen. At the same time, the number of columns allowed to be frozen is set to 4, which means that the freeze operation button will appear before the first four columns, and users can manually freeze them as needed. Finally, set `showFrozenIcon` to `true` to display the fixed column icon in the basic table.

## Set Right Frozen Columns

A common scenario for freezing the right column in a table is to place operation buttons or menus, so that users can easily operate on each row in the table.

The configuration items are as follows:

- `rightFrozenColCount`: Number of right frozen columns, default is 0.

## Set Top Frozen Rows

The header part is automatically frozen, if you want the body part to be frozen, just set `frozenRowCount`. The main setting number value must be greater than the number of header rows to freeze the body part rows.

## Set Bottom Frozen Rows

The scenario of freezing the bottom row can be used to fix the total row or a table with multiple header levels. Users can keep the visibility of the total row when scrolling the table, which is convenient for viewing summary data.

The configuration items are as follows:

- `bottomFrozenRowCount`: Number of bottom frozen rows, default is 0.

## Use the Freeze Column Interface

In addition to setting the frozen columns through the configuration items, VTable also provides the corresponding interface method `setFrozenColCount` to dynamically set the number of frozen columns, so that you can adjust it at any time according to your needs during the program running.

You can use the `setFrozenColCount` interface method of the `ListTable` class to set the current number of frozen columns, as shown below:

```javascript
listTable.setFrozenColCount(3);
or;
listTable.frozenColCount = 3;
```

In this example, we adjust the number of frozen columns of the current list to 3. At this time, the first three columns will be frozen.

## Example

Example:

```javascript livedemo template=vtable
const records = [
  {
    230517143221027: 'CA-2018-156720',
    230517143221030: 'JM-15580',
    230517143221032: 'Bagged Rubber Bands',
    230517143221023: 'Office Supplies',
    230517143221034: 'Fasteners',
    230517143221037: 'West',
    230517143221024: 'Loveland',
    230517143221029: '2018-12-30',
    230517143221042: '3',
    230517143221040: '3.024',
    230517143221041: '-0.605'
  },
  {
    230517143221027: 'CA-2018-115427',
    230517143221030: 'EB-13975',
    230517143221032: 'GBC Binding covers',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'West',
    230517143221024: 'Fairfield',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '20.72',
    230517143221041: '6.475'
  },
  {
    230517143221027: 'CA-2018-115427',
    230517143221030: 'EB-13975',
    230517143221032: 'Cardinal Slant-D Ring Binder, Heavy Gauge Vinyl',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'West',
    230517143221024: 'Fairfield',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '13.904',
    230517143221041: '4.519'
  },
  {
    230517143221027: 'CA-2018-143259',
    230517143221030: 'PO-18865',
    230517143221032: 'Wilson Jones Legal Size Ring Binders',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'East',
    230517143221024: 'New York City',
    230517143221029: '2018-12-30',
    230517143221042: '3',
    230517143221040: '52.776',
    230517143221041: '19.791'
  },
  {
    230517143221027: 'CA-2018-143259',
    230517143221030: 'PO-18865',
    230517143221032: 'Gear Head AU3700S Headset',
    230517143221023: 'Technology',
    230517143221034: 'Phones',
    230517143221037: 'East',
    230517143221024: 'New York City',
    230517143221029: '2018-12-30',
    230517143221042: '7',
    230517143221040: '90.93',
    230517143221041: '2.728'
  },
  {
    230517143221027: 'CA-2018-143259',
    230517143221030: 'PO-18865',
    230517143221032: 'Bush Westfield Collection Bookcases, Fully Assembled',
    230517143221023: 'Furniture',
    230517143221034: 'Bookcases',
    230517143221037: 'East',
    230517143221024: 'New York City',
    230517143221029: '2018-12-30',
    230517143221042: '4',
    230517143221040: '323.136',
    230517143221041: '12.118'
  },
  {
    230517143221027: 'CA-2018-126221',
    230517143221030: 'CC-12430',
    230517143221032: 'Eureka The Boss Plus 12-Amp Hard Box Upright Vacuum, Red',
    230517143221023: 'Office Supplies',
    230517143221034: 'Appliances',
    230517143221037: 'Central',
    230517143221024: 'Columbus',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '209.3',
    230517143221041: '56.511'
  },
  {
    230517143221027: 'US-2018-158526',
    230517143221030: 'KH-16360',
    230517143221032: 'Harbour Creations Steel Folding Chair',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '3',
    230517143221040: '258.75',
    230517143221041: '77.625'
  },
  {
    230517143221027: 'US-2018-158526',
    230517143221030: 'KH-16360',
    230517143221032: 'Global Leather and Oak Executive Chair, Black',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '1',
    230517143221040: '300.98',
    230517143221041: '87.284'
  },
  {
    230517143221027: 'US-2018-158526',
    230517143221030: 'KH-16360',
    230517143221032: 'Panasonic KP-350BK Electric Pencil Sharpener with Auto Stop',
    230517143221023: 'Office Supplies',
    230517143221034: 'Art',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '1',
    230517143221040: '34.58',
    230517143221041: '10.028'
  },
  {
    230517143221027: 'US-2018-158526',
    230517143221030: 'KH-16360',
    230517143221032: 'GBC ProClick Spines for 32-Hole Punch',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '1',
    230517143221040: '12.53',
    230517143221041: '5.889'
  },
  {
    230517143221027: 'US-2018-158526',
    230517143221030: 'KH-16360',
    230517143221032: 'DMI Arturo Collection Mission-style Design Wood Chair',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '8',
    230517143221040: '1207.84',
    230517143221041: '314.038'
  },
  {
    230517143221027: 'CA-2018-130631',
    230517143221030: 'BS-11755',
    230517143221032: 'Hand-Finished Solid Wood Document Frame',
    230517143221023: 'Furniture',
    230517143221034: 'Furnishings',
    230517143221037: 'West',
    230517143221024: 'Edmonds',
    230517143221029: '2018-12-29',
    230517143221042: '2',
    230517143221040: '68.46',
    230517143221041: '20.538'
  }
];

const columns = [
  {
    field: '230517143221027',
    title: 'Order ID',
    width: 'auto',
    sort: true
  },
  {
    field: '230517143221030',
    title: 'Customer ID',
    width: 'auto',
    sort: true
  },
  {
    field: '230517143221032',
    title: 'Product Name',
    width: 'auto'
  },
  {
    field: '230517143221023',
    title: 'Category',
    width: 'auto'
  },
  {
    field: '230517143221034',
    title: 'Sub-Category',
    width: 'auto'
  },
  {
    field: '230517143221037',
    title: 'Region',
    width: 'auto'
  },
  {
    field: '230517143221024',
    title: 'City',
    width: 'auto'
  },
  {
    field: '230517143221029',
    title: 'Order Date',
    width: 'auto'
  },
  {
    field: '230517143221042',
    title: 'Quantity',
    width: 'auto'
  },
  {
    field: '230517143221040',
    title: 'Sales',
    width: 'auto'
  },
  {
    field: '230517143221041',
    title: 'Profit',
    width: 'auto'
  }
];

const option = {
  records,
  columns,
  frozenColCount: 1,
  rightFrozenColCount: 1,
  frozenRowCount: 2,
  bottomFrozenRowCount: 1,
  widthMode: 'standard'
};

// 创建 VTable 实例
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```
