<template>
  <div class="toolbar">
    <button @click="check">Check scrollbar hit area</button>
    <span>{{ state }}</span>
  </div>
  <div class="issue5157-table">
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
  </div>
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
  const bodyDoms = Array.from(document.querySelectorAll<HTMLElement>('[id^="vue_issue5157-body-"]'));
  const frozenDoms = Array.from(document.querySelectorAll<HTMLElement>('[id^="vue_issue5157-frozen-"]'));
  if (!table || !bodyDoms.length || !frozenDoms.length) {
    state.value = 'FAIL | missing table or dom';
    return { pass: false };
  }

  const firstBodyRect = bodyDoms[0].getBoundingClientRect();
  const firstFrozenRect = frozenDoms[0].getBoundingClientRect();
  const tableRect = table.getElement().getBoundingClientRect();
  const scrollbarSize = table.theme?.scrollStyle?.width ?? 16;
  const scrollbarLeft = tableRect.left + table.tableNoFrameWidth - scrollbarSize;
  const frozenScrollbarTop = tableRect.top + Math.min(table.tableNoFrameHeight, table.getAllRowsHeight()) - scrollbarSize;
  const clippedFrozenDoms = frozenDoms.filter(dom => {
    const rect = dom.getBoundingClientRect();
    return rect.bottom > frozenScrollbarTop && getComputedStyle(dom).clipPath !== 'none';
  });
  const pass =
    firstBodyRect.right <= scrollbarLeft + 0.5 &&
    firstFrozenRect.bottom <= frozenScrollbarTop + 0.5 &&
    clippedFrozenDoms.length > 0;
  state.value =
    `${pass ? 'PASS' : 'FAIL'} | bodyRight=${Math.round(firstBodyRect.right)} scrollbarLeft=${Math.round(scrollbarLeft)} ` +
    `frozenBottom=${Math.round(firstFrozenRect.bottom)} frozenScrollbarTop=${Math.round(frozenScrollbarTop)} ` +
    `clippedFrozen=${clippedFrozenDoms.length}`;
  return {
    pass,
    bodyRight: firstBodyRect.right,
    scrollbarLeft,
    frozenBottom: firstFrozenRect.bottom,
    frozenScrollbarTop,
    clippedFrozenCount: clippedFrozenDoms.length,
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

.issue5157-table {
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
