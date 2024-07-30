<script setup>
import listtable from './table/unified/options/list-table/list-table.vue';
import listTableEdit from './table/unified/composition/list-table/list-table-edit.vue';

import pivotTableTree from './table/unified/composition/pivot-table/pivot-table-lazyTreeload.vue';
import pivotTableTitleOnDimension from './table/unified/options/pivot-table/pivot-table-titleOnDimension.vue';

import pivotChart from './table/unified/composition/pivot-chart/pivot-chart.vue';
</script>

<template>

  <listtable />
  <!-- <listTableEdit /> -->

  <!-- <pivotTableTree /> -->
  <!-- <pivotTableTitleOnDimension /> -->

  <!-- <pivotChart /> -->

  
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
