# React Integration Guide for VTable

This comprehensive guide covers everything you need to integrate VTable with React applications, from basic usage to advanced patterns and optimizations.

## Installation and Setup

### Installing React VTable

```bash
# Install both the core library and React wrapper
npm install @visactor/vtable @visactor/react-vtable

# Or with yarn
yarn add @visactor/vtable @visactor/react-vtable

# Or with pnpm
pnpm add @visactor/vtable @visactor/react-vtable
```

### Basic Integration

```jsx
import React, { useState, useEffect } from 'react';
import { ListTable } from '@visactor/react-vtable';

function BasicTable() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Load your data
    setData([
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
      // ... more data
    ]);
  }, []);

  const columns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 },
    { field: 'status', caption: 'Status', width: 120 }
  ];

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ListTable
        columns={columns}
        records={data}
        defaultRowHeight={40}
        defaultHeaderRowHeight={50}
      />
    </div>
  );
}

export default BasicTable;
```

## Advanced React Patterns

### 1. Using Hooks for State Management

```jsx
import React, { useState, useCallback, useMemo } from 'react';
import { ListTable } from '@visactor/react-vtable';

function useTableData(initialData = []) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addRecord = useCallback((record) => {
    setData(prev => [...prev, { ...record, id: Date.now() }]);
  }, []);
  
  const updateRecord = useCallback((id, updates) => {
    setData(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  }, []);
  
  const deleteRecord = useCallback((id) => {
    setData(prev => prev.filter(record => record.id !== id));
  }, []);
  
  const loadData = useCallback(async (fetchFn) => {
    setLoading(true);
    setError(null);
    try {
      const newData = await fetchFn();
      setData(newData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    data,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    loadData
  };
}

function AdvancedTable() {
  const { data, loading, error, addRecord, updateRecord, deleteRecord } = useTableData();
  
  const columns = useMemo(() => [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { 
      field: 'email', 
      caption: 'Email', 
      width: 250,
      editor: 'input'
    },
    { 
      field: 'status', 
      caption: 'Status', 
      width: 120,
      editor: 'select',
      editorOptions: {
        values: ['Active', 'Inactive', 'Pending']
      }
    },
    {
      field: 'actions',
      caption: 'Actions',
      width: 150,
      cellType: 'button',
      customRender: ({ record }) => (
        <button onClick={() => deleteRecord(record.id)}>
          Delete
        </button>
      )
    }
  ], [deleteRecord]);
  
  const handleCellEdit = useCallback((args) => {
    const { row, field, value } = args;
    const record = data[row];
    if (record) {
      updateRecord(record.id, { [field]: value });
    }
  }, [data, updateRecord]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <button 
        onClick={() => addRecord({ 
          name: 'New User', 
          email: 'new@example.com', 
          status: 'Pending' 
        })}
        style={{ marginBottom: '10px' }}
      >
        Add Record
      </button>
      
      <ListTable
        columns={columns}
        records={data}
        onAfterCellEdit={handleCellEdit}
        defaultRowHeight={40}
        defaultHeaderRowHeight={50}
      />
    </div>
  );
}
```

### 2. Context and State Management Integration

