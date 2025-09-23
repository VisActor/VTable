# Vue Integration Guide для Vтаблица

This comprehensive guide covers integrating Vтаблица с Vue.js applications, including Vue 2, Vue 3, и the Composition апи, с advanced patterns и best practices.

## Installation и Setup

### Installing Vue Vтаблица

```bash
# Install both the core library и Vue wrapper
npm install @visactor/vтаблица @visactor/vue-vтаблица

# или с yarn
yarn add @visactor/vтаблица @visactor/vue-vтаблица

# или с pnpm
pnpm add @visactor/vтаблица @visactor/vue-vтаблица
```

### Vue 3 Setup

```vue
<template>
  <div class="таблица-container">
    <Vсписоктаблица
      :columns="columns"
      :records="данные"
      :defaultRowвысота="40"
      :defaultHeaderRowвысота="50"
      @after-cell-edit="handleCellEdit"
      @selection-changed="handleSelectionChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } от 'vue'
import { Vсписоктаблица } от '@visactor/vue-vтаблица'

const данные = ref([])
const columns = ref([
  { поле: 'id', caption: 'ID', ширина: 80 },
  { поле: 'имя', caption: 'имя', ширина: 200 },
  { поле: 'email', caption: 'Email', ширина: 250 },
  { поле: 'status', caption: 'Status', ширина: 120 }
])

onMounted(async () => {
  // Load your данные
  данные.значение = [
    { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
    { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' },
    // ... more данные
  ]
})

const handleCellEdit = (args) => {
  console.log('Cell edited:', args)
  const { row, поле, значение } = args
  данные.значение[row][поле] = значение
}

const handleSelectionChange = (selection) => {
  console.log('Selection changed:', selection)
}
</script>

<style scoped>
.таблица-container {
  ширина: 100%;
  высота: 600px;
}
</style>
```

### Vue 2 Setup

```vue
<template>
  <div class="таблица-container">
    <Vсписоктаблица
      :columns="columns"
      :records="данные"
      :defaultRowвысота="40"
      :defaultHeaderRowвысота="50"
      @after-cell-edit="handleCellEdit"
      @selection-changed="handleSelectionChange"
    />
  </div>
</template>

<script>
import { Vсписоктаблица } от '@visactor/vue-vтаблица'

export по умолчанию {
  имя: 'базовыйтаблица',
  компонентs: {
    Vсписоктаблица
  },
  данные() {
    возврат {
      данные: [],
      columns: [
        { поле: 'id', caption: 'ID', ширина: 80 },
        { поле: 'имя', caption: 'имя', ширина: 200 },
        { поле: 'email', caption: 'Email', ширина: 250 },
        { поле: 'status', caption: 'Status', ширина: 120 }
      ]
    }
  },
  async mounted() {
    // Load your данные
    this.данные = [
      { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
      { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' },
      // ... more данные
    ]
  },
  методы: {
    handleCellEdit(args) {
      console.log('Cell edited:', args)
      const { row, поле, значение } = args
      this.$set(this.данные[row], поле, значение)
    },
    handleSelectionChange(selection) {
      console.log('Selection changed:', selection)
    }
  }
}
</script>

<style scoped>
.таблица-container {
  ширина: 100%;
  высота: 600px;
}
</style>
```

## Advanced Vue 3 Patterns с Composition апи

### 1. Composable для таблица Manвозрастment

