# VTable Types and Table Classes

VTable provides three main table types, each designed for different use cases and data visualization needs.

## ListTable

The `ListTable` is the most common table type, designed for displaying flat, tabular data in rows and columns.

### Basic Usage

```javascript
import { ListTable } from '@visactor/vtable';

const listTable = new ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'id', caption: 'ID', width: 100 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'value', caption: 'Value', width: 150 }
  ],
  records: [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 }
  ]
});
```

### Key Features

**Data Binding**
- Supports flat data structures
- Direct field mapping to columns
- Automatic data type detection

**Column Types**
- Text columns with formatting
- Number columns with alignment
- Date columns with custom formats
- Link columns for navigation
- Image columns for visual content
- Progress bar columns for metrics
- Chart columns for embedded visualizations

**Interactive Features**
- Row and cell selection
- Column sorting (single and multi-column)
- Row filtering
- Inline editing
- Resizable columns
- Frozen columns

### Advanced ListTable Configuration

```javascript
const advancedListTable = new ListTable({
  container: document.getElementById('container'),
  columns: [
    {
      field: 'employee',
      caption: 'Employee',
      width: 200,
      style: {
        fontWeight: 'bold',
        color: '#2c3e50'
      }
    },
    {
      field: 'progress',
      caption: 'Project Progress',
      width: 150,
      cellType: 'progressbar',
      style: {
        barColor: '#27ae60',
        barBgColor: '#ecf0f1'
      }
    },
    {
      field: 'chart',
      caption: 'Performance',
      width: 200,
      cellType: 'chart',
      chartSpec: {
        type: 'line',
        data: { values: [] }
      }
    }
  ],
  records: data,
  sortState: {
    field: 'employee',
    order: 'asc'
  },
  hover: {
    highlightMode: 'row'
  },
  select: {
    mode: 'row',
    headerSelectMode: true
  }
});
```

## PivotTable

The `PivotTable` is designed for multidimensional data analysis, allowing you to summarize and aggregate data across different dimensions.

### Basic Usage

```javascript
import { PivotTable } from '@visactor/vtable';

const pivotTable = new PivotTable({
  container: document.getElementById('container'),
  records: salesData,
  rows: ['region', 'category'],
  columns: ['quarter'],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Total Sales',
      width: 'auto',
      format: (rec) => '$' + Number(rec.sales).toLocaleString()
    },
    {
      indicatorKey: 'profit',
      caption: 'Profit',
      width: 'auto',
      style: {
        color: (args) => args.value > 0 ? 'green' : 'red'
      }
    }
  ]
});
```

### Key Concepts

**Dimensions**
- **Rows**: Fields that create row headers (categories for grouping data vertically)
- **Columns**: Fields that create column headers (categories for grouping data horizontally)
- **Indicators**: Numeric fields that are aggregated and displayed in cells

**Aggregation Functions**
- `SUM`: Total of all values
- `AVG`: Average of all values
- `COUNT`: Count of records
- `MAX`: Maximum value
- `MIN`: Minimum value
- Custom aggregation functions

### Advanced PivotTable Features

```javascript
const advancedPivotTable = new PivotTable({
  container: document.getElementById('container'),
  records: salesData,
  rows: [
    {
      dimensionKey: 'region',
      caption: 'Sales Region',
      width: 'auto',
      headerStyle: {
        bgColor: '#4472c4',
        color: 'white',
        fontWeight: 'bold'
      }
    },
    {
      dimensionKey: 'category',
      caption: 'Product Category',
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: 'quarter',
      caption: 'Quarter',
      width: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Revenue',
      width: 120,
      format: (rec) => '$' + Number(rec.sales).toLocaleString(),
      aggregation: 'SUM',
      style: {
        bgColor: (args) => {
          const value = Number(args.value);
          if (value > 1000000) return '#d4edda';
          if (value > 500000) return '#fff3cd';
          return '#f8d7da';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      bgColor: '#70ad47',
      color: 'white'
    }
  },
  dataConfig: {
    aggregationRules: [
      {
        indicatorKey: 'sales',
        field: 'sales',
        aggregationType: 'SUM'
      }
    ]
  }
});
```