```jsx
import React, { createContext, useContext, useReducer } from 'react';
import { ListTable } from '@visactor/react-vtable';

// Table state management
const TableContext = createContext();

const tableReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'ADD_RECORD':
      return { ...state, data: [...state.data, action.payload] };
    case 'UPDATE_RECORD':
      return {
        ...state,
        data: state.data.map(record =>
          record.id === action.payload.id ? action.payload : record
        )
      };
    case 'DELETE_RECORD':
      return {
        ...state,
        data: state.data.filter(record => record.id !== action.payload)
      };
    case 'SET_SELECTION':
      return { ...state, selection: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    default:
      return state;
  }
};

export function TableProvider({ children }) {
  const [state, dispatch] = useReducer(tableReducer, {
    data: [],
    selection: [],
    filter: null,
    sort: null
  });
  
  const value = {
    ...state,
    dispatch,
    setData: (data) => dispatch({ type: 'SET_DATA', payload: data }),
    addRecord: (record) => dispatch({ type: 'ADD_RECORD', payload: record }),
    updateRecord: (record) => dispatch({ type: 'UPDATE_RECORD', payload: record }),
    deleteRecord: (id) => dispatch({ type: 'DELETE_RECORD', payload: id }),
    setSelection: (selection) => dispatch({ type: 'SET_SELECTION', payload: selection }),
    setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    setSort: (sort) => dispatch({ type: 'SET_SORT', payload: sort })
  };
  
  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}

function ConnectedTable() {
  const { data, selection, setSelection, updateRecord } = useTable();
  
  const columns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 },
    { field: 'status', caption: 'Status', width: 120 }
  ];
  
  return (
    <ListTable
      columns={columns}
      records={data}
      select={{
        enableRowSelect: true,
        enableColumnSelect: false
      }}
      onSelectionChanged={(selection) => setSelection(selection)}
      onAfterCellEdit={(args) => {
        const { row, field, value } = args;
        const record = { ...data[row], [field]: value };
        updateRecord(record);
      }}
    />
  );
}
```

### 3. Performance Optimization with React

```jsx
import React, { memo, useMemo, useCallback, useRef } from 'react';
import { ListTable } from '@visactor/react-vtable';

// Memoized table component for performance
const OptimizedTable = memo(({ 
  data, 
  columns, 
  onCellEdit, 
  onSelectionChange,
  height = 600 
}) => {
  const tableRef = useRef(null);
  
  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, [columns]);
  
  // Memoize data transformation
  const processedData = useMemo(() => {
    // Apply any data transformations here
    return data.map(record => ({
      ...record,
      // Add computed fields if needed
      fullName: `${record.firstName} ${record.lastName}`
    }));
  }, [data]);
  
  // Stable event handlers
  const handleCellEdit = useCallback((args) => {
    if (onCellEdit) {
      onCellEdit(args);
    }
  }, [onCellEdit]);
  
  const handleSelectionChange = useCallback((selection) => {
    if (onSelectionChange) {
      onSelectionChange(selection);
    }
  }, [onSelectionChange]);
  
  return (
    <div style={{ width: '100%', height: height }}>
      <ListTable
        ref={tableRef}
        columns={memoizedColumns}
        records={processedData}
        onAfterCellEdit={handleCellEdit}
        onSelectionChanged={handleSelectionChange}
        // Performance optimizations
        defaultRowHeight={40}
        defaultHeaderRowHeight={50}
        enabledTreeStick={false}
        pixelRatio={window.devicePixelRatio || 1}
      />
    </div>
  );
});

OptimizedTable.displayName = 'OptimizedTable';
```

### 4. Custom Cell Renderers with React Components

```jsx
import React from 'react';
import { ListTable } from '@visactor/react-vtable';

// Custom React component for cell rendering
function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Inactive': return '#ef4444';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };
  
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: getStatusColor(status)
      }}
    >
      {status}
    </span>
  );
}

function ActionButtons({ record, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => onEdit(record)}
        style={{
          padding: '4px 8px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(record.id)}
        style={{
          padding: '4px 8px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
}

function TableWithCustomRenderers() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    // ... more data
  ];
  
  const handleEdit = useCallback((record) => {
    console.log('Edit record:', record);
  }, []);
  
  const handleDelete = useCallback((id) => {
    console.log('Delete record:', id);
  }, []);
  
  const columns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 },
    {
      field: 'status',
      caption: 'Status',
      width: 120,
      customRender: ({ value }) => <StatusBadge status={value} />
    },
    {
      field: 'actions',
      caption: 'Actions',
      width: 200,
      customRender: ({ record }) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )
    }
  ];
  
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ListTable
        columns={columns}
        records={data}
        defaultRowHeight={50}
        defaultHeaderRowHeight={50}
      />
    </div>
  );
}
```

## React Hooks for VTable

### Custom Hook for Table Management

