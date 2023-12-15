import ReactDOM from 'react-dom/client';
import * as VTable from '@visactor/vtable';
import * as VChart from '@visactor/vchart';
import * as VTableEditors from '@visactor/vtable-editors';
import {
  downloadCsv,
  exportVTableToCsv,
  downloadExcel,
  exportVTableToExcel,
} from "@visactor/vtable-export";
import { App } from './app';

import '@arco-design/web-react/dist/css/arco.css';

(window as any).VTable = VTable;
(window as any).VTable_editors=  VTableEditors;
(window as any).VChart = VChart.VChart;

(window as any).downloadCsv = downloadCsv;
(window as any).exportVTableToCsv = exportVTableToCsv;
(window as any).downloadExcel = downloadExcel;
(window as any).exportVTableToExcel = exportVTableToExcel;

(window as any).CONTAINER_ID = 'chart';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
