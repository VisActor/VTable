<template>
  <vue-list-table :options="tableOptions"/>
</template>

<script>
// ... 导入和注册 VueVTable 组件的代码
export default {
  data() {
    const option = {
      header: [
        {
          field: '0',
          caption: '名称'
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
        }
      ],
      records: new Array(1000).fill(['张三', 18, '男', '🏀'])
    };
    return {
      tableOptions: option
    };
  }
  // ... 其他选项
};
</script>
