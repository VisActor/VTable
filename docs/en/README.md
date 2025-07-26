# VTable English Documentation

Welcome to the comprehensive English documentation for VTable - a high-performance multidimensional data analysis table and grid artist.

## 🚀 Quick Start Guide

### Installation

```bash
# Using npm
npm install @visactor/vtable

# Using yarn  
yarn add @visactor/vtable

# Using pnpm
pnpm add @visactor/vtable
```

### Basic Usage

```javascript
import * as VTable from '@visactor/vtable';

const columns = [
  { field: 'id', caption: 'ID', width: 100 },
  { field: 'name', caption: 'Name', width: 150 },
  { field: 'email', caption: 'Email', width: 200 },
  { field: 'status', caption: 'Status', width: 120 }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
];

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  columns: columns,
  records: data
});
```

## 📚 Documentation Structure

### Core Concepts
- [Table Types](./core/table-types.md) - ListTable, PivotTable, PivotChart
- [Data Handling](./core/data-handling.md) - Data sources, records, and processing
- [Column Configuration](./core/columns.md) - Column types, styling, and behavior
- [Styling & Themes](./core/styling.md) - Themes, custom styles, and visual design

### Advanced Features
- [Performance Optimization](./advanced/performance.md) - Large datasets, virtualization
- [Interactive Features](./advanced/interactions.md) - Sorting, filtering, editing
- [Custom Rendering](./advanced/custom-rendering.md) - Custom cells, layouts, graphics
- [Event Handling](./advanced/events.md) - User interactions and callbacks

### Integration Guides
- [React Integration](./integration/react.md) - Using VTable with React
- [Vue Integration](./integration/vue.md) - Using VTable with Vue.js
- [Angular Integration](./integration/angular.md) - Using VTable with Angular

### API Reference
- [ListTable API](./api/list-table.md) - Complete ListTable reference
- [PivotTable API](./api/pivot-table.md) - Complete PivotTable reference
- [PivotChart API](./api/pivot-chart.md) - Complete PivotChart reference
- [Types & Interfaces](./api/types.md) - TypeScript definitions

### Examples & Tutorials
- [Basic Examples](./examples/basic.md) - Simple table setups
- [Advanced Examples](./examples/advanced.md) - Complex configurations
- [Real-world Use Cases](./examples/use-cases.md) - Practical applications
- [Performance Demos](./examples/performance.md) - Large dataset examples

## 🎯 Key Features

### High Performance
- **Virtual Scrolling**: Handle millions of rows smoothly
- **Optimized Rendering**: Canvas-based rendering for speed
- **Memory Efficient**: Smart data loading and caching

### Rich Visualization
- **Multiple Table Types**: List, Pivot, and Chart tables
- **Custom Themes**: Built-in and custom styling options
- **Interactive Elements**: Progress bars, charts, custom graphics

### Developer Experience
- **TypeScript Support**: Full type definitions included
- **Framework Integration**: React, Vue, Angular components
- **Extensive API**: Comprehensive configuration options

### Data Features
- **Multiple Data Sources**: Arrays, objects, APIs, databases
- **Real-time Updates**: Live data synchronization
- **Data Processing**: Aggregation, filtering, sorting

## 🛠️ Getting Help

- **Interactive Examples**: See [english-demo](../../english-demo/index.html)
- **API Documentation**: Browse the [API reference](./api/)
- **GitHub Issues**: Report bugs and request features
- **Community**: Join discussions and get support

## 🔗 Quick Links

- [Getting Started Guide](./getting-started.md)
- [API Reference](./api/)
- [Examples Collection](./examples/)
- [Migration Guide](./migration.md)
- [FAQ](./faq.md)