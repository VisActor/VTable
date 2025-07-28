# React Integration Guide для Vтаблица

This comprehensive guide covers everything you need к integrate Vтаблица с React applications, от базовый usвозраст к advanced patterns и optimizations.

## Installation и Setup

### Installing React Vтаблица

```bash
# Install both the core library и React wrapper
npm install @visactor/vтаблица @visactor/react-vтаблица

# или с yarn
yarn add @visactor/vтаблица @visactor/react-vтаблица

# или с pnpm
pnpm add @visactor/vтаблица @visactor/react-vтаблица
```

### базовый Integration

```jsx
import React, { useState, useEffect } от 'react';
import { списоктаблица } от '@visactor/react-vтаблица';

функция базовыйтаблица() {
  const [данные, setданные] = useState([]);
  
  useEffect(() => {
    // Load your данные
    setданные([
      { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
      { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' },
      // ... more данные
    ]);
  }, []);

  const columns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 },
    { поле: 'status', caption: 'Status', ширина: 120 }
  ];

  возврат (
    <div style={{ ширина: '100%', высота: '600px' }}>
      <списоктаблица
        columns={columns}
        records={данные}
        defaultRowвысота={40}
        defaultHeaderRowвысота={50}
      />
    </div>
  );
}

export по умолчанию базовыйтаблица;
```

## Advanced React Patterns

### 1. Using Hoхорошоs для State Manвозрастment

```jsx
import React, { useState, useCallback, useMemo } от 'react';
import { списоктаблица } от '@visactor/react-vтаблица';

функция useтаблицаданные(initialданные = []) {
  const [данные, setданные] = useState(initialданные);
  const [загрузка, setLoading] = useState(false);
  const [ошибка, setError] = useState(null);
  
  const addRecord = useCallback((record) => {
    setданные(prev => [...prev, { ...record, id: Date.now() }]);
  }, []);
  
  const updateRecord = useCallback((id, updates) => {
    setданные(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  }, []);
  
  const deleteRecord = useCallback((id) => {
    setданные(prev => prev.filter(record => record.id !== id));
  }, []);
  
  const loadданные = useCallback(async (fetchFn) => {
    setLoading(true);
    setError(null);
    try {
      const newданные = await fetchFn();
      setданные(newданные);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  возврат {
    данные,
    загрузка,
    ошибка,
    addRecord,
    updateRecord,
    deleteRecord,
    loadданные
  };
}

функция Advancedтаблица() {
  const { данные, загрузка, ошибка, addRecord, updateRecord, deleteRecord } = useтаблицаданные();
  
  const columns = useMemo(() => [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { 
      поле: 'email', 
      caption: 'Email', 
      ширина: 250,
      editor: 'ввод'
    },
    { 
      поле: 'status', 
      caption: 'Status', 
      ширина: 120,
      editor: 'выбрать',
      editorOptions: {
        values: ['активный', 'неактивный', 'Pending']
      }
    },
    {
      поле: 'actions',
      caption: 'Actions',
      ширина: 150,
      cellType: 'Кнопка',
      пользовательскийRender: ({ record }) => (
        <Кнопка onНажать={() => deleteRecord(record.id)}>
          Delete
        </Кнопка>
      )
    }
  ], [deleteRecord]);
  
  const handleCellEdit = useCallback((args) => {
    const { row, поле, значение } = args;
    const record = данные[row];
    if (record) {
      updateRecord(record.id, { [поле]: значение });
    }
  }, [данные, updateRecord]);
  
  if (загрузка) возврат <div>загрузка...</div>;
  if (ошибка) возврат <div>ошибка: {ошибка.messвозраст}</div>;
  
  возврат (
    <div style={{ ширина: '100%', высота: '600px' }}>
      <Кнопка 
        onНажать={() => addRecord({ 
          имя: 'новый User', 
          email: 'новый@пример.com', 
          status: 'Pending' 
        })}
        style={{ marginBottom: '10px' }}
      >
        Add Record
      </Кнопка>
      
      <списоктаблица
        columns={columns}
        records={данные}
        onAfterCellEdit={handleCellEdit}
        defaultRowвысота={40}
        defaultHeaderRowвысота={50}
      />
    </div>
  );
}
```

### 2. Context и State Manвозрастment Integration

