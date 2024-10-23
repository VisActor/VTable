<template>
  <vue-list-table :options="tableOptions" :records="records" @onDropdownMenuClick="handleDropdownMenuClick">
    <template v-for="(column, index) in columns" :key="index">
      <ListColumn :field="column.field" :title="column.title" />
    </template>
    <ListColumn field="4" title="邮件" maxWidth="300"/>
    <ListColumn field="5" title="地址" drag-header="true"/>
    <ListColumn field="6" title="手机" drag-header="true"/>
    <ListColumn field="7" title="状态" drag-header="true"/>
    <Menu menuType="html" :contextMenuItems="['copy', 'paste', 'delete', '...']" />
  </vue-list-table>
</template>

<script>
import { ListColumn } from '../../../../../src/components/index';

export default {
  components: {
    ListColumn
  },
  data() {
    const columns = [
      { field: '0', title: '名字' },
      { field: '1', title: '年龄' },
      { field: '2', title: '性别' },
      { field: '3', title: '爱好' }
    ];
    
    const options = {
      // widthMode : 'adaptive',
      menu: {
        menuType : 'html',
        contextMenuItems: ['copy', 'paste', 'delete', '...']
      }
    };
    
    const records = new Array(1000).fill(['张三', 18, '男', '🏀','@example','xxx.xxx.xxx.xxx','12345678901','正常']);

    return {
      columns,
      records,
      tableOptions: options
    };
  },
  onMounted() {
    console.log(this.records);
  },
  methods: {
    handleDropdownMenuClick(args) {
      console.log('menu click', args);
    }
  }
};
</script>