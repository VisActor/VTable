import * as VTable from '../../src';

const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  // 生成较大数据量，便于对比实时与非实时响应下的拖拽流畅度
  const records = Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: `记录 ${index + 1}`,
    dept: ['研发', '产品', '运营', '销售'][index % 4],
    city: ['杭州', '北京', '上海', '成都', '广州'][index % 5],
    score: Math.round(Math.random() * 100),
    salary: Math.round(4000 + Math.random() * 20000)
  }));

  const option: any = {
    columns: [
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: '姓名', width: 160 },
      { field: 'dept', title: '部门', width: 120 },
      { field: 'city', title: '城市', width: 120 },
      { field: 'score', title: '评分', width: 120 },
      { field: 'salary', title: '薪资', width: 140 }
    ],
    records,
    defaultRowHeight: 32,
    resize: {
      columnResizeMode: 'all',
      rowResizeMode: 'all',
      // 关键：设为 false 时，拖拽过程只移动指示线，鼠标松开后才应用列宽/行高变化，
      // 可显著缓解大数据量下的拖拽卡顿。默认为 true，保持原有行为。
      realtime: false
    }
  };

  const instance = new ListTable(document.getElementById(CONTAINER_ID)!, option);
  (window as any).tableInstance = instance;

  // 提供简单的运行时切换按钮，便于对比两种模式的手感
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed',
    'top:10px',
    'right:10px',
    'z-index:9999',
    'background:#fff',
    'padding:8px 12px',
    'border:1px solid #ddd',
    'border-radius:4px',
    'box-shadow:0 1px 4px rgba(0,0,0,.1)',
    'font-family:sans-serif',
    'font-size:12px'
  ].join(';');
  bar.innerHTML = `
    <div style="margin-bottom:6px;">当前 resize.realtime = <b id="__realtime_state">false</b></div>
    <button id="__toggle_realtime">切换为 实时响应(true)</button>
  `;
  document.body.appendChild(bar);
  let current = false;
  bar.querySelector('#__toggle_realtime')!.addEventListener('click', () => {
    current = !current;
    // 通过 updateOption 重新应用配置
    (instance as any).updateOption({
      ...option,
      resize: { ...option.resize, realtime: current }
    });
    (bar.querySelector('#__realtime_state') as HTMLElement).textContent = String(current);
    (bar.querySelector('#__toggle_realtime') as HTMLElement).textContent = `切换为 ${
      current ? '非实时(false)' : '实时(true)'
    }`;
  });
}