```jsx
import React, { createContext, useContext, useReducer } от 'react';
import { списоктаблица } от '@visactor/react-vтаблица';

// таблица state manвозрастment
const таблицаContext = createContext();

const таблицаReducer = (state, action) => {
  switch (action.тип) {
    case 'SET_данные':
      возврат { ...state, данные: action.payload };
    case 'ADD_RECORD':
      возврат { ...state, данные: [...state.данные, action.payload] };
    case 'UPDATE_RECORD':
      возврат {
        ...state,
        данные: state.данные.map(record =>
          record.id === action.payload.id ? action.payload : record
        )
      };
    case 'DELETE_RECORD':
      возврат {
        ...state,
        данные: state.данные.filter(record => record.id !== action.payload)
      };
    case 'SET_SELECTION':
      возврат { ...state, selection: action.payload };
    case 'SET_FILTER':
      возврат { ...state, filter: action.payload };
    case 'SET_сортировка':
      возврат { ...state, сортировка: action.payload };
    по умолчанию:
      возврат state;
  }
};

export функция таблицаProvider({ children }) {
  const [state, dispatch] = useReducer(таблицаReducer, {
    данные: [],
    selection: [],
    filter: null,
    сортировка: null
  });
  
  const значение = {
    ...state,
    dispatch,
    setданные: (данные) => dispatch({ тип: 'SET_данные', payload: данные }),
    addRecord: (record) => dispatch({ тип: 'ADD_RECORD', payload: record }),
    updateRecord: (record) => dispatch({ тип: 'UPDATE_RECORD', payload: record }),
    deleteRecord: (id) => dispatch({ тип: 'DELETE_RECORD', payload: id }),
    setSelection: (selection) => dispatch({ тип: 'SET_SELECTION', payload: selection }),
    setFilter: (filter) => dispatch({ тип: 'SET_FILTER', payload: filter }),
    setсортировка: (сортировка) => dispatch({ тип: 'SET_сортировка', payload: сортировка })
  };
  
  возврат (
    <таблицаContext.Provider значение={значение}>
      {children}
    </таблицаContext.Provider>
  );
}

export функция useтаблица() {
  const context = useContext(таблицаContext);
  if (!context) {
    throw новый ошибка('useтаблица must be used within a таблицаProvider');
  }
  возврат context;
}

функция Connectedтаблица() {
  const { данные, selection, setSelection, updateRecord } = useтаблица();
  
  const columns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 },
    { поле: 'status', caption: 'Status', ширина: 120 }
  ];
  
  возврат (
    <списоктаблица
      columns={columns}
      records={данные}
      выбрать={{
        enableRowSelect: true,
        enableColumnSelect: false
      }}
      onSelectionChanged={(selection) => setSelection(selection)}
      onAfterCellEdit={(args) => {
        const { row, поле, значение } = args;
        const record = { ...данные[row], [поле]: значение };
        updateRecord(record);
      }}
    />
  );
}
```

### 3. Производительность Optimization с React

```jsx
import React, { memo, useMemo, useCallback, useRef } от 'react';
import { списоктаблица } от '@visactor/react-vтаблица';

// Memoized таблица компонент для Производительность
const Optimizedтаблица = memo(({ 
  данные, 
  columns, 
  onCellEdit, 
  onSelectionChange,
  высота = 600 
}) => {
  const таблицаRef = useRef(null);
  
  // Memoize columns к prсобытие unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, [columns]);
  
  // Memoize данные transformation
  const processedданные = useMemo(() => {
    // Apply любой данные transformations here
    возврат данные.map(record => ({
      ...record,
      // Add computed полеs if needed
      fullимя: `${record.firstимя} ${record.lastимя}`
    }));
  }, [данные]);
  
  // Sтаблица событие handlers
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
  
  возврат (
    <div style={{ ширина: '100%', высота: высота }}>
      <списоктаблица
        ref={таблицаRef}
        columns={memoizedColumns}
        records={processedданные}
        onAfterCellEdit={handleCellEdit}
        onSelectionChanged={handleSelectionChange}
        // Производительность optimizations
        defaultRowвысота={40}
        defaultHeaderRowвысота={50}
        enabledTreeStick={false}
        pixelRatio={window.devicePixelRatio || 1}
      />
    </div>
  );
});

Optimizedтаблица.displayимя = 'Optimizedтаблица';
```

### 4. пользовательский Cell Renderers с React компонентs