```jsx
import { useState, useCallback, useRef, useEffect } from 'react';

export function useVTable(initialData = [], initialColumns = []) {
  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState(initialColumns);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  
  // Data operations
  const addRecord = useCallback((record) => {
    setData(prev => [...prev, { ...record, id: Date.now() }]);
  }, []);
  
  const updateRecord = useCallback((id, updates) => {
    setData(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  }, []);
  
  const deleteRecord = useCallback((id) => {
    setData(prev => prev.filter(record => record.id !== id));
  }, []);
  
  const bulkDelete = useCallback((ids) => {
    setData(prev => prev.filter(record => !ids.includes(record.id)));
  }, []);
  
  // Table operations
  const exportData = useCallback((format = 'csv') => {
    if (tableRef.current) {
      tableRef.current.exportCsv();
    }
  }, []);
  
  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.updateSize();
    }
  }, []);
  
  // Filter operations
  const filterData = useCallback((predicate) => {
    const filtered = initialData.filter(predicate);
    setData(filtered);
  }, [initialData]);
  
  const clearFilter = useCallback(() => {
    setData(initialData);
  }, [initialData]);
  
  // Sort operations
  const sortData = useCallback((field, order = 'asc') => {
    setData(prev => [...prev].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    }));
  }, []);
  
  return {
    // State
    data,
    columns,
    selection,
    loading,
    error,
    tableRef,
    
    // Data operations
    addRecord,
    updateRecord,
    deleteRecord,
    bulkDelete,
    
    // Table operations
    exportData,
    refreshTable,
    
    // Filter operations
    filterData,
    clearFilter,
    
    // Sort operations
    sortData,
    
    // State setters
    setData,
    setColumns,
    setSelection,
    setLoading,
    setError
  };
}
```

### Usage of Custom Hook

```jsx
import React from 'react';
import { ListTable } from '@visactor/react-vtable';
import { useVTable } from './hooks/useVTable';

function SmartTable() {
  const {
    data,
    columns,
    selection,
    loading,
    tableRef,
    addRecord,
    updateRecord,
    deleteRecord,
    bulkDelete,
    exportData,
    setSelection
  } = useVTable(
    // Initial data
    [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
    ],
    // Initial columns
    [
      { field: 'id', caption: 'ID', width: 80 },
      { field: 'name', caption: 'Name', width: 200 },
      { field: 'email', caption: 'Email', width: 250 },
      { field: 'status', caption: 'Status', width: 120 }
    ]
  );
  
  const handleSelectionChange = useCallback((newSelection) => {
    setSelection(newSelection);
  }, [setSelection]);
  
  const handleBulkDelete = useCallback(() => {
    if (selection.length > 0) {
      const selectedIds = selection.map(sel => data[sel.row].id);
      bulkDelete(selectedIds);
      setSelection([]);
    }
  }, [selection, data, bulkDelete, setSelection]);
  
  return (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => addRecord({ 
          name: 'New User', 
          email: 'new@example.com', 
          status: 'Pending' 
        })}>
          Add Record
        </button>
        
        <button 
          onClick={handleBulkDelete}
          disabled={selection.length === 0}
        >
          Delete Selected ({selection.length})
        </button>
        
        <button onClick={() => exportData('csv')}>
          Export CSV
        </button>
      </div>
      
      <div style={{ width: '100%', height: '600px' }}>
        <ListTable
          ref={tableRef}
          columns={columns}
          records={data}
          select={{
            enableRowSelect: true,
            enableMultiSelect: true
          }}
          onSelectionChanged={handleSelectionChange}
          onAfterCellEdit={(args) => {
            const { row, field, value } = args;
            const record = data[row];
            updateRecord(record.id, { [field]: value });
          }}
          defaultRowHeight={40}
          defaultHeaderRowHeight={50}
        />
      </div>
    </div>
  );
}
```

## Integration with Popular React Libraries

### 1. React Router Integration

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { ListTable } from '@visactor/react-vtable';

