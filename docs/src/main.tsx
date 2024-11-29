import React from 'react';
import ReactDOM from 'react-dom/client';
import Inula from 'openinula';
import * as VTable from '@visactor/vtable';
import * as VRender from '@visactor/vtable/es/vrender';
import * as VTableGantt from '@visactor/vtable-gantt';
import * as VTableCalendar from '@visactor/vtable-calendar';
import * as VChart from '@visactor/vchart';
import * as VTableEditors from '@visactor/vtable-editors';
import { downloadCsv, exportVTableToCsv, downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';
import { SearchComponent } from '@visactor/vtable-search';
import * as ReactVTable from '@visactor/react-vtable';
import * as VueVTable from '@visactor/vue-vtable';
import * as InulaVTable from '@visactor/openinula-vtable';
import * as VTablePlugins from '@visactor/vtable-plugins';
import { App } from './app';
import * as ArcoDesign from '@arco-design/web-react';
import * as ArcoDesignVue from '@arco-design/web-vue';
import * as ArcoDesignIcon from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import '@arco-design/web-vue/dist/arco.css';
import { createApp, ref, onMounted, h } from 'vue';

(window as any).ArcoDesign = ArcoDesign;
(window as any).ArcoDesignVue = ArcoDesignVue;
(window as any).ArcoDesignIcon = ArcoDesignIcon;
(window as any).VTable = VTable;
(window as any).VRender = VRender;
(window as any).VTableGantt = VTableGantt;
(window as any).VTableCalendar = VTableCalendar;
(window as any).VTable_editors = VTableEditors;
(window as any).VTablePlugins = VTablePlugins;
(window as any).VChart = VChart.VChart;

(window as any).downloadCsv = downloadCsv;
(window as any).exportVTableToCsv = exportVTableToCsv;
(window as any).downloadExcel = downloadExcel;
(window as any).exportVTableToExcel = exportVTableToExcel;
(window as any).SearchComponent = SearchComponent;

(window as any).CONTAINER_ID = 'chart';
(window as any).React = React;
(window as any).ReactDom = ReactDOM;
(window as any).ReactVTable = ReactVTable;

(window as any).VueVTable = VueVTable;
(window as any).createApp = createApp;
(window as any).ref = ref;
(window as any).onMounted = onMounted;
(window as any).h = h;

(window as any).Inula = Inula;
(window as any).InulaVTable = InulaVTable;


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
