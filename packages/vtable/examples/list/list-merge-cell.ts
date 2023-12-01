import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const generatePersons = i => {
  return {
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  };
};

const getRecordsWithAjax = (startIndex, num) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const records = [];
      for (let i = 0; i < num; i++) {
        records.push(generatePersons(startIndex + i));
      }
      resolve(records);
    }, 500);
  });
};

// create DataSource
const loadedData = {};
const dataSource = new VTable.data.CachedDataSource({
  get(index) {
    // 每一批次请求100条数据 0-99 100-199 200-299
    const loadStartIndex = Math.floor(index / 100) * 100;
    // 判断是否已请求过？
    if (!loadedData[loadStartIndex]) {
      const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // return Promise Object
      loadedData[loadStartIndex] = promiseObject;
    }
    return loadedData[loadStartIndex].then(data => {
      return data[index - loadStartIndex]; //获取批次数据列表中的index对应数据
    });
  },
  length: 10000 //all records count
});

export function createTable() {
  // const records = generatePersons(1000);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID ff',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];
  const option = {
    container: document.getElementById(CONTAINER_ID),
    // records,
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    allowFrozenColCount: 3,
    // frozenColCount: 2,
    // autoWrapText: true,
    // heightMode: 'autoHeight',
    // widthMode: 'adaptive',
    customMergeCell: (col, row, table) => {
      if (col > 0 && col < 8 && row > 7 && row < 11) {
        return {
          text: 'long long long long long long long long long long long long long long long long long long text!',
          range: {
            start: {
              col: 1,
              row: 8
            },
            end: {
              col: 7,
              row: 10
            }
          },
          style: {
            bgColor: '#fff'
          }
        };
      }
    }
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  tableInstance.dataSource = dataSource;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
  // tableInstance.on('sort_click', args => {
  //   tableInstance.updateSortState(
  //     {
  //       field: args.field,
  //       order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
  //     },
  //     false
  //   );
  //   return false; //return false代表不执行内部排序逻辑
  // });
}
