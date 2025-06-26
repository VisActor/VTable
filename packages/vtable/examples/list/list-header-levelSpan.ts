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
      // field: 'object',
      caption: 'object',
      // title: 'object',
      width: 'auto',
      columns: [
        {
          field: 'field1',
          // title: 'field1',
          caption: 'field1',
          // width: 'auto',
          // hideColumnsSubHeader: true,
          columns: [
            {
              field: 'field11',
              caption: 'field11',
              // title: 'field11',
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
              caption: 'field12',
              // title: 'field12',
              width: '150',
              // hideColumnsSubHeader: true,
              columns: [
                {
                  field: 'chinese',
                  title: 'chinese',
                  width: '150'
                },
                {
                  field: 'english',
                  title: 'english',
                  width: '150'
                }
              ]
            },
            {
              field: 'field13',
              caption: 'field13',
              // title: 'field13',
              width: '150',
              hideColumnsSubHeader: true,
              columns: [
                {
                  field: 'english',
                  title: 'english',
                  width: '150'
                },
                {
                  field: 'computer',
                  title: 'computer',
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
      // hideColumnsSubHeader: true,
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
      id: 1,
      field1: 'field1',
      field13: 'field13',
      math: 'math',
      chinese: 'chinese',
      english: 'english',
      computer: 'computer'
    }
  ];

  // const records = [
  //   {
  //     id: 1,
  //     name1: 'a1',
  //     name2: 'a2',
  //     name3: 'a3'
  //   },
  //   {
  //     id: 2,
  //     name1: 'b1',
  //     name2: 'b2',
  //     name3: 'b3'
  //   },
  //   {
  //     id: 3,
  //     name1: 'c1',
  //     name2: 'c2',
  //     name3: 'c3'
  //   },
  //   {
  //     id: 4,
  //     name1: 'd1',
  //     name2: 'd2',
  //     name3: 'd3'
  //   },
  //   {
  //     id: 5,
  //     name1: 'e1',
  //     name2: 'e2',
  //     name3: 'e3'
  //   }
  // ];
  // const columns = [
  //   {
  //     field: 'id',
  //     caption: 'ID',
  //     width: 100
  //   },
  //   {
  //     caption: 'Name',
  //     field: 'name',
  //     headerStyle: {
  //       textAlign: 'center'
  //     },
  //     hideColumnsSubHeader: true,
  //     columns: [
  //       {
  //         field: 'name1',
  //         caption: 'name1',
  //         width: 100
  //       },
  //       {
  //         caption: 'name-level-2',
  //         field: 'name-level-2',
  //         width: 150,
  //         hideColumnsSubHeader: true,
  //         columns: [
  //           {
  //             field: 'name2',
  //             title: 'name2',
  //             // caption: 'name2',
  //             width: 100
  //           },
  //           {
  //             field: 'name3',
  //             title: 'name3',
  //             // caption: 'name3',
  //             width: 150
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

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
