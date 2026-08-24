import * as VTable from '@visactor/vtable';
import { RotateTablePlugin } from '../../src';

const CONTAINER_ID = 'vTable';

const records = Array.from({ length: 80 }, (_, index) => ({
  id: index + 1,
  name: `Name ${index + 1}`,
  email: `${index + 1}@example.com`,
  city: `City ${index + 1}`
}));

const columns: VTable.ColumnsDefine = [
  { field: 'id', title: 'ID', width: 80, sort: true },
  { field: 'name', title: 'Name', width: 180 },
  { field: 'email', title: 'Email', width: 220 },
  { field: 'city', title: 'City', width: 180 }
];

const removeToolbar = () => {
  document.getElementById('issue5235Toolbar')?.remove();
  document.getElementById('issue5235Spacer')?.remove();
};

const setStatus = (message: string, pass: boolean) => {
  const status = document.getElementById('issue5235Status');
  if (!status) {
    return;
  }
  status.textContent = message;
  status.style.color = pass ? '#237804' : '#cf1322';
};

const getRotateDom = () => document.getElementById(CONTAINER_ID) as HTMLElement;

const dispatchWheelAndCheckPrevented = () => {
  const canvas = document.querySelector<HTMLCanvasElement>(`#${CONTAINER_ID} canvas`);
  if (!canvas) {
    return false;
  }

  const rect = canvas.getBoundingClientRect();
  const wheelEvent = new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    deltaY: 80
  });

  canvas.dispatchEvent(wheelEvent);
  return wheelEvent.defaultPrevented;
};

export function createTable() {
  removeToolbar();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '720px';
  container.style.height = '360px';
  container.style.margin = '24px auto';
  container.style.border = '1px solid #d9d9d9';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5235Toolbar';
  toolbar.style.cssText = 'display:flex;gap:8px;align-items:center;height:48px;font-size:12px;';
  toolbar.innerHTML = `
    <button id="issue5235Rotate">旋转表格</button>
    <button id="issue5235Restore">还原表格</button>
    <button id="issue5235Check">滚轮检查</button>
    <span>预期：旋转再还原后，表格内 wheel 的原始事件仍会被 preventDefault。</span>
    <strong id="issue5235Status"></strong>
  `;
  container.before(toolbar);

  const spacer = document.createElement('div');
  spacer.id = 'issue5235Spacer';
  spacer.style.cssText = 'height:900px;background:linear-gradient(#fff,#f5f5f5);';
  spacer.textContent = '页面滚动占位：用于观察表格内滚轮是否带动外层页面滚动。';
  container.after(spacer);

  const rotatePlugin = new RotateTablePlugin();
  const tableInstance = new VTable.ListTable(container, {
    records,
    columns,
    widthMode: 'standard',
    rowSeriesNumber: {},
    overscrollBehavior: 'none',
    plugins: [rotatePlugin]
  });

  const rotateTable = () => {
    const rotateDom = getRotateDom();
    const { width, height } = rotateDom.getBoundingClientRect();
    rotateDom.style.width = `${height}px`;
    rotateDom.style.height = `${width}px`;
    tableInstance.rotate90WithTransform?.(rotateDom);
    setStatus('READY | 已旋转，请点击还原后检查滚轮。', true);
  };

  const restoreTable = () => {
    const rotateDom = getRotateDom();
    const { width, height } = rotateDom.getBoundingClientRect();
    rotateDom.style.width = `${height}px`;
    rotateDom.style.height = `${width}px`;
    tableInstance.cancelTransform?.(rotateDom);
    setStatus('READY | 已还原，请点击滚轮检查。', true);
  };

  const checkWheel = () => {
    const prevented = dispatchWheelAndCheckPrevented();
    setStatus(`${prevented ? 'PASS' : 'FAIL'} | wheel.defaultPrevented=${prevented}`, prevented);
  };

  document.getElementById('issue5235Rotate')?.addEventListener('click', rotateTable);
  document.getElementById('issue5235Restore')?.addEventListener('click', restoreTable);
  document.getElementById('issue5235Check')?.addEventListener('click', checkWheel);

  (window as any).tableInstance = tableInstance;
  (window as any).issue5235Run = () => {
    rotateTable();
    restoreTable();
    checkWheel();
    return document.getElementById('issue5235Status')?.textContent;
  };

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    removeToolbar();
    release();
  };
}