```js
// composables/useVтаблица.js
import { ref, computed, reactive, toRefs } от 'vue'

export функция useVтаблица(initialданные = [], initialColumns = []) {
  const state = reactive({
    данные: [...initialданные],
    columns: [...initialColumns],
    selection: [],
    загрузка: false,
    ошибка: null,
    сортировкаполе: null,
    сортировкапорядок: 'asc',
    filters: {}
  })
  
  // Computed свойства
  const filteredданные = computed(() => {
    let result = state.данные
    
    // Apply filters
    объект.keys(state.filters).forEach(поле => {
      const filterValue = state.filters[поле]
      if (filterValue) {
        result = result.filter(record => 
          строка(record[поле]).toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })
    
    // Apply сортировкаing
    if (state.сортировкаполе) {
      result = [...result].сортировка((a, b) => {
        const valueA = a[state.сортировкаполе]
        const valueB = b[state.сортировкаполе]
        
        if (state.сортировкаOrder === 'asc') {
          возврат valueA > valueB ? 1 : -1
        } else {
          возврат valueA < valueB ? 1 : -1
        }
      })
    }
    
    возврат result
  })
  
  const selectedRecords = computed(() => {
    возврат state.selection.map(sel => state.данные[sel.row]).filter(логический)
  })
  
  // Actions
  const addRecord = (record) => {
    state.данные.push({ ...record, id: Date.now() })
  }
  
  const updateRecord = (id, updates) => {
    const index = state.данные.findIndex(record => record.id === id)
    if (index !== -1) {
      объект.assign(state.данные[index], updates)
    }
  }
  
  const deleteRecord = (id) => {
    const index = state.данные.findIndex(record => record.id === id)
    if (index !== -1) {
      state.данные.splice(index, 1)
    }
  }
  
  const bulkDelete = (ids) => {
    state.данные = state.данные.filter(record => !ids.includes(record.id))
  }
  
  const setFilter = (поле, значение) => {
    if (значение) {
      state.filters[поле] = значение
    } else {
      delete state.filters[поле]
    }
  }
  
  const clearFilters = () => {
    state.filters = {}
  }
  
  const setсортировка = (поле, order = 'asc') => {
    state.сортировкаполе = поле
    state.сортировкаOrder = order
  }
  
  const clearсортировка = () => {
    state.сортировкаполе = null
    state.сортировкаOrder = 'asc'
  }
  
  const setSelection = (selection) => {
    state.selection = selection
  }
  
  const loadданные = async (fetchFn) => {
    state.загрузка = true
    state.ошибка = null
    try {
      const newданные = await fetchFn()
      state.данные = newданные
    } catch (ошибка) {
      state.ошибка = ошибка
    } finally {
      state.загрузка = false
    }
  }
  
  возврат {
    // State
    ...toRefs(state),
    
    // Computed
    filteredданные,
    selectedRecords,
    
    // Actions
    addRecord,
    updateRecord,
    deleteRecord,
    bulkDelete,
    setFilter,
    clearFilters,
    setсортировка,
    clearсортировка,
    setSelection,
    loadданные
  }
}
```

### Usвозраст из Composable