```jsx
import React от 'react';
import { списоктаблица } от '@visactor/react-vтаблица';

// пользовательский React компонент для cell rendering
функция StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'активный': возврат '#10b981';
      case 'неактивный': возврат '#ef4444';
      case 'Pending': возврат '#f59e0b';
      по умолчанию: возврат '#6b7280';
    }
  };
  
  возврат (
    <span
      style={{
        display: 'inline-block',
        заполнение: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        цвет: 'white',
        backgroundColor: getStatusColor(status)
      }}
    >
      {status}
    </span>
  );
}

функция ActionКнопкаs({ record, onEdit, onDelete }) {
  возврат (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Кнопка
        onНажать={() => onEdit(record)}
        style={{
          заполнение: '4px 8px',
          backgroundColor: '#3b82f6',
          цвет: 'white',
          bпорядок: 'никто',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Edit
      </Кнопка>
      <Кнопка
        onНажать={() => onDelete(record.id)}
        style={{
          заполнение: '4px 8px',
          backgroundColor: '#ef4444',
          цвет: 'white',
          bпорядок: 'никто',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Delete
      </Кнопка>
    </div>
  );
}

функция таблицаWithпользовательскийRenderers() {
  const данные = [
    { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
    { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' },
    // ... more данные
  ];
  
  const handleEdit = useCallback((record) => {
    console.log('Edit record:', record);
  }, []);
  
  const handleDelete = useCallback((id) => {
    console.log('Delete record:', id);
  }, []);
  
  const columns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 },
    {
      поле: 'status',
      caption: 'Status',
      ширина: 120,
      пользовательскийRender: ({ значение }) => <StatusBadge status={значение} />
    },
    {
      поле: 'actions',
      caption: 'Actions',
      ширина: 200,
      пользовательскийRender: ({ record }) => (
        <ActionКнопкаs
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )
    }
  ];
  
  возврат (
    <div style={{ ширина: '100%', высота: '600px' }}>
      <списоктаблица
        columns={columns}
        records={данные}
        defaultRowвысота={50}
        defaultHeaderRowвысота={50}
      />
    </div>
  );
}
```

## React Hoхорошоs для Vтаблица

### пользовательский Hoхорошо для таблица Manвозрастment

```jsx
import { useState, useCallback, useRef, useEffect } от 'react';

export функция useVтаблица(initialданные = [], initialColumns = []) {
  const [данные, setданные] = useState(initialданные);
  const [columns, setColumns] = useState(initialColumns);
  const [selection, setSelection] = useState([]);
  const [загрузка, setLoading] = useState(false);
  const [ошибка, setError] = useState(null);
  const таблицаRef = useRef(null);
  
  // данные operations
  const addRecord = useCallback((record) => {
    setданные(prev => [...prev, { ...record, id: Date.now() }]);
  }, []);
  
  const updateRecord = useCallback((id, updates) => {
    setданные(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  }, []);
  
  const deleteRecord = useCallback((id) => {
    setданные(prev => prev.filter(record => record.id !== id));
  }, []);
  
  const bulkDelete = useCallback((ids) => {
    setданные(prev => prev.filter(record => !ids.includes(record.id)));
  }, []);
  
  // таблица operations
  const exportданные = useCallback((format = 'csv') => {
    if (таблицаRef.текущий) {
      таблицаRef.текущий.exportCsv();
    }
  }, []);
  
  const refreshтаблица = useCallback(() => {
    if (таблицаRef.текущий) {
      таблицаRef.текущий.updateSize();
    }
  }, []);
  
  // Filter operations
  const filterданные = useCallback((predicate) => {
    const filtered = initialданные.filter(predicate);
    setданные(filtered);
  }, [initialданные]);
  
  const clearFilter = useCallback(() => {
    setданные(initialданные);
  }, [initialданные]);
  
  // сортировка operations
  const сортировкаданные = useCallback((поле, order = 'asc') => {
    setданные(prev => [...prev].сортировка((a, b) => {
      const valueA = a[поле];
      const valueB = b[поле];
      
      if (order === 'asc') {
        возврат valueA > valueB ? 1 : -1;
      } else {
        возврат valueA < valueB ? 1 : -1;
      }
    }));
  }, []);
  
  возврат {
    // State
    данные,
    columns,
    selection,
    загрузка,
    ошибка,
    таблицаRef,
    
    // данные operations
    addRecord,
    updateRecord,
    deleteRecord,
    bulkDelete,
    
    // таблица operations
    exportданные,
    refreshтаблица,
    
    // Filter operations
    filterданные,
    clearFilter,
    
    // сортировка operations
    сортировкаданные,
    
    // State setters
    setданные,
    setColumns,
    setSelection,
    setLoading,
    setError
  };
}
```

