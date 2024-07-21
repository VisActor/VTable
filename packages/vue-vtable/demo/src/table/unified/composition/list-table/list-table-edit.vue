<template>
  <vue-list-table
    :options="tableOptions"
    :records="records"
    :width="width"
    :height="height"
    @onDropdownMenuClick="handleDropdownMenuClick"
    @onClickCell="handleClickCell"
    @onMouseEnterTable="handleMouseEnterTable"
    @onScroll="handleScroll"
    ref="listTableRef"
  />
</template>

<script setup>
import { ref, onMounted , inject} from 'vue';
// import * as VTable from '@visactor/vtable';
// import * as VTable_editors from '@visactor/vtable-editors';

// const input_editor = new VTable_editors.InputEditor();
// VTable.register.editor('input-editor', input_editor);

const tableOptions = ref({});
const records = ref([]);
const width = ref('100%');
const height = ref('600px');
const listTableRef = ref(null);
const copyData = ref(null);

const handleScroll = (args) => {
  console.log('scroll', args);
};

const handleMouseEnterTable = (args) => {
  console.log('mouse enter table', args);
};

const handleClickCell = (args) => {
  console.log('click cell', args);
};

const handleDropdownMenuClick = (args) => {
  // console.log('menu click', args);
  if (args.menuKey === 'copy') {
    copyData.value = listTableRef.value.baseTableRef.vTableInstance.getCopyValue();
  } else if (args.menuKey === 'paste') {
    const rows = copyData.value.split('\n');
    const values = rows.map(row => row.split('\t').map(cell => cell.trim()));
    listTableRef.value.vTableInstance.changeCellValues(args.col, args.row, values);
  } else if (args.menuKey === 'delete') {
    const selectCells = listTableRef.value.vTableInstance.getSelectedCellInfos();
    if (selectCells?.length > 0 && cellIsSelectRange(args.col, args.row, selectCells)) {
      deleteSelectRange(selectCells);
    } else {
      listTableRef.value.vTableInstance.changeCellValue(args.col, args.row, '');
    }
  }
};

const cellIsSelectRange = (col, row, selectCells) => {
  return selectCells.some(row => row.some(cell => cell.col === col && cell.row === row));
};

const deleteSelectRange = (selectCells) => {
  selectCells.forEach(row => {
    row.forEach(cell => {
      listTableRef.value.vTableInstance.changeCellValue(cell.col, cell.row, '');
    });
  });
};

onMounted(async () => {
  
  const res = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json');
  const data = await res.json();
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
    menu: {
      contextMenuItems: ['copy', 'paste', 'delete', '...']
    }
  };
});
</script>
