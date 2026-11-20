import * as VTable from '../../src';

interface Issue4656Window extends Window {
  tableInstance?: VTable.ListTable;
  issue4656Run?: () => boolean;
}

const CONTAINER_ID = 'vTable';

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Missing #${CONTAINER_ID} container`);
  }
  container.style.width = '640px';
  container.style.height = '360px';

  const tableInstance = new VTable.ListTable(container, {
    columns: [
      { field: 'name', title: 'Name', width: 180 },
      { field: 'value', title: 'Value', width: 180 }
    ],
    records: [
      { name: 'Alpha', value: 1 },
      { name: 'Beta', value: 2 },
      { name: 'Gamma', value: 3 }
    ],
    excelOptions: {
      fillHandle: true
    }
  });

  tableInstance.selectCell(0, 1);

  const runCheck = () => {
    const bounds = tableInstance.scenegraph.highPerformanceGetCell(0, 1).globalAABBBounds;
    const createEvent = (offset: number): Parameters<typeof tableInstance.eventManager.checkCellFillhandle>[0] => ({
      abstractPos: {
        x: bounds.x2 + offset,
        y: bounds.y2 + offset
      },
      eventArgs: {}
    });
    const expandedAreaHit = tableInstance.eventManager.checkCellFillhandle(createEvent(11));
    const outsideAreaMiss = !tableInstance.eventManager.checkCellFillhandle(createEvent(13));
    const pass = expandedAreaHit && outsideAreaMiss;
    container.style.outline = `4px solid ${pass ? '#52c41a' : '#ff4d4f'}`;
    return pass;
  };

  requestAnimationFrame(runCheck);

  const issueWindow = window as Issue4656Window;
  issueWindow.tableInstance = tableInstance;
  issueWindow.issue4656Run = runCheck;
}
