<template>
  <vue-list-table ref="tableRef" :options="option">
    <ListColumn
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :title="column.title"
      :width="column.width"
      :editor="DYNAMIC_RENDER_EDITOR"
      :edit-config="editConfig"
    >
      <template #edit="{ value, onChange }">
        <a-date-picker
          v-if="column.field === 'birthday'"
          :default-value="value"
          style="width: 100%; height: 100%"
          :trigger-props="{ 'content-class': 'table-editor-element' }"
          @change="onChange"
        />
        <a-input
          v-else
          :default-value="value"
          style="width: 100%; height: 100%"
          allow-clear
          @input="onChange"
          @clear="onChange()"
        />
      </template>
    </ListColumn>
  </vue-list-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ListColumn, DYNAMIC_RENDER_EDITOR } from '../../../../../src';
import { generateMockData } from '../../utils';

const { columns, records } = generateMockData(20);

const editBefore = (param: any): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(param.row !== 1);
    }, 50);
  });
};

const validateValue = (param: any): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(param.row !== 2 || !!param.value);
    }, 50);
  });
};

const editConfig = {
  editBefore,
  disablePrompt: '🚫当前行禁止编辑',
  validateValue,
  invalidPrompt: '⚠️当前行禁止空值'
};

const option = {
  records,
  editCellTrigger: 'click'
};

const tableRef = ref();
</script>
<style lang="scss" scoped></style>
