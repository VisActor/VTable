# Vue Integration Guide for VTable

This comprehensive guide covers integrating VTable with Vue.js applications, including Vue 2, Vue 3, and the Composition API, with advanced patterns and best practices.

## Installation and Setup

### Installing Vue VTable

```bash
# Install both the core library and Vue wrapper
npm install @visactor/vtable @visactor/vue-vtable

# Or with yarn
yarn add @visactor/vtable @visactor/vue-vtable

# Or with pnpm
pnpm add @visactor/vtable @visactor/vue-vtable
```

### Vue 3 Setup

```vue
<template>
  <div class="table-container">
    <VListTable
      :columns="columns"
      :records="data"
      :defaultRowHeight="40"
      :defaultHeaderRowHeight="50"
      @after-cell-edit="handleCellEdit"
      @selection-changed="handleSelectionChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VListTable } from '@visactor/vue-vtable'

const data = ref([])
const columns = ref([
  { field: 'id', caption: 'ID', width: 80 },
  { field: 'name', caption: 'Name', width: 200 },
  { field: 'email', caption: 'Email', width: 250 },
  { field: 'status', caption: 'Status', width: 120 }
])

onMounted(async () => {
  // Load your data
  data.value = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    // ... more data
  ]
})

const handleCellEdit = (args) => {
  console.log('Cell edited:', args)
  const { row, field, value } = args
  data.value[row][field] = value
}

const handleSelectionChange = (selection) => {
  console.log('Selection changed:', selection)
}
</script>

<style scoped>
.table-container {
  width: 100%;
  height: 600px;
}
</style>
```

### Vue 2 Setup

```vue
<template>
  <div class="table-container">
    <VListTable
      :columns="columns"
      :records="data"
      :defaultRowHeight="40"
      :defaultHeaderRowHeight="50"
      @after-cell-edit="handleCellEdit"
      @selection-changed="handleSelectionChange"
    />
  </div>
</template>

<script>
import { VListTable } from '@visactor/vue-vtable'

export default {
  name: 'BasicTable',
  components: {
    VListTable
  },
  data() {
    return {
      data: [],
      columns: [
        { field: 'id', caption: 'ID', width: 80 },
        { field: 'name', caption: 'Name', width: 200 },
        { field: 'email', caption: 'Email', width: 250 },
        { field: 'status', caption: 'Status', width: 120 }
      ]
    }
  },
  async mounted() {
    // Load your data
    this.data = [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
      // ... more data
    ]
  },
  methods: {
    handleCellEdit(args) {
      console.log('Cell edited:', args)
      const { row, field, value } = args
      this.$set(this.data[row], field, value)
    },
    handleSelectionChange(selection) {
      console.log('Selection changed:', selection)
    }
  }
}
</script>

<style scoped>
.table-container {
  width: 100%;
  height: 600px;
}
</style>
```

## Advanced Vue 3 Patterns with Composition API

### 1. Composable for Table Management

```js
// composables/useVTable.js
import { ref, computed, reactive, toRefs } from 'vue'

export function useVTable(initialData = [], initialColumns = []) {
  const state = reactive({
    data: [...initialData],
    columns: [...initialColumns],
    selection: [],
    loading: false,
    error: null,
    sortField: null,
    sortOrder: 'asc',
    filters: {}
  })
  
  // Computed properties
  const filteredData = computed(() => {
    let result = state.data
    
    // Apply filters
    Object.keys(state.filters).forEach(field => {
      const filterValue = state.filters[field]
      if (filterValue) {
        result = result.filter(record => 
          String(record[field]).toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })
    
    // Apply sorting
    if (state.sortField) {
      result = [...result].sort((a, b) => {
        const valueA = a[state.sortField]
        const valueB = b[state.sortField]
        
        if (state.sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
    }
    
    return result
  })
  
  const selectedRecords = computed(() => {
    return state.selection.map(sel => state.data[sel.row]).filter(Boolean)
  })
  
  // Actions
  const addRecord = (record) => {
    state.data.push({ ...record, id: Date.now() })
  }
  
  const updateRecord = (id, updates) => {
    const index = state.data.findIndex(record => record.id === id)
    if (index !== -1) {
      Object.assign(state.data[index], updates)
    }
  }
  
  const deleteRecord = (id) => {
    const index = state.data.findIndex(record => record.id === id)
    if (index !== -1) {
      state.data.splice(index, 1)
    }
  }
  
  const bulkDelete = (ids) => {
    state.data = state.data.filter(record => !ids.includes(record.id))
  }
  
  const setFilter = (field, value) => {
    if (value) {
      state.filters[field] = value
    } else {
      delete state.filters[field]
    }
  }
  
  const clearFilters = () => {
    state.filters = {}
  }
  
  const setSort = (field, order = 'asc') => {
    state.sortField = field
    state.sortOrder = order
  }
  
  const clearSort = () => {
    state.sortField = null
    state.sortOrder = 'asc'
  }
  
  const setSelection = (selection) => {
    state.selection = selection
  }
  
  const loadData = async (fetchFn) => {
    state.loading = true
    state.error = null
    try {
      const newData = await fetchFn()
      state.data = newData
    } catch (error) {
      state.error = error
    } finally {
      state.loading = false
    }
  }
  
  return {
    // State
    ...toRefs(state),
    
    // Computed
    filteredData,
    selectedRecords,
    
    // Actions
    addRecord,
    updateRecord,
    deleteRecord,
    bulkDelete,
    setFilter,
    clearFilters,
    setSort,
    clearSort,
    setSelection,
    loadData
  }
}
```

