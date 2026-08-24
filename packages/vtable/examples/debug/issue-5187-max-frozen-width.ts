import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const fields = [
  ['orderDate', '订单日期', 91],
  ['customerName', '客户名称', 76],
  ['shipDate', '发货日期', 91],
  ['deliveryDate', '交付日期', 91],
  ['productDate', '产品日期', 91],
  ['category', '类别', 76],
  ['subCategory', '子类别', 76],
  ['region', '区域', 76],
  ['customerId', '客户编号', 110],
  ['birthDate', '出生日期', 100],
  ['renewDate', '续费日期', 100],
  ['rate', '折扣', 76],
  ['ratio', '占比', 76]
] as const;

const records = Array.from({ length: 80 }, (_, index) => {
  const day = `${(index % 28) + 1}`.padStart(2, '0');
  const names = ['邢宁', '俞毅', '麦虢', '牛惠', '陶丽雪', '徐虹'];

  return {
    orderDate: `2016-01-${day}`,
    customerName: names[index % names.length],
    shipDate: `2016-02-${day}`,
    deliveryDate: `2017-05-${day}`,
    productDate: `2016-03-${day}`,
    category: ['家具', '技术', '办公用品'][index % 3],
    subCategory: ['桌子', '电话', '配件', '收纳具'][index % 4],
    region: index % 2 ? '分组1' : '中南',
    customerId: `${names[index % names.length]}-${10000 + index}`,
    birthDate: '1975-07-10',
    renewDate: '2026-02-28',
    rate: `${(index % 5) / 10}`,
    ratio: `${(index % 4) / 4}`
  };
});

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  document.getElementById('issue5187Toolbar')?.remove();

  container.style.width = '640px';
  container.style.height = '520px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5187Toolbar';
  toolbar.style.cssText = 'height: 32px; display: flex; gap: 8px; align-items: center; font-size: 12px;';
  toolbar.innerHTML = `
    <button id="issue5187ScrollFrozen">scroll frozen cols</button>
    <button id="issue5187Wide">set container 1600px</button>
    <button id="issue5187Narrow">set container 1055px</button>
    <button id="issue5187Reproduce">reproduce 1600px -> 1055px</button>
    <span id="issue5187State"></span>
  `;
  container.before(toolbar);

  const columns: VTable.ColumnsDefine = fields.map(([field, title, width]) => ({
    field,
    title,
    width,
    showSort: false
  }));

  const tableInstance = new VTable.ListTable({
    container,
    columns,
    records,
    widthMode: 'standard',
    columnResizeMode: 'all',
    defaultRowHeight: 35.2,
    heightMode: 'autoHeight',
    defaultHeaderColWidth: 'auto',
    frozenColCount: 4,
    maxFrozenWidth: 100,
    unfreezeAllOnExceedsMaxWidth: false,
    scrollFrozenCols: true,
    theme: VTable.themes.DEFAULT.extends({
      scrollStyle: {
        visible: 'focus',
        width: 7,
        hoverOn: true
      },
      frozenColumnLine: {
        shadow: {
          width: 3,
          startColor: 'rgba(225, 228, 232, 0.6)',
          endColor: 'rgba(225, 228, 232, 0.6)'
        }
      }
    })
  });

  const stateNode = document.getElementById('issue5187State')!;
  const updateState = () => {
    stateNode.textContent = [
      `container: ${container.style.width}`,
      `frozen width: ${tableInstance.getFrozenColsWidth()}`,
      `content: ${tableInstance.getFrozenColsContentWidth()}`,
      `offset: ${tableInstance.getFrozenColsOffset()}`,
      `scrollLeft: ${tableInstance.getFrozenColsScrollLeft()}`
    ].join(' | ');
  };
  const resizeContainer = (width: number) => {
    container.style.width = `${width}px`;
    tableInstance.resize();
    updateState();
  };

  document.getElementById('issue5187ScrollFrozen')?.addEventListener('click', () => {
    tableInstance.stateManager.setFrozenColsScrollLeft(tableInstance.getFrozenColsOffset());
    updateState();
  });
  document.getElementById('issue5187Wide')?.addEventListener('click', () => {
    resizeContainer(1600);
  });
  document.getElementById('issue5187Narrow')?.addEventListener('click', () => {
    resizeContainer(1055);
  });
  document.getElementById('issue5187Reproduce')?.addEventListener('click', () => {
    resizeContainer(1600);
    tableInstance.stateManager.setFrozenColsScrollLeft(tableInstance.getFrozenColsOffset());
    requestAnimationFrame(() => {
      resizeContainer(1055);
    });
  });

  tableInstance.on(VTable.ListTable.EVENT_TYPE.RESIZE_COLUMN_END, updateState);
  updateState();

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    document.getElementById('issue5187Toolbar')?.remove();
    release();
  };

  (window as any).tableInstance = tableInstance;
}
