import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const colCount = 50;
  const rowCount = 200;

  const departments = ['Engineering', 'Marketing', 'Sales', 'Design', 'Finance', 'HR', 'Operations', 'Legal'];
  const statuses = ['Active', 'On Leave', 'Remote', 'In Office'];
  const levels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
  const cities = [
    'Beijing',
    'Shanghai',
    'Shenzhen',
    'Hangzhou',
    'Guangzhou',
    'Chengdu',
    'Nanjing',
    'Wuhan',
    'Tokyo',
    'Singapore'
  ];

  const columns: VTable.ColumnsDefine = [
    { field: 'id', title: 'ID', width: 60 },
    { field: 'name', title: 'Name', width: 120 },
    { field: 'dept', title: 'Department', width: 110 },
    { field: 'level', title: 'Level', width: 90 },
    { field: 'city', title: 'City', width: 100 },
    { field: 'status', title: 'Status', width: 90 },
    { field: 'email', title: 'Email', width: 200 }
  ];

  for (let i = 1; i <= colCount - 7; i++) {
    const quarter = `Q${((i - 1) % 4) + 1}`;
    const year = 2020 + Math.floor((i - 1) / 4);
    columns.push({
      field: `metric_${i}`,
      title: `${quarter} ${year}`,
      width: 100,
      style: {
        textAlign: 'right'
      },
      headerStyle: {
        textAlign: 'center'
      }
    });
  }

  const fnames = ['Alex', 'Emma', 'Liam', 'Mia', 'Noah', 'Olivia', 'James', 'Sophia', 'Lucas', 'Ava'];
  const lnames = ['Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Wu', 'Zhou', 'Xu'];

  const records = Array.from({ length: rowCount }, (_, i) => {
    const rec: Record<string, any> = {
      id: i + 1,
      name: `${fnames[i % fnames.length]} ${lnames[Math.floor(i / fnames.length) % lnames.length]}`,
      dept: departments[i % departments.length],
      level: levels[i % levels.length],
      city: cities[i % cities.length],
      status: statuses[i % statuses.length],
      email:
        `${fnames[i % fnames.length].toLowerCase()}.` +
        `${lnames[Math.floor(i / fnames.length) % lnames.length].toLowerCase()}@company.com`
    };
    for (let j = 1; j <= colCount - 7; j++) {
      rec[`metric_${j}`] = (Math.random() * 10000).toFixed(0);
    }
    return rec;
  });

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    defaultRowHeight: 36,
    widthMode: 'standard',
    frozenColCount: 1,
    keyboardOptions: {
      moveSelectedCellOnArrowKeys: true
    },
    theme: VTable.themes.ARCO.extends({
      scrollStyle: {
        visible: 'always',
        width: 8,
        hoverOn: true
      },
      selectionStyle: {
        cellBgColor: 'rgba(0, 100, 250, 0.12)',
        cellBorderColor: '#0064FA',
        cellBorderLineWidth: 2
      }
    }),
    hover: {
      highlightMode: 'cross',
      disableHeaderHover: false
    },
    select: {
      headerSelectMode: 'cell'
    }
  };

  const instance = new ListTable(option);

  instance.selectCell(1, 1);

  const infoDiv = document.createElement('div');
  infoDiv.style.cssText =
    'position:fixed;top:12px;right:16px;padding:12px 20px;background:rgba(0,0,0,0.75);' +
    'color:#fff;border-radius:8px;font:14px/1.6 system-ui,sans-serif;z-index:999;max-width:360px;' +
    'box-shadow:0 4px 12px rgba(0,0,0,0.15)';
  infoDiv.innerHTML =
    '<b>Arrow Key Navigation Demo</b><br>' +
    'Use <kbd style="background:#555;padding:1px 6px;border-radius:3px">←</kbd> ' +
    '<kbd style="background:#555;padding:1px 6px;border-radius:3px">→</kbd> ' +
    '<kbd style="background:#555;padding:1px 6px;border-radius:3px">↑</kbd> ' +
    '<kbd style="background:#555;padding:1px 6px;border-radius:3px">↓</kbd> to navigate<br>' +
    '<span style="color:#8cf">50 columns × 200 rows</span>';
  document.body.appendChild(infoDiv);

  window.tableInstance = instance;
}
