import { createApp } from 'vue';
import App from './App.vue';
import { ListTable, PivotTable, PivotChart } from '../../src/index';
// import './index.css';

const app = createApp(App);
app.component('VueListTable', ListTable);
app.component('VuePivotTable', PivotTable);
app.component('VuePivotChart', PivotChart);
app.mount('#app');
