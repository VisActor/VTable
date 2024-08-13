import React from 'react';
import ReactDOM from 'react-dom/client';
import Inula from 'openinula';
import * as VTable from '@visactor/vtable';
import * as VChart from '@visactor/vchart';
import * as VTableEditors from '@visactor/vtable-editors';
import { downloadCsv, exportVTableToCsv, downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';
import { SearchComponent } from '@visactor/vtable-search';
import * as ReactVTable from '@visactor/react-vtable';
import * as InulaVTable from '@visactor/openinula-vtable';
import { App } from './app';
import * as ArcoDesign from '@arco-design/web-react';
import * as ArcoDesignIcon from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';

(window as any).ArcoDesign = ArcoDesign;
(window as any).ArcoDesignIcon = ArcoDesignIcon;
(window as any).VTable = VTable;
(window as any).VTable_editors = VTableEditors;
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

(window as any).Inula = Inula;
(window as any).InulaVTable = InulaVTable;

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
