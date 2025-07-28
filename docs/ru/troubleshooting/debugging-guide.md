# Vтаблица Troubleshooting и Debugging Guide

This comprehensive guide helps you diagnose и resolve common issues when working с Vтаблица, providing solutions для Производительность problems, rendering issues, данные handling, и integration challenges.

## Common Issues и Solutions

### 1. Rendering и Display Issues

#### таблица не Rendering

**Problem**: таблица container is empty или shows no content.

**Causes и Solutions**:

```javascript
// ❌ Problem: Missing container высота
const таблица = новый списоктаблица({
  container: document.getElementById('container'), // Container has высота: 0
  columns: columns,
  records: данные
});

// ✅ Solution: Ensure container has explicit высота
const container = document.getElementById('container');
container.style.высота = '600px'; // или use CSS

const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные
});
```

```css
/* ✅ CSS Solution */
#container {
  ширина: 100%;
  высота: 600px; /* Explicit высота обязательный */
}
```

#### Columns не Displaying Correctly

**Problem**: Columns are missing, overlapping, или have incorrect ширинаs.

```javascript
// ❌ Problem: Missing обязательный column свойства
const columns = [
  { поле: 'имя' }, // Missing caption и ширина
  { caption: 'Email' }, // Missing поле
];

// ✅ Solution: Provide все обязательный свойства
const columns = [
  { поле: 'имя', caption: 'имя', ширина: 150 },
  { поле: 'email', caption: 'Email', ширина: 200 },
];

// ✅ авто-ширина solution
const columns = [
  { поле: 'имя', caption: 'имя', minширина: 100 },
  { поле: 'email', caption: 'Email', minширина: 150 },
];
```

#### Canvas Rendering Issues

**Problem**: Blurry текст или pixelated rendering на high-DPI screens.

```javascript
// ❌ Problem: не accounting для device pixel ratio
const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные,
  renderMode: 'canvas'
});

// ✅ Solution: Set proper pixel ratio
const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные,
  renderMode: 'canvas',
  pixelRatio: window.devicePixelRatio || 1
});
```

### 2. данные Handling Issues

#### данные не Updating

**Problem**: таблица doesn't reflect данные changes after modifying the records массив.

```javascript
// ❌ Problem: Modifying данные без notifying таблица
данные.push(newRecord);
данные[0].имя = 'Updated имя';

// ✅ Solution 1: Use таблица методы
таблица.addRecord(newRecord);
таблица.updateRecord(0, { имя: 'Updated имя' });

// ✅ Solution 2: Replace entire данныеset
const newданные = [...данные, newRecord];
таблица.updateOption({ records: newданные });
```

#### сортировкаing и Filtering не Working

**Problem**: Built-в сортировкаing/filtering doesn't work as expected.

```javascript
// ❌ Problem: данные format incompatible с сортировкаing
const данные = [
  { id: '10', значение: '100' }, // Strings instead из numbers
  { id: '2', значение: '20' }
];

// ✅ Solution: Ensure correct данные types
const данные = [
  { id: 10, значение: 100 },
  { id: 2, значение: 20 }
];

// ✅ пользовательский сортировка функция для mixed types
const columns = [
  {
    поле: 'id',
    caption: 'ID',
    сортировка: (a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      возврат numA - numB;
    }
  }
];
```

#### Large данныеset Производительность Issues

**Problem**: таблица becomes slow или unresponsive с large данныеsets.

```javascript
// ❌ Problem: загрузка все данные в once
const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: millionRecords // Too much данные
});

// ✅ Solution: Implement pagination
const ITEMS_PER_Pвозраст = 1000;
let currentPвозраст = 0;

const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: millionRecords.slice(0, ITEMS_PER_Pвозраст),
  
  // включить virtual scrolling
  scrollMode: 'virtual',
  estimatedRowвысота: 40
});

// Load more данные на прокрутка
таблица.на('прокрутка', (e) => {
  const { scrollTop, scrollвысота, clientвысота } = e;
  const scrollPercentвозраст = (scrollTop + clientвысота) / scrollвысота;
  
  if (scrollPercentвозраст > 0.9) {
    const nextPвозраст = currentPвозраст + 1;
    const начало = nextPвозраст * ITEMS_PER_Pвозраст;
    const конец = начало + ITEMS_PER_Pвозраст;
    const nextданные = millionRecords.slice(начало, конец);
    
    if (nextданные.length > 0) {
      таблица.addRecords(nextданные);
      currentPвозраст = nextPвозраст;
    }
  }
});
```

