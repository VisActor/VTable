# VTable Troubleshooting and Debugging Guide

This comprehensive guide helps you diagnose and resolve common issues when working with VTable, providing solutions for performance problems, rendering issues, data handling, and integration challenges.

## Common Issues and Solutions

### 1. Rendering and Display Issues

#### Table Not Rendering

**Problem**: Table container is empty or shows no content.

**Causes and Solutions**:

```javascript
// ❌ Problem: Missing container height
const table = new ListTable({
  container: document.getElementById('container'), // Container has height: 0
  columns: columns,
  records: data
});

// ✅ Solution: Ensure container has explicit height
const container = document.getElementById('container');
container.style.height = '600px'; // Or use CSS

const table = new ListTable({
  container: container,
  columns: columns,
  records: data
});
```

```css
/* ✅ CSS Solution */
#container {
  width: 100%;
  height: 600px; /* Explicit height required */
}
```

#### Columns Not Displaying Correctly

**Problem**: Columns are missing, overlapping, or have incorrect widths.

```javascript
// ❌ Problem: Missing required column properties
const columns = [
  { field: 'name' }, // Missing caption and width
  { caption: 'Email' }, // Missing field
];

// ✅ Solution: Provide all required properties
const columns = [
  { field: 'name', caption: 'Name', width: 150 },
  { field: 'email', caption: 'Email', width: 200 },
];

// ✅ Auto-width solution
const columns = [
  { field: 'name', caption: 'Name', minWidth: 100 },
  { field: 'email', caption: 'Email', minWidth: 150 },
];
```

#### Canvas Rendering Issues

**Problem**: Blurry text or pixelated rendering on high-DPI screens.

```javascript
// ❌ Problem: Not accounting for device pixel ratio
const table = new ListTable({
  container: container,
  columns: columns,
  records: data,
  renderMode: 'canvas'
});

// ✅ Solution: Set proper pixel ratio
const table = new ListTable({
  container: container,
  columns: columns,
  records: data,
  renderMode: 'canvas',
  pixelRatio: window.devicePixelRatio || 1
});
```

### 2. Data Handling Issues

#### Data Not Updating

**Problem**: Table doesn't reflect data changes after modifying the records array.

```javascript
// ❌ Problem: Modifying data without notifying table
data.push(newRecord);
data[0].name = 'Updated Name';

// ✅ Solution 1: Use table methods
table.addRecord(newRecord);
table.updateRecord(0, { name: 'Updated Name' });

// ✅ Solution 2: Replace entire dataset
const newData = [...data, newRecord];
table.updateOption({ records: newData });
```

#### Sorting and Filtering Not Working

**Problem**: Built-in sorting/filtering doesn't work as expected.

```javascript
// ❌ Problem: Data format incompatible with sorting
const data = [
  { id: '10', value: '100' }, // Strings instead of numbers
  { id: '2', value: '20' }
];

// ✅ Solution: Ensure correct data types
const data = [
  { id: 10, value: 100 },
  { id: 2, value: 20 }
];

// ✅ Custom sort function for mixed types
const columns = [
  {
    field: 'id',
    caption: 'ID',
    sort: (a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    }
  }
];
```

#### Large Dataset Performance Issues

**Problem**: Table becomes slow or unresponsive with large datasets.

```javascript
// ❌ Problem: Loading all data at once
const table = new ListTable({
  container: container,
  columns: columns,
  records: millionRecords // Too much data
});

// ✅ Solution: Implement pagination
const ITEMS_PER_PAGE = 1000;
let currentPage = 0;

const table = new ListTable({
  container: container,
  columns: columns,
  records: millionRecords.slice(0, ITEMS_PER_PAGE),
  
  // Enable virtual scrolling
  scrollMode: 'virtual',
  estimatedRowHeight: 40
});

// Load more data on scroll
table.on('scroll', (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e;
  const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
  
  if (scrollPercentage > 0.9) {
    const nextPage = currentPage + 1;
    const start = nextPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const nextData = millionRecords.slice(start, end);
    
    if (nextData.length > 0) {
      table.addRecords(nextData);
      currentPage = nextPage;
    }
  }
});
```

### 3. Event Handling Issues

#### Events Not Firing

**Problem**: Event listeners don't trigger or receive unexpected data.