### Usage of Composable

```vue
<template>
  <div>
    <!-- Toolbar -->
    <div class="toolbar">
      <button @click="addNewRecord" class="btn-primary">
        Add Record
      </button>
      
      <button 
        @click="handleBulkDelete"
        :disabled="selectedRecords.length === 0"
        class="btn-danger"
      >
        Delete Selected ({{ selectedRecords.length }})
      </button>
      
      <div class="filters">
        <input
          v-model="nameFilter"
          @input="setFilter('name', $event.target.value)"
          placeholder="Filter by name..."
          class="filter-input"
        >
        
        <select
          v-model="statusFilter"
          @change="setFilter('status', $event.target.value)"
          class="filter-select"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
        
        <button @click="clearAllFilters" class="btn-secondary">
          Clear Filters
        </button>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="error">
      Error: {{ error.message }}
    </div>
    
    <!-- Table -->
    <div class="table-container">
      <VListTable
        :columns="enhancedColumns"
        :records="filteredData"
        :defaultRowHeight="40"
        :defaultHeaderRowHeight="50"
        :select="{ enableRowSelect: true, enableMultiSelect: true }"
        @after-cell-edit="handleCellEdit"
        @selection-changed="setSelection"
        @sort="handleSort"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VListTable } from '@visactor/vue-vtable'
import { useVTable } from '@/composables/useVTable'

// Initial data and columns
const initialData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
]

const initialColumns = [
  { field: 'id', caption: 'ID', width: 80 },
  { 
    field: 'name', 
    caption: 'Name', 
    width: 200,
    sort: true
  },
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
    },
    sort: true
  }
]

// Use the composable
const {
  data,
  columns,
  selection,
  loading,
  error,
  filteredData,
  selectedRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  bulkDelete,
  setFilter,
  clearFilters,
  setSort,
  setSelection
} = useVTable(initialData, initialColumns)

// Filter refs
const nameFilter = ref('')
const statusFilter = ref('')

// Enhanced columns with actions
const enhancedColumns = computed(() => [
  ...columns.value,
  {
    field: 'actions',
    caption: 'Actions',
    width: 150,
    customRender: ({ record }) => {
      return `
        <button onclick="editRecord(${record.id})" class="btn-edit">Edit</button>
        <button onclick="deleteRecord(${record.id})" class="btn-delete">Delete</button>
      `
    }
  }
])

// Methods
const addNewRecord = () => {
  addRecord({
    name: 'New User',
    email: 'new@example.com',
    status: 'Pending'
  })
}

const handleBulkDelete = () => {
  if (selectedRecords.value.length > 0) {
    const ids = selectedRecords.value.map(record => record.id)
    bulkDelete(ids)
    setSelection([])
  }
}

const handleCellEdit = (args) => {
  const { row, field, value } = args
  const record = filteredData.value[row]
  updateRecord(record.id, { [field]: value })
}

const handleSort = (args) => {
  const { field, order } = args
  setSort(field, order)
}

const clearAllFilters = () => {
  nameFilter.value = ''
  statusFilter.value = ''
  clearFilters()
}

// Make functions available globally for custom render
window.editRecord = (id) => {
  console.log('Edit record:', id)
  // Implement edit logic
}

window.deleteRecord = (id) => {
  deleteRecord(id)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-input, .filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading, .error {
  padding: 1rem;
  text-align: center;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
```

## Custom Components and Slots

### 1. Custom Cell Components

```vue
<!-- components/StatusBadge.vue -->
<template>
  <span 
    :class="['status-badge', `status-${status.toLowerCase()}`]"
  >
    {{ status }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}
</style>
```

