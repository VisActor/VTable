# Performance Optimization Guide for VTable

This comprehensive guide covers advanced performance optimization techniques for VTable, enabling you to handle millions of rows with smooth interactions.

## Overview

VTable is built with performance as a core principle, leveraging canvas-based rendering and virtual scrolling to handle massive datasets. This guide provides detailed strategies to maximize performance for your specific use case.

## Virtual Scrolling and Large Datasets

### Understanding Virtual Scrolling

VTable uses virtual scrolling to render only visible rows, dramatically reducing DOM elements and memory usage:

```javascript
import { ListTable } from '@visactor/vtable';

// Configuration for large datasets
const performantTable = new ListTable({
  container: document.getElementById('container'),
  columns: columns,
  records: largeDataset, // Can handle 100K+ records
  
  // Performance optimizations
  enabledTreeStick: false, // Disable tree sticking for better performance
  scrollSliderOption: {
    width: 14,
    scrollRailColor: 'rgba(100,100,100,0.2)',
    scrollSliderColor: 'rgba(100,100,100,0.5)'
  },
  
  // Virtual scrolling settings
  pixelRatio: window.devicePixelRatio || 1,
  renderMode: 'html', // or 'canvas' for maximum performance
  
  // Row height optimization
  defaultRowHeight: 40,
  defaultHeaderRowHeight: 50,
  
  // Column width optimization
  limitMaxAutoWidth: 450,
  minColumnWidth: 50,
  maxColumnWidth: 800
});
```

### Memory Management Strategies

#### 1. Data Pagination and Lazy Loading

```javascript
class DataManager {
  constructor() {
    this.pageSize = 1000;
    this.cache = new Map();
  }
  
  async loadPage(pageIndex) {
    if (this.cache.has(pageIndex)) {
      return this.cache.get(pageIndex);
    }
    
    const data = await this.fetchDataFromAPI(pageIndex, this.pageSize);
    this.cache.set(pageIndex, data);
    
    // Implement LRU cache eviction
    if (this.cache.size > 10) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    return data;
  }
  
  async fetchDataFromAPI(page, size) {
    const response = await fetch(`/api/data?page=${page}&size=${size}`);
    return response.json();
  }
}

// Integrate with VTable
const dataManager = new DataManager();
let currentPage = 0;

const table = new ListTable({
  container: document.getElementById('container'),
  columns: columns,
  records: await dataManager.loadPage(0),
  
  // Enable pagination
  pagination: {
    perPageSize: 1000,
    currentPage: 0,
    totalCount: 1000000 // Total records
  }
});

// Handle page changes
table.on('scroll', async (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event;
  const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
  
  if (scrollPercentage > 0.8) { // Load next page when 80% scrolled
    currentPage++;
    const newData = await dataManager.loadPage(currentPage);
    table.addRecords(newData);
  }
});
```

#### 2. Efficient Data Structures

```javascript
// Use efficient data structures for better performance
class OptimizedDataStore {
  constructor(rawData) {
    this.data = new Map();
    this.sortedIndices = [];
    this.filterCache = new Map();
    
    this.buildIndices(rawData);
  }
  
  buildIndices(rawData) {
    rawData.forEach((record, index) => {
      this.data.set(index, record);
      this.sortedIndices.push(index);
    });
  }
  
  // Efficient sorting without data copying
  sort(field, order = 'asc') {
    this.sortedIndices.sort((a, b) => {
      const valueA = this.data.get(a)[field];
      const valueB = this.data.get(b)[field];
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }
  
  // Efficient filtering with caching
  filter(predicate) {
    const cacheKey = predicate.toString();
    if (this.filterCache.has(cacheKey)) {
      return this.filterCache.get(cacheKey);
    }
    
    const filtered = this.sortedIndices.filter(index => 
      predicate(this.data.get(index))
    );
    
    this.filterCache.set(cacheKey, filtered);
    return filtered;
  }
  
  getRecords(start, end) {
    return this.sortedIndices
      .slice(start, end)
      .map(index => this.data.get(index));
  }
}
```

## Rendering Performance

### Canvas vs HTML Rendering

```javascript
// Canvas rendering for maximum performance
const canvasTable = new ListTable({
  container: document.getElementById('container'),
  columns: columns,
  records: data,
  
  // Canvas rendering configuration
  renderMode: 'canvas',
  pixelRatio: window.devicePixelRatio || 1,
  
  // Canvas-specific optimizations
  canvasOptions: {
    enableDirtyBounds: true, // Only redraw changed regions
    enableMultipleCanvas: true, // Use multiple canvases for better performance
    smoothScrolling: true,
    animationFrameThrottle: 16 // 60fps
  },
  
  // Disable expensive features for performance
  hover: {
    disableHover: true // Disable hover effects
  },
  
  select: {
    disableSelect: false,
    highlightMode: 'cell' // More efficient than 'row'
  }
});

// HTML rendering for better accessibility
const htmlTable = new ListTable({
  container: document.getElementById('container'),
  columns: columns,
  records: data,
  
  renderMode: 'html',
  
  // HTML-specific optimizations
  htmlOptions: {
    enableVirtualDOM: true,
    reuseElements: true,
    batchUpdates: true
  }
});
```