```javascript
// ❌ Problem: Incorrect event names or timing
const table = new ListTable({
  container: container,
  columns: columns,
  records: data
});

// Event listener added before table is ready
table.on('click_cell', (event) => {
  console.log(event); // May not fire
});

// ✅ Solution: Use correct event names and timing
table.on('ready', () => {
  table.on('click_cell', (event) => {
    console.log('Cell clicked:', event);
  });
  
  table.on('after_cell_edit', (event) => {
    console.log('Cell edited:', event);
  });
});
```

#### Memory Leaks from Event Listeners

**Problem**: Event listeners not properly cleaned up.

```javascript
// ❌ Problem: No cleanup
function createTable() {
  const table = new ListTable(config);
  
  table.on('click_cell', handler);
  // No cleanup when table is destroyed
}

// ✅ Solution: Proper cleanup
class TableManager {
  constructor(config) {
    this.table = new ListTable(config);
    this.handlers = new Map();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const clickHandler = (event) => console.log('Click:', event);
    const editHandler = (event) => console.log('Edit:', event);
    
    this.table.on('click_cell', clickHandler);
    this.table.on('after_cell_edit', editHandler);
    
    // Store handlers for cleanup
    this.handlers.set('click_cell', clickHandler);
    this.handlers.set('after_cell_edit', editHandler);
  }
  
  destroy() {
    // Remove all event listeners
    this.handlers.forEach((handler, event) => {
      this.table.off(event, handler);
    });
    
    // Release table resources
    this.table.release();
    
    // Clear references
    this.handlers.clear();
    this.table = null;
  }
}
```

### 4. Styling and Theme Issues

#### Custom Styles Not Applied

**Problem**: CSS styles don't affect table appearance.

```css
/* ❌ Problem: Styles not specific enough */
.table-cell {
  background-color: red; /* Won't work */
}

/* ✅ Solution: Use proper selectors */
.vtable .vtable-cell {
  background-color: red;
}

/* ✅ Or use !important (last resort) */
.custom-table .vtable-cell {
  background-color: red !important;
}
```

```javascript
// ✅ Solution: Use table's built-in styling options
const table = new ListTable({
  container: container,
  columns: columns,
  records: data,
  
  theme: {
    defaultStyle: {
      bgColor: '#ffffff',
      color: '#333333'
    },
    headerStyle: {
      bgColor: '#f5f5f5',
      color: '#333333',
      fontWeight: 'bold'
    }
  }
});
```

#### Theme Not Loading

**Problem**: Custom theme configuration doesn't take effect.

```javascript
// ❌ Problem: Incorrect theme structure
const theme = {
  colors: {
    primary: '#007bff' // Wrong structure
  }
};

// ✅ Solution: Use correct theme structure
const theme = {
  defaultStyle: {
    bgColor: '#ffffff',
    color: '#333333',
    borderColor: '#e0e0e0'
  },
  headerStyle: {
    bgColor: '#f8f9fa',
    color: '#495057',
    fontWeight: 'bold'
  },
  bodyStyle: {
    bgColor: '#ffffff',
    color: '#495057'
  },
  frameStyle: {
    borderColor: '#dee2e6',
    borderWidth: 1
  }
};

const table = new ListTable({
  container: container,
  columns: columns,
  records: data,
  theme: theme
});
```

### 5. Integration Issues

#### React Integration Problems

**Problem**: Table not updating when React state changes.

```jsx
// ❌ Problem: Props not properly watched
function MyTable({ data, columns }) {
  const tableRef = useRef();
  
  // Table doesn't update when data changes
  useEffect(() => {
    const table = new ListTable({
      container: tableRef.current,
      columns: columns,
      records: data
    });
  }, []); // Empty dependency array
  
  return <div ref={tableRef} />;
}

// ✅ Solution: Watch props and update table
function MyTable({ data, columns }) {
  const tableRef = useRef();
  const tableInstanceRef = useRef();
  
  // Create table once
  useEffect(() => {
    tableInstanceRef.current = new ListTable({
      container: tableRef.current,
      columns: columns,
      records: data
    });
    
    return () => {
      if (tableInstanceRef.current) {
        tableInstanceRef.current.release();
      }
    };
  }, []);
  
  // Update data when props change
  useEffect(() => {
    if (tableInstanceRef.current) {
      tableInstanceRef.current.updateOption({ records: data });
    }
  }, [data]);
  
  // Update columns when they change
  useEffect(() => {
    if (tableInstanceRef.current) {
      tableInstanceRef.current.updateOption({ columns: columns });
    }
  }, [columns]);
  
  return <div ref={tableRef} style={{ height: '600px' }} />;
}
```

