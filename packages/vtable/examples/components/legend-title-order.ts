import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    { category: 'A', value: 120 },
    { category: 'B', value: 90 },
    { category: 'C', value: 60 }
  ];

  const columns: VTable.ColumnsDefine = [
    {
      field: 'category',
      title: 'Category',
      width: 120
    },
    {
      field: 'value',
      title: 'Value',
      width: 120
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    // place title and legend both at the top
    title: {
      text: 'Title above legend (componentLayoutOrder)',
      orient: 'top',
      align: 'center'
    },
    legends: {
      type: 'discrete',
      orient: 'top',
      position: 'start',
      data: [
        {
          label: 'A',
          shape: {
            fill: '#1664FF',
            symbolType: 'circle'
          }
        },
        {
          label: 'B',
          shape: {
            fill: '#1AC6FF',
            symbolType: 'square'
          }
        },
        {
          label: 'C',
          shape: {
            fill: '#FFCC00',
            symbolType: 'triangle'
          }
        }
      ]
    },
    // ensure title is laid out before legend so legend appears under the title
    componentLayoutOrder: ['title', 'legend']
  };

  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;
}
