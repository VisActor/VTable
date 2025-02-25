<!--
 * @Author: lym
 * @Date: 2025-02-24 10:45:36
 * @LastEditors: lym
 * @LastEditTime: 2025-02-25 11:16:12
 * @Description: 自定义dom组件
-->
<template>
  <vue-list-table ref="tableRef" :options="option" />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { Tag } from '@arco-design/web-vue';
import * as VTable from '../../../../../../../vtable/src/index';
import { generateMockData } from '../../../utils';

const option = {
  ...generateMockData(100, {
    gender: {
      field: 'gender',
      headerCustomLayout: args => {
        const { table, row, col, rect, value } = args;
        const { height, width } = rect ?? table.getCellRect(col, row);

        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          vue: { element: h(Tag, { color: 'green' }, value), container: table.headerDomContainer }
        });

        return {
          rootContainer: container,
          renderDefault: false
        };
      },
      customLayout: args => {
        const { table, row, col, rect, value } = args;
        const { height, width } = rect ?? table.getCellRect(col, row);

        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          vue: {
            element: h(Tag, { color: value === '女' ? 'magenta' : 'arcoblue' }, value),
            container: table.bodyDomContainer
          }
        });

        return {
          rootContainer: container,
          renderDefault: false
        };
      }
    }
  }),
  customConfig: {
    createReactContainer: true
  },
  widthMode: 'standard'
};

const tableRef = ref();
</script>
<style lang="scss" scoped></style>
