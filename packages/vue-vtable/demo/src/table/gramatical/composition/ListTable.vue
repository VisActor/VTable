<template>
  <vue-list-table
    :options="tableOptions"
    :records="records"
    :keep-column-width-change="keepColumnWidthChange"
    @on-dropdown-menu-click="handleDropdownMenuClick"
    @on-mouse-enter-cell="handleMouseEnterCell"
  >
    <ListColumn key="0" field="0" title="名字" max-width="300" :drag-header="true" />
    <ListColumn key="1" field="1" title="年龄" max-width="300" :drag-header="true" />
    <ListColumn key="2" field="2" title="性别" max-width="300" :drag-header="true" />
    <ListColumn key="3" field="3" title="爱好" max-width="300" :drag-header="true" />
  </vue-list-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ListColumn } from '../../../../../src/components/index';

//优先级：records > tableOptions.records
const records = ref([
  ['张三2', 18, '男', '篮球'],
  ['李四', 20, '女', '足球'],
  ['王五', 22, '男', '羽毛球'],
  ['赵六', 24, '女', '乒乓球']
]);

const tableOptions = ref({
  columns: [
    {
      field: '0',
      caption: '名称1'
    },
    {
      field: '1',
      caption: '年龄1'
    },
    {
      field: '2',
      caption: '性别1'
    },
    {
      field: '3',
      caption: '爱好1'
    }
  ],
  records: [
    ['张三', 18, '男', '篮球'],
    ['李四', 20, '女', '足球'],
    ['王五', 22, '男', '羽毛球'],
    ['赵六', 24, '女', '乒乓球'],
    ['张三', 18, '男', '篮球'],
    ['李四', 20, '女', '足球'],
    ['王五', 22, '男', '羽毛球'],
    ['赵六', 24, '女', '乒乓球']
  ],
  menu: {
    contextMenuItems: ['copy', 'paste', 'delete', '...']
  }
});

const keepColumnWidthChange = ref(true);

// update record
window.update = () => {
  records.value = [
    ['张三1', 18, '男', '篮球'],
    ['李四1', 20, '女', '足球'],
    ['王五1', 22, '男', '羽毛球'],
    ['赵六1', 24, '女', '乒乓球']
  ];
};

// 定义 handleDropdownMenuClick 方法
const handleDropdownMenuClick = args => {
  console.log('menu click', tableOptions.value);
  console.log('menu click', args);
};

// 定义 handleMouseEnterCell 方法
const handleMouseEnterCell = args => {
  console.log('mouse enter cell', args);
};
</script>
