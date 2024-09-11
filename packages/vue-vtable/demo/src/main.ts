import { createApp } from 'vue';
import App from './App.vue';
import { ListTable, PivotTable, PivotChart } from '../../src/index';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
// import './index.css';

const app = createApp(App);
app.use(ArcoVue);
app.component('VueListTable', ListTable);
app.component('VuePivotTable', PivotTable);
app.component('VuePivotChart', PivotChart);
app.mount('#app');
