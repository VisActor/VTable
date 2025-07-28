# VTable Data Handling Guide

This guide covers all aspects of data handling in VTable, from basic data binding to advanced data processing and manipulation.

## Data Sources

### Basic Array Data
The most common data format is an array of objects:

```javascript
const records = [
  { id: 1, name: 'John Doe', department: 'Sales', salary: 65000 },
  { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 70000 },
  { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 85000 }
];

const table = new VTable.ListTable({
  container: document.getElementById('container'),
  records: records,
  columns: [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 150 },
    { field: 'department', caption: 'Department', width: 120 },
    { field: 'salary', caption: 'Salary', width: 100 }
  ]
});
```

### Loading Data from APIs
```javascript
// Load data asynchronously
async function loadTableData() {
  try {
    const response = await fetch('/api/employees');
    const data = await response.json();
    
    const table = new VTable.ListTable({
      container: document.getElementById('container'),
      records: data,
      columns: columns
    });
    
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

// With error handling and loading states
async function loadDataWithStates() {
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  
  loadingElement.style.display = 'block';
  errorElement.style.display = 'none';
  
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Expected array of records');
    }
    
    const table = new VTable.ListTable({
      container: document.getElementById('container'),
      records: data,
      columns: columns
    });
    
    loadingElement.style.display = 'none';
    
  } catch (error) {
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorElement.textContent = `Failed to load data: ${error.message}`;
  }
}
```

### Real-time Data Updates
```javascript
class RealTimeTable {
  constructor(containerId, initialData, columns) {
    this.table = new VTable.ListTable({
      container: document.getElementById(containerId),
      records: initialData,
      columns: columns
    });
    
    this.setupWebSocket();
  }
  
  setupWebSocket() {
    this.ws = new WebSocket('/api/realtime');
    
    this.ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      this.handleDataUpdate(update);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  handleDataUpdate(update) {
    switch (update.type) {
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
      this.ws.close();
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

// Add record at specific position
table.addRecord({ id: 7, name: 'Eva Martinez', department: 'Legal', salary: 80000 }, 2);
```

### Updating Records
```javascript
// Update single record by index
table.updateRecords([{ id: 1, name: 'John Updated', department: 'Sales', salary: 70000 }], [0]);

// Update multiple records
table.updateRecords([
  { id: 1, salary: 67000 },
  { id: 2, salary: 73000 }
], [0, 1]);

// Update all records
table.updateRecords(newDataArray);

// Partial updates using changeCellValue
table.changeCellValue(1, 2, 'New Value'); // col, row, value
```

### Removing Records
```javascript
// Remove single record by index
table.removeRecord(2);

// Remove multiple records
table.removeRecords([1, 3, 5]);

// Clear all records
table.updateRecords([]);
```

### Finding and Filtering Data
```javascript
// Get record by index
const record = table.getRecordByRowCol(0, 2); // row 2

// Get all records
const allRecords = table.records;

// Find records matching criteria
function findRecords(records, criteria) {
  return records.filter(record => {
    return Object.keys(criteria).every(key => {
      return record[key] === criteria[key];
    });
  });
}

const salespeople = findRecords(table.records, { department: 'Sales' });

// Custom filtering with table update
function filterTable(table, filterFn) {
  const originalRecords = table.records;
  const filteredRecords = originalRecords.filter(filterFn);
  table.updateRecords(filteredRecords);
  
  // Return function to restore original data
  return () => table.updateRecords(originalRecords);
}

// Usage
const restoreData = filterTable(table, record => record.salary > 70000);
// Later: restoreData(); to show all data again
```

## Data Validation

### Client-side Validation
```javascript
const table = new VTable.ListTable({
  container: document.getElementById('container'),
  records: data,
  columns: [
    {
      field: 'email',
      caption: 'Email',
      width: 200,
      editor: 'input',
      style: {
        bgColor: (args) => {
          const email = args.dataValue;
          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          return isValid ? '#ffffff' : '#ffebee';
        }
      }
    },
    {
      field: 'age',
      caption: 'Age',
      width: 80,
      editor: 'input',
      style: {
        bgColor: (args) => {
          const age = Number(args.dataValue);
          return (age >= 18 && age <= 65) ? '#ffffff' : '#ffebee';
        }
      }
    }
  ]
});

// Validation on cell change
table.on('change_cell_value', (args) => {
  const { field, newValue, col, row } = args;
  
  let isValid = true;
  let errorMessage = '';
  
  switch (field) {
    case 'email':
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue);
      errorMessage = 'Please enter a valid email address';
      break;
    case 'age':
      const age = Number(newValue);
      isValid = age >= 18 && age <= 65;
      errorMessage = 'Age must be between 18 and 65';
      break;
    case 'salary':
      const salary = Number(newValue);
      isValid = salary > 0;
      errorMessage = 'Salary must be greater than 0';
      break;
  }
  
  if (!isValid) {
    // Revert the change
    table.changeCellValue(col, row, args.oldValue);
    
    // Show error message
    showErrorMessage(errorMessage);
  } else {
    // Save to backend
    saveRecordUpdate(args);
  }
});

function showErrorMessage(message) {
  // Implementation depends on your UI framework
  console.error(message);
  // Or show toast, modal, etc.
}
```

