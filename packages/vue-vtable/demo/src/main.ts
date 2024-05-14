import { createApp } from 'vue';
import App from './App.vue';
import {ListTable}  from '../../src/index';


const app = createApp(App);
app.component('vue-list-table', ListTable); // 这样在整个应用中都可以使用 <vue-list-table> 标签了
app.mount('#app');