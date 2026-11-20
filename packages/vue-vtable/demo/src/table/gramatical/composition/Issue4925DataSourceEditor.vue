<template>
  <div class="issue-4925-demo">
    <div class="result" data-testid="issue-4925-result">Current value: {{ currentValue }}</div>
    <vue-list-table ref="tableRef" class="table" :options="option">
      <ListColumn field="id" title="ID" :width="100" />
      <ListColumn field="status" title="Status" :width="240" :editor="DYNAMIC_RENDER_EDITOR">
        <template #edit="{ table, col, row }">
          <button class="update-button" @click.stop="updateCurrentCell(table, col, row)">Set approved</button>
        </template>
      </ListColumn>
    </vue-list-table>
  </div>
</template>

<script setup lang="ts">
import * as VTable from '@visactor/vtable';
import { ref } from 'vue';
import { DYNAMIC_RENDER_EDITOR, ListColumn } from '../../../../../src';

const records = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' }
];
const dataSource = new VTable.data.CachedDataSource({
  get(index: number) {
    return records[index];
  },
  length: records.length
});
const option = {
  dataSource,
  editCellTrigger: 'click'
};
const tableRef = ref();
const currentValue = ref(records[0].status);

function updateCurrentCell(table: VTable.ListTable, col: number, row: number) {
  table.completeEditCell();
  table.changeCellValue(col, row, 'approved');
  setTimeout(() => {
    currentValue.value = String(table.getCellOriginValue(col, row));
  }, 0);
}
</script>

<style scoped>
.issue-4925-demo {
  display: flex;
  height: 100vh;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
}

.table {
  flex: 1;
  min-height: 0;
}

.result {
  font-size: 14px;
  line-height: 32px;
}

.update-button {
  height: 100%;
  border: 1px solid #1664ff;
  background: #1664ff;
  color: #fff;
  cursor: pointer;
}
</style>