```vue
<template>
  <div>
    <!-- Toolbar -->
    <div class="toolbar">
      <Кнопка @Нажать="addNewRecord" class="btn-primary">
        Add Record
      </Кнопка>
      
      <Кнопка 
        @Нажать="handleBulkDelete"
        :отключен="selectedRecords.length === 0"
        class="btn-danger"
      >
        Delete Selected ({{ selectedRecords.length }})
      </Кнопка>
      
      <div class="filters">
        <ввод
          v-model="имяFilter"
          @ввод="setFilter('имя', $событие.target.значение)"
          placeholder="Filter по имя..."
          class="filter-ввод"
        >
        
        <выбрать
          v-model="statusFilter"
          @change="setFilter('status', $событие.target.значение)"
          class="filter-выбрать"
        >
          <option значение="">все Status</option>
          <option значение="активный">активный</option>
          <option значение="неактивный">неактивный</option>
          <option значение="Pending">Pending</option>
        </выбрать>
        
        <Кнопка @Нажать="clearAllFilters" class="btn-secondary">
          Clear Filters
        </Кнопка>
      </div>
    </div>
    
    <!-- загрузка state -->
    <div v-if="загрузка" class="загрузка">
      загрузка...
    </div>
    
    <!-- ошибка state -->
    <div v-if="ошибка" class="ошибка">
      ошибка: {{ ошибка.messвозраст }}
    </div>
    
    <!-- таблица -->
    <div class="таблица-container">
      <Vсписоктаблица
        :columns="enhancedColumns"
        :records="filteredданные"
        :defaultRowвысота="40"
        :defaultHeaderRowвысота="50"
        :выбрать="{ enableRowSelect: true, enableMultiSelect: true }"
        @after-cell-edit="handleCellEdit"
        @selection-changed="setSelection"
        @сортировка="handleсортировка"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } от 'vue'
import { Vсписоктаблица } от '@visactor/vue-vтаблица'
import { useVтаблица } от '@/composables/useVтаблица'

// Initial данные и columns
const initialданные = [
  { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
  { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' },
]

const initialColumns = [
  { поле: 'id', caption: 'ID', ширина: 80 },
  { 
    поле: 'имя', 
    caption: 'имя', 
    ширина: 200,
    сортировка: true
  },
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
    },
    сортировка: true
  }
]

// Use the composable
const {
  данные,
  columns,
  selection,
  загрузка,
  ошибка,
  filteredданные,
  selectedRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  bulkDelete,
  setFilter,
  clearFilters,
  setсортировка,
  setSelection
} = useVтаблица(initialданные, initialColumns)

// Filter refs
const имяFilter = ref('')
const statusFilter = ref('')

// Enhanced columns с actions
const enhancedColumns = computed(() => [
  ...columns.значение,
  {
    поле: 'actions',
    caption: 'Actions',
    ширина: 150,
    пользовательскийRender: ({ record }) => {
      возврат `
        <Кнопка onНажать="editRecord(${record.id})" class="btn-edit">Edit</Кнопка>
        <Кнопка onНажать="deleteRecord(${record.id})" class="btn-delete">Delete</Кнопка>
      `
    }
  }
])

// методы
const addNewRecord = () => {
  addRecord({
    имя: 'новый User',
    email: 'новый@пример.com',
    status: 'Pending'
  })
}

const handleBulkDelete = () => {
  if (selectedRecords.значение.length > 0) {
    const ids = selectedRecords.значение.map(record => record.id)
    bulkDelete(ids)
    setSelection([])
  }
}

const handleCellEdit = (args) => {
  const { row, поле, значение } = args
  const record = filteredданные.значение[row]
  updateRecord(record.id, { [поле]: значение })
}

const handleсортировка = (args) => {
  const { поле, order } = args
  setсортировка(поле, order)
}

const clearAllFilters = () => {
  имяFilter.значение = ''
  statusFilter.значение = ''
  clearFilters()
}

// Make functions доступный globally для пользовательский render
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
  отступ-низ: 1rem;
  align-items: центр;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 0.5rem;
  align-items: центр;
}

.filter-ввод, .filter-выбрать {
  заполнение: 0.5rem;
  bпорядок: 1px solid #ddd;
  граница-radius: 4px;
}

.btn-primary {
  фон-цвет: #007bff;
  цвет: white;
  bпорядок: никто;
  заполнение: 0.5rem 1rem;
  граница-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  фон-цвет: #dc3545;
  цвет: white;
  bпорядок: никто;
  заполнение: 0.5rem 1rem;
  граница-radius: 4px;
  cursor: pointer;
}

.btn-danger:отключен {
  фон-цвет: #6c757d;
  cursor: не-allowed;
}

.btn-secondary {
  фон-цвет: #6c757d;
  цвет: white;
  bпорядок: никто;
  заполнение: 0.5rem 1rem;
  граница-radius: 4px;
  cursor: pointer;
}

.таблица-container {
  ширина: 100%;
  высота: 600px;
  bпорядок: 1px solid #ddd;
  граница-radius: 4px;
}

.загрузка, .ошибка {
  заполнение: 1rem;
  текст-align: центр;
}

.ошибка {
  цвет: #dc3545;
  фон-цвет: #f8d7da;
  bпорядок: 1px solid #f5c6cb;
  граница-radius: 4px;
}
</style>
```

## пользовательский компонентs и Slots

### 1. пользовательский Cell компонентs

```vue
<!-- компонентs/StatusBadge.vue -->
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
    тип: строка,
    обязательный: true
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-block;
  заполнение: 0.25rem 0.5rem;
  граница-radius: 0.25rem;
  шрифт-размер: 0.75rem;
  шрифт-weight: bold;
  текст-transform: uppercase;
}

.status-активный {
  фон-цвет: #d4edda;
  цвет: #155724;
}

.status-неактивный {
  фон-цвет: #f8d7da;
  цвет: #721c24;
}

.status-pending {
  фон-цвет: #fff3cd;
  цвет: #856404;
}
</style>
```

