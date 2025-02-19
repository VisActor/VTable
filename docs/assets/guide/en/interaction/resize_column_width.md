# Column width and row height adjustment

In practical applications, data lengths in tables often vary, and columns with longer data may affect the layout of other columns. In order to better display the data, we need to adjust the column width and row height according to the data content. VTable provides a column width and row height adjustment function so that users can easily adjust the table column width and row height according to their needs.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090b.gif)

## Adjust column width and row height switch

We can turn on or off the column width adjustment function by setting `columnResizeMode`; turn on or off the row height adjustment function by setting `columnResizeMode`. This configuration item has the following optional values:

- 'all': The entire column, including the cells at the header and body, can adjust the column width or row height.
- 'none': disable column width or row height adjustment
- 'header': Column width or row height can only be adjusted in units at the header
- 'body': Column width or row height can only be adjusted in body cells

## Adjust column width limits

In actual projects, we may need to impose certain restrictions on the column width. Although the column width can be dragged, it cannot be infinitely reduced or enlarged. At this time, we can limit the minimum and maximum column width of each column by setting columns.minWidth and columns.maxWidth.

```
    columns: [
      {
        ...
        minWidth: '50px',
        maxWidth: '200px  },
      {
        ...
        minWidth: '100px',
        maxWidth: '300px'
      }
    ];
```

After setting, the column width will not exceed the set range when dragging and adjusting.

## Column width and row height adjustment scope

Configuration items (pivot table and perspective chart support):

```
  /**
   * The effective range of adjusting column width: 'column' | 'indicator' | 'all' | 'indicatorGroup', single column | by indicator | all columns | multiple indicators belonging to the same dimension value
   */
 columnResizeType?: 'column' | 'indicator' | 'all' | 'indicatorGroup';
 /**
   * The effective range of adjusting row height: 'row' | 'indicator' | 'all' | 'indicatorGroup', single row | by indicator | all rows | multiple indicators belonging to the same dimension value
   */
 rowResizeType?: 'row' | 'indicator' | 'all' | 'indicatorGroup';
```

- `column`/`row`: Default value, only adjusts the width of the current column/row;
- `indicator`: The column widths/row heights of the same indicator columns are adjusted together;
- `all`: The column widths/row heights of all columns are adjusted together;
- `indicatorGroup`: Indicator columns of the same group are adjusted together. For example, there are two indicators under the Northeast dimension value: sales and profit. When the column width of sales is adjusted, the profit column will also be adjusted;

## Column width adjustment scope configuration example

In the example below columnResizeType is set to all.

