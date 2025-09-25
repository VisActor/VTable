# Data Filtering

VTable-Sheet provides powerful data filtering capabilities to help users quickly find the data they need. The filtering functionality supports multiple filtering modes, including filtering by value and by condition.

The filtering functionality is implemented using VTable's filter-plugin, which is included by default in vtable-sheet. For a tutorial on this plugin, please refer to: [filter-plugin](../plugin/filter).

If you want to modify the plugin configuration, please use the vtablePluginModules configuration option. For details, refer to: [vtablePluginModules](../sheet/plugin).

## Enabling Filtering

### Global Enabling

You can enable filtering in the worksheet configuration:

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Data Table',
      filter: true,  // Enable filtering for the entire sheet
      // ...other configurations
    }
  ]
});
```

### Enabling for Specific Columns

You can also enable filtering only for specific columns:

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Data Table',
      columns: [
        { title: 'Name', filter: true },  // Enable filtering only for the Name column
        { title: 'Age' },                // No filtering
        { title: 'Department', filter: true }   // Enable filtering only for the Department column
      ],
      // ...other configurations
    }
  ]
});
```

### Custom Filter Modes

By default, the filter panel supports both filtering by value and by condition.

You can specify which filtering modes to support:

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Data Table',
      // Only enable condition-based filtering
      filter: { filterModes: ['byCondition'] },
      // ...other configurations
    }
  ]
});
```

Supported filtering modes are:
- `'byValue'`: Value list-based filtering
- `'byCondition'`: Condition-based filtering

## Using Filtering

After enabling filtering, header cells will display a filter icon. Clicking the icon will open the filter menu, where users can choose filtering methods.

### Value List Filtering

Value list filtering displays all unique values in the column, and users can filter data by checking values:

<div style="display: flex; justify-content: center;  width:350px">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/byValue-fillter.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>


### Condition Filtering

Condition filtering allows users to set more complex filter conditions, such as "greater than", "contains", etc.:

<div style="display: flex; justify-content: center;  width:350px">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/byCondition-filter.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>

## Filter Event Listening
TODO
You can listen for filter state changes:

```typescript
// Listen for filter change events
sheetInstance.on('filterChange', (evt) => {
  console.log('Filter changed:', evt);
  console.log('Filtered column:', evt.columnKey);
  console.log('Filter condition:', evt.filter);
});

// Listen for filter reset events
sheetInstance.on('filterReset', () => {
  console.log('All filters have been reset');
});
```

## Complete Filtering Example

Here is a complete data filtering example:

```javascript livedemo template=vtable
// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// Container
const container = document.getElementById(CONTAINER_ID);
// Create product data table
const productData = [
  ['Product', 'Price', 'Stock', 'Sales', 'Rating'],
  ['Laptop', 5999, 120, 78, 4.5],
  ['Smartphone', 3999, 200, 156, 4.2],
  ['Tablet', 2599, 150, 92, 4.0],
  ['Headphones', 899, 300, 210, 4.7],
  ['Mouse', 129, 500, 310, 4.3],
  ['Keyboard', 239, 400, 180, 4.4],
  ['Monitor', 1299, 100, 60, 4.6],
  ['Webcam', 399, 200, 85, 3.9],
  ['Speakers', 599, 150, 75, 4.1],
  ['External HDD', 499, 250, 120, 4.2],
  ['Charger', 99, 600, 350, 4.0],
  ['Watch', 1999, 80, 45, 4.8],
  ['Router', 349, 180, 95, 4.3],
  ['Printer', 799, 70, 30, 4.0],
  ['Projector', 3499, 40, 15, 4.5]
];

// Initialize VTableSheet
const sheet = new VTableSheet.VTableSheet(container, {
  sheets: [
    {
      sheetTitle: "Product Data",
      sheetKey: "products",
      columns: [
        { title: 'Product', field: 'product' },
        { title: 'Price', field: 'price' },
        { title: 'Stock', field: 'stock' },
        { title: 'Sales', field: 'sales' },
        { title: 'Rating', field: 'rating' }
      ], 
      data: productData,
      filter: true  // Enable filtering
    }
  ]
});
window['sheetInstance'] = sheet;
```

With these filtering features, users can quickly filter out the data they need, improving the efficiency of data analysis and processing.