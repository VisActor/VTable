import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const removeDemoToolbar = () => {
  document.getElementById('issue5213Toolbar')?.remove();
};

const setStatus = (message: string, pass: boolean) => {
  const statusNode = document.getElementById('issue5213Status');
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.style.color = pass ? '#237804' : '#cf1322';
};

export function createTable() {
  removeDemoToolbar();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '640px';
  container.style.height = '360px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5213Toolbar';
  toolbar.style.cssText = [
    'display: flex',
    'gap: 8px',
    'align-items: center',
    'height: 40px',
    'font-size: 12px'
  ].join(';');
  toolbar.innerHTML = `
    <button id="issue5213Check">检查聚合行序号</button>
    <span>预期：聚合行序号列为空；旧逻辑会显示行号。</span>
    <strong id="issue5213Status"></strong>
  `;
  container.before(toolbar);

  const tableInstance = new VTable.ListTable(container, {
    records: [{ value: 1 }, { value: 2 }],
    columns: [
      {
        field: 'value',
        title: 'Value',
        width: 160,
        aggregation: {
          aggregationType: VTable.TYPES.AggregationType.SUM
        }
      }
    ],
    rowSeriesNumber: {
      title: 'No.'
    },
    defaultRowHeight: 36
  });

  const checkAggregationSeriesNumber = () => {
    const aggregationRow = tableInstance.rowCount - 1;
    const displayValue = tableInstance.getCellValue(0, aggregationRow);
    const originValue = tableInstance.getCellOriginValue(0, aggregationRow);
    const isAggregation = tableInstance.internalProps.layoutMap.isAggregation(0, aggregationRow);
    const pass = isAggregation && displayValue === '' && originValue === '';

    setStatus(
      `${pass ? 'PASS' : 'FAIL'} | aggregationRow=${aggregationRow}, display=${String(displayValue)}, origin=${String(
        originValue
      )}`,
      pass
    );
  };

  document.getElementById('issue5213Check')?.addEventListener('click', checkAggregationSeriesNumber);
  requestAnimationFrame(checkAggregationSeriesNumber);

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    removeDemoToolbar();
    release();
  };

  (window as any).tableInstance = tableInstance;
}