```javascript livedemo  template=vtable
const data = [
  {
    10002: '36004.12287902832',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '36004.12287902832',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1646.5089945793152',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1646.5089945793152',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Bookcases'
  },
  {
    10002: '10899.361869812012',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '10899.361869812012',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Bookcases'
  },
  {
    10002: '1339.4909970760345',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '1339.4909970760345',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Bookcases'
  },
  {
    10002: '24157.178108215332',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '24157.178108215332',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1997.9050402641296',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1997.9050402641296',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Bookcases'
  },
  {
    10002: '43819.33399963379',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '43819.33399963379',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1167.6339691877365',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1167.6339691877365',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Bookcases'
  },
  {
    10002: '101781.32774353027',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '101781.32774353027',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Chairs'
  },
  {
    10002: '4027.58094894886',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '4027.58094894886',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Chairs'
  },
  {
    10002: '45176.44617843628',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '45176.44617843628',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Chairs'
  },
  {
    10002: '6612.087041854858',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '6612.087041854858',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Chairs'
  },
  {
    10002: '85230.64583206177',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '85230.64583206177',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Chairs'
  },
  {
    10002: '6592.718985438347',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '6592.718985438347',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Chairs'
  },
  {
    10002: '96260.68257522583',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '96260.68257522583',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Chairs'
  },
  {
    10002: '9357.765951037407',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '9357.765951037407',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Chairs'
  },
  {
    10002: '30072.729959964752',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '30072.729959964752',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Furnishings'
  },
  {
    10002: '7641.274031370878',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '7641.274031370878',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Furnishings'
  },
  {
    10002: '17306.68389749527',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '17306.68389749527',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Furnishings'
  },
  {
    10002: '3442.686985105276',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '3442.686985105276',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Furnishings'
  },
  {
    10002: '15254.369949698448',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '15254.369949698448',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Furnishings'
  },
  {
    10002: '-3906.223020374775',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-3906.223020374775',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Furnishings'
  },
  {
    10002: '29071.379935264587',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '29071.379935264587',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Furnishings'
  },
  {
    10002: '5881.414980173111',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '5881.414980173111',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Furnishings'
  },
  {
    10002: '84754.5619468689',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '84754.5619468689',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Tables'
  },
  {
    10002: '1482.6120259165764',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '1482.6120259165764',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Tables'
  },
  {
    10002: '43916.19310760498',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '43916.19310760498',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Tables'
  },
  {
    10002: '-4623.056034088135',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-4623.056034088135',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Tables'
  },
  {
    10002: '39154.970703125',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '39154.970703125',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Tables'
  },
  {
    10002: '-3559.6519879102707',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-3559.6519879102707',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Tables'
  },
  {
    10002: '39139.806856155396',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '39139.806856155396',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Tables'
  },
  {
    10002: '-11025.375987529755',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-11025.375987529755',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Tables'
  },
  {
    10002: '30236.3359644413',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '30236.3359644413',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Appliances'
  },
  {
    10002: '8261.27197098732',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '8261.27197098732',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Appliances'
  },
  {
    10002: '19525.326094150543',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '19525.326094150543',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Appliances'
  },
  {
    10002: '4123.939019560814',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '4123.939019560814',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Appliances'
  },
  {
    10002: '23582.032926678658',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '23582.032926678658',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Appliances'
  },
  {
    10002: '-2638.6159623861313',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '-2638.6159623861313',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Appliances'
  },
  {
    10002: '34188.466317892075',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '34188.466317892075',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Appliances'
  },
  {
    10002: '8391.413984239101',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '8391.413984239101',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Appliances'
  },
  {
    10002: '9212.066044569016',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '9212.066044569016',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Art'
  },
  {
    10002: '2374.101003214717',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '2374.101003214717',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Art'
  },
  {
    10002: '4655.6219692230225',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4655.6219692230225',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Art'
  },
  {
    10002: '1058.5850008130074',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1058.5850008130074',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Art'
  },
  {
    10002: '5765.340019583702',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '5765.340019583702',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Art'
  },
  {
    10002: '1195.1630011796951',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1195.1630011796951',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Art'
  },
  {
    10002: '7485.764034986496',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '7485.764034986496',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Art'
  },
  {
    10002: '1899.942004531622',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1899.942004531622',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Art'
  },
  {
    10002: '55961.11282122135',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '55961.11282122135',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Binders'
  },
  {
    10002: '16096.799980849028',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '16096.799980849028',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Binders'
  },
  {
    10002: '37030.34099626541',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '37030.34099626541',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Binders'
  },
  {
    10002: '3900.6622482538223',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '3900.6622482538223',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Binders'
  },
  {
    10002: '56923.28208118677',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '56923.28208118677',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Binders'
  },
  {
    10002: '-1043.632896721363',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '-1043.632896721363',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Binders'
  },
  {
    10002: '53497.99653959274',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '53497.99653959274',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Binders'
  },
  {
    10002: '11267.932148218155',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '11267.932148218155',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Binders'
  },
  {
    10002: '4118.099995136261',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4118.099995136261',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1908.761996269226',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1908.761996269226',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Envelopes'
  },
  {
    10002: '3345.555993080139',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '3345.555993080139',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1465.4750101566315',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1465.4750101566315',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Envelopes'
  },
  {
    10002: '4636.871988296509',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4636.871988296509',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1777.5259877443314',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1777.5259877443314',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Envelopes'
  },
  {
    10002: '4375.874011039734',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4375.874011039734',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1812.4089943170547',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1812.4089943170547',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Envelopes'
  },
  {
    10002: '923.2159950733185',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '923.2159950733185',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Fasteners'
  },
  {
    10002: '275.19199895858765',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '275.19199895858765',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Fasteners'
  },
  {
    10002: '503.3160014152527',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '503.3160014152527',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Fasteners'
  },
  {
    10002: '173.71899946779013',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '173.71899946779013',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Fasteners'
  },
  {
    10002: '778.0299946069717',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '778.0299946069717',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Fasteners'
  },
  {
    10002: '236.6199992671609',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '236.6199992671609',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Fasteners'
  },
  {
    10002: '819.7179999351501',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '819.7179999351501',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Fasteners'
  },
  {
    10002: '263.98999811708927',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '263.98999811708927',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Fasteners'
  },
  {
    10002: '5078.726016759872',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '5078.726016759872',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Labels'
  },
  {
    10002: '2303.1279985904694',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '2303.1279985904694',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Labels'
  },
  {
    10002: '2353.179967880249',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2353.179967880249',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Labels'
  },
  {
    10002: '1040.771997153759',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1040.771997153759',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Labels'
  },
  {
    10002: '2451.4719779491425',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2451.4719779491425',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Labels'
  },
  {
    10002: '1073.0799936652184',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1073.0799936652184',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Labels'
  },
  {
    10002: '2602.934000492096',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2602.934000492096',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Labels'
  },
  {
    10002: '1129.2839995622635',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1129.2839995622635',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Labels'
  },
  {
    10002: '26663.717969417572',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '26663.717969417572',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Paper'
  },
  {
    10002: '12119.230026364326',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '12119.230026364326',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Paper'
  }
];
const option = {
  records: data,
  rowTree: [
    {
      dimensionKey: '230627170530016',
      value: 'Furniture',
      hierarchyState: 'expand',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Bookcases',
          hierarchyState: 'collapse'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Chairs',
          hierarchyState: 'collapse'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Furnishings'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Tables'
        }
      ]
    },
    {
      dimensionKey: '230627170530016',
      value: 'Office Supplies',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Appliances'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Art'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Binders'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Envelopes'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Fasteners'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Labels'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Paper'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Storage'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Supplies'
        }
      ]
    },
    {
      dimensionKey: '230627170530016',
      value: 'Technology',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Accessories'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Copiers'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Machines'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Phones'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: '230627170530059',
      value: 'West',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'South',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'Central',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'East',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    }
  ],
  rows: [
    {
      dimensionKey: '230627170530016',
      title: 'Catogery',
      width: 'auto'
    },
    {
      dimensionKey: '230627170530068',
      title: 'Sub-Catogery',
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: '230627170530059',
      title: 'Region',
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: '230627170530019',
      title: 'Sales',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: value => {
        if (value !== undefined) return '$' + Number(value).toFixed(2);
        return '';
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    },
    {
      indicatorKey: '230627170530022',
      title: 'Profit',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: value => {
        if (value) return '$' + Number(value).toFixed(2);
        return '';
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      textStick: true
    }
  },
  widthMode: 'standard',
  rowHierarchyIndent: 20,
  rowHierarchyTextStartAlignment: true,
  resize: {
    columnResizeType: 'all'
  }
};
const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
```