#### Vue Integration Problems

**Problem**: Reactivity not working with VTable.

```vue
<!-- ❌ Problem: Direct mutation not detected -->
<template>
  <div>
    <button @click="updateData">Update</button>
    <VTable :records="data" :columns="columns" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [{ id: 1, name: 'John' }],
      columns: [{ field: 'id' }, { field: 'name' }]
    };
  },
  methods: {
    updateData() {
      // This won't trigger reactivity
      this.data[0].name = 'Jane';
    }
  }
};
</script>
```

```vue
<!-- ✅ Solution: Use Vue's reactivity correctly -->
<template>
  <div>
    <button @click="updateData">Update</button>
    <VTable :records="data" :columns="columns" />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      data: [{ id: 1, name: 'John' }],
      columns: [{ field: 'id' }, { field: 'name' }]
    };
  },
  methods: {
    updateData() {
      // Vue 2: Use Vue.set or replace array
      Vue.set(this.data[0], 'name', 'Jane');
      // Or: this.data = [...this.data];
      
      // Vue 3: Direct mutation works
      // this.data[0].name = 'Jane';
    }
  }
};
</script>
```

## Debugging Techniques

### 1. Enable Debug Mode

```javascript
// Enable debug logging
const table = new ListTable({
  container: container,
  columns: columns,
  records: data,
  
  // Enable debug mode
  debug: true,
  
  // Custom logging
  logLevel: 'debug' // 'error', 'warn', 'info', 'debug'
});

// Access debug information
console.log('Table state:', table.getTableState());
console.log('Render info:', table.getRenderInfo());
```

### 2. Performance Monitoring

```javascript
class PerformanceDebugger {
  constructor(table) {
    this.table = table;
    this.metrics = {
      renderTimes: [],
      eventTimes: [],
      dataUpdateTimes: []
    };
    
    this.setupMonitoring();
  }
  
  setupMonitoring() {
    // Monitor render performance
    const originalRender = this.table.render;
    this.table.render = (...args) => {
      const start = performance.now();
      const result = originalRender.apply(this.table, args);
      const duration = performance.now() - start;
      
      this.metrics.renderTimes.push(duration);
      if (duration > 16) { // > 60fps
        console.warn(`Slow render: ${duration}ms`);
      }
      
      return result;
    };
    
    // Monitor event handling
    const originalOn = this.table.on;
    this.table.on = (event, handler) => {
      const wrappedHandler = (...args) => {
        const start = performance.now();
        const result = handler.apply(this, args);
        const duration = performance.now() - start;
        
        this.metrics.eventTimes.push({ event, duration });
        if (duration > 10) {
          console.warn(`Slow event handler for ${event}: ${duration}ms`);
        }
        
        return result;
      };
      
      return originalOn.call(this.table, event, wrappedHandler);
    };
  }
  
  getReport() {
    const avgRenderTime = this.getAverage(this.metrics.renderTimes);
    const slowEvents = this.metrics.eventTimes.filter(e => e.duration > 10);
    
    return {
      averageRenderTime: avgRenderTime,
      slowRenders: this.metrics.renderTimes.filter(t => t > 16).length,
      slowEvents: slowEvents,
      recommendations: this.getRecommendations(avgRenderTime, slowEvents)
    };
  }
  
  getAverage(array) {
    return array.length > 0 ? array.reduce((a, b) => a + b) / array.length : 0;
  }
  
  getRecommendations(avgRenderTime, slowEvents) {
    const recommendations = [];
    
    if (avgRenderTime > 16) {
      recommendations.push('Consider using canvas rendering mode');
      recommendations.push('Reduce column complexity or use virtual scrolling');
    }
    
    if (slowEvents.length > 0) {
      recommendations.push('Optimize event handlers - consider debouncing');
    }
    
    return recommendations;
  }
}

// Usage
const debugger = new PerformanceDebugger(table);

// Get performance report
setTimeout(() => {
  console.log('Performance Report:', debugger.getReport());
}, 10000);
```

### 3. Data Validation