```vue
<!-- components/ActionButtons.vue -->
<template>
  <div class="action-buttons">
    <button 
      @click="$emit('edit', record)"
      class="btn btn-sm btn-primary"
    >
      Edit
    </button>
    
    <button 
      @click="$emit('delete', record.id)"
      class="btn btn-sm btn-danger"
    >
      Delete
    </button>
    
    <button 
      @click="$emit('view', record)"
      class="btn btn-sm btn-info"
    >
      View
    </button>
  </div>
</template>

<script setup>
defineProps({
  record: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete', 'view'])
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.btn-primary { background-color: #007bff; color: white; }
.btn-danger { background-color: #dc3545; color: white; }
.btn-info { background-color: #17a2b8; color: white; }
</style>
```

### Using Custom Components in Table

```vue
<template>
  <div class="table-container">
    <VListTable
      :columns="columns"
      :records="data"
      :defaultRowHeight="50"
      :defaultHeaderRowHeight="50"
    >
      <!-- Custom cell rendering using slots -->
      <template #cell="{ column, record, value }">
        <StatusBadge 
          v-if="column.field === 'status'"
          :status="value"
        />
        
        <ActionButtons
          v-else-if="column.field === 'actions'"
          :record="record"
          @edit="handleEdit"
          @delete="handleDelete"
          @view="handleView"
        />
        
        <span v-else>{{ value }}</span>
      </template>
    </VListTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VListTable } from '@visactor/vue-vtable'
import StatusBadge from './components/StatusBadge.vue'
import ActionButtons from './components/ActionButtons.vue'

const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
])

const columns = ref([
  { field: 'id', caption: 'ID', width: 80 },
  { field: 'name', caption: 'Name', width: 200 },
  { field: 'email', caption: 'Email', width: 250 },
  { field: 'status', caption: 'Status', width: 120 },
  { field: 'actions', caption: 'Actions', width: 200 }
])

const handleEdit = (record) => {
  console.log('Edit record:', record)
  // Implement edit logic
}

const handleDelete = (id) => {
  console.log('Delete record:', id)
  data.value = data.value.filter(record => record.id !== id)
}

const handleView = (record) => {
  console.log('View record:', record)
  // Implement view logic
}
</script>
```

## Integration with Vue Ecosystem

### 1. Vuex Integration

```js
// store/modules/table.js
const state = {
  data: [],
  selection: [],
  loading: false,
  error: null,
  filters: {},
  sort: { field: null, order: 'asc' }
}

const mutations = {
  SET_DATA(state, data) {
    state.data = data
  },
  
  ADD_RECORD(state, record) {
    state.data.push({ ...record, id: Date.now() })
  },
  
  UPDATE_RECORD(state, { id, updates }) {
    const index = state.data.findIndex(record => record.id === id)
    if (index !== -1) {
      Object.assign(state.data[index], updates)
    }
  },
  
  DELETE_RECORD(state, id) {
    state.data = state.data.filter(record => record.id !== id)
  },
  
  SET_SELECTION(state, selection) {
    state.selection = selection
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
  
  SET_FILTER(state, { field, value }) {
    if (value) {
      state.filters = { ...state.filters, [field]: value }
    } else {
      const { [field]: _, ...rest } = state.filters
      state.filters = rest
    }
  },
  
  CLEAR_FILTERS(state) {
    state.filters = {}
  },
  
  SET_SORT(state, { field, order }) {
    state.sort = { field, order }
  }
}

const actions = {
  async loadData({ commit }, fetchFn) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const data = await fetchFn()
      commit('SET_DATA', data)
    } catch (error) {
      commit('SET_ERROR', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  addRecord({ commit }, record) {
    commit('ADD_RECORD', record)
  },
  
  updateRecord({ commit }, { id, updates }) {
    commit('UPDATE_RECORD', { id, updates })
  },
  
  deleteRecord({ commit }, id) {
    commit('DELETE_RECORD', id)
  },
  
  bulkDelete({ commit, state }, ids) {
    ids.forEach(id => commit('DELETE_RECORD', id))
  },
  
  setSelection({ commit }, selection) {
    commit('SET_SELECTION', selection)
  },
  
  setFilter({ commit }, { field, value }) {
    commit('SET_FILTER', { field, value })
  },
  
  clearFilters({ commit }) {
    commit('CLEAR_FILTERS')
  },
  
  setSort({ commit }, { field, order }) {
    commit('SET_SORT', { field, order })
  }
}

const getters = {
  filteredData: (state) => {
    let result = [...state.data]
    
    // Apply filters
    Object.keys(state.filters).forEach(field => {
      const filterValue = state.filters[field]
      if (filterValue) {
        result = result.filter(record => 
          String(record[field]).toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })
    
    // Apply sorting
    if (state.sort.field) {
      result.sort((a, b) => {
        const valueA = a[state.sort.field]
        const valueB = b[state.sort.field]
        
        if (state.sort.order === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
    }
    
    return result
  },
  
  selectedRecords: (state, getters) => {
    return state.selection.map(sel => getters.filteredData[sel.row]).filter(Boolean)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

### Component using Vuex

```vue
<template>
  <div>
    <div class="toolbar">
      <button @click="addRecord" class="btn-primary">
        Add Record
      </button>
      
      <button 
        @click="bulkDelete"
        :disabled="selectedRecords.length === 0"
        class="btn-danger"
      >
        Delete Selected ({{ selectedRecords.length }})
      </button>
      
      <input
        :value="filters.name || ''"
        @input="setFilter({ field: 'name', value: $event.target.value })"
        placeholder="Filter by name..."
        class="filter-input"
      >
    </div>
    
    <div class="table-container">
      <VListTable
        :columns="columns"
        :records="filteredData"
        :loading="loading"
        @after-cell-edit="handleCellEdit"
        @selection-changed="setSelection"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { VListTable } from '@visactor/vue-vtable'