### Usвозраст из пользовательский Hoхорошо

```jsx
import React от 'react';
import { списоктаблица } от '@visactor/react-vтаблица';
import { useVтаблица } от './hoхорошоs/useVтаблица';

функция Smartтаблица() {
  const {
    данные,
    columns,
    selection,
    загрузка,
    таблицаRef,
    addRecord,
    updateRecord,
    deleteRecord,
    bulkDelete,
    exportданные,
    setSelection
  } = useVтаблица(
    // Initial данные
    [
      { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
      { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' }
    ],
    // Initial columns
    [
      { поле: 'id', caption: 'ID', ширина: 80 },
      { поле: 'имя', caption: 'имя', ширина: 200 },
      { поле: 'email', caption: 'Email', ширина: 250 },
      { поле: 'status', caption: 'Status', ширина: 120 }
    ]
  );
  
  const handleSelectionChange = useCallback((newSelection) => {
    setSelection(newSelection);
  }, [setSelection]);
  
  const handleBulkDelete = useCallback(() => {
    if (selection.length > 0) {
      const selectedIds = selection.map(sel => данные[sel.row].id);
      bulkDelete(selectedIds);
      setSelection([]);
    }
  }, [selection, данные, bulkDelete, setSelection]);
  
  возврат (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <Кнопка onНажать={() => addRecord({ 
          имя: 'новый User', 
          email: 'новый@пример.com', 
          status: 'Pending' 
        })}>
          Add Record
        </Кнопка>
        
        <Кнопка 
          onНажать={handleBulkDelete}
          отключен={selection.length === 0}
        >
          Delete Selected ({selection.length})
        </Кнопка>
        
        <Кнопка onНажать={() => exportданные('csv')}>
          Export CSV
        </Кнопка>
      </div>
      
      <div style={{ ширина: '100%', высота: '600px' }}>
        <списоктаблица
          ref={таблицаRef}
          columns={columns}
          records={данные}
          выбрать={{
            enableRowSelect: true,
            enableMultiSelect: true
          }}
          onSelectionChanged={handleSelectionChange}
          onAfterCellEdit={(args) => {
            const { row, поле, значение } = args;
            const record = данные[row];
            updateRecord(record.id, { [поле]: значение });
          }}
          defaultRowвысота={40}
          defaultHeaderRowвысота={50}
        />
      </div>
    </div>
  );
}
```

## Integration с Popular React Libraries

### 1. React Router Integration

```jsx
import React от 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } от 'react-router-dom';
import { списоктаблица } от '@visactor/react-vтаблица';

функция Userтаблица() {
  const navigate = useNavigate();
  
  const columns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 },
    {
      поле: 'actions',
      caption: 'Actions',
      ширина: 150,
      пользовательскийRender: ({ record }) => (
        <Кнопка onНажать={() => navigate(`/user/${record.id}`)}>
          View Details
        </Кнопка>
      )
    }
  ];
  
  возврат (
    <списоктаблица
      columns={columns}
      records={данные}
      onDoubleНажатьCell={(args) => {
        const record = данные[args.row];
        navigate(`/user/${record.id}`);
      }}
    />
  );
}

функция UserDetail() {
  const { id } = useParams();
  // Load и display user details
  возврат <div>User Details для ID: {id}</div>;
}

функция App() {
  возврат (
    <Router>
      <Routes>
        <Route path="/" element={<Userтаблица />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
}
```

### 2. Redux Integration