### 3. событие Handling Issues

#### событиеs не Firing

**Problem**: событие списокeners don't trigger или receive unexpected данные.

```javascript
// ❌ Problem: Incorrect событие имяs или timing
const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные
});

// событие списокener added before таблица is ready
таблица.на('Нажать_cell', (событие) => {
  console.log(событие); // May не fire
});

// ✅ Solution: Use correct событие имяs и timing
таблица.на('ready', () => {
  таблица.на('Нажать_cell', (событие) => {
    console.log('Cell Нажатьed:', событие);
  });
  
  таблица.на('after_cell_edit', (событие) => {
    console.log('Cell edited:', событие);
  });
});
```

#### Memory Leaks от событие списокeners

**Problem**: событие списокeners не properly cleaned up.

```javascript
// ❌ Problem: No cleanup
функция createтаблица() {
  const таблица = новый списоктаблица(config);
  
  таблица.на('Нажать_cell', handler);
  // No cleanup when таблица is destroyed
}

// ✅ Solution: Proper cleanup
class таблицаManвозрастr {
  constructor(config) {
    this.таблица = новый списоктаблица(config);
    this.handlers = новый Map();
    this.setupсобытиесписокeners();
  }
  
  setupсобытиесписокeners() {
    const НажатьHandler = (событие) => console.log('Нажать:', событие);
    const editHandler = (событие) => console.log('Edit:', событие);
    
    this.таблица.на('Нажать_cell', НажатьHandler);
    this.таблица.на('after_cell_edit', editHandler);
    
    // Store handlers для cleanup
    this.handlers.set('Нажать_cell', НажатьHandler);
    this.handlers.set('after_cell_edit', editHandler);
  }
  
  destroy() {
    // Remove все событие списокeners
    this.handlers.forEach((handler, событие) => {
      this.таблица.off(событие, handler);
    });
    
    // Релиз таблица resources
    this.таблица.Релиз();
    
    // Clear references
    this.handlers.clear();
    this.таблица = null;
  }
}
```

### 4. Styling и тема Issues

#### пользовательский Styles не Applied

**Problem**: CSS styles don't affect таблица appearance.

```css
/* ❌ Problem: Styles не specific enough */
.таблица-cell {
  фон-цвет: red; /* Won't work */
}

/* ✅ Solution: Use proper selectors */
.vтаблица .vтаблица-cell {
  фон-цвет: red;
}

/* ✅ или use !important (последний reсортировка) */
.пользовательский-таблица .vтаблица-cell {
  фон-цвет: red !important;
}
```

```javascript
// ✅ Solution: Use таблица's built-в styling options
const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные,
  
  тема: {
    defaultStyle: {
      bgColor: '#ffffff',
      цвет: '#333333'
    },
    headerStyle: {
      bgColor: '#f5f5f5',
      цвет: '#333333',
      fontWeight: 'bold'
    }
  }
});
```

#### тема не загрузка

**Problem**: пользовательский тема configuration doesn't take effect.

```javascript
// ❌ Problem: Incorrect тема structure
const тема = {
  colors: {
    primary: '#007bff' // Wrong structure
  }
};

// ✅ Solution: Use correct тема structure
const тема = {
  defaultStyle: {
    bgColor: '#ffffff',
    цвет: '#333333',
    borderColor: '#e0e0e0'
  },
  headerStyle: {
    bgColor: '#f8f9fa',
    цвет: '#495057',
    fontWeight: 'bold'
  },
  bodyStyle: {
    bgColor: '#ffffff',
    цвет: '#495057'
  },
  frameStyle: {
    borderColor: '#dee2e6',
    borderширина: 1
  }
};

const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные,
  тема: тема
});
```

