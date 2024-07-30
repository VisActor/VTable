<script setup>
import { ref, watch, defineProps } from 'vue';
// import ListTable from '../table/list-table/ListTable.vue';
import listtablecheckbox from '../table/unified/options/list-table/list-table-checkbox.vue';
import listtabletranspose from '../table/unified/options/list-table/list-table-transpose.vue';
import listtable from '../table/unified/options/list-table/list-table.vue';
import listtablefetch from '../table/unified/options/list-table/list-table-fetch.vue';
import pivottable from '../table/unified/options/pivot-table/pivot-table.vue';
import pivottabletree from '../table/unified/options/pivot-table/pivot-table-tree.vue';
import pivottabletitleOnDimension from '../table/unified/options/pivot-table/pivot-table-titleOnDimension.vue';
import pivotchartlistTable from '../table/unified/composition/pivot-chart/pivot-chart-listTable.vue';
import pivotchart from '../table/unified/composition/pivot-chart/pivot-chart.vue';
import listtablepagination from '../table/unified/composition/list-table/list-table-pagination.vue';
import listtableedit from '../table/unified/composition/list-table/list-table-edit.vue';
import pivottablelazyTreeload from '../table/unified/composition/pivot-table/pivot-table-lazyTreeload.vue';

const components = {
  listtablecheckbox,
  listtabletranspose,
  listtable,
  listtablefetch,
  pivottable,
  pivottabletree,
  pivottabletitleOnDimension,
  pivotchartlistTable,
  pivotchart,
  listtablepagination,
  listtableedit,
  pivottablelazyTreeload,
};




const props = defineProps({
  currentComponent: {
    type: String,
    required: true,
  },
});

const currentComponent = ref(props.currentComponent);

watch(
  () => props.currentComponent,
  (newVal) => {
    currentComponent.value = newVal;
  }
);
</script>

<template>
  <main class="content">
    <div class="title">
      {{ currentComponent }}
    </div>
    <component :is="components[currentComponent]" />
  </main>
</template>

<style scoped>
.content {
  flex: 1;
  padding-inline: 20px;
  height: 100vh;
  overflow: hidden;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>