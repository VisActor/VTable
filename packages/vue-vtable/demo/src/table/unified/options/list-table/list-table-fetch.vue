<template>
  <vue-list-table :options="tableOptions"/>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tableOptions = ref({});

const fetchData = async () => {
  try {
    const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json');
    const data = await response.json();

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

    tableOptions.value = {
      records: data,
      columns,
      widthMode: 'standard',
    };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(fetchData);
</script>