### 5. Integration Issues

#### React Integration Problems

**Problem**: таблица не updating when React state changes.

```jsx
// ❌ Problem: Props не properly watched
функция Myтаблица({ данные, columns }) {
  const таблицаRef = useRef();
  
  // таблица doesn't update when данные changes
  useEffect(() => {
    const таблица = новый списоктаблица({
      container: таблицаRef.текущий,
      columns: columns,
      records: данные
    });
  }, []); // Empty dependency массив
  
  возврат <div ref={таблицаRef} />;
}

// ✅ Solution: Watch props и update таблица
функция Myтаблица({ данные, columns }) {
  const таблицаRef = useRef();
  const таблицаInstanceRef = useRef();
  
  // Create таблица once
  useEffect(() => {
    таблицаInstanceRef.текущий = новый списоктаблица({
      container: таблицаRef.текущий,
      columns: columns,
      records: данные
    });
    
    возврат () => {
      if (таблицаInstanceRef.текущий) {
        таблицаInstanceRef.текущий.Релиз();
      }
    };
  }, []);
  
  // Update данные when props change
  useEffect(() => {
    if (таблицаInstanceRef.текущий) {
      таблицаInstanceRef.текущий.updateOption({ records: данные });
    }
  }, [данные]);
  
  // Update columns when they change
  useEffect(() => {
    if (таблицаInstanceRef.текущий) {
      таблицаInstanceRef.текущий.updateOption({ columns: columns });
    }
  }, [columns]);
  
  возврат <div ref={таблицаRef} style={{ высота: '600px' }} />;
}
```

#### Vue Integration Problems

**Problem**: Reactivity не working с Vтаблица.

```vue
<!-- ❌ Problem: Direct mutation не detected -->
<template>
  <div>
    <Кнопка @Нажать="updateданные">Update</Кнопка>
    <Vтаблица :records="данные" :columns="columns" />
  </div>
</template>

<script>
export по умолчанию {
  данные() {
    возврат {
      данные: [{ id: 1, имя: 'John' }],
      columns: [{ поле: 'id' }, { поле: 'имя' }]
    };
  },
  методы: {
    updateданные() {
      // This won't trigger reactivity
      this.данные[0].имя = 'Jane';
    }
  }
};
</script>
```

```vue
<!-- ✅ Solution: Use Vue's reactivity correctly -->
<template>
  <div>
    <Кнопка @Нажать="updateданные">Update</Кнопка>
    <Vтаблица :records="данные" :columns="columns" />
  </div>
</template>

<script>
import Vue от 'vue';

export по умолчанию {
  данные() {
    возврат {
      данные: [{ id: 1, имя: 'John' }],
      columns: [{ поле: 'id' }, { поле: 'имя' }]
    };
  },
  методы: {
    updateданные() {
      // Vue 2: Use Vue.set или replace массив
      Vue.set(this.данные[0], 'имя', 'Jane');
      // или: this.данные = [...this.данные];
      
      // Vue 3: Direct mutation works
      // this.данные[0].имя = 'Jane';
    }
  }
};
</script>
```

## Debugging Techniques

### 1. включить Debug Mode

```javascript
// включить debug logging
const таблица = новый списоктаблица({
  container: container,
  columns: columns,
  records: данные,
  
  // включить debug mode
  debug: true,
  
  // пользовательский logging
  logLevel: 'debug' // 'ошибка', 'warn', 'информация', 'debug'
});

// Access debug information
console.log('таблица state:', таблица.getтаблицаState());
console.log('Render информация:', таблица.getRenderInfo());
```

### 2. Производительность Monitoring

