# Руководство по работе с данными VTable

Это руководство охватывает все аспекты работы с данными в VTable, от базовой привязки данных до продвинутой обработки и манипуляции данными.

## Источники данных

### Базовые данные массива
Наиболее распространенный формат данных - это массив объектов:

```javascript
const records = [
  { id: 1, name: 'Иван Иванов', department: 'Продажи', salary: 65000 },
  { id: 2, name: 'Анна Петрова', department: 'Маркетинг', salary: 70000 },
  { id: 3, name: 'Сергей Сидоров', department: 'Разработка', salary: 85000 }
];

const table = новый VTable.ListTable({
  container: document.getElementById('container'),
  records: records,
  columns: [
    { field: 'id', caption: 'ID', ширина: 80 },
    { field: 'name', caption: 'Имя', ширина: 150 },
    { field: 'department', caption: 'Отдел', ширина: 120 },
    { field: 'salary', caption: 'Зарплата', ширина: 100 }
  ]
});
```

### Загрузка данных из API
```javascript
// Асинхронная загрузка данных
async функция loadTableData() {
  try {
    const response = await fetch('/api/employees');
    const data = await response.json();
    
    const table = новый VTable.ListTable({
      container: document.getElementById('container'),
      records: data,
      columns: columns
    });
    
  } catch (ошибка) {
    console.ошибка('Не удалось загрузить данные:', ошибка);
  }
}

// С обработкой ошибок и состояниями загрузки
async функция loadDataWithStates() {
  const loadingElement = document.getElementById('загрузка');
  const errorElement = document.getElementById('ошибка');
  
  loadingElement.style.display = 'block';
  errorElement.style.display = 'никто';
  
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw новый ошибка(`HTTP ошибка! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!массив.isArray(data)) {
      throw новый ошибка('Expected массив из records');
    }
    
    const table = новый VTable.ListTable({
      container: document.getElementById('container'),
      records: data,
      columns: columns
    });
    
    loadingElement.style.display = 'никто';
    
  } catch (ошибка) {
    loadingElement.style.display = 'никто';
    errorElement.style.display = 'block';
    errorElement.textContent = `Failed к load data: ${ошибка.сообщение}`;
  }
}
```

### Real-time Data Updates
```javascript
class RealTimeTable {
  constructor(containerId, initialData, columns) {
    this.table = новый VTable.ListTable({
      container: document.getElementById(containerId),
      records: initialData,
      columns: columns
    });
    
    this.setupWebSocket();
  }
  
  setupWebSocket() {
    this.ws = новый WebSocket('/api/realtime');
    
    this.ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      this.handleDataUpdate(update);
    };
    
    this.ws.onerror = (ошибка) => {
      console.ошибка('WebSocket ошибка:', ошибка);
    };
  }
  
  handleDataUpdate(update) {
    switch (update.тип) {
      case 'INSERT':
        this.table.addRecord(update.record);
        break;
      case 'UPDATE':
        this.table.updateRecords([update.record], [update.index]);
        break;
      case 'DELETE':
        this.table.removeRecord(update.index);
        break;
      case 'BULK_UPDATE':
        this.table.updateRecords(update.records);
        break;
    }
  }
  
  destroy() {
    if (this.ws) {
      this.ws.закрыть();
    }
    this.table.release();
  }
}
```

## Data Manipulation

### Adding Records
```javascript
// Add single record
table.addRecord({ id: 4, name: 'Alice Brown', department: 'HR', salary: 68000 });

// Add multiple records
table.addRecords([
  { id: 5, name: 'Charlie Wilson', department: 'IT', salary: 72000 },
  { id: 6, name: 'Diana Davis', department: 'Finance', salary: 75000 }
]);

// Add record в specific позиция
table.addRecord({ id: 7, name: 'Eva Martinez', department: 'Legal', salary: 80000 }, 2);
```

### Updating Records
```javascript
// Update single record по index
table.updateRecords([{ id: 1, name: 'John Updated', department: 'Sales', salary: 70000 }], [0]);

