<!--
 * @Author: lym
 * @Date: 2025-02-24 10:51:41
 * @LastEditors: lym
 * @LastEditTime: 2025-02-25 11:14:50
 * @Description: 自定义dom组件-插槽式
-->
<template>
  <vue-list-table :options="tableOptions">
    <ListColumn
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :title="column.title"
      :width="column.width"
    >
      <template v-if="column.field === 'gender'" #headerCustomLayout="{ width, height }">
        <Group :width="width" :height="height" display="flex" align-items="center" justify-content="center" :vue="{}">
          <a-tag color="orangered"> 性别 </a-tag>
        </Group>
      </template>
      <template v-if="column.field === 'gender'" #customLayout="{ width, height, record }">
        <Group :width="width" :height="height" display="flex" align-items="center" justify-content="center" :vue="{}">
          <IconWoman v-if="record.gender === '女'" />
          <IconMan v-else />
        </Group>
      </template>
    </ListColumn>
  </vue-list-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ListColumn, Group } from '../../../../../src/components/index';
import { IconMan, IconWoman } from '@arco-design/web-vue/es/icon';
import { generateMockData } from '../../utils';

const { columns, records } = generateMockData();

const tableOptions = ref({
  records,
  customConfig: {
    createReactContainer: true
  },
  widthMode: 'adaptive'
});
</script>