```javascript
class ПроизводительностьDebugger {
  constructor(таблица) {
    this.таблица = таблица;
    this.metrics = {
      renderTimes: [],
      событиеTimes: [],
      данныеUpdateTimes: []
    };
    
    this.setupMonitoring();
  }
  
  setupMonitoring() {
    // Monitor render Производительность
    const originalRender = this.таблица.render;
    this.таблица.render = (...args) => {
      const начало = Производительность.now();
      const result = originalRender.apply(this.таблица, args);
      const duration = Производительность.now() - начало;
      
      this.metrics.renderTimes.push(duration);
      if (duration > 16) { // > 60fps
        console.warn(`Slow render: ${duration}ms`);
      }
      
      возврат result;
    };
    
    // Monitor событие handling
    const originalOn = this.таблица.на;
    this.таблица.на = (событие, handler) => {
      const wrappedHandler = (...args) => {
        const начало = Производительность.now();
        const result = handler.apply(this, args);
        const duration = Производительность.now() - начало;
        
        this.metrics.событиеTimes.push({ событие, duration });
        if (duration > 10) {
          console.warn(`Slow событие handler для ${событие}: ${duration}ms`);
        }
        
        возврат result;
      };
      
      возврат originalOn.call(this.таблица, событие, wrappedHandler);
    };
  }
  
  getReport() {
    const avgRenderTime = this.getAverвозраст(this.metrics.renderTimes);
    const slowсобытиеs = this.metrics.событиеTimes.filter(e => e.duration > 10);
    
    возврат {
      averвозрастRenderTime: avgRenderTime,
      slowRenders: this.metrics.renderTimes.filter(t => t > 16).length,
      slowсобытиеs: slowсобытиеs,
      recommendations: this.getRecommendations(avgRenderTime, slowсобытиеs)
    };
  }
  
  getAverвозраст(массив) {
    возврат массив.length > 0 ? массив.reduce((a, b) => a + b) / массив.length : 0;
  }
  
  getRecommendations(avgRenderTime, slowсобытиеs) {
    const recommendations = [];
    
    if (avgRenderTime > 16) {
      recommendations.push('Consider using canvas rendering mode');
      recommendations.push('Reduce column complexity или use virtual scrolling');
    }
    
    if (slowсобытиеs.length > 0) {
      recommendations.push('Optimize событие handlers - consider debouncing');
    }
    
    возврат recommendations;
  }
}

// Usвозраст
const debugger = новый ПроизводительностьDebugger(таблица);

// Get Производительность report
setTimeout(() => {
  console.log('Производительность Report:', debugger.getReport());
}, 10000);
```

### 3. данные Validation