// Update multiple records
table.updateRecords([
  { id: 1, salary: 67000 },
  { id: 2, salary: 73000 }
], [0, 1]);

// Update все records
table.updateRecords(newDataArray);

// Partial updates using changeCellValue
table.changeCellValue(1, 2, 'новый значение'); // col, row, значение
```

### Removing Records
```javascript
// Remove single record по index
table.removeRecord(2);

// Remove multiple records
table.removeRecords([1, 3, 5]);

// Clear все records
table.updateRecords([]);
```

### Finding и Filtering Data
```javascript
// Get record по index
const record = table.getRecordByRowCol(0, 2); // row 2

// Get все records
const allRecords = table.records;

// Find records matching criteria
функция findRecords(records, criteria) {
  возврат records.filter(record => {
    возврат объект.keys(criteria).каждый(key => {
      возврат record[key] === criteria[key];
    });
  });
}

const salespeople = findRecords(table.records, { department: 'Sales' });

// Custom filtering с table update
функция filterTable(table, filterFn) {
  const originalRecords = table.records;
  const filteredRecords = originalRecords.filter(filterFn);
  table.updateRecords(filteredRecords);
  
  // возврат функция к restore original data
  возврат () => table.updateRecords(originalRecords);
}

// Usage
const restoreData = filterTable(table, record => record.salary > 70000);
// Later: restoreData(); к показать все data again
```

## Data Validation

### Client-side Validation
```javascript
const table = новый VTable.ListTable({
  container: document.getElementById('container'),
  records: data,
  columns: [
    {
      field: 'email',
      caption: 'Email',
      ширина: 200,
      editor: 'ввод',
      style: {
        bgColor: (args) => {
          const email = args.dataValue;
          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          возврат isValid ? '#ffffff' : '#ffebee';
        }
      }
    },
    {
      field: 'age',
      caption: 'Age',
      ширина: 80,
      editor: 'ввод',
      style: {
        bgColor: (args) => {
          const age = число(args.dataValue);
          возврат (age >= 18 && age <= 65) ? '#ffffff' : '#ffebee';
        }
      }
    }
  ]
});

// Validation на cell change
table.на('change_cell_value', (args) => {
  const { field, newValue, col, row } = args;
  
  let isValid = true;
  let errorMessage = '';
  
  switch (field) {
    case 'email':
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue);
      errorMessage = 'Please enter a valid email address';
      break;
    case 'age':
      const age = число(newValue);
      isValid = age >= 18 && age <= 65;
      errorMessage = 'Age must be between 18 и 65';
      break;
    case 'salary':
      const salary = число(newValue);
      isValid = salary > 0;
      errorMessage = 'Salary must be greater than 0';
      break;
  }
  
  if (!isValid) {
    // Revert the change
    table.changeCellValue(col, row, args.oldValue);
    
    // показать ошибка сообщение
    showErrorMessage(errorMessage);
  } else {
    // Save к backend
    saveRecordUpdate(args);
  }
});

функция showErrorMessage(сообщение) {
  // Implementation depends на your UI framework
  console.ошибка(сообщение);
  // или показать toast, модальное окно, etc.
}
```

### Data тип Enforcement
```javascript
class TypedTable extends VTable.ListTable {
  constructor(options) {
    super(options);
    this.columnTypes = this.extractColumnTypes(options.columns);
    this.setupTypeValidation();
  }
  
  extractColumnTypes(columns) {
    const types = {};
    columns.forEach(col => {
      if (col.dataType) {
        types[col.field] = col.dataType;
      }
    });
    возврат types;
  }
  
