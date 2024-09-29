<template>
  <vue-pivot-table :options="tableOptions" :records="data" @onMouseEnterCell="onMouseEnterCell" ref="pivotTableRef">

    <PivotColumnDimension title="Category" dimensionKey="Category" :headerStyle="{ textStick: true }" width="auto" />

    <PivotRowDimension
      v-for="row in rows"
      :key="row.dimensionKey"
      :dimensionKey="row.dimensionKey"
      :title="row.title"
      :headerStyle="row.headerStyle"
      :width="row.width"
    />

    <PivotIndicator
      v-for="indicator in indicators"
      :key="indicator.indicatorKey"
      :indicatorKey="indicator.indicatorKey"
      :title="indicator.title"
      :width="indicator.width"
      :showSort="indicator.showSort"
      :headerStyle="indicator.headerStyle"
      :format="indicator.format"
      :style="indicator.style"
    />

    <PivotCorner titleOnDimension="row" :headerStyle="{ textStick: true }" />

    <Menu menuType="html" :contextMenuItems="['copy', 'paste', 'delete', '...']" />

    <!-- <PivotRowHeaderTitle title="City" :headerStyle="{ textStick: true }" /> -->
    
    <!-- <PivotColumnHeaderTitle title="Category" :headerStyle="{ textStick: true }" /> -->

  </vue-pivot-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as VTable from '@visactor/vtable';
import { PivotColumnDimension, PivotRowDimension, PivotIndicator, PivotCorner, Menu , PivotRowHeaderTitle , PivotColumnHeaderTitle } from '../../../../../src/components/index';

const pivotTableRef = ref(null);

const tableOptions = {
  // columns: [
  //   {
  //     dimensionKey: 'Category',
  //     title: 'Category',
  //     headerStyle: {
  //       textStick: true
  //     },
  //     width: 'auto'
  //   }
  // ],
  tooltip: {
        isShowOverflowTextTooltip: true
  },
  dataConfig: {
    sortRules: [
      {
        sortField: 'Category',
        sortBy: ['Office Supplies', 'Technology', 'Furniture']
      }
    ]
  },
  widthMode: 'standard',
};

const data = ref([]);

const indicators = [
  {
    indicatorKey: 'Quantity',
    title: 'Quantity',
    width: 'auto',
    showSort: false,
    headerStyle: {
      fontWeight: 'normal'
    },
    style: {
      padding: [16, 28, 16, 28],
      color(args) {
        if (args.dataValue >= 0) return 'black';
        return 'red';
      }
    }
  },
  {
    indicatorKey: 'Sales',
    title: 'Sales',
    width: 'auto',
    showSort: false,
    headerStyle: {
      fontWeight: 'normal'
    },
    format: rec => {
      return '$' + Number(rec).toFixed(2);
    },
    style: {
      padding: [16, 28, 16, 28],
      color(args) {
        if (args.dataValue >= 0) return 'black';
        return 'red';
      }
    }
  },
  {
    indicatorKey: 'Profit',
    title: 'Profit',
    width: 'auto',
    showSort: false,
    headerStyle: {
      fontWeight: 'normal'
    },
    format: rec => {
      return '$' + Number(rec).toFixed(2);
    },
    style: {
      padding: [16, 28, 16, 28],
      color(args) {
        if (args.dataValue >= 0) return 'black';
        return 'red';
      }
    }
  }
];

const rows = [
  {
    dimensionKey: 'City',
    title: 'City',
    headerStyle: {
      textStick: true
    },
    width: 'auto'
  }
];

onMounted(() => {
  setTimeout(() => {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
      .then(res => res.json())
      .then(jsonData => {
        data.value = jsonData;
      });
  }, 0);
});

const onMouseEnterCell = (args) => {
  const tableInstance = pivotTableRef.value.vTableInstance;
  const { col, row, targetIcon } = args;

  if (col === 0 && row >= 1) {
    const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });

    tableInstance.showTooltip(col, row, {
      content: 'Order ID：' + tableInstance.getCellValue(col, row),
      className: 'defineTooltip',
      referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
      disappearDelay: 100,
      style: {
        bgColor: 'black',
        color: 'white',
        font: 'normal bold normal 14px/1 STKaiti',
        arrowMark: true
      }
    });
  }  
};
</script>