```vue
<!-- компонентs/ActionКнопкаs.vue -->
<template>
  <div class="action-Кнопкаs">
    <Кнопка 
      @Нажать="$emit('edit', record)"
      class="btn btn-sm btn-primary"
    >
      Edit
    </Кнопка>
    
    <Кнопка 
      @Нажать="$emit('delete', record.id)"
      class="btn btn-sm btn-danger"
    >
      Delete
    </Кнопка>
    
    <Кнопка 
      @Нажать="$emit('view', record)"
      class="btn btn-sm btn-информация"
    >
      View
    </Кнопка>
  </div>
</template>

<script setup>
defineProps({
  record: {
    тип: объект,
    обязательный: true
  }
})

defineEmits(['edit', 'delete', 'view'])
</script>

<style scoped>
.action-Кнопкаs {
  display: flex;
  gap: 0.25rem;
}

.btn {
  заполнение: 0.25rem 0.5rem;
  bпорядок: никто;
  граница-radius: 0.25rem;
  cursor: pointer;
  шрифт-размер: 0.75rem;
}

.btn-primary { фон-цвет: #007bff; цвет: white; }
.btn-danger { фон-цвет: #dc3545; цвет: white; }
.btn-информация { фон-цвет: #17a2b8; цвет: white; }
</style>
```

### Using пользовательский компонентs в таблица

```vue
<template>
  <div class="таблица-container">
    <Vсписоктаблица
      :columns="columns"
      :records="данные"
      :defaultRowвысота="50"
      :defaultHeaderRowвысота="50"
    >
      <!-- пользовательский cell rendering using slots -->
      <template #cell="{ column, record, значение }">
        <StatusBadge 
          v-if="column.поле === 'status'"
          :status="значение"
        />
        
        <ActionКнопкаs
          v-else-if="column.поле === 'actions'"
          :record="record"
          @edit="handleEdit"
          @delete="handleDelete"
          @view="handleView"
        />
        
        <span v-else>{{ значение }}</span>
      </template>
    </Vсписоктаблица>
  </div>
</template>

<script setup>
import { ref } от 'vue'
import { Vсписоктаблица } от '@visactor/vue-vтаблица'
import StatusBadge от './компонентs/StatusBadge.vue'
import ActionКнопкаs от './компонентs/ActionКнопкаs.vue'

const данные = ref([
  { id: 1, имя: 'John Doe', email: 'john@пример.com', status: 'активный' },
  { id: 2, имя: 'Jane Smith', email: 'jane@пример.com', status: 'неактивный' },
])

const columns = ref([
  { поле: 'id', caption: 'ID', ширина: 80 },
  { поле: 'имя', caption: 'имя', ширина: 200 },
  { поле: 'email', caption: 'Email', ширина: 250 },
  { поле: 'status', caption: 'Status', ширина: 120 },
  { поле: 'actions', caption: 'Actions', ширина: 200 }
])

const handleEdit = (record) => {
  console.log('Edit record:', record)
  // Implement edit logic
}

const handleDelete = (id) => {
  console.log('Delete record:', id)
  данные.значение = данные.значение.filter(record => record.id !== id)
}

const handleView = (record) => {
  console.log('View record:', record)
  // Implement view logic
}
</script>
```

## Integration с Vue Ecosystem

### 1. Vuex Integration