**Interactive Features**
- Drill-down/drill-up functionality
- Dynamic dimension reordering
- Filter and sort by dimensions
- Expand/collapse hierarchies
- Export to various formats

## PivotChart

The `PivotChart` combines the analytical power of pivot tables with rich chart visualizations.

### Basic Usage

```javascript
import { PivotChart } from '@visactor/vtable';

const pivotChart = new PivotChart({
  container: document.getElementById('container'),
  records: salesData,
  rows: ['category'],
  columns: ['quarter'],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Sales Amount',
      width: 'auto'
    }
  ],
  indicatorsAsCol: false,
  corner: {
    titleOnDimension: 'row'
  }
});
```

### Chart Integration

**Built-in Chart Types**
- Bar charts
- Line charts
- Area charts
- Pie charts
- Scatter plots
- Custom chart types

**Chart Configuration**
```javascript
const pivotChart = new PivotChart({
  // ... other options
  defaultHeaderRowHeight: 50,
  defaultRowHeight: 200, // Accommodate chart height
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Monthly Sales',
      width: 300,
      chartSpec: {
        type: 'bar',
        data: {
          id: 'data'
        },
        xField: 'month',
        yField: 'sales',
        seriesField: 'category',
        color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
        bar: {
          cornerRadius: 4
        },
        axes: [
          {
            orient: 'bottom',
            type: 'band'
          },
          {
            orient: 'left',
            type: 'linear'
          }
        ]
      }
    }
  ]
});
```

### Advanced Chart Features

**Interactive Charts**
- Hover tooltips
- Click events
- Zoom and pan
- Brush selection
- Animation effects

**Dynamic Data Binding**
```javascript
// Chart data updates automatically with pivot data
pivotChart.on('pivot_sort_click', (args) => {
  console.log('Pivot sorted, charts will update automatically');
});

pivotChart.on('drill_menu_click', (args) => {
  console.log('Drill down performed, chart data refreshed');
});
```

## Choosing the Right Table Type

### Use ListTable When:
- Displaying flat, tabular data
- Need simple sorting and filtering
- Working with records that don't require aggregation
- Building dashboards with detailed views
- Creating data entry forms

### Use PivotTable When:
- Analyzing multidimensional data
- Need to aggregate and summarize information
- Creating business intelligence reports
- Comparing data across different categories
- Building analytical dashboards

### Use PivotChart When:
- Combining tabular analysis with visual representation
- Need both detailed data and trend visualization
- Creating executive dashboards
- Presenting data to non-technical stakeholders
- Building interactive data exploration tools

## Migration Between Table Types

### Converting ListTable to PivotTable

```javascript
// From ListTable
const listTable = new ListTable({
  records: salesData,
  columns: [
    { field: 'region', caption: 'Region' },
    { field: 'sales', caption: 'Sales' }
  ]
});

// To PivotTable
const pivotTable = new PivotTable({
  records: salesData,
  rows: ['region'],
  indicators: [
    { indicatorKey: 'sales', caption: 'Total Sales' }
  ]
});
```

### Sharing Configuration Between Types

```javascript
// Common configuration
const commonConfig = {
  container: document.getElementById('container'),
  records: data,
  theme: 'ARCO',
  hover: { highlightMode: 'row' },
  select: { mode: 'cell' }
};

// Apply to different table types
const listTable = new ListTable({
  ...commonConfig,
  columns: listColumns
});

const pivotTable = new PivotTable({
  ...commonConfig,
  rows: ['dimension1'],
  indicators: pivotIndicators
});
```

## Performance Considerations

### ListTable Performance
- Virtual scrolling for large datasets
- Lazy loading for remote data
- Column virtualization for wide tables

### PivotTable Performance
- Data aggregation optimization
- Hierarchical data caching
- Progressive loading for large dimensions

### PivotChart Performance
- Chart rendering optimization
- Data sampling for large datasets
- Efficient chart updates during interaction

Each table type is optimized for its specific use case, ensuring optimal performance across different scenarios.