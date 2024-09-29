<template>
  <vue-pivot-chart :options="tableOptions" ref="pivotChartRef" @onLegendItemClick="handleLegendItemClick" :height="800">
    
   <PivotRowDimension
      v-for="row in rows"
      :dimensionKey="row.dimensionKey"
      :title="row.title"
      :headerStyle="row.headerStyle"
      :objectHandler="row"
    />
    
    
    <PivotColumnDimension
      v-for="column in columns"
      :dimensionKey="column.dimensionKey"
      :title="column.title"
      :headerStyle="column.headerStyle"
      :objectHandler="column"
    />

    
    <PivotIndicator
      v-for="indicator in indicators"
      :indicatorKey="indicator.indicatorKey"
      :title="indicator.title"
      :cellType="indicator.cellType"
      :chartModule="indicator.chartModule"
      :chartSpec="indicator.chartSpec"
      :style="indicator.style"
    />

    <PivotCorner
      :titleOnDimension="corner.titleOnDimension"
      :headerStyle="corner.headerStyle"
    />

  </vue-pivot-chart>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { registerChartModule }  from '../../../../../src/index';
import { PivotColumnDimension, PivotRowDimension, PivotIndicator, PivotCorner } from '../../../../../src/components/index';
import VChart from '@visactor/vchart';
registerChartModule('vchart', VChart);

const pivotChartRef = ref(null);
const tableOptions = ref({});

const rows = [
  {
    dimensionKey: 'Order Year',
    title: 'Order Year',
    headerStyle: {
      textStick: true
    }
  },
  'Ship Mode'
];

const columns = [
  {
    dimensionKey: 'Region',
    title: 'Region',
    headerStyle: {
      textStick: true
    }
  },
  'Category'
];

const indicators = [
  {
    indicatorKey: 'Quantity',
    title: 'Quantity',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: {
      type: 'common',
      stack: true,
      type: 'pie',
      data: {
        id: 'data',
        fields: {
          'Segment-Indicator': {
            sortIndex: 1,
            domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity']
          }
        }
      },
      categoryField: 'Segment-Indicator',
      valueField: 'Quantity',
      scales: [
        {
          id: 'color',
          type: 'ordinal',
          domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity'],
          range: ['#2E62F1', '#4DC36A', '#FF8406']
        }
      ]
    },
    style: {
      padding: 1
    }
  }
];

const corner = {
  titleOnDimension: 'row',
  headerStyle: {
    autoWrapText: true
  }
};

const handleLegendItemClick = (args) => {
  console.log('handleLegendItemClick',args);
  pivotChartRef.value.vTableInstance.updateFilterRules([
    {
      filterKey: 'Segment-Indicator',
      filteredValues: args.value
    }
  ]);
};

onMounted(() => {
   fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      const option = {
        hideIndicatorName: true,
        rows,
        columns,
        indicators,
        records: data,
        defaultRowHeight: 200,
        defaultHeaderRowHeight: 50,
        defaultColWidth: 280,
        defaultHeaderColWidth: 100,
        indicatorTitle: '指标',
        autoWrapText: true,
        widthMode: 'adaptive',
        heightMode: 'adaptive',
        legends: {
          orient: 'bottom',
          type: 'discrete',
          data: [
            {
              label: 'Consumer-Quantity',
              shape: {
                fill: '#2E62F1',
                symbolType: 'circle'
              }
            },
            {
              label: 'Corporate-Quantity',
              shape: {
                fill: '#4DC36A',
                symbolType: 'square'
              }
            },
            {
              label: 'Home Office-Quantity',
              shape: {
                fill: '#FF8406',
                symbolType: 'square'
              }
            }
          ]
        },
        pagination: {
          currentPage: 0,
          perPageCount: 8
        }
      };
      tableOptions.value = option;
    });
});

</script>