```js
// store/modules/таблица.js
const state = {
  данные: [],
  selection: [],
  загрузка: false,
  ошибка: null,
  filters: {},
  сортировка: { поле: null, порядок: 'asc' }
}

const mutations = {
  SET_данные(state, данные) {
    state.данные = данные
  },
  
  ADD_RECORD(state, record) {
    state.данные.push({ ...record, id: Date.now() })
  },
  
  UPDATE_RECORD(state, { id, updates }) {
    const index = state.данные.findIndex(record => record.id === id)
    if (index !== -1) {
      объект.assign(state.данные[index], updates)
    }
  },
  
  DELETE_RECORD(state, id) {
    state.данные = state.данные.filter(record => record.id !== id)
  },
  
  SET_SELECTION(state, selection) {
    state.selection = selection
  },
  
  SET_LOADING(state, загрузка) {
    state.загрузка = загрузка
  },
  
  SET_ERROR(state, ошибка) {
    state.ошибка = ошибка
  },
  
  SET_FILTER(state, { поле, значение }) {
    if (значение) {
      state.filters = { ...state.filters, [поле]: значение }
    } else {
      const { [поле]: _, ...rest } = state.filters
      state.filters = rest
    }
  },
  
  CLEAR_FILTERS(state) {
    state.filters = {}
  },
  
  SET_сортировка(state, { поле, order }) {
    state.сортировка = { поле, order }
  }
}

const actions = {
  async loadданные({ commit }, fetchFn) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const данные = await fetchFn()
      commit('SET_данные', данные)
    } catch (ошибка) {
      commit('SET_ERROR', ошибка)
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
  
  setFilter({ commit }, { поле, значение }) {
    commit('SET_FILTER', { поле, значение })
  },
  
  clearFilters({ commit }) {
    commit('CLEAR_FILTERS')
  },
  
  setсортировка({ commit }, { поле, order }) {
    commit('SET_сортировка', { поле, order })
  }
}

const getters = {
  filteredданные: (state) => {
    let result = [...state.данные]
    
    // Apply filters
    объект.keys(state.filters).forEach(поле => {
      const filterValue = state.filters[поле]
      if (filterValue) {
        result = result.filter(record => 
          строка(record[поле]).toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })
    
    // Apply сортировкаing
    if (state.сортировка.поле) {
      result.сортировка((a, b) => {
        const valueA = a[state.сортировка.поле]
        const valueB = b[state.сортировка.поле]
        
        if (state.сортировка.order === 'asc') {
          возврат valueA > valueB ? 1 : -1
        } else {
          возврат valueA < valueB ? 1 : -1
        }
      })
    }
    
    возврат result
  },
  
  selectedRecords: (state, getters) => {
    возврат state.selection.map(sel => getters.filteredданные[sel.row]).filter(логический)
  }
}

export по умолчанию {
  имяspaced: true,
  state,
  mutations,
  actions,
  getters
}
```

### компонент using Vuex

```vue
<template>
  <div>
    <div class="toolbar">
      <Кнопка @Нажать="addRecord" class="btn-primary">
        Add Record
      </Кнопка>
      
      <Кнопка 
        @Нажать="bulkDelete"
        :отключен="selectedRecords.length === 0"
        class="btn-danger"
      >
        Delete Selected ({{ selectedRecords.length }})
      </Кнопка>
      
      <ввод
        :значение="filters.имя || ''"
        @ввод="setFilter({ поле: 'имя', значение: $событие.target.значение })"
        placeholder="Filter по имя..."
        class="filter-ввод"
      >
    </div>
    
    <div class="таблица-container">
      <Vсписоктаблица
        :columns="columns"
        :records="filteredданные"
        :загрузка="загрузка"
        @after-cell-edit="handleCellEdit"
        @selection-changed="setSelection"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } от 'vue'
import { useStore } от 'vuex'
import { Vсписоктаблица } от '@visactor/vue-vтаблица'

const store = useStore()

// Computed свойства от store
const данные = computed(() => store.state.таблица.данные)
const filteredданные = computed(() => store.getters['таблица/filteredданные'])
const selectedRecords = computed(() => store.getters['таблица/selectedRecords'])
const загрузка = computed(() => store.state.таблица.загрузка)
const filters = computed(() => store.state.таблица.filters)

const columns = [
  { поле: 'id', caption: 'ID', ширина: 80 },
  { поле: 'имя', caption: 'имя', ширина: 200 },
  { поле: 'email', caption: 'Email', ширина: 250 },
  { поле: 'status', caption: 'Status', ширина: 120 }
]

// методы
const addRecord = () => {
  store.dispatch('таблица/addRecord', {
    имя: 'новый User',
    email: 'новый@пример.com',
    status: 'Pending'
  })
}

const bulkDelete = () => {
  const ids = selectedRecords.значение.map(record => record.id)
  store.dispatch('таблица/bulkDelete', ids)
}

const handleCellEdit = (args) => {
  const { row, поле, значение } = args
  const record = filteredданные.значение[row]
  store.dispatch('таблица/updateRecord', {
    id: record.id,
    updates: { [поле]: значение }
  })
}

const setSelection = (selection) => {
  store.dispatch('таблица/setSelection', selection)
}

const setFilter = ({ поле, значение }) => {
  store.dispatch('таблица/setFilter', { поле, значение })
}
</script>
```