const store = useStore()

// Computed properties from store
const data = computed(() => store.state.table.data)
const filteredData = computed(() => store.getters['table/filteredData'])
const selectedRecords = computed(() => store.getters['table/selectedRecords'])
const loading = computed(() => store.state.table.loading)
const filters = computed(() => store.state.table.filters)

const columns = [
  { field: 'id', caption: 'ID', width: 80 },
  { field: 'name', caption: 'Name', width: 200 },
  { field: 'email', caption: 'Email', width: 250 },
  { field: 'status', caption: 'Status', width: 120 }
]

// Methods
const addRecord = () => {
  store.dispatch('table/addRecord', {
    name: 'New User',
    email: 'new@example.com',
    status: 'Pending'
  })
}

const bulkDelete = () => {
  const ids = selectedRecords.value.map(record => record.id)
  store.dispatch('table/bulkDelete', ids)
}

const handleCellEdit = (args) => {
  const { row, field, value } = args
  const record = filteredData.value[row]
  store.dispatch('table/updateRecord', {
    id: record.id,
    updates: { [field]: value }
  })
}

const setSelection = (selection) => {
  store.dispatch('table/setSelection', selection)
}

const setFilter = ({ field, value }) => {
  store.dispatch('table/setFilter', { field, value })
}
</script>
```

### 2. Vue Router Integration

```vue
<template>
  <div>
    <VListTable
      :columns="columns"
      :records="data"
      @double-click-cell="navigateToDetail"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { VListTable } from '@visactor/vue-vtable'

const router = useRouter()

const columns = [
  { field: 'id', caption: 'ID', width: 80 },
  { field: 'name', caption: 'Name', width: 200 },
  { field: 'email', caption: 'Email', width: 250 },
  {
    field: 'actions',
    caption: 'Actions',
    width: 150,
    customRender: ({ record }) => `
      <button onclick="viewDetail(${record.id})">View Details</button>
    `
  }
]

const navigateToDetail = (args) => {
  const record = data.value[args.row]
  router.push(`/user/${record.id}`)
}

// Make function available globally
window.viewDetail = (id) => {
  router.push(`/user/${id}`)
}
</script>
```

## Performance Optimization

### 1. Virtual Scrolling and Large Datasets

```vue
<template>
  <div>
    <VListTable
      :columns="columns"
      :records="data"
      :virtualized="true"
      :rowHeight="40"
      :bufferSize="10"
      :enableDataLazyLoad="true"
      @data-lazy-load="handleLazyLoad"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref([])
const loading = ref(false)
let currentPage = 0
const pageSize = 100

const handleLazyLoad = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    const newData = await fetchPage(currentPage, pageSize)
    data.value.push(...newData)
    currentPage++
  } finally {
    loading.value = false
  }
}

const fetchPage = async (page, size) => {
  const response = await fetch(`/api/data?page=${page}&size=${size}`)
  return response.json()
}

onMounted(() => {
  handleLazyLoad()
})
</script>
```

### 2. Memoization and Optimization

```vue
<template>
  <div>
    <VListTable
      :columns="memoizedColumns"
      :records="processedData"
      :key="tableKey"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  rawData: Array,
  columnConfig: Array
})

