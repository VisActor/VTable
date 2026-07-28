<template>
  <div class="toolbar">
    <button @click="check">Check scrollbar hit area</button>
    <span>{{ state }}</span>
  </div>
  <vue-list-table ref="tableRef" :options="tableOptions">
    <ListColumn field="name" title="Name" width="180" />
    <ListColumn field="value" title="Value" width="180" />
    <ListColumn field="action" title="Action" width="260">
      <template #customLayout="{ width, height, record, row }">
        <Group
          :width="width"
          :height="height"
          :vue="{
            element: renderAction(record, row),
            pointerEvents: true,
            id: `issue5157-${row}`
          }"
        />
      </template>
    </ListColumn>
  </vue-list-table>
</template>

<script setup lang="ts">
import { h, nextTick, ref } from 'vue';
import { Group, ListColumn } from '../../../../../src/components/index';
import * as VTable from '../../../../../../vtable/src/index';

const tableRef = ref();
const state = ref('READY');

const records = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `row-${index + 1}`,
  value: `value-${index + 1}`,
  action: 'clickable'
}));

const tableOptions = ref({
  records,
  widthMode: 'standard',
  heightMode: 'standard',
  defaultRowHeight: 44,
  defaultHeaderRowHeight: 40,
  theme: {
    ...VTable.themes.DEFAULT,
    scrollStyle: {
      ...VTable.themes.DEFAULT.scrollStyle,
      visible: 'always',
      width: 16
    }
  },
  customConfig: {
    createReactContainer: true
  }
});

function renderAction(record: any, row: number) {
  return h(
    'button',
    {
      class: 'action-button',
      'data-row': row,
      onClick: () => {
        state.value = `clicked ${record.id}`;
      }
    },
    `Action ${record.id}`
  );
}

function check() {
  const table = tableRef.value?.vTableInstance;
  const dom = document.querySelector<HTMLElement>('[id^="vue_issue5157-"]');
  if (!table || !dom) {
    state.value = 'FAIL | missing table or dom';
    return { pass: false };
  }

  const domRect = dom.getBoundingClientRect();
  const tableRect = table.getElement().getBoundingClientRect();
  const scrollbarLeft = tableRect.left + table.tableNoFrameWidth - 16;
  const pass = domRect.right <= scrollbarLeft + 0.5;
  state.value = `${pass ? 'PASS' : 'FAIL'} | domRight=${Math.round(domRect.right)} scrollbarLeft=${Math.round(
    scrollbarLeft
  )}`;
  return { pass, domRight: domRect.right, scrollbarLeft };
}

nextTick(() => {
  setTimeout(check, 0);
});

(window as any).issue5157Check = check;
</script>

<style scoped>
.toolbar {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  font-size: 12px;
}

:deep(.vtable) {
  width: 620px;
  height: 360px;
}

.action-button {
  width: 100%;
  height: 100%;
  border: 0;
  background: #e8f3ff;
  color: #1664ff;
  cursor: pointer;
}
</style>