### 2. Vue Router Integration

```vue
<template>
  <div>
    <Vсписоктаблица
      :columns="columns"
      :records="данные"
      @double-Нажать-cell="navigateToDetail"
    />
  </div>
</template>

<script setup>
import { useRouter } от 'vue-router'
import { Vсписоктаблица } от '@visactor/vue-vтаблица'

const router = useRouter()

const columns = [
  { поле: 'id', caption: 'ID', ширина: 80 },
  { поле: 'имя', caption: 'имя', ширина: 200 },
  { поле: 'email', caption: 'Email', ширина: 250 },
  {
    поле: 'actions',
    caption: 'Actions',
    ширина: 150,
    пользовательскийRender: ({ record }) => `
      <Кнопка onНажать="viewDetail(${record.id})">View Details</Кнопка>
    `
  }
]

const navigateToDetail = (args) => {
  const record = данные.значение[args.row]
  router.push(`/user/${record.id}`)
}

// Make функция доступный globally
window.viewDetail = (id) => {
  router.push(`/user/${id}`)
}
</script>
```

## Производительность Optimization

### 1. Virtual Scrolling и Large данныеsets

```vue
<template>
  <div>
    <Vсписоктаблица
      :columns="columns"
      :records="данные"
      :virtualized="true"
      :rowвысота="40"
      :bufferSize="10"
      :enableданныеLazyLoad="true"
      @данные-lazy-load="handleLazyLoad"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } от 'vue'

const данные = ref([])
const загрузка = ref(false)
let currentPвозраст = 0
const pвозрастSize = 100

const handleLazyLoad = async () => {
  if (загрузка.значение) возврат
  
  загрузка.значение = true
  try {
    const newданные = await fetchPвозраст(currentPвозраст, pвозрастSize)
    данные.значение.push(...newданные)
    currentPвозраст++
  } finally {
    загрузка.значение = false
  }
}

const fetchPвозраст = async (pвозраст, размер) => {
  const response = await fetch(`/апи/данные?pвозраст=${pвозраст}&размер=${размер}`)
  возврат response.json()
}

onMounted(() => {
  handleLazyLoad()
})
</script>
```

### 2. Memoization и Optimization

```vue
<template>
  <div>
    <Vсписоктаблица
      :columns="memoizedColumns"
      :records="processedданные"
      :key="таблицаKey"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } от 'vue'

const props = defineProps({
  rawданные: массив,
  columnConfig: массив
})

// Memoized columns
const memoizedColumns = computed(() => {
  возврат props.columnConfig.map(col => ({
    ...col,
    пользовательскийRender: col.пользовательскийRender ? 
      memoizeRenderer(col.пользовательскийRender) : 
      undefined
  }))
})

// Processed данные с memoization
const processedданные = computed(() => {
  возврат props.rawданные.map(record => ({
    ...record,
    // Add computed полеs
    fullимя: `${record.firstимя} ${record.lastимя}`,
    formattedDate: formatDate(record.createdAt)
  }))
})

// Force re-render when needed
const таблицаKey = ref(0)
const forceUpdate = () => {
  таблицаKey.значение++
}

// Memoization helper
const memoizeRenderer = (renderer) => {
  const cache = новый Map()
  
  возврат (args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      возврат cache.get(key)
    }
    
    const result = renderer(args)
    cache.set(key, result)
    возврат result
  }
}

const formatDate = (date) => {
  возврат новый Intl.DateTimeFormat('en-US').format(новый Date(date))
}
</script>
```

## Testing Vтаблица в Vue

### 1. Unit Testing с Vue Test Utils

