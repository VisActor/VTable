<template>
    <vue-list-table :options="tableOptions" />
</template>

<script>
export default {
  data() {
    return {
      tableOptions: {
        columns: [
          {
            field: 'isCheck',
            title: '',
            width: 60,
            headerType: 'checkbox',
            cellType: 'checkbox',
          },
          {
            field: 'productName',
            title: 'productName',
            width: 120
          },
          {
            field: 'price',
            title: 'checkbox',
            width: 120,
            cellType: 'checkbox',
            disable: true,
            checked: true
          },
          {
            field: 'check',
            title: 'checkbox',
            width: 120,
            cellType: 'checkbox'
          }
        ],
        records: [
          { productName: 'aaaa', price: 20, check: { text: 'unchecked', checked: false, disable: false } },
          { productName: 'bbbb', price: 18, check: { text: 'checked', checked: true, disable: false } },
          { productName: 'cccc', price: 16, check: { text: 'disable', checked: true, disable: true } },
          { productName: 'cccc', price: 14, check: { text: 'disable', checked: false, disable: true } },
          { productName: 'eeee', price: 12, check: { text: 'checked', checked: false, disable: false } },
          { productName: 'ffff', price: 10, check: { text: 'checked', checked: false, disable: false } },
          { productName: 'gggg', price: 10, check: { text: 'checked', checked: false, disable: false } }
        ]
      }
    };
  },
  mounted() {
    // const tableInstance = new VTable.ListTable(document.getElementById('table-container'), this.tableOptions);
    // window['tableInstance'] = tableInstance;
  }
};
</script>