function UserTable() {
  const navigate = useNavigate();
  
  const columns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 },
    {
      field: 'actions',
      caption: 'Actions',
      width: 150,
      customRender: ({ record }) => (
        <button onClick={() => navigate(`/user/${record.id}`)}>
          View Details
        </button>
      )
    }
  ];
  
  return (
    <ListTable
      columns={columns}
      records={data}
      onDoubleClickCell={(args) => {
        const record = data[args.row];
        navigate(`/user/${record.id}`);
      }}
    />
  );
}

function UserDetail() {
  const { id } = useParams();
  // Load and display user details
  return <div>User Details for ID: {id}</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserTable />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
}
```

### 2. Redux Integration

```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListTable } from '@visactor/react-vtable';

// Redux actions
const ADD_RECORD = 'ADD_RECORD';
const UPDATE_RECORD = 'UPDATE_RECORD';
const DELETE_RECORD = 'DELETE_RECORD';
const SET_SELECTION = 'SET_SELECTION';

export const addRecord = (record) => ({ type: ADD_RECORD, payload: record });
export const updateRecord = (id, updates) => ({ type: UPDATE_RECORD, payload: { id, updates } });
export const deleteRecord = (id) => ({ type: DELETE_RECORD, payload: id });
export const setSelection = (selection) => ({ type: SET_SELECTION, payload: selection });

// Redux reducer
const initialState = {
  data: [],
  selection: []
};

export const tableReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RECORD:
      return {
        ...state,
        data: [...state.data, { ...action.payload, id: Date.now() }]
      };
    case UPDATE_RECORD:
      return {
        ...state,
        data: state.data.map(record =>
          record.id === action.payload.id
            ? { ...record, ...action.payload.updates }
            : record
        )
      };
    case DELETE_RECORD:
      return {
        ...state,
        data: state.data.filter(record => record.id !== action.payload)
      };
    case SET_SELECTION:
      return {
        ...state,
        selection: action.payload
      };
    default:
      return state;
  }
};

// Connected component
function ReduxTable() {
  const { data, selection } = useSelector(state => state.table);
  const dispatch = useDispatch();
  
  const columns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 }
  ];
  
  return (
    <div>
      <button onClick={() => dispatch(addRecord({ 
        name: 'New User', 
        email: 'new@example.com' 
      }))}>
        Add Record
      </button>
      
      <ListTable
        columns={columns}
        records={data}
        onSelectionChanged={(sel) => dispatch(setSelection(sel))}
        onAfterCellEdit={(args) => {
          const { row, field, value } = args;
          const record = data[row];
          dispatch(updateRecord(record.id, { [field]: value }));
        }}
      />
    </div>
  );
}
```

## Best Practices

### 1. Performance Optimization

```jsx
// Use React.memo for stable props
const MemoizedTable = React.memo(ListTable, (prevProps, nextProps) => {
  return (
    prevProps.records === nextProps.records &&
    prevProps.columns === nextProps.columns
  );
});

// Use useMemo for expensive computations
const processedData = useMemo(() => {
  return data.map(record => ({
    ...record,
    computedField: expensiveComputation(record)
  }));
}, [data]);

// Use useCallback for event handlers
const handleCellEdit = useCallback((args) => {
  // Handle edit
}, [dependencies]);
```

### 2. Error Handling

```jsx
import React, { ErrorBoundary } from 'react';

class TableErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Table error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong with the table.</h2>
          <details>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

function SafeTable(props) {
  return (
    <TableErrorBoundary>
      <ListTable {...props} />
    </TableErrorBoundary>
  );
}
```

### 3. Testing

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListTable } from '@visactor/react-vtable';

describe('VTable Integration', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' }
  ];
  
  const mockColumns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 }
  ];
  
  test('renders table with data', () => {
    render(
      <ListTable
        columns={mockColumns}
        records={mockData}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  test('handles cell edit', () => {
    const handleEdit = jest.fn();
    
    render(
      <ListTable
        columns={mockColumns}
        records={mockData}
        onAfterCellEdit={handleEdit}
      />
    );
    
    // Simulate cell edit
    // ... test implementation
    
    expect(handleEdit).toHaveBeenCalled();
  });
});
```

This comprehensive React integration guide provides everything needed to effectively use VTable in React applications, from basic usage to advanced patterns and best practices.