```javascript
class DataValidator {
  static validateColumns(columns) {
    const errors = [];
    const fields = new Set();
    
    columns.forEach((column, index) => {
      // Check required properties
      if (!column.field) {
        errors.push(`Column ${index}: Missing 'field' property`);
      }
      
      if (!column.caption) {
        errors.push(`Column ${index}: Missing 'caption' property`);
      }
      
      // Check for duplicate fields
      if (column.field && fields.has(column.field)) {
        errors.push(`Column ${index}: Duplicate field '${column.field}'`);
      }
      fields.add(column.field);
      
      // Check width
      if (column.width && (column.width < 0 || column.width > 2000)) {
        errors.push(`Column ${index}: Invalid width ${column.width}`);
      }
    });
    
    return errors;
  }
  
  static validateData(data, columns) {
    const errors = [];
    const columnFields = columns.map(col => col.field);
    
    data.forEach((record, index) => {
      // Check if record is object
      if (typeof record !== 'object' || record === null) {
        errors.push(`Record ${index}: Must be an object`);
        return;
      }
      
      // Check for missing fields
      columnFields.forEach(field => {
        if (!(field in record)) {
          errors.push(`Record ${index}: Missing field '${field}'`);
        }
      });
      
      // Check data types (if specified in columns)
      columns.forEach(column => {
        if (column.dataType && record[column.field] !== undefined) {
          const value = record[column.field];
          
          switch (column.dataType) {
            case 'number':
              if (typeof value !== 'number') {
                errors.push(`Record ${index}: Field '${column.field}' should be number, got ${typeof value}`);
              }
              break;
            case 'string':
              if (typeof value !== 'string') {
                errors.push(`Record ${index}: Field '${column.field}' should be string, got ${typeof value}`);
              }
              break;
            case 'date':
              if (!(value instanceof Date) && !Date.parse(value)) {
                errors.push(`Record ${index}: Field '${column.field}' should be valid date`);
              }
              break;
          }
        }
      });
    });
    
    return errors;
  }
  
  static validate(columns, data) {
    const columnErrors = this.validateColumns(columns);
    const dataErrors = this.validateData(data, columns);
    
    return {
      isValid: columnErrors.length === 0 && dataErrors.length === 0,
      columnErrors,
      dataErrors,
      allErrors: [...columnErrors, ...dataErrors]
    };
  }
}

// Usage
const validation = DataValidator.validate(columns, data);
if (!validation.isValid) {
  console.error('Data validation failed:', validation.allErrors);
}
```

### 4. Browser Compatibility Debugging

```javascript
class CompatibilityChecker {
  static checkBrowserSupport() {
    const support = {
      canvas: !!document.createElement('canvas').getContext,
      es6: typeof Symbol !== 'undefined',
      requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
      devicePixelRatio: typeof window.devicePixelRatio !== 'undefined',
      flexbox: this.supportsFlexbox(),
      intersectionObserver: 'IntersectionObserver' in window
    };
    
    const unsupported = Object.keys(support).filter(key => !support[key]);
    
    if (unsupported.length > 0) {
      console.warn('Browser lacks support for:', unsupported);
    }
    
    return {
      supported: unsupported.length === 0,
      missing: unsupported,
      details: support
    };
  }
  
  static supportsFlexbox() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    return div.style.display === 'flex';
  }
  
  static getPolyfillRecommendations(missing) {
    const recommendations = [];
    
    if (missing.includes('requestAnimationFrame')) {
      recommendations.push('Include requestAnimationFrame polyfill');
    }
    
    if (missing.includes('intersectionObserver')) {
      recommendations.push('Include IntersectionObserver polyfill for virtual scrolling');
    }
    
    if (missing.includes('es6')) {
      recommendations.push('Use Babel to transpile ES6 features');
    }
    
    return recommendations;
  }
}

// Check compatibility on initialization
const compatibility = CompatibilityChecker.checkBrowserSupport();
if (!compatibility.supported) {
  console.warn('Compatibility issues detected:', compatibility.missing);
  const recommendations = CompatibilityChecker.getPolyfillRecommendations(compatibility.missing);
  console.info('Recommendations:', recommendations);
}
```

## Error Recovery Strategies

### 1. Graceful Error Handling

