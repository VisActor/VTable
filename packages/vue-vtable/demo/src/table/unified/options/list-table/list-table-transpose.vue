<template>
    <vue-list-table :options="tableOptions" />
</template>

<script>
export default {
  data() {
    return {
      tableOptions: {
        columns: [],
        records: [],
        widthMode: 'standard'
      }
    };
  },
  mounted() {
    console.log('fetching data');
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched data:', data); // 调试信息
        const columns = [
          { field: 'Order ID', title: 'Order ID', width: 'auto' },
          { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
          { field: 'Product Name', title: 'Product Name', width: 'auto' },
          { field: 'Category', title: 'Category', width: 'auto' },
          { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
          { field: 'Region', title: 'Region', width: 'auto' },
          { field: 'City', title: 'City', width: 'auto' },
          { field: 'Order Date', title: 'Order Date', width: 'auto' },
          { field: 'Quantity', title: 'Quantity', width: 'auto' },
          { field: 'Sales', title: 'Sales', width: 'auto' },
          { field: 'Profit', title: 'Profit', width: 'auto' }
        ];
        

        this.tableOptions = {
          records: data,
          columns,
          widthMode: 'standard',

          transpose:true,
          widthMode:'standard',
          defaultRowHeight:50,
          defaultHeaderColWidth:200,
        };
        console.log('Table options:', this.tableOptions); // 调试信息 
      })
      .catch((error) => {
        console.error('Fetch error:', error); // 错误信息
      });
  }
};
</script>