```jsx
import React от 'react';
import { useSelector, useDispatch } от 'react-redux';
import { списоктаблица } от '@visactor/react-vтаблица';

// Redux actions
const ADD_RECORD = 'ADD_RECORD';
const UPDATE_RECORD = 'UPDATE_RECORD';
const DELETE_RECORD = 'DELETE_RECORD';
const SET_SELECTION = 'SET_SELECTION';

export const addRecord = (record) => ({ тип: ADD_RECORD, payload: record });
export const updateRecord = (id, updates) => ({ тип: UPDATE_RECORD, payload: { id, updates } });
export const deleteRecord = (id) => ({ тип: DELETE_RECORD, payload: id });
export const setSelection = (selection) => ({ тип: SET_SELECTION, payload: selection });

// Redux reducer
const initialState = {
  данные: [],
  selection: []
};

export const таблицаReducer = (state = initialState, action) => {
  switch (action.тип) {
    case ADD_RECORD:
      возврат {
        ...state,
        данные: [...state.данные, { ...action.payload, id: Date.now() }]
      };
    case UPDATE_RECORD:
      возврат {
        ...state,
        данные: state.данные.map(record =>
          record.id === action.payload.id
            ? { ...record, ...action.payload.updates }
            : record
        )
      };
    case DELETE_RECORD:
      возврат {
        ...state,
        данные: state.данные.filter(record => record.id !== action.payload)
      };
    case SET_SELECTION:
      возврат {
        ...state,
        selection: action.payload
      };
    по умолчанию:
      возврат state;
  }
};

// Connected компонент
функция Reduxтаблица() {
  const { данные, selection } = useSelector(state => state.таблица);
  const dispatch = useDispatch();
  
  const columns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 }
  ];
  
  возврат (
    <div>
      <Кнопка onНажать={() => dispatch(addRecord({ 
        имя: 'новый User', 
        email: 'новый@пример.com' 
      }))}>
        Add Record
      </Кнопка>
      
      <списоктаблица
        columns={columns}
        records={данные}
        onSelectionChanged={(sel) => dispatch(setSelection(sel))}
        onAfterCellEdit={(args) => {
          const { row, поле, значение } = args;
          const record = данные[row];
          dispatch(updateRecord(record.id, { [поле]: значение }));
        }}
      />
    </div>
  );
}
```

## Best Practices

### 1. Производительность Optimization

```jsx
// Use React.memo для sтаблица props
const Memoizedтаблица = React.memo(списоктаблица, (prevProps, nextProps) => {
  возврат (
    prevProps.records === nextProps.records &&
    prevProps.columns === nextProps.columns
  );
});

// Use useMemo для expensive computations
const processedданные = useMemo(() => {
  возврат данные.map(record => ({
    ...record,
    computedполе: expensiveComputation(record)
  }));
}, [данные]);

// Use useCallback для событие handlers
const handleCellEdit = useCallback((args) => {
  // Handle edit
}, [dependencies]);
```

### 2. ошибка Handling

```jsx
import React, { ErrorBoundary } от 'react';

class таблицаErrorBoundary extends React.компонент {
  constructor(props) {
    super(props);
    this.state = { hasError: false, ошибка: null };
  }
  
  static getDerivedStateFromError(ошибка) {
    возврат { hasError: true, ошибка };
  }
  
  компонентDidCatch(ошибка, errorInfo) {
    console.ошибка('таблица ошибка:', ошибка, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      возврат (
        <div>
          <h2>Something went wrong с the таблица.</h2>
          <details>
            {this.state.ошибка && this.state.ошибка.toString()}
          </details>
        </div>
      );
    }
    
    возврат this.props.children;
  }
}

функция Safeтаблица(props) {
  возврат (
    <таблицаErrorBoundary>
      <списоктаблица {...props} />
    </таблицаErrorBoundary>
  );
}
```

### 3. Testing

```jsx
import React от 'react';
import { render, screen, fireсобытие } от '@testing-library/react';
import { списоктаблица } от '@visactor/react-vтаблица';

describe('Vтаблица Integration', () => {
  const mockданные = [
    { id: 1, имя: 'John Doe', email: 'john@пример.com' }
  ];
  
  const mockColumns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 }
  ];
  
  test('renders таблица с данные', () => {
    render(
      <списоктаблица
        columns={mockColumns}
        records={mockданные}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  test('handles cell edit', () => {
    const handleEdit = jest.fn();
    
    render(
      <списоктаблица
        columns={mockColumns}
        records={mockданные}
        onAfterCellEdit={handleEdit}
      />
    );
    
    // Simulate cell edit
    // ... test implementation
    
    expect(handleEdit).toHaveBeenCalled();
  });
});
```

This comprehensive React integration guide provides everything needed к effectively use Vтаблица в React applications, от базовый usвозраст к advanced patterns и best practices.