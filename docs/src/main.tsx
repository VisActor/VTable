import ReactDOM from 'react-dom/client';
import * as VTable from '@visactor/vtable';
import * as VTableEditors from '@visactor/vtable-editors';
import { App } from './app';

import '@arco-design/web-react/dist/css/arco.css';

(window as any).VTable = VTable;
(window as any).VTable_editors=  VTableEditors;
(window as any).CONTAINER_ID = 'chart';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
