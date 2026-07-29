<template>
  <div class="toolbar">
    <button @click="check">Check scrollbar hit area</button>
    <span>{{ state }}</span>
  </div>
  <vue-list-table ref="tableRef" :options="tableOptions">
    <ListColumn field="name" title="Name" width="180">
      <template #customLayout="{ width, height, record, row }">
        <Group
          :width="width"
          :height="height"
          :vue="{
            element: renderAction(record, row, 'Frozen'),
            pointerEvents: true,
            id: `issue5157-frozen-${row}`
          }"
        />
      </template>
    </ListColumn>
    <ListColumn field="value" title="Value" width="180" />
    <ListColumn field="action" title="Action" width="260">
      <template #customLayout="{ width, height, record, row }">
        <Group
          :width="width"
          :height="height"
          :vue="{
            element: renderAction(record, row, 'Action'),
            pointerEvents: true,
            id: `issue5157-body-${row}`
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
  frozenColCount: 1,
  scrollFrozenCols: true,
  maxFrozenWidth: 80,
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

function renderAction(record: any, row: number, label: string) {
  return h(
    'button',
    {
      class: 'action-button',
      'data-row': row,
      onClick: () => {
        state.value = `clicked ${record.id}`;
      }
    },
    `${label} ${record.id}`
  );
}

function check() {
  const table = tableRef.value?.vTableInstance;
  const bodyDom = document.querySelector<HTMLElement>('[id^="vue_issue5157-body-"]');
  const frozenDom = document.querySelector<HTMLElement>('[id^="vue_issue5157-frozen-"]');
  if (!table || !bodyDom || !frozenDom) {
    state.value = 'FAIL | missing table or dom';
    return { pass: false };
  }

  const bodyRect = bodyDom.getBoundingClientRect();
  const frozenRect = frozenDom.getBoundingClientRect();
  const tableRect = table.getElement().getBoundingClientRect();
  const scrollbarLeft = tableRect.left + table.tableNoFrameWidth - 16;
  const frozenScrollbarTop = tableRect.top + Math.min(table.tableNoFrameHeight, table.getAllRowsHeight()) - 16;
  const pass = bodyRect.right <= scrollbarLeft + 0.5 && frozenRect.bottom <= frozenScrollbarTop + 0.5;
  state.value =
    `${pass ? 'PASS' : 'FAIL'} | bodyRight=${Math.round(bodyRect.right)} scrollbarLeft=${Math.round(scrollbarLeft)} ` +
    `frozenBottom=${Math.round(frozenRect.bottom)} frozenScrollbarTop=${Math.round(frozenScrollbarTop)}`;
  return {
    pass,
    bodyRight: bodyRect.right,
    scrollbarLeft,
    frozenBottom: frozenRect.bottom,
    frozenScrollbarTop,
    frozenOffset: table.getFrozenColsOffset?.()
  };
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
