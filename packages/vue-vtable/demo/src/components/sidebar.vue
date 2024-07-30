<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['switchComponent']);

const links = ref({
  ListTable: [
    { name: 'list-table-checkbox', component: 'listtablecheckbox' },
    { name: 'list-table-transpose', component: 'listtabletranspose' },
    { name: 'list-table', component: 'listtable' },
    { name: 'list-table-fetch', component: 'listtablefetch' },
    { name: 'list-table-pagination', component: 'listtablepagination' },
    { name: 'list-table-edit', component: 'listtableedit' },
  ],
  PivotTable: [
    { name: 'pivot-table', component: 'pivottable' },
    { name: 'pivot-table-tree', component: 'pivottabletree' },
    { name: 'pivot-table-titleOnDimension', component: 'pivottabletitleOnDimension' },
    { name: 'pivot-table-lazyTreeload', component: 'pivottablelazyTreeload' },
  ],
  PivotChart: [
    { name: 'pivot-chart-listTable', component: 'pivotchartlistTable' },
    { name: 'pivot-chart', component: 'pivotchart' },
  ],
});

</script>

<template>
  <nav class="sidebar">
    <div class="title">
      <img style="width: 100%; margin-bottom: 10px;"
      src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/logo_500_200_light.png"
      />
      <div>
        VTable-Vue-Demo
      </div>
    </div>
    <ul class="list">
      <li v-for="(category, categoryName) in links" :key="categoryName">
        <div class="categoryName">- {{ categoryName }}</div>
        <ul>
          <li v-for="link in category" :key="link.name">
            <a href="#" class="link" @click.prevent="emit('switchComponent', link.component)">
              {{ link.name }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #cecece;
  color: #000000;
  padding: 20px;
  height: calc(100vh - 40px);
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.list {
  padding: 0;
  height: calc(100vh - 240px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.list::-webkit-scrollbar {
  display: none;
}

.sidebar li {
  border-radius: 5px;
  margin:10px 0 30px 0;
}

.sidebar a {
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  outline: none; 
  font-size: 16px;
  padding-bottom: 10px;
  border-bottom: 0.1px solid #646464;
  white-space: nowrap; 
}

.sidebar a:focus {
  color: rgb(0, 58, 204); 
}

.title {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
}

.categoryName {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.link {
 margin-left: 12px;
}
</style>
