import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    profit: 'test-the-edge-side'
  }));
};
export function createTable() {
  const columns = [
    {
      field: 'id',
      title: 'Order ID',
      width: 'auto'
    },
    {
      field: 'lastName',
      title: 'Last Name',
      width: 'auto'
    },
    {
      field: 'name',
      title: 'Name',
      width: 'auto'
    },
    {
      field: 'email1',
      title: 'Email Address',
      width: 'auto'
    },
    {
      field: 'date1',
      title: 'date1',
      width: 'auto'
    },
    {
      field: 'tel',
      title: 'tel',
      width: 'auto'
    },
    {
      field: 'sex',
      title: 'sex',
      width: 'auto'
    },
    {
      field: 'work',
      title: 'work',
      width: 'auto'
    },
    {
      field: 'city',
      title: 'city',
      width: 'auto'
    },
    {
      field: 'Quantity',
      title: 'Quantity',
      width: 'auto'
    },
    {
      field: 'Sales',
      title: 'Sales',
      width: 'auto'
    },
    {
      field: 'profit',
      title: 'Profit',
      width: 'auto'
    }
  ];

  const records = generatePersons(10);
  const container = document.getElementById(CONTAINER_ID);
  const button1 = document.createElement('button');
  button1.innerText = 'set 10 rows';

  const button2 = document.createElement('button');
  button2.innerText = 'set 40 rows';

  const button3 = document.createElement('button');
  button3.innerText = 'update columns';

  const button4 = document.createElement('button');
  button4.innerText = 'filter';

  container?.parentElement?.appendChild(button1);
  container?.parentElement?.appendChild(button2);
  container?.parentElement?.appendChild(button3);
  container?.parentElement?.appendChild(button4);

  container?.style.setProperty('margin', '10px');
  container?.style.setProperty('width', 'calc(100% - 20px)');
  container?.style.setProperty('height', '100%');
  // container?.style.setProperty('width', '500px');
  // container?.style.setProperty('height', '500px');
  container?.style.setProperty('box-sizing', 'border-box');
  container?.style.setProperty('border', '1px solid #d7d9dc');
  const option: VTable.ListTableConstructorOptions = {
    container: container,
    emptyTip: true,
    records: records,
    columns: [...columns],
    widthMode: 'standard',
    allowFrozenColCount: 2,
    hover: {
      highlightMode: 'cross',
      disableHover: false,
      disableHeaderHover: true
    },
    theme: VTable.themes.ARCO.extends({
      defaultStyle: {
        padding: 0
      },
      headerStyle: {
        fontSize: 14,
        padding: 0,
        fontWeight: 600
      },
      bodyStyle: {
        fontSize: 14,
        padding: 0,
        bgColor: args => {
          const { row, table } = args;
          return 1 & (row - table.frozenRowCount) ? '#f8f8f8' : '#FFF';
        }
      },
      cellInnerBorder: false,
      frameStyle: {
        borderLineWidth: [0, 1, 1, 0],
        shadowBlur: 0,
        cornerRadius: 0,
        shadowColor: 'transparent'
      },
      // frameStyle: undefined,
      scrollStyle: {
        width: 16,
        visible: 'focus',
        hoverOn: true,
        barToSide: true,
        scrollSliderCornerRadius: 0,
        scrollRailColor: 'RGBA(216,216,216,.5)',
        scrollSliderColor: 'RGBA(170,170,170,1)'
      }
    })
  };
  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  button1.onclick = () => {
    tableInstance.setRecords(generatePersons(10));
  };

  button2.onclick = () => {
    tableInstance.setRecords(generatePersons(40));
  };

  button3.onclick = () => {
    if (tableInstance.columns.length > columns.length) {
      tableInstance.updateColumns([...columns]);
    } else {
      tableInstance.updateColumns([...columns, ...columns]);
    }
  };

  button4.onclick = () => {
    console.log(tableInstance.dataSource);
    if (tableInstance.dataSource.length > 1) {
      tableInstance.updateFilterRules([
        {
          filterKey: 'name',
          filteredValues: ['小明7']
        }
      ]);
    } else {
      tableInstance.updateFilterRules([
        {
          filterFunc: () => true
        }
      ]);
    }
  };

  const menuLitsEl = document.querySelector('.menu-list') as HTMLDivElement;
  const unmounted = () => {
    button1.onclick = null;
    button2.onclick = null;
    button3.onclick = null;
    button4.onclick = null;
    container?.parentElement?.removeChild(button1);
    container?.parentElement?.removeChild(button2);
    container?.parentElement?.removeChild(button3);
    container?.parentElement?.removeChild(button4);
    menuLitsEl.removeEventListener('click', unmounted);
  };
  menuLitsEl.addEventListener('click', unmounted);
}
