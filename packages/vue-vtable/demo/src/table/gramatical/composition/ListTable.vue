<template>
  <vue-list-table :options="tableOptions" :records="records" @onDropdownMenuClick="handleDropdownMenuClick" @onMouseEnterCell="handleMouseEnterCell">
    <ListColumn field="0" title="名字" maxWidth="300" :dragHeader="true" />
    <ListColumn field="1" title="年龄" maxWidth="300" :dragHeader="true" />
    <ListColumn field="2" title="性别" maxWidth="300" :dragHeader="true" />
    <ListColumn field="3" title="爱好" maxWidth="300" :dragHeader="true" />
  </vue-list-table>
</template>

<script setup>
import { ref } from 'vue';
import { ListColumn } from '../../../../../src/components/index';

const records = ref([
  ['张三', 18, '男', '篮球'],
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


// 定义 handleDropdownMenuClick 方法
const handleDropdownMenuClick = (args) => {
  console.log('menu click', tableOptions.value);
  console.log('menu click', args);
};

// 定义 handleMouseEnterCell 方法
const handleMouseEnterCell = (args) => {
  console.log('mouse enter cell', args);
};
</script>