```javascript
class данныеValidator {
  static validateColumns(columns) {
    const errors = [];
    const полеs = новый Set();
    
    columns.forEach((column, index) => {
      // Check обязательный свойства
      if (!column.поле) {
        errors.push(`Column ${index}: Missing 'поле' property`);
      }
      
      if (!column.caption) {
        errors.push(`Column ${index}: Missing 'caption' property`);
      }
      
      // Check для duplicate полеs
      if (column.поле && полеs.has(column.поле)) {
        errors.push(`Column ${index}: Duplicate поле '${column.поле}'`);
      }
      полеs.add(column.поле);
      
      // Check ширина
      if (column.ширина && (column.ширина < 0 || column.ширина > 2000)) {
        errors.push(`Column ${index}: Invalid ширина ${column.ширина}`);
      }
    });
    
    возврат errors;
  }
  
  static validateданные(данные, columns) {
    const errors = [];
    const columnполеs = columns.map(col => col.поле);
    
    данные.forEach((record, index) => {
      // Check if record is объект
      if (typeof record !== 'объект' || record === null) {
        errors.push(`Record ${index}: Must be an объект`);
        возврат;
      }
      
      // Check для missing полеs
      columnполеs.forEach(поле => {
        if (!(поле в record)) {
          errors.push(`Record ${index}: Missing поле '${поле}'`);
        }
      });
      
      // Check данные types (if specified в columns)
      columns.forEach(column => {
        if (column.данныеType && record[column.поле] !== undefined) {
          const значение = record[column.поле];
          
          switch (column.данныеType) {
            case 'число':
              if (typeof значение !== 'число') {
                errors.push(`Record ${index}: поле '${column.поле}' should be число, got ${typeof значение}`);
              }
              break;
            case 'строка':
              if (typeof значение !== 'строка') {
                errors.push(`Record ${index}: поле '${column.поле}' should be строка, got ${typeof значение}`);
              }
              break;
            case 'date':
              if (!(значение instanceof Date) && !Date.parse(значение)) {
                errors.push(`Record ${index}: поле '${column.поле}' should be valid date`);
              }
              break;
          }
        }
      });
    });
    
    возврат errors;
  }
  
  static validate(columns, данные) {
    const columnErrors = this.validateColumns(columns);
    const данныеErrors = this.validateданные(данные, columns);
    
    возврат {
      isValid: columnErrors.length === 0 && данныеErrors.length === 0,
      columnErrors,
      данныеErrors,
      allErrors: [...columnErrors, ...данныеErrors]
    };
  }
}

// Usвозраст
const validation = данныеValidator.validate(columns, данные);
if (!validation.isValid) {
  console.ошибка('данные validation failed:', validation.allErrors);
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
      intersectionObserver: 'IntersectionObserver' в window
    };
    
    const unsupported = объект.keys(support).filter(key => !support[key]);
    
    if (unsupported.length > 0) {
      console.warn('Browser lacks support для:', unsupported);
    }
    
    возврат {
      supported: unsupported.length === 0,
      missing: unsupported,
      details: support
    };
  }
  
  static supportsFlexbox() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    возврат div.style.display === 'flex';
  }
  
  static getPolyfillRecommendations(missing) {
    const recommendations = [];
    
    if (missing.includes('requestAnimationFrame')) {
      recommendations.push('Include requestAnimationFrame polyfill');
    }
    
    if (missing.includes('intersectionObserver')) {
      recommendations.push('Include IntersectionObserver polyfill для virtual scrolling');
    }
    
    if (missing.includes('es6')) {
      recommendations.push('Use Babel к transpile ES6 возможности');
    }
    
    возврат recommendations;
  }
}

// Check compatibility на initialization
const compatibility = CompatibilityChecker.checkBrowserSupport();
if (!compatibility.supported) {
  console.warn('Compatibility issues detected:', compatibility.missing);
  const recommendations = CompatibilityChecker.getPolyfillRecommendations(compatibility.missing);
  console.информация('Recommendations:', recommendations);
}
```

## ошибка Recovery Strategies

### 1. Graceful ошибка Handling

