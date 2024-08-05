<template>
  <vue-list-table :options="tableOptions" :records="records" @onDropdownMenuClick="handleDropdownMenuClick" @onMouseEnterCell="handleMouseEnterCell">
    <ListColumn v-for="column in columns" :key="column.field" :field="column.field" :title="column.caption" maxWidth="300" dragHeader="true" />
  </vue-list-table>
</template>

<script setup>
import { ref , onMounted } from 'vue';
import { ListColumn } from '../../../../../src/components/index';

const columns = [
  {
    field: '0',
    caption: '名字'
  },
  {
    field: '1',
    caption: '年龄'
  },
  {
    field: '2',
    caption: '性别'
  },
  {
    field: '3',
    caption: '爱好'
  },
  {
    field: '4',
    caption: '公司'
  },
  {
    field: '5',
    caption: '地址'
  },
  {
    field: '6',
    caption: '手机'
  },
  {
    field: '7',
    caption: '邮箱'
  },
  {
    field: '8',
    caption: '备注'
  }
];

const updateRandomColumn = () => {
  const index = Math.floor(Math.random() * columns.length);
  columns[index].caption = columns[index].caption + '!';
  console.log('updateRandomColumn', columns);
};
setInterval(updateRandomColumn, 1000);

function getRandomName() {
  const names = ['张三', '李四', '王五', '赵六', '陈七', '吴八', '郑九', '王十'];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomAge() {
  return Math.floor(Math.random() * 10) + 18; 
}

function getRandomGender() {
  return Math.random() > 0.5 ? '男' : '女';
}

function getRandomSport() {
  const sports = ['篮球', '足球', '羽毛球', '乒乓球', '排球', '网球', '游泳', '跑步'];
  return sports[Math.floor(Math.random() * sports.length)];
}

const generateRandomRecords = (num) => {
  const records = [];
  for (let i = 0; i < num; i++) {
    records.push([getRandomName(), getRandomAge(), getRandomGender(), getRandomSport()]);
  }
  return records;
};

const records = ref(generateRandomRecords(1000));

const updateRandomRecords = () => {
  for (let i = 0; i < 1000; i++) {
    const index = Math.floor(Math.random() * records.value.length);
    records.value[index] = [getRandomName(), getRandomAge(), getRandomGender(), getRandomSport()];
  }
};

// 每秒更新10条记录
// setInterval(updateRandomRecords, 1000);

const tableOptions = ref({
  menu: {
    contextMenuItems: ['copy', 'paste', 'delete', '...']
  }
});

const handleDropdownMenuClick = (args) => {
  console.log('menu click', tableOptions.value);
  console.log('menu click', args);
};

const handleMouseEnterCell = (args) => {
  console.log('mouse enter cell', args);
};
</script>