### Data Type Enforcement
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
    return types;
  }
  
  setupTypeValidation() {
    this.on('change_cell_value', (args) => {
      const { field, newValue } = args;
      const expectedType = this.columnTypes[field];
      
      if (expectedType && !this.validateType(newValue, expectedType)) {
        // Revert invalid change
        this.changeCellValue(args.col, args.row, args.oldValue);
        console.error(`Invalid type for ${field}. Expected ${expectedType}`);
      }
    });
  }
  
  validateType(value, type) {
    switch (type) {
      case 'number':
        return !isNaN(Number(value)) && isFinite(Number(value));
      case 'integer':
        return Number.isInteger(Number(value));
      case 'string':
        return typeof value === 'string';
      case 'boolean':
        return typeof value === 'boolean' || value === 'true' || value === 'false';
      case 'date':
        return !isNaN(Date.parse(value));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  }
}

// Usage
const typedTable = new TypedTable({
  container: document.getElementById('container'),
  records: data,
  columns: [
    { field: 'id', caption: 'ID', width: 80, dataType: 'integer' },
    { field: 'name', caption: 'Name', width: 150, dataType: 'string' },
    { field: 'email', caption: 'Email', width: 200, dataType: 'email' },
    { field: 'salary', caption: 'Salary', width: 100, dataType: 'number' },
    { field: 'active', caption: 'Active', width: 80, dataType: 'boolean' },
    { field: 'hireDate', caption: 'Hire Date', width: 120, dataType: 'date' }
  ]
});
```

## Data Formatting and Transformation

### Value Formatters
```javascript
const table = new VTable.ListTable({
  container: document.getElementById('container'),
  records: data,
  columns: [
    {
      field: 'salary',
      caption: 'Salary',
      width: 120,
      format: (value) => {
        return '$' + Number(value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    },
    {
      field: 'percentage',
      caption: 'Performance',
      width: 100,
      format: (value) => {
        return (Number(value) * 100).toFixed(1) + '%';
      }
    },
    {
      field: 'hireDate',
      caption: 'Hire Date',
      width: 120,
      format: (value) => {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      field: 'status',
      caption: 'Status',
      width: 100,
      format: (value) => {
        const statusMap = {
          'A': 'Active',
          'I': 'Inactive',
          'P': 'Pending'
        };
        return statusMap[value] || value;
      }
    }
  ]
});
```

### Data Preprocessing
```javascript
// Transform data before creating table
function preprocessData(rawData) {
  return rawData.map(record => ({
    ...record,
    // Calculate derived fields
    fullName: `${record.firstName} ${record.lastName}`,
    yearsEmployed: new Date().getFullYear() - new Date(record.hireDate).getFullYear(),
    salaryRange: categorySalary(record.salary),
    // Normalize values
    department: record.department.toUpperCase(),
    email: record.email.toLowerCase(),
    // Parse dates
    hireDate: new Date(record.hireDate),
    // Convert strings to numbers
    salary: Number(record.salary),
    age: Number(record.age)
  }));
}

function categorySalary(salary) {
  if (salary < 50000) return 'Entry Level';
  if (salary < 75000) return 'Mid Level';
  if (salary < 100000) return 'Senior Level';
  return 'Executive Level';
}

// Usage
const processedData = preprocessData(rawApiData);
const table = new VTable.ListTable({
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
    
    this.table = new VTable.ListTable({
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
      <button id="prev-page">Previous</button>
      <span id="page-info"></span>
      <button id="next-page">Next</button>
    `;
    
    this.table.container.parentNode.appendChild(controls);
    
    document.getElementById('prev-page').onclick = () => this.previousPage();
    document.getElementById('next-page').onclick = () => this.nextPage();
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
    document.getElementById('page-info').textContent = 
      `Page ${this.currentPage} of ${totalPages} (${this.totalRecords} total records)`;
    
    document.getElementById('prev-page').disabled = this.currentPage === 1;
    document.getElementById('next-page').disabled = this.currentPage === totalPages;
  }
}
```

### Virtual Scrolling for Large Datasets
```javascript
const largeTable = new VTable.ListTable({
  container: document.getElementById('container'),
  records: [], // Start empty
  columns: columns,
  // Enable virtual scrolling
  scrollMode: 'virtual',
  // Optimize for large datasets
  overscanRowCount: 10,
  defaultRowHeight: 40
});

// Load data in chunks
class VirtualDataLoader {
  constructor(table, dataSource, chunkSize = 1000) {
    this.table = table;
    this.dataSource = dataSource;
    this.chunkSize = chunkSize;
    this.loadedChunks = new Set();
    this.totalRecords = 0;
    
    this.setupScrollListener();
  }
  
  async initialize() {
    // Get total count
    this.totalRecords = await this.dataSource.getCount();
    
    // Load first chunk
    await this.loadChunk(0);
  }
  
  setupScrollListener() {
    this.table.on('scroll', (args) => {
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
    if (this.loadedChunks.has(chunkIndex)) return;
    
    const offset = chunkIndex * this.chunkSize;
    const chunkData = await this.dataSource.getData(offset, this.chunkSize);
    
    // Merge with existing data
    const currentRecords = this.table.records;
    const newRecords = [...currentRecords];
    
    // Insert chunk data at correct position
    for (let i = 0; i < chunkData.length; i++) {
      newRecords[offset + i] = chunkData[i];
    }
    
    this.table.updateRecords(newRecords);
    this.loadedChunks.add(chunkIndex);
  }
}

// Data source interface
class APIDataSource {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async getCount() {
    const response = await fetch(`${this.baseUrl}/count`);
    const data = await response.json();
    return data.count;
  }
  
  async getData(offset, limit) {
    const response = await fetch(`${this.baseUrl}/data?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.records;
  }
}

// Usage
const dataSource = new APIDataSource('/api/employees');
const loader = new VirtualDataLoader(largeTable, dataSource);
loader.initialize();
```

This comprehensive data handling guide covers all aspects of working with data in VTable, from basic operations to advanced scenarios with large datasets and real-time updates.