```javascript
class ErrorRecoveryManвозрастr {
  constructor(таблица) {
    this.таблица = таблица;
    this.errorCount = 0;
    this.maxErrors = 5;
    this.lastError = null;
    
    this.setupErrorHandling();
  }
  
  setupErrorHandling() {
    // Wrap таблица методы с ошибка handling
    this.wrapMethod('render');
    this.wrapMethod('updateданные');
    this.wrapMethod('addRecord');
    
    // Handle unhandled errors
    window.addсобытиесписокener('ошибка', (событие) => {
      if (this.isтаблицаRelatedError(событие.ошибка)) {
        this.handleError(событие.ошибка);
      }
    });
  }
  
  wrapMethod(methodимя) {
    const originalMethod = this.таблица[methodимя];
    if (!originalMethod) возврат;
    
    this.таблица[methodимя] = (...args) => {
      try {
        возврат originalMethod.apply(this.таблица, args);
      } catch (ошибка) {
        this.handleError(ошибка, methodимя);
        возврат this.getRecoveryValue(methodимя);
      }
    };
  }
  
  handleError(ошибка, context = 'unknown') {
    this.errorCount++;
    this.lastError = { ошибка, context, timestamp: Date.now() };
    
    console.ошибка(`Vтаблица ошибка в ${context}:`, ошибка);
    
    // Attempt recovery
    if (this.errorCount < this.maxErrors) {
      this.attemptRecovery(ошибка, context);
    } else {
      this.performFullRecovery();
    }
  }
  
  attemptRecovery(ошибка, context) {
    switch (context) {
      case 'render':
        // Try к re-render с simplified options
        setTimeout(() => this.таблица.render(), 100);
        break;
        
      case 'updateданные':
        // Reset к последний known good state
        console.warn('Reverting к предыдущий данные state');
        break;
        
      по умолчанию:
        // Generic recovery - refresh таблица
        setTimeout(() => this.refreshтаблица(), 100);
    }
  }
  
  performFullRecovery() {
    console.warn('Too many errors, performing full таблица recovery');
    
    // Save текущий state
    const currentданные = this.таблица.getAllRecords();
    const currentColumns = this.таблица.getAllColumns();
    
    // Recreate таблица
    const container = this.таблица.container;
    this.таблица.Релиз();
    
    this.таблица = новый списоктаблица({
      container: container,
      columns: currentColumns,
      records: currentданные,
      // Use safe defaults
      renderMode: 'html',
      debug: true
    });
    
    this.errorCount = 0;
  }
  
  refreshтаблица() {
    try {
      this.таблица.updateSize();
      this.таблица.render();
    } catch (ошибка) {
      console.ошибка('Recovery failed:', ошибка);
      this.performFullRecovery();
    }
  }
  
  isтаблицаRelatedError(ошибка) {
    const messвозраст = ошибка.messвозраст || '';
    возврат messвозраст.includes('vтаблица') || 
           messвозраст.includes('canvas') || 
           messвозраст.includes('render');
  }
  
  getRecoveryValue(methodимя) {
    // возврат safe по умолчанию values для failed методы
    switch (methodимя) {
      case 'render': возврат null;
      case 'updateданные': возврат false;
      case 'addRecord': возврат false;
      по умолчанию: возврат undefined;
    }
  }
  
  getErrorReport() {
    возврат {
      errorCount: this.errorCount,
      lastError: this.lastError,
      isHealthy: this.errorCount < this.maxErrors
    };
  }
}

// Usвозраст
const errorManвозрастr = новый ErrorRecoveryManвозрастr(таблица);

// Check health periodically
setInterval(() => {
  const report = errorManвозрастr.getErrorReport();
  if (!report.isHealthy) {
    console.warn('таблица health issues detected:', report);
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
  
  createтаблица() {
    try {
      // Try advanced rendering первый
      возврат this.createAdvancedтаблица();
    } catch (ошибка) {
      console.warn('Advanced rendering failed, using fallback:', ошибка);
      возврат this.createFallbackтаблица();
    }
  }
  
  createAdvancedтаблица() {
    возврат новый списоктаблица({
      ...this.config,
      renderMode: 'canvas',
      virtualized: true,
      enableAnimations: true
    });
  }
  
  createFallbackтаблица() {
    this.fallbackMode = true;
    
    возврат новый списоктаблица({
      ...this.config,
      renderMode: 'html',
      virtualized: false,
      enableAnimations: false,
      // Simplified columns для compatibility
      columns: this.simplifyColumns(this.config.columns)
    });
  }
  
  simplifyColumns(columns) {
    возврат columns.map(column => ({
      поле: column.поле,
      caption: column.caption,
      ширина: column.ширина || 150,
      // Remove complex renderers that might fail
      cellType: 'текст'
    }));
  }
  
  isFallbackMode() {
    возврат this.fallbackMode;
  }
}

// Usвозраст
const renderer = новый FallbackRenderer({
  container: document.getElementById('container'),
  columns: columns,
  records: данные
});

const таблица = renderer.createтаблица();

if (renderer.isFallbackMode()) {
  console.warn('Running в fallback mode - некоторые возможности may be limited');
}
```

This comprehensive troubleshooting guide provides solutions для the most common Vтаблица issues и debugging techniques к help developers quickly identify и resolve problems.