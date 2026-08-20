import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const MERGE_START_ROW = 1;
const MERGE_END_ROW = 1000;

const records = Array.from({ length: 1000 }, (_, index) => ({
  category: index + 1 >= MERGE_START_ROW && index + 1 <= MERGE_END_ROW ? '办公用品' : `类别 ${index}`,
  subcategory: index < 883 ? '装订机' : '美术'
}));

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  document.getElementById('issue3752Toolbar')?.remove();
  container.style.width = '720px';
  container.style.height = '480px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue3752Toolbar';
  toolbar.style.cssText = 'height: 44px; font-size: 12px; display: flex; gap: 12px; align-items: center;';
  toolbar.innerHTML = '<button id="issue3752Check">check</button><span id="issue3752State"></span>';
  container.before(toolbar);

  const option: VTable.ListTableConstructorOptions = {
    container,
    records,
    columns: [
      {
        field: 'category',
        title: '类别',
        width: 79,
        mergeCell: true,
        cellType: 'link',
        linkDetect: true,
        linkJump: false,
        style: {
          textAlign: 'left',
          textStick: true,
          textStickBaseOnAlign: true,
          padding: [8.6, 12, 8.6, 12],
          fontSize: 12,
          lineHeight: 18
        }
      },
      {
        field: 'subcategory',
        title: '子类别',
        width: 79,
        mergeCell: true,
        cellType: 'link',
        linkDetect: true,
        linkJump: false,
        style: {
          textAlign: 'left',
          textStick: true,
          textStickBaseOnAlign: true,
          padding: [8.6, 12, 8.6, 12],
          fontSize: 12,
          lineHeight: 18
        }
      }
    ],
    widthMode: 'standard',
    heightMode: 'autoHeight',
    autoWrapText: false,
    showHeader: true,
    customConfig: {
      minSingleRowHeight: 5
    }
  };

  const tableInstance = new VTable.ListTable(option);

  const check = () => {
    const rowHeight = tableInstance.getRowHeight(MERGE_START_ROW);
    const { rowStart, rowEnd } = tableInstance.scenegraph.proxy;
    let maxCellBottom = -Infinity;
    for (let row = rowStart; row <= rowEnd; row++) {
      const cellGroup = tableInstance.scenegraph.getCell(0, row);
      maxCellBottom = Math.max(maxCellBottom, cellGroup.globalAABBBounds.y2);
    }
    const tableHeight = tableInstance.scenegraph.tableGroup.attribute.height;
    const pass = rowHeight >= 5 && maxCellBottom >= tableHeight;
    const state = document.getElementById('issue3752State')!;
    const roundedBottom = Math.round(maxCellBottom);
    const roundedTableHeight = Math.round(tableHeight);
    state.textContent =
      `${pass ? 'PASS' : 'FAIL'} | rowHeight=${rowHeight} | scrollTop=${tableInstance.getScrollTop()}` +
      ` | rows=${rowStart}-${rowEnd} | bottom=${roundedBottom}/${roundedTableHeight}`;
    return { pass, rowHeight, scrollTop: tableInstance.getScrollTop(), rowStart, rowEnd, maxCellBottom, tableHeight };
  };

  document.getElementById('issue3752Check')!.addEventListener('click', check);
  setTimeout(check, 0);

  (window as any).tableInstance = tableInstance;
  (window as any).issue3752Check = check;
}

createTable();
