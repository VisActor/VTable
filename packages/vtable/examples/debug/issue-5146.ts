import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const TIP_ID = 'issue-5146-tip';

function createRecords(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `name-${index + 1}`,
    city: ['Beijing', 'Shanghai', 'Hangzhou', 'Shenzhen'][index % 4],
    score: 60 + (index % 40),
    email: `user${index + 1}@visactor.io`
  }));
}

function ensureTip() {
  const existed = document.getElementById(TIP_ID);
  if (existed) {
    existed.remove();
  }
  const tip = document.createElement('div');
  tip.id = TIP_ID;
  tip.style.margin = '8px 0';
  tip.style.font = '14px/1.5 sans-serif';
  tip.textContent = [
    'Issue #5146:',
    'click any body cell or use the preselected cell,',
    'then keep pressing Shift + Arrow keys to verify the selection range expands continuously.'
  ].join(' ');
  const container = document.getElementById(CONTAINER_ID);
  container?.parentElement?.insertBefore(tip, container);
}

export function createTable() {
  ensureTip();

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records: createRecords(30),
    columns: [
      {
        field: 'id',
        title: 'ID',
        width: 80
      },
      {
        field: 'name',
        title: 'Name',
        width: 180
      },
      {
        field: 'city',
        title: 'City',
        width: 160
      },
      {
        field: 'score',
        title: 'Score',
        width: 120
      },
      {
        field: 'email',
        title: 'Email',
        width: 240
      }
    ],
    keyboardOptions: {
      moveSelectedCellOnArrowKeys: true,
      shiftMultiSelect: true
    },
    select: {
      headerSelectMode: 'cell'
    },
    widthMode: 'standard',
    defaultRowHeight: 36
  };

  const table = new VTable.ListTable(option);
  table.selectCell(1, 2);
  table.getElement()?.focus();

  const w = window as unknown as { tableInstance?: VTable.ListTable };
  w.tableInstance = table;
}