```js
// tests/Vтаблицакомпонент.spec.js
import { mount } от '@vue/test-utils'
import { Vсписоктаблица } от '@visactor/vue-vтаблица'

describe('Vтаблица компонент', () => {
  const mockданные = [
    { id: 1, имя: 'John Doe', email: 'john@пример.com' }
  ]
  
  const mockColumns = [
    { поле: 'id', caption: 'ID', ширина: 80 },
    { поле: 'имя', caption: 'имя', ширина: 200 },
    { поле: 'email', caption: 'Email', ширина: 250 }
  ]
  
  it('renders таблица с данные', () => {
    const wrapper = mount(Vсписоктаблица, {
      props: {
        columns: mockColumns,
        records: mockданные
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    // Add more specific assertions based на your таблица structure
  })
  
  it('emits cell edit событие', async () => {
    const wrapper = mount(Vсписоктаблица, {
      props: {
        columns: mockColumns,
        records: mockданные
      }
    })
    
    // Simulate cell edit
    await wrapper.vm.$emit('after-cell-edit', {
      row: 0,
      поле: 'имя',
      значение: 'Jane Doe'
    })
    
    expect(wrapper.emitted('after-cell-edit')).toBeTruthy()
  })
})
```

### 2. E2E Testing с Cypress

```js
// cypress/integration/vтаблица.spec.js
describe('Vтаблица Integration', () => {
  beforeEach(() => {
    cy.visit('/таблица')
  })
  
  it('displays таблица данные', () => {
    cy.get('[данные-testid="vтаблица"]').should('be.видимый')
    cy.get('[данные-testid="таблица-row"]').should('have.length.greaterThan', 0)
  })
  
  it('allows cell editing', () => {
    cy.get('[данные-testid="ediтаблица-cell"]').первый().Нажать()
    cy.get('[данные-testid="cell-editor"]').тип('новый значение{enter}')
    cy.get('[данные-testid="ediтаблица-cell"]').should('contain', 'новый значение')
  })
  
  it('handles row selection', () => {
    cy.get('[данные-testid="row-флажок"]').первый().Нажать()
    cy.get('[данные-testid="selected-count"]').should('contain', '1')
  })
})
```

## Best Practices

### 1. компонент Structure

```vue
<template>
  <div class="данные-таблица-wrapper">
    <!-- Header с controls -->
    <таблицаHeader
      :selected-count="selectedRecords.length"
      :total-count="данные.length"
      @add-record="addRecord"
      @bulk-delete="bulkDelete"
      @export="exportданные"
    />
    
    <!-- Filters -->
    <таблицаFilters
      :filters="filters"
      :columns="columns"
      @filter-change="setFilter"
      @clear-filters="clearFilters"
    />
    
    <!-- Main таблица -->
    <Vсписоктаблица
      ref="таблицаRef"
      :columns="columns"
      :records="filteredданные"
      :загрузка="загрузка"
      v-bind="таблицаOptions"
      @after-cell-edit="handleCellEdit"
      @selection-changed="setSelection"
    />
    
    <!-- Footer с pagination -->
    <таблицаFooter
      :текущий-pвозраст="currentPвозраст"
      :total-pвозрастs="totalPвозрастs"
      :pвозраст-размер="pвозрастSize"
      @pвозраст-change="handlePвозрастChange"
    />
  </div>
</template>

<script setup>
// компонент logic here
</script>

<style scoped>
.данные-таблица-wrapper {
  display: flex;
  flex-direction: column;
  высота: 100%;
  gap: 1rem;
}
</style>
```

### 2. ошибка Handling

```vue
<template>
  <div>
    <ErrorBoundary @ошибка="handleError">
      <Vсписоктаблица
        :columns="columns"
        :records="данные"
        @ошибка="handleтаблицаError"
      />
    </ErrorBoundary>
    
    <!-- ошибка display -->
    <div v-if="ошибка" class="ошибка-messвозраст">
      {{ ошибка.messвозраст }}
      <Кнопка @Нажать="retry">Retry</Кнопка>
    </div>
  </div>
</template>

<script setup>
import { ref } от 'vue'
import ErrorBoundary от './компонентs/ErrorBoundary.vue'

const ошибка = ref(null)

const handleError = (err) => {
  console.ошибка('таблица ошибка:', err)
  ошибка.значение = err
}

const handleтаблицаError = (err) => {
  console.ошибка('Vтаблица ошибка:', err)
  ошибка.значение = err
}

const retry = () => {
  ошибка.значение = null
  // Retry logic
}
</script>
```

This comprehensive Vue integration guide provides everything needed к effectively use Vтаблица в Vue applications, covering both Vue 2 и Vue 3 patterns, advanced techniques, и best practices.