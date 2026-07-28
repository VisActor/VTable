<template>
  <div class="toolbar">
    <button @click="sortAsc">Sort score asc</button>
    <span>Expected first name after sort: Bob</span>
  </div>
  <vue-list-table ref="tableRef" :options="tableOptions">
    <ListColumn field="name" title="Name" width="220">
      <template #customLayout="{ width, height, record }">
        <Group :width="width" :height="height" :vue="{}">
          <div class="name-cell" :data-record-id="record.id">
            {{ record.name }} / score: {{ record.score }}
          </div>
        </Group>
      </template>
    </ListColumn>
    <ListColumn field="score" title="Score" width="160" :sort="true" />
  </vue-list-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Group, ListColumn } from '../../../../../src/components/index';
import * as VTable from '../../../../../../vtable/src/index';

const tableRef = ref();
const records = [
  { id: 1, name: 'Alice', score: 30 },
  { id: 2, name: 'Bob', score: 10 },
  { id: 3, name: 'Cindy', score: 20 }
];

const tableOptions = ref({
  records,
  defaultRowHeight: 44,
  defaultHeaderRowHeight: 40,
  theme: VTable.themes.DEFAULT,
  customConfig: {
    createReactContainer: true
  }
});

function sortAsc() {
  tableRef.value?.vTableInstance?.updateSortState({
    field: 'score',
    order: 'asc'
  });
}
</script>

<style scoped>
.toolbar {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
}

.name-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  color: #1f2329;
  background: #f7f8fa;
}
</style>