```javascript
class ErrorRecoveryManager {
  constructor(table) {
    this.table = table;
    this.errorCount = 0;
    this.maxErrors = 5;
    this.lastError = null;
    
    this.setupErrorHandling();
  }
  
  setupErrorHandling() {
    // Wrap table methods with error handling
    this.wrapMethod('render');
    this.wrapMethod('updateData');
    this.wrapMethod('addRecord');
    
    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      if (this.isTableRelatedError(event.error)) {
        this.handleError(event.error);
      }
    });
  }
  
  wrapMethod(methodName) {
    const originalMethod = this.table[methodName];
    if (!originalMethod) return;
    
    this.table[methodName] = (...args) => {
      try {
        return originalMethod.apply(this.table, args);
      } catch (error) {
        this.handleError(error, methodName);
        return this.getRecoveryValue(methodName);
      }
    };
  }
  
  handleError(error, context = 'unknown') {
    this.errorCount++;
    this.lastError = { error, context, timestamp: Date.now() };
    
    console.error(`VTable error in ${context}:`, error);
    
    // Attempt recovery
    if (this.errorCount < this.maxErrors) {
      this.attemptRecovery(error, context);
    } else {
      this.performFullRecovery();
    }
  }
  
  attemptRecovery(error, context) {
    switch (context) {
      case 'render':
        // Try to re-render with simplified options
        setTimeout(() => this.table.render(), 100);
        break;
        
      case 'updateData':
        // Reset to last known good state
        console.warn('Reverting to previous data state');
        break;
        
      default:
        // Generic recovery - refresh table
        setTimeout(() => this.refreshTable(), 100);
    }
  }
  
  performFullRecovery() {
    console.warn('Too many errors, performing full table recovery');
    
    // Save current state
    const currentData = this.table.getAllRecords();
    const currentColumns = this.table.getAllColumns();
    
    // Recreate table
    const container = this.table.container;
    this.table.release();
    
    this.table = new ListTable({
      container: container,
      columns: currentColumns,
      records: currentData,
      // Use safe defaults
      renderMode: 'html',
      debug: true
    });
    
    this.errorCount = 0;
  }
  
  refreshTable() {
    try {
      this.table.updateSize();
      this.table.render();
    } catch (error) {
      console.error('Recovery failed:', error);
      this.performFullRecovery();
    }
  }
  
  isTableRelatedError(error) {
    const message = error.message || '';
    return message.includes('vtable') || 
           message.includes('canvas') || 
           message.includes('render');
  }
  
  getRecoveryValue(methodName) {
    // Return safe default values for failed methods
    switch (methodName) {
      case 'render': return null;
      case 'updateData': return false;
      case 'addRecord': return false;
      default: return undefined;
    }
  }
  
  getErrorReport() {
    return {
      errorCount: this.errorCount,
      lastError: this.lastError,
      isHealthy: this.errorCount < this.maxErrors
    };
  }
}

// Usage
const errorManager = new ErrorRecoveryManager(table);

// Check health periodically
setInterval(() => {
  const report = errorManager.getErrorReport();
  if (!report.isHealthy) {
    console.warn('Table health issues detected:', report);
  }
}, 30000);
```

### 2. Fallback Rendering

```javascript
class FallbackRenderer {
  constructor(config) {
    this.config = config;
    this.fallbackMode = false;
  }
  
  createTable() {
    try {
      // Try advanced rendering first
      return this.createAdvancedTable();
    } catch (error) {
      console.warn('Advanced rendering failed, using fallback:', error);
      return this.createFallbackTable();
    }
  }
  
  createAdvancedTable() {
    return new ListTable({
      ...this.config,
      renderMode: 'canvas',
      virtualized: true,
      enableAnimations: true
    });
  }
  
  createFallbackTable() {
    this.fallbackMode = true;
    
    return new ListTable({
      ...this.config,
      renderMode: 'html',
      virtualized: false,
      enableAnimations: false,
      // Simplified columns for compatibility
      columns: this.simplifyColumns(this.config.columns)
    });
  }
  
  simplifyColumns(columns) {
    return columns.map(column => ({
      field: column.field,
      caption: column.caption,
      width: column.width || 150,
      // Remove complex renderers that might fail
      cellType: 'text'
    }));
  }
  
  isFallbackMode() {
    return this.fallbackMode;
  }
}

// Usage
const renderer = new FallbackRenderer({
  container: document.getElementById('container'),
  columns: columns,
  records: data
});

const table = renderer.createTable();

if (renderer.isFallbackMode()) {
  console.warn('Running in fallback mode - some features may be limited');
}
```

This comprehensive troubleshooting guide provides solutions for the most common VTable issues and debugging techniques to help developers quickly identify and resolve problems.