The same applies to the range of row height adjustment.

## Double-click automatic column width

When users are browsing data and find that the data is collapsed and want to view the complete data, they can expand the column width by content through double-click interaction.

But if the content is too long, you will find that the content is still omitted. This is because we have an internal default configuration of maximum column width `limitMaxAutoWidth: 450`, which limits the calculated maximum column width to 450. At this time, you can adjust this value to meet the needs. Or you can configure automatic row height to display rows (do not turn it on unless necessary, there is a certain performance overhead):

```
  heightMode:'autoHeight',
  autoWrapText:true,
```

## Adjust column width interaction effect configuration

When adjusting the column width and row height, we can customize the style of the column width mark line. In the `theme.columnResize` object, we can set the following configuration items:

- lineColor: the color of the line
- bgColor: background line color
- lineWidth: line width of the straight line
- width: width of background line
- resizeHotSpotSize: response Adjust the size of the interactive behavior hot zone in row height and column width

```javascript
{
    theme:
    {
        columnResize : {
            lineColor: 'blue',
            bgColor: 'red',
            lineWidth: 1,
            width: 5,
            resizeHotSpotSize: 8
        }
    }
}
```

In this way we can see an interaction effect similar to the following:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0d.png)

### Style example

Based on the above configuration, we can implement a simple VTable example showing how to adjust the column width:

```javascript livedemo  template=vtable
const myVTable = new VTable.ListTable(document.getElementById(CONTAINER_ID), {
  resize: {
    columnResizeMode: 'header'
  },
  columns: [
    {
      field: '订单 ID',
      title: '订单 ID',
      sort: true,
      width: 'auto'
    },
    {
      field: '邮寄方式',
      title: '邮寄方式'
    },
    {
      field: '类别',
      title: '类别'
    },
    {
      field: '子类别',
      title: '子类别'
    },
    {
      field: '销售额',
      title: '销售额'
    }
  ],
  records: [
    {
      '订单 ID': 'CN-2019-1973789',
      邮寄方式: '标准级',
      类别: '办公用品',
      子类别: '信封',
      销售额: '125.44'
    },
    {
      '订单 ID': 'CN-2019-1973789',
      邮寄方式: '标准级',
      类别: '办公用品',
      子类别: '装订机',
      销售额: '31.92'
    }
  ],
  theme: VTable.themes.BRIGHT.extends({
    columnResize: {
      lineColor: 'blue',
      bgColor: 'lightgray',
      lineWidth: 2,
      width: 10,
      resizeHotSpotSize: 8
    }
  })
});
```
