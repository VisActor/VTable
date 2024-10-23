<template>
  <vue-list-table :options="tableOptions" :records="recordsData" >
    <ListColumn 
      v-for="column in columnsData" 
      :field="column.field" 
      :title="column.title" 
      :width="column.width" 
      :tree="column.tree"
      :fieldFormat="column.fieldFormat"
    />
    <Tooltip :isShowOverflowTextTooltip="true" /> 
  </vue-list-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ListColumn } from '../../../../../src/components/index';

const tableOptions = ref({});
const recordsData = ref([]);
const columnsData = ref([]);

const fetchData = async () => {
  try {
    const response = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/company_struct.json')
    const jsonData = await response.json();

    const columns = [
      {
        field: "group",
        title: "department",
        width: "auto",
        tree: true,
        fieldFormat(rec) {
          return rec['department'] ?? rec['group'] ?? rec['name'];
        }
      },
      {
        field: "total_children",
        title: "members count",
        width: "auto",
        fieldFormat(rec) {
          if (rec?.['position']) {
            return `position: ${rec['position']}`;
          } else {
            return rec?.['total_children'];
          }
        }
      },
      {
        field: "monthly_expense",
        title: "monthly expense",
        width: "auto",
        fieldFormat(rec) {
          if (rec?.['salary']) {
            return `salary: ${rec['salary']}`;
          } else {
            return rec?.['monthly_expense'];
          }
        }
      },
      {
        field: "new_hires_this_month",
        title: "new hires this month",
        width: "auto"
      },
      {
        field: "resignations_this_month",
        title: "resignations this month",
        width: "auto"
      },
      {
        field: "complaints_and_suggestions",
        title: "received complaints count",
        width: "auto"
      }
    ];

    tableOptions.value = {
      widthMode: 'standard',
      // tooltip: {
      //   isShowOverflowTextTooltip: true
      // }
    };

    columnsData.value = columns;
    recordsData.value = jsonData;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(fetchData);
</script>