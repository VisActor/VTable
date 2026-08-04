<template>
  <vue-list-table ref="tableRef" :options="option">
    <ListColumn field="id" title="ID" :width="120" />
    <ListColumn field="name" title="Name" :width="160" :editor="DYNAMIC_RENDER_EDITOR">
      <template #edit="{ refValue }">
        <div class="issue-4884-editor-root">
          <input v-model="refValue.value" class="issue-4884-editor-input" />
        </div>
      </template>
    </ListColumn>
  </vue-list-table>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { ListColumn, DYNAMIC_RENDER_EDITOR } from '../../../../../src';

const tableRef = ref();

const option = {
  records: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ],
  editCellTrigger: 'click',
  widthMode: 'standard'
};

onMounted(async () => {
  await nextTick();
  (window as any).issue4884GetEditorWrapperBackground = () => {
    const editorRoot = document.querySelector('.issue-4884-editor-root') as HTMLElement | null;
    const wrapper = editorRoot?.parentElement as HTMLElement | null;
    return wrapper?.style.backgroundColor ?? null;
  };
  (window as any).issue4884StartEdit = () => tableRef.value?.vTableInstance?.startEditCell(1, 1);
  (window as any).issue4884TableInstance = () => tableRef.value?.vTableInstance;
});
</script>

<style scoped>
.issue-4884-editor-root {
  width: 100%;
  height: 100%;
}

.issue-4884-editor-input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #1677ff;
  background: transparent;
}
</style>
