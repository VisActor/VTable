import * as VTable from '../../src';

const ListTable = VTable.ListTable;

export function createTable() {
  // const columns = [
  //   {
  //     field: 'object',
  //     title: 'object',
  //     width: 'auto',
  //     levelSpan: 2,
  //     columns: [
  //       // {
  //       //   field: 'field1',
  //       //   title: 'field1',
  //       //   width: 'auto',
  //       //   columns: [
  //       {
  //         field: 'field11',
  //         title: 'field11',
  //         width: '150',
  //         // levelSpan: 2,
  //         columns: [
  //           {
  //             field: 'math',
  //             title: 'math',
  //             width: '150'
  //           }
  //         ]
  //       },
  //       {
  //         field: 'field12',
  //         title: 'field12',
  //         width: '150',
  //         columns: [
  //           {
  //             field: 'chinese',
  //             title: 'chinese',
  //             width: '150'
  //           }
  //         ]
  //       },
  //       {
  //         field: 'field13',
  //         title: 'field13',
  //         width: '150',
  //         columns: [
  //           {
  //             field: 'english',
  //             title: 'english',
  //             width: '150'
  //           }
  //         ]
  //       }
  //       // ]
  //       // }
  //     ]
  //   },
  //   {
  //     field: 'basic',
  //     title: 'basic',
  //     width: 'auto',
  //     columns: [
  //       {
  //         field: 'field21',
  //         title: 'field21',
  //         width: '150',
  //         // levelSpan: 2,
  //         columns: [
  //           {
  //             field: 'computer',
  //             title: 'computer',
  //             width: '150',
  //             columns: [
  //               {
  //                 field: 'math',
  //                 title: 'math',
  //                 width: '150'
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  const columns = [
    {
      field: 'object',
      title: 'object',
      width: 'auto',
      columns: [
        {
          field: 'field1',
          title: 'field1',
          width: 'auto',
          columns: [
            {
              field: 'field11',
              title: 'field11',
              width: '150',
              columns: [
                {
                  field: 'math',
                  title: 'math',
                  width: '150'
                }
              ]
            },
            {
              field: 'field12',
              title: 'field12',
              width: '150',
              columns: [
                {
                  field: 'chinese',
                  title: 'chinese',
                  width: '150'
                }
              ]
            },
            {
              field: 'field13',
              title: 'field13',
              width: '150',
              columns: [
                {
                  field: 'english',
                  title: 'english',
                  width: '150'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      field: 'basic',
      title: 'basic',
      width: 'auto',
      levelSpan: 2,
      columns: [
        {
          field: 'field21',
          title: 'field21',
          width: '150',
          columns: [
            {
              field: 'computer',
              title: 'computer',
              width: '150'
            }
          ]
        }
      ]
    }
  ];

  const records = [
    {
      math: 'math',
      chinese: 'chinese',
      english: 'english',
      computer: 'computer'
    }
  ];

  const container = document.getElementById('vTable');
  const option = {
    container,
    columns,
    records,
    widthMode: 'auto', // 自适应宽度模式
    heightMode: 'autoHeight', // 自动高度模式
    defaultColWidth: 120, // 默认列宽
    defaultRowHeight: 40, // 默认行高
    autoWrapText: true, // 自动换行
    theme: VTable.themes.DEFAULT // 使用默认主题
  };

  const tableInstance = new ListTable(option);

  // 方便调试用
  window.tableInstance = tableInstance;
}
