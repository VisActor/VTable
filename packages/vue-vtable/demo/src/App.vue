<script setup>
// unified
import listtable from './table/unified/options/list-table/list-table.vue';
import listtableFetch from './table/unified/options/list-table/list-table-fetch.vue';

import listTableEdit from './table/unified/composition/list-table/list-table-edit.vue';
import pivotTableTree from './table/unified/composition/pivot-table/pivot-table-lazyTreeload.vue';
import pivotTableTitleOnDimension from './table/unified/options/pivot-table/pivot-table-titleOnDimension.vue';

import pivotChart from './table/unified/composition/pivot-chart/pivot-chart.vue';

// gramatical
import ListTable from './table/gramatical/composition/ListTable.vue';
import ListTableTree from './table/gramatical/composition/ListTable-tree.vue';
import ListTableDes from './table/gramatical/composition/ListTable-destruction.vue';
import PivotChartPie from './table/gramatical/composition/PivotChartPie.vue';

import ListTableVFor from './table/gramatical/options/ListTable-v-for.vue';
import PivotTable from './table/gramatical/options/PivotTable.vue';  
</script>

<template>
  <!-- ------- -->
  <!-- unified -->
  <!-- ------- -->

  <!-- <listtable /> -->
  <!-- <listTableEdit /> -->
  <!-- <listtableFetch /> -->
  
  <!-- <pivotTableTree /> -->
  <!-- <pivotTableTitleOnDimension /> -->
  
  <!-- <pivotChart /> -->

  <!-- ---------- -->
  <!-- gramatical -->
  <!-- ---------- -->

  <ListTable/>
  <!-- <ListTableDes /> -->
  <!-- <ListTableTree /> -->

  <!-- <PivotTable /> -->
  
  <!-- <PivotChartPie /> -->

</template>

<style>
body,#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}
</style>