// Memoized columns
const memoizedColumns = computed(() => {
  return props.columnConfig.map(col => ({
    ...col,
    customRender: col.customRender ? 
      memoizeRenderer(col.customRender) : 
      undefined
  }))
})

// Processed data with memoization
const processedData = computed(() => {
  return props.rawData.map(record => ({
    ...record,
    // Add computed fields
    fullName: `${record.firstName} ${record.lastName}`,
    formattedDate: formatDate(record.createdAt)
  }))
})

// Force re-render when needed
const tableKey = ref(0)
const forceUpdate = () => {
  tableKey.value++
}

// Memoization helper
const memoizeRenderer = (renderer) => {
  const cache = new Map()
  
  return (args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = renderer(args)
    cache.set(key, result)
    return result
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(new Date(date))
}
</script>
```

## Testing VTable in Vue

### 1. Unit Testing with Vue Test Utils

```js
// tests/VTableComponent.spec.js
import { mount } from '@vue/test-utils'
import { VListTable } from '@visactor/vue-vtable'

describe('VTable Component', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' }
  ]
  
  const mockColumns = [
    { field: 'id', caption: 'ID', width: 80 },
    { field: 'name', caption: 'Name', width: 200 },
    { field: 'email', caption: 'Email', width: 250 }
  ]
  
  it('renders table with data', () => {
    const wrapper = mount(VListTable, {
      props: {
        columns: mockColumns,
        records: mockData
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    // Add more specific assertions based on your table structure
  })
  
  it('emits cell edit event', async () => {
    const wrapper = mount(VListTable, {
      props: {
        columns: mockColumns,
        records: mockData
      }
    })
    
    // Simulate cell edit
    await wrapper.vm.$emit('after-cell-edit', {
      row: 0,
      field: 'name',
      value: 'Jane Doe'
    })
    
    expect(wrapper.emitted('after-cell-edit')).toBeTruthy()
  })
})
```

### 2. E2E Testing with Cypress

```js
// cypress/integration/vtable.spec.js
describe('VTable Integration', () => {
  beforeEach(() => {
    cy.visit('/table')
  })
  
  it('displays table data', () => {
    cy.get('[data-testid="vtable"]').should('be.visible')
    cy.get('[data-testid="table-row"]').should('have.length.greaterThan', 0)
  })
  
  it('allows cell editing', () => {
    cy.get('[data-testid="editable-cell"]').first().click()
    cy.get('[data-testid="cell-editor"]').type('New Value{enter}')
    cy.get('[data-testid="editable-cell"]').should('contain', 'New Value')
  })
  
  it('handles row selection', () => {
    cy.get('[data-testid="row-checkbox"]').first().click()
    cy.get('[data-testid="selected-count"]').should('contain', '1')
  })
})
```

## Best Practices

### 1. Component Structure

```vue
<template>
  <div class="data-table-wrapper">
    <!-- Header with controls -->
    <TableHeader
      :selected-count="selectedRecords.length"
      :total-count="data.length"
      @add-record="addRecord"
      @bulk-delete="bulkDelete"
      @export="exportData"
    />
    
    <!-- Filters -->
    <TableFilters
      :filters="filters"
      :columns="columns"
      @filter-change="setFilter"
      @clear-filters="clearFilters"
    />
    
    <!-- Main table -->
    <VListTable
      ref="tableRef"
      :columns="columns"
      :records="filteredData"
      :loading="loading"
      v-bind="tableOptions"
      @after-cell-edit="handleCellEdit"
      @selection-changed="setSelection"
    />
    
    <!-- Footer with pagination -->
    <TableFooter
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.data-table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
}
</style>
```

### 2. Error Handling

```vue
<template>
  <div>
    <ErrorBoundary @error="handleError">
      <VListTable
        :columns="columns"
        :records="data"
        @error="handleTableError"
      />
    </ErrorBoundary>
    
    <!-- Error display -->
    <div v-if="error" class="error-message">
      {{ error.message }}
      <button @click="retry">Retry</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ErrorBoundary from './components/ErrorBoundary.vue'

const error = ref(null)

const handleError = (err) => {
  console.error('Table error:', err)
  error.value = err
}

const handleTableError = (err) => {
  console.error('VTable error:', err)
  error.value = err
}

const retry = () => {
  error.value = null
  // Retry logic
}
</script>
```

This comprehensive Vue integration guide provides everything needed to effectively use VTable in Vue applications, covering both Vue 2 and Vue 3 patterns, advanced techniques, and best practices.