  setupTypeValidation() {
    this.на('change_cell_value', (args) => {
      const { field, newValue } = args;
      const expectedType = this.columnTypes[field];
      
      if (expectedType && !this.validateType(newValue, expectedType)) {
        // Revert invalid change
        this.changeCellValue(args.col, args.row, args.oldValue);
        console.ошибка(`Invalid тип для ${field}. Expected ${expectedType}`);
      }
    });
  }
  
  validateType(значение, тип) {
    switch (тип) {
      case 'число':
        возврат !isNaN(число(значение)) && isFinite(число(значение));
      case 'integer':
        возврат число.isInteger(число(значение));
      case 'строка':
        возврат typeof значение === 'строка';
      case 'логический':
        возврат typeof значение === 'логический' || значение === 'true' || значение === 'false';
      case 'date':
        возврат !isNaN(Date.parse(значение));
      case 'email':
        возврат /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(значение);
      case 'url':
        try {
          новый URL(значение);
          возврат true;
        } catch {
          возврат false;
        }
      по умолчанию:
        возврат true;
    }
  }
}

// Usage
const typedTable = новый TypedTable({
  container: document.getElementById('container'),
  records: data,
  columns: [
    { field: 'id', caption: 'ID', ширина: 80, dataType: 'integer' },
    { field: 'name', caption: 'Name', ширина: 150, dataType: 'строка' },
    { field: 'email', caption: 'Email', ширина: 200, dataType: 'email' },
    { field: 'salary', caption: 'Salary', ширина: 100, dataType: 'число' },
    { field: 'активный', caption: 'активный', ширина: 80, dataType: 'логический' },
    { field: 'hireDate', caption: 'Hire Date', ширина: 120, dataType: 'date' }
  ]
});
```

## Data Formatting и Transformation

### значение Formatters
```javascript
const table = новый VTable.ListTable({
  container: document.getElementById('container'),
  records: data,
  columns: [
    {
      field: 'salary',
      caption: 'Salary',
      ширина: 120,
      format: (значение) => {
        возврат '$' + число(значение).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    },
    {
      field: 'percentage',
      caption: 'Performance',
      ширина: 100,
      format: (значение) => {
        возврат (число(значение) * 100).toFixed(1) + '%';
      }
    },
    {
      field: 'hireDate',
      caption: 'Hire Date',
      ширина: 120,
      format: (значение) => {
        возврат новый Date(значение).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      field: 'status',
      caption: 'Status',
      ширина: 100,
      format: (значение) => {
        const statusMap = {
          'A': 'активный',
          'I': 'неактивный',
          'P': 'Pending'
        };
        возврат statusMap[значение] || значение;
      }
    }
  ]
});
```

### Data Preprocessing
```javascript
// Transform data before creating table
функция preprocessData(rawData) {
  возврат rawData.map(record => ({
    ...record,
    // Calculate derived fields
    fullName: `${record.firstName} ${record.lastName}`,
    yearsEmployed: новый Date().getFullYear() - новый Date(record.hireDate).getFullYear(),
    salaryRange: categorySalary(record.salary),
    // Normalize values
    department: record.department.toUpperCase(),
    email: record.email.toLowerCase(),
    // Parse dates
    hireDate: новый Date(record.hireDate),
    // Convert strings к numbers
    salary: число(record.salary),
    age: число(record.age)
  }));
}

функция categorySalary(salary) {
  if (salary < 50000) возврат 'Entry Level';
  if (salary < 75000) возврат 'Mid Level';
  if (salary < 100000) возврат 'Senior Level';
  возврат 'Executive Level';
}

// Usage
const processedData = preprocessData(rawApiData);
const table = новый VTable.ListTable({
  container: document.getElementById('container'),
  records: processedData,
  columns: columns
});
```

## Large Dataset Handling

### Pagination
```javascript
class PaginatedTable {
  constructor(containerId, columns, pageSize = 100) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.totalRecords = 0;
    this.allData = [];
    
    this.table = новый VTable.ListTable({
      container: document.getElementById(containerId),
      records: [],
      columns: columns
    });
    
    this.createPaginationControls();
  }
  
  setData(data) {
    this.allData = data;
    this.totalRecords = data.length;
    this.currentPage = 1;
    this.updateTable();
    this.updatePaginationControls();
  }
  
  updateTable() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageData = this.allData.slice(startIndex, endIndex);
    this.table.updateRecords(pageData);
  }
  
  createPaginationControls() {
    const controls = document.createElement('div');
    controls.className = 'pagination-controls';
    controls.innerHTML = `
      <кнопка id="prev-page">предыдущий</кнопка>
      <span id="page-информация"></span>
      <кнопка id="следующий-page">следующий</кнопка>
    `;
    
    this.table.container.parentNode.appendChild(controls);
    
    document.getElementById('prev-page').onclick = () => this.previousPage();
    document.getElementById('следующий-page').onclick = () => this.nextPage();
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateTable();
      this.updatePaginationControls();
    }
  }
  
  nextPage() {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateTable();
      this.updatePaginationControls();
    }
  }
  
  updatePaginationControls() {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    document.getElementById('page-информация').textContent = 
      `Page ${this.currentPage} из ${totalPages} (${this.totalRecords} total records)`;
    
    document.getElementById('prev-page').отключен = this.currentPage === 1;
    document.getElementById('следующий-page').отключен = this.currentPage === totalPages;
  }
}
```

### Virtual Scrolling для Large Datasets
```javascript
const largeTable = новый VTable.ListTable({
  container: document.getElementById('container'),
  records: [], // начало empty
  columns: columns,
  // включить virtual scrolling
  scrollMode: 'virtual',
  // Optimize для large datasets
  overscanRowCount: 10,
  defaultRowHeight: 40
});

