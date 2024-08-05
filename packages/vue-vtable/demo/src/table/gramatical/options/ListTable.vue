<template>
  <vue-list-table :options="tableOptions" :records="records" @onDropdownMenuClick="handleDropdownMenuClick">
    <ListColumn field="0" title="名字" />
    <ListColumn field="1" title="年龄" />
    <ListColumn field="2" title="性别" />
    <ListColumn field="3" title="爱好" />
  </vue-list-table>
</template>

<script>
import { ref, onMounted } from 'vue';
import ListColumn from '../../../../../src/components/list-column.vue';

export default {
  components: {
    ListColumn
  },
  setup() {
    const ListColumnRef = ref(null);

    onMounted(() => {
      console.log(ListColumnRef.value);
    });

    return {
      ListColumnRef
    };
  },
  methods: {
    handleDropdownMenuClick(args) {
      console.log('menu click', ListTable);
      console.log('menu click', args);
    }
  },
  data() {
    const options = {
      header: [
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
    };
    const records = [
      ['张三', 18, '男', '篮球'],
      ['李四', 20, '女', '足球'],
      ['王五', 22, '男', '羽毛球'],
      ['赵六', 24, '女', '乒乓球']
    ];
    return {
      records,
      tableOptions: options
    };
  }
};
</script>