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

## 📖 Documentation Structure

### Core Concepts
- **[Getting Started](getting-started.md)** - Installation, setup, and your first table
- **[Table Types](core/table-types.md)** - ListTable, PivotTable, and PivotChart
- **[Data Handling](core/data-handling.md)** - Data binding, validation, and manipulation

### Advanced Topics
- **[Performance Optimization](advanced/performance-optimization.md)** - Virtual scrolling, memory management, and large dataset handling
- **[Custom Styling & Themes](advanced/styling-themes.md)** - Advanced theming, custom renderers, and styling techniques
- **[Event System](advanced/event-system.md)** - Comprehensive event handling and custom interactions

### Framework Integrations
- **[React Integration](integrations/react-integration.md)** - Complete React patterns, hooks, and best practices
- **[Vue Integration](integrations/vue-integration.md)** - Vue 2/3 setup, Composition API, and Vuex integration
- **[Angular Integration](integrations/angular-integration.md)** - Angular services, components, and TypeScript patterns

### Troubleshooting & Support
- **[Debugging Guide](troubleshooting/debugging-guide.md)** - Common issues, debugging techniques, and solutions
- **[Migration Guide](troubleshooting/migration-guide.md)** - Upgrading between versions
- **[FAQ](faq.md)** - Frequently asked questions and solutions

### Examples & Use Cases
- **[Basic Examples](examples/basic-examples.md)** - Simple table configurations and common patterns
- **[Enterprise Examples](examples/enterprise-examples.md)** - Complex business scenarios and advanced implementations
- **[Interactive Demos](examples/interactive-demos.md)** - Live examples with full source code

## 🎯 Quick Navigation

| Topic | Description | Difficulty |
|-------|-------------|------------|
| [Getting Started](getting-started.md) | Basic setup and first table | Beginner |
| [ListTable Basics](core/table-types.md#listtable) | Standard data tables | Beginner |
| [PivotTable Guide](core/table-types.md#pivottable) | Multidimensional analysis | Intermediate |
| [Performance Tips](advanced/performance-optimization.md) | Large dataset handling | Advanced |  
| [React Patterns](integrations/react-integration.md) | React-specific implementations | Intermediate |
| [Custom Themes](advanced/styling-themes.md) | Styling and branding | Intermediate |
| [Debugging Help](troubleshooting/debugging-guide.md) | Problem solving | All Levels |

## 🔧 API Reference

For complete API documentation, see:
- **[Complete API Reference](../llms.txt)** - Comprehensive API documentation for language models
- **[TypeScript Definitions](https://github.com/VisActor/VTable/tree/main/packages/vtable/types)** - Full TypeScript type definitions

## 🌟 Features Highlight

- **High Performance**: Handle millions of rows with virtual scrolling
- **Rich Interactions**: Sorting, filtering, editing, and selection
- **Flexible Styling**: Themes, custom renderers, and responsive design
- **Framework Ready**: React, Vue, Angular, and vanilla JavaScript support
- **Enterprise Features**: Export, import, validation, and accessibility
- **Extensible**: Plugin architecture and custom components

## 💡 Examples Gallery

Check out our interactive examples:
- [Basic Data Table](../english-demo/index.html) - Simple employee data table
- [Financial Dashboard](../english-demo/examples/financial-dashboard.html) - Real-time financial data
- [E-commerce Catalog](../english-demo/examples/ecommerce-catalog.html) - Product management interface
- [Project Management](../english-demo/examples/project-management.html) - Task tracking and progress

## 🚀 Getting Help

- **[GitHub Issues](https://github.com/VisActor/VTable/issues)** - Bug reports and feature requests
- **[Discussions](https://github.com/VisActor/VTable/discussions)** - Community help and questions
- **[Examples](https://github.com/VisActor/VTable/tree/main/packages/vtable/examples)** - Official code examples
- **[VisActor Website](https://www.visactor.io/vtable)** - Official documentation and guides

## 📊 Supported Table Types

### ListTable
Perfect for displaying flat, tabular data with advanced features like sorting, filtering, and editing.

### PivotTable  
Ideal for multidimensional data analysis with hierarchical grouping and aggregations.

### PivotChart
Combines the power of PivotTable with integrated chart visualizations for comprehensive data insights.

---

*This documentation is continuously updated. For the latest information, visit our [GitHub repository](https://github.com/VisActor/VTable).*

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