// Load data в chunks
class VirtualDataLoader {
  constructor(table, dataSource, chunkSize = 1000) {
    this.table = table;
    this.dataSource = dataSource;
    this.chunkSize = chunkSize;
    this.loadedChunks = новый Set();
    this.totalRecords = 0;
    
    this.setupScrollListener();
  }
  
  async initialize() {
    // Get total count
    this.totalRecords = await this.dataSource.getCount();
    
    // Load первый chunk
    await this.loadChunk(0);
  }
  
  setupScrollListener() {
    this.table.на('прокрутка', (args) => {
      const { scrollTop, scrollHeight, clientHeight } = args;
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);
      
      // Determine which chunk we need
      const neededChunk = Math.floor(scrollRatio * this.totalRecords / this.chunkSize);
      
      if (!this.loadedChunks.has(neededChunk)) {
        this.loadChunk(neededChunk);
      }
    });
  }
  
  async loadChunk(chunkIndex) {
    if (this.loadedChunks.has(chunkIndex)) возврат;
    
    const offset = chunkIndex * this.chunkSize;
    const chunkData = await this.dataSource.getData(offset, this.chunkSize);
    
    // Merge с existing data
    const currentRecords = this.table.records;
    const newRecords = [...currentRecords];
    
    // Insert chunk data в correct позиция
    для (let i = 0; i < chunkData.length; i++) {
      newRecords[offset + i] = chunkData[i];
    }
    
    this.table.updateRecords(newRecords);
    this.loadedChunks.add(chunkIndex);
  }
}

// Data source интерфейс
class APIDataSource {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async getCount() {
    const response = await fetch(`${this.baseUrl}/count`);
    const data = await response.json();
    возврат data.count;
  }
  
  async getData(offset, limit) {
    const response = await fetch(`${this.baseUrl}/data?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    возврат data.records;
  }
}

// Usage
const dataSource = новый APIDataSource('/api/employees');
const loader = новый VirtualDataLoader(largeTable, dataSource);
loader.initialize();
```

This comprehensive data handling guide covers все aspects из working с data в VTable, от basic operations к advanced scenarios с large datasets и real-time updates.