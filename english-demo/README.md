# VTable English Examples Directory

This directory contains comprehensive English documentation and examples for VTable, designed to help developers quickly understand and implement the library's features.

## 📁 Directory Structure

```
english-demo/
├── index.html                    # Main comprehensive demo (requires internet for VTable library)
├── offline-demo.html            # Offline demo with HTML/CSS examples 
├── README.md                    # This documentation file
└── examples/
    ├── color-themes.html        # Advanced color theming and styling
    ├── interactive-behavior.html # User interaction features
    └── performance-advanced.html # Large datasets and advanced features
```

## 🚀 Quick Start

1. **For GitHub Pages deployment**: The `offline-demo.html` works without external dependencies
2. **For full interactive examples**: Use `index.html` (requires internet connection for VTable library)
3. **For specialized features**: Check individual files in the `examples/` folder

## 📊 What's Included

### Main Demo Features
- **Basic Tables**: Simple list tables and pivot tables
- **Styling & Theming**: Custom colors, conditional formatting, complete themes
- **Interactive Features**: Sorting, filtering, selection, editing
- **Advanced Features**: Progress bars, charts, responsive design
- **Performance**: Large dataset handling and optimization
- **Event Handling**: Comprehensive interaction examples

### Specialized Examples
- **Color Themes**: Interactive theme switcher with 6+ predefined themes
- **Interactive Behavior**: Advanced user interactions, editing, keyboard navigation
- **Performance**: Large dataset demos (1K-100K+ records), real-time updates

## 🎯 Use Cases Covered

1. **Data Dashboards** - Business metrics and KPI displays
2. **Admin Panels** - Content management with CRUD operations  
3. **Financial Reports** - Conditional formatting for financial data
4. **E-commerce** - Product catalogs with rich formatting
5. **Analytics** - Data analysis with pivot tables and charts

## 🛠️ Technical Features Demonstrated

- Canvas-based high-performance rendering
- Virtual scrolling for large datasets
- Responsive design patterns
- Custom cell types and renderers
- Theme system and styling API
- Event handling and user interactions
- Data formatting and validation
- Export and data manipulation

## 🌐 GitHub Pages Ready

All examples are designed to work on GitHub Pages:
- `offline-demo.html` - No external dependencies
- Other files - Require CDN access to VTable library

## 🔧 Customization Guide

### Colors and Styling
```javascript
// Example: Custom color scheme
const customTheme = {
    headerStyle: {
        bgColor: '#4a90e2',
        color: '#ffffff',
        fontWeight: 'bold'
    },
    bodyStyle: {
        hover: {
            bgColor: '#e6f3ff'
        }
    }
};
```

### Conditional Formatting
```javascript
// Example: Highlight high values
style: {
    bgColor(args) {
        const { dataValue } = args;
        return dataValue > 80000 ? '#d4edda' : '#ffffff';
    }
}
```

### Event Handling
```javascript
// Example: Handle cell clicks
table.on('click_cell', (args) => {
    console.log('Clicked:', args.row, args.col, args.value);
});
```

## 🌟 Key Features

- **⚡ High Performance**: Canvas-based rendering for millions of rows
- **📊 Pivot Tables**: Built-in data analysis capabilities  
- **🎨 Rich Styling**: Extensive customization options
- **📱 Responsive**: Works on all device sizes
- **🔄 Interactive**: Sorting, filtering, editing, selection
- **📈 Charts**: Integrated visualization support
- **🎯 TypeScript**: Full type support for development

## 🛠️ Getting Started

### Installation
```bash
npm install @visactor/vtable
# or
yarn add @visactor/vtable
```

### Basic Usage
```javascript
import * as VTable from '@visactor/vtable';

const option = {
    container: document.getElementById('table'),
    records: yourData,
    columns: [
        { field: 'name', title: 'Name', width: 150 },
        { field: 'age', title: 'Age', width: 80 },
        { field: 'city', title: 'City', width: 120 }
    ]
};

const table = new VTable.ListTable(option);
```

## 📖 Code Examples

Each demo includes complete, copy-paste ready code examples showing:
- Basic configuration
- Advanced customization
- Event handling
- Performance optimization
- Best practices

## 🔗 Links to Official Resources

- [VTable GitHub](https://github.com/VisActor/VTable)
- [Official Documentation](https://visactor.io/vtable)
- [API Reference](https://visactor.io/vtable/option/ListTable)
- [Live Examples](https://visactor.io/vtable/example)

## 🤝 Contributing

This documentation is part of the VTable project. Contributions are welcome!

## 📄 License

MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Note**: This documentation significantly improves the English language support for VTable with practical, real-world examples that developers can immediately use and customize for their projects.