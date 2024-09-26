<script setup>
// unified
import listtable from './table/unified/options/list-table/list-table.vue';
import listtableFetch from './table/unified/options/list-table/list-table-fetch.vue';

import listTableEditor from './table/unified/composition/list-table/list-table-editor.vue';
import listTableCustom from './table/unified/composition/list-table/list-table-custom.vue';
import pivotTableTree from './table/unified/composition/pivot-table/pivot-table-lazyTreeload.vue';//need to fix
import pivotTableTitleOnDimension from './table/unified/options/pivot-table/pivot-table-titleOnDimension.vue';

import pivotChart from './table/unified/composition/pivot-chart/pivot-chart.vue';

// gramatical
import ListTable from './table/gramatical/composition/ListTable.vue';
import ListTableTree from './table/gramatical/composition/ListTable-tree.vue';
import ListTableEditor from './table/gramatical/composition/ListTable-editor.vue';
import ListTableEditorArco from './table/gramatical/composition/ListTable-editor-arco.vue';
import ListTableDes from './table/gramatical/composition/ListTable-destruction.vue';
import ListTableCustom from './table/gramatical/composition/ListTable-custom.vue';
import ListTableCustomHover from './table/gramatical/composition/ListTable-custom-hover.vue';
import ListTableVFor from './table/gramatical/options/ListTable-v-for.vue';

import PivotTable from './table/gramatical/options/PivotTable.vue';  

import PivotChartPie from './table/gramatical/composition/PivotChartPie.vue';

// single custom component
import singleTag from './table/single/single-tag.vue';
import singleCheckbox from './table/single/single-checkbox.vue';
import singleRadio from './table/single/single-radio.vue';
</script>

<template>
  <!-- ------- -->
  <!-- unified -->
  <!-- ------- -->

  <!-- <listtable /> -->
  <!-- <listTableEditor /> -->
  <!-- <listtableFetch /> -->
  <!-- <listTableCustom /> -->

  <!-- <pivotTableTree /> -->
  <!-- <pivotTableTitleOnDimension /> -->

  <!-- <pivotChart /> -->

  <!-- ---------- -->
  <!-- gramatical -->
  <!-- ---------- -->

  <ListTable/>
  <!-- <ListTableEditor /> -->
  <!-- <ListTableEditorArco /> -->
  <!-- <ListTableDes /> -->
  <!-- <ListTableTree /> -->
  <!-- <ListTableCustom />  -->
  <!-- <ListTableCustomHover /> -->

  <!-- <PivotTable /> -->

  <!-- <PivotChartPie /> -->

  <!-- ----------------------- -->
  <!-- single custom component -->
  <!-- ----------------------- -->

  <!-- <singleTag /> -->
  <!-- <singleCheckbox /> -->
  <!-- <singleRadio /> -->

</template>

<style>
body,
#app {
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