### Column Rendering Optimization

```javascript
const optimizedColumns = [
  {
    field: 'id',
    caption: 'ID',
    width: 80,
    // Simple text rendering - fastest
    cellType: 'text'
  },
  {
    field: 'name',
    caption: 'Name',
    width: 200,
    // Custom renderer with caching
    customRender: (args) => {
      const { value, table, row, col } = args;
      
      // Use render caching for expensive operations
      const cacheKey = `name_${row}_${col}_${value}`;
      if (table._renderCache && table._renderCache.has(cacheKey)) {
        return table._renderCache.get(cacheKey);
      }
      
      const result = `<span class="name-cell">${value}</span>`;
      
      if (!table._renderCache) {
        table._renderCache = new Map();
      }
      table._renderCache.set(cacheKey, result);
      
      return result;
    }
  },
  {
    field: 'status',
    caption: 'Status',
    width: 120,
    // Use built-in cell types when possible
    cellType: 'text',
    style: {
      // Pre-define styles to avoid runtime calculations
      bgColor: (args) => {
        switch (args.value) {
          case 'active': return '#e8f5e8';
          case 'inactive': return '#ffe8e8';
          default: return '#f5f5f5';
        }
      }
    }
  }
];
```

## Event Handling Optimization

### Efficient Event Management

```javascript
// Debounced event handling for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttled scroll handling
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const table = new ListTable({
  container: document.getElementById('container'),
  columns: columns,
  records: data
});

// Optimized event listeners
const debouncedResize = debounce(() => {
  table.updateSize();
}, 250);

const throttledScroll = throttle((event) => {
  // Handle scroll events efficiently
  console.log('Scroll position:', event.scrollTop);
}, 50);

// Use event delegation
table.on('scroll', throttledScroll);
window.addEventListener('resize', debouncedResize);

// Clean up event listeners
function cleanup() {
  window.removeEventListener('resize', debouncedResize);
  table.release(); // Proper cleanup
}
```

### Batch Operations

```javascript
// Efficient batch updates
class BatchUpdateManager {
  constructor(table) {
    this.table = table;
    this.pendingUpdates = [];
    this.updateTimer = null;
  }
  
  queueUpdate(operation) {
    this.pendingUpdates.push(operation);
    
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    
    this.updateTimer = setTimeout(() => {
      this.processBatch();
    }, 16); // Process at 60fps
  }
  
  processBatch() {
    if (this.pendingUpdates.length === 0) return;
    
    // Begin batch update
    this.table.beginUpdate();
    
    try {
      this.pendingUpdates.forEach(operation => {
        switch (operation.type) {
          case 'add':
            this.table.addRecord(operation.record);
            break;
          case 'update':
            this.table.updateRecord(operation.index, operation.record);
            break;
          case 'delete':
            this.table.deleteRecord(operation.index);
            break;
        }
      });
    } finally {
      // End batch update and trigger single re-render
      this.table.endUpdate();
      this.pendingUpdates = [];
    }
  }
}

// Usage
const batchManager = new BatchUpdateManager(table);

// Queue multiple updates
batchManager.queueUpdate({ type: 'add', record: newRecord1 });
batchManager.queueUpdate({ type: 'add', record: newRecord2 });
batchManager.queueUpdate({ type: 'update', index: 5, record: updatedRecord });
// All updates will be processed in a single batch
```

## Best Practices Summary

### Do's
- Use virtual scrolling for large datasets (>1000 rows)
- Implement proper data pagination and caching
- Use canvas rendering for maximum performance
- Debounce/throttle event handlers
- Batch DOM updates
- Clean up event listeners and references
- Monitor performance metrics

### Don'ts
- Don't load all data at once for large datasets
- Don't use complex custom renderers without caching
- Don't forget to call `table.release()` when destroying tables
- Don't bind event listeners inside render functions
- Don't perform expensive operations in scroll handlers
- Don't keep references to destroyed table instances

### Performance Checklist

- [ ] Virtual scrolling enabled for datasets >1000 rows
- [ ] Data pagination implemented
- [ ] Proper memory management in place
- [ ] Event handlers optimized with debouncing/throttling
- [ ] Canvas rendering enabled for maximum performance
- [ ] Batch updates implemented for multiple operations
- [ ] Performance monitoring in place
- [ ] Proper cleanup procedures implemented
- [ ] Memory leak prevention measures active
- [ ] Render caching for expensive operations

This comprehensive performance guide ensures your VTable implementation can handle enterprise-scale data with smooth, responsive interactions.