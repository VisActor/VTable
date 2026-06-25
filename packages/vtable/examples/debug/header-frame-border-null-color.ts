import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const BORDER_COLOR = '#E1E4E8';
const FONT_FAMILY =
  '-apple-system,"Helvetica Neue","PingFang SC",Arial,"Microsoft YaHei","Hiragino Sans GB",Helvetica,' +
  'sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"';

const headerFrameStyle = {
  borderColor: [null, null, BORDER_COLOR, null],
  borderLineWidth: 2
};

const baseStyle = {
  borderColor: [BORDER_COLOR, BORDER_COLOR, BORDER_COLOR, BORDER_COLOR],
  borderLineWidth: [1, 1, 1, 1],
  borderLineDash: [null, null, null, null],
  padding: [8.6, 12, 8.6, 12],
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  fontStyle: 'normal',
  fontVariant: 'normal',
  lineHeight: 18,
  underline: false
};

const bodyStyle = {
  ...baseStyle,
  hover: {
    cellBgColor: 'rgba(186, 215, 255, 0.7)',
    inlineRowBgColor: 'rgba(186, 215, 255, 0.3)',
    inlineColumnBgColor: 'rgba(186, 215, 255, 0.3)'
  },
  fontWeight: 'normal',
  color: '#141414'
};

const headerStyle = {
  ...baseStyle,
  hover: {
    cellBgColor: 'rgba(0, 100, 250, 0.16)',
    inlineRowBgColor: 'rgba(255, 255, 255, 0)',
    inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
  },
  frameStyle: headerFrameStyle,
  fontWeight: 'bold',
  color: '#1b1f23',
  bgColor: '#eef1f5'
};

const columns: VTable.TYPES.ColumnsDefine = [
  {
    field: 'category',
    title: '类别',
    showSort: false,
    style: { ...bodyStyle, textAlign: 'left' },
    headerStyle: { ...headerStyle, textAlign: 'left' },
    width: 76,
    cellType: 'link',
    linkDetect: true,
    linkJump: false
  },
  {
    field: 'subCategory',
    title: '子类别',
    showSort: false,
    style: { ...bodyStyle, textAlign: 'left' },
    headerStyle: { ...headerStyle, textAlign: 'left' },
    width: 188,
    cellType: 'link',
    linkDetect: true,
    linkJump: false
  },
  {
    field: 'manager',
    title: '地区经理',
    showSort: false,
    style: { ...bodyStyle, textAlign: 'left' },
    headerStyle: { ...headerStyle, textAlign: 'left' },
    width: 76,
    cellType: 'link',
    linkDetect: true,
    linkJump: false
  },
  {
    field: 'sales',
    title: '销售额',
    showSort: false,
    style: { ...bodyStyle, textAlign: 'right' },
    headerStyle: { ...headerStyle, textAlign: 'right' },
    width: 88,
    dropDownMenu: [
      { text: '降序排序', menuKey: 'sort_desc' },
      { text: '升序排序', menuKey: 'sort_asc' },
      { text: '冻结列', menuKey: 'frozen_col' }
    ]
  },
  {
    field: 'quantity',
    title: '数量',
    showSort: false,
    style: { ...bodyStyle, textAlign: 'right' },
    headerStyle: { ...headerStyle, textAlign: 'right' },
    width: 729
  },
  {
    field: 'profit',
    title: '利润',
    showSort: false,
    style: { ...bodyStyle, textAlign: 'right' },
    headerStyle: { ...headerStyle, textAlign: 'right' },
    width: 460
  }
];

const records = [
  {
    category: '家具',
    subCategory: '椅子',
    manager: '杨健',
    sales: '153884.02499389648',
    quantity: '184',
    profit: '26845.084301948547'
  },
  {
    category: '办公用品',
    subCategory: '系固件',
    manager: '杨健',
    sales: '4729.787956237793',
    quantity: '85',
    profit: '775.6280167102814'
  },
  {
    category: '家具',
    subCategory: '书架',
    manager: '白德伟',
    sales: '228510.26754760742',
    quantity: '253',
    profit: '29967.308319091797'
  },
  {
    category: '办公用品',
    subCategory: '装订机',
    manager: '楚杰',
    sales: '45179.95973491669',
    quantity: '517',
    profit: '4118.6599479317665'
  },
  {
    category: '家具',
    subCategory: '桌子',
    manager: '楚杰',
    sales: '184567.76220703125',
    quantity: '130',
    profit: '-15772.939086914062'
  }
];

function createInfo(root: HTMLElement) {
  const info = document.createElement('div');
  info.style.cssText = [
    'box-sizing: border-box',
    'padding: 8px 12px',
    'font: 13px/1.5 sans-serif',
    'color: #24292f',
    'background: #f6f8fa',
    'border-bottom: 1px solid #d0d7de'
  ].join(';');
  info.innerHTML = [
    '<strong>Header frameStyle null borderColor regression case.</strong>',
    'Only the bottom header frame border should be visible.',
    '<code>borderColor: [null, null, "#E1E4E8", null]</code> is intentional.'
  ].join(' ');
  root.appendChild(info);
}

export function createTable() {
  const root = document.getElementById(CONTAINER_ID) as HTMLElement;
  root.innerHTML = '';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';

  createInfo(root);

  const tableContainer = document.createElement('div');
  tableContainer.style.cssText = 'position: relative; flex: 1; min-height: 0; width: 100%; overflow: hidden;';
  root.appendChild(tableContainer);

  const option: VTable.ListTableConstructorOptions = {
    container: tableContainer,
    columns,
    records,
    transpose: false,
    widthMode: 'standard',
    columnResizeMode: 'all',
    heightMode: 'autoHeight',
    autoWrapText: false,
    maxCharactersNumber: 256,
    defaultHeaderColWidth: 'auto',
    keyboardOptions: {
      selectAllOnCtrlA: true,
      copySelected: false
    },
    menu: {
      renderMode: 'html',
      dropDownMenuHighlight: [
        {
          menuKey: 'frozen_col',
          field: 'sales'
        }
      ]
    },
    customConfig: {
      _disableColumnAndRowSizeRound: true,
      imageMargin: 4,
      multilinesForXTable: true,
      shrinkSparklineFirst: true
    },
    frozenColCount: 4,
    theme: {
      underlayBackgroundColor: 'rgba(255,255,255,0)',
      frameStyle: {
        borderColor: BORDER_COLOR,
        borderLineWidth: 1
      },
      headerStyle,
      rowHeaderStyle: headerStyle,
      bodyStyle,
      frozenColumnLine: {
        shadow: {
          width: 3,
          startColor: 'rgba(225, 228, 232, 0.6)',
          endColor: 'rgba(225, 228, 232, 0.6)'
        }
      },
      cellInnerBorder: false,
      cellBorderClipDirection: 'bottom-right',
      _contentOffset: 1
    },
    showHeader: true,
    hover: {
      highlightMode: 'row'
    },
    select: {
      highlightMode: 'cell',
      headerSelectMode: 'inline'
    }
  };

  const table = new VTable.ListTable(option);
  (window as unknown as { tableInstance?: VTable.ListTable }).tableInstance = table;
}
