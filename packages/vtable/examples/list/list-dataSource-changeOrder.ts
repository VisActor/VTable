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

export function createTable() {
  // create DataSource
  const loadedData = {};
  const dataSource = new VTable.data.CachedDataSource({
    // get(index) {
    //   // 每一批次请求100条数据 0-99 100-199 200-299
    //   const loadStartIndex = Math.floor(index / 100) * 100;
    //   // 判断是否已请求过？
    //   if (!loadedData[loadStartIndex]) {
    //     const promiseObject = getRecordsWithAjax(loadStartIndex, 100); // return Promise Object
    //     loadedData[loadStartIndex] = promiseObject;
    //   }
    //   return loadedData[loadStartIndex].then((data: any) => {
    //     return data[index - loadStartIndex]; //获取批次数据列表中的index对应数据
    //   });
    // },
    records: [
      {
        类别: '办公用品',
        销售额: '129.696',
        数量: '2',
        利润: '60.704',
        children: [
          {
            类别: '信封', // 对应原子类别
            销售额: '125.44',
            数量: '2',
            利润: '42.56',
            children: [
              {
                类别: '黄色信封',
                销售额: '125.44',
                数量: '2',
                利润: '42.56'
              },
              {
                类别: '白色信封',
                销售额: '1375.92',
                数量: '3',
                利润: '550.2'
              }
            ]
          },
          {
            类别: '器具', // 对应原子类别
            销售额: '1375.92',
            数量: '3',
            利润: '550.2',
            children: [
              {
                类别: '订书机',
                销售额: '125.44',
                数量: '2',
                利润: '42.56'
              },
              {
                类别: '计算器',
                销售额: '1375.92',
                数量: '3',
                利润: '550.2'
              }
            ]
          }
        ]
      },
      {
        类别: '技术',
        销售额: '229.696',
        数量: '20',
        利润: '90.704',
        children: [
          {
            类别: '设备', // 对应原子类别
            销售额: '225.44',
            数量: '5',
            利润: '462.56'
          },
          {
            类别: '配件', // 对应原子类别
            销售额: '375.92',
            数量: '8',
            利润: '550.2'
          },
          {
            类别: '复印机', // 对应原子类别
            销售额: '425.44',
            数量: '7',
            利润: '34.56'
          },
          {
            类别: '电话', // 对应原子类别
            销售额: '175.92',
            数量: '6',
            利润: '750.2'
          }
        ]
      },
      {
        类别: '家具',
        销售额: '129.696',
        数量: '2',
        利润: '-60.704',
        children: [
          {
            类别: '桌子', // 对应原子类别
            销售额: '125.44',
            数量: '2',
            利润: '42.56',
            children: [
              {
                类别: '黄色桌子',
                销售额: '125.44',
                数量: '2',
                利润: '42.56'
              },
              {
                类别: '白色桌子',
                销售额: '1375.92',
                数量: '3',
                利润: '550.2'
              }
            ]
          },
          {
            类别: '椅子', // 对应原子类别
            销售额: '1375.92',
            数量: '3',
            利润: '550.2',
            children: [
              {
                类别: '老板椅',
                销售额: '125.44',
                数量: '2',
                利润: '42.56'
              },
              {
                类别: '沙发椅',
                销售额: '1375.92',
                数量: '3',
                利润: '550.2'
              }
            ]
          }
        ]
      },
      {
        类别: '生活家电（懒加载）',
        销售额: '229.696',
        数量: '20',
        利润: '90.704',
        children: true
      }
    ],
    canChangeOrder(sourceIndex: number, targetIndex: number) {
      let sourceIndexs = tableInstance.getRecordIndexByCell(
        0,
        sourceIndex + tableInstance.columnHeaderLevelCount
      ) as number[];
      if (typeof sourceIndexs === 'number') {
        sourceIndexs = [sourceIndexs];
      }
      let targetIndexs = tableInstance.getRecordIndexByCell(
        0,
        targetIndex + tableInstance.columnHeaderLevelCount
      ) as number[];
      if (typeof targetIndexs === 'number') {
        targetIndexs = [targetIndexs];
      }
      console.log(targetIndexs, sourceIndexs);
      if (sourceIndexs.length === targetIndexs.length) {
        return true;
      } else if (targetIndexs.length + 1 === sourceIndexs.length) {
        return true;
      }
      return false;
    },
    changeOrder: (sourceIndex: number, targetIndex: number) => {
      const record = tableInstance.getRecordByCell(0, sourceIndex + tableInstance.columnHeaderLevelCount) as any;
      let sourceIndexs = tableInstance.getRecordIndexByCell(
        0,
        sourceIndex + tableInstance.columnHeaderLevelCount
      ) as number[];
      if (typeof sourceIndexs === 'number') {
        sourceIndexs = [sourceIndexs];
      }
      let targetIndexs = tableInstance.getRecordIndexByCell(
        0,
        targetIndex + tableInstance.columnHeaderLevelCount
      ) as number[];
      if (typeof targetIndexs === 'number') {
        targetIndexs = [targetIndexs];
      }
      if (sourceIndexs.length === targetIndexs.length) {
        tableInstance.deleteRecords([sourceIndexs]);
        tableInstance.addRecord(record, targetIndexs);
      } else if (targetIndexs.length + 1 === sourceIndexs.length) {
        tableInstance.deleteRecords([sourceIndexs]);
        targetIndexs.push(0);
        tableInstance.addRecord(record, targetIndexs);
      }
    },
    added(index: number, count: number) {
      this.length += count;
    },
    deleted(index: number[]) {
      this.length -= index.length;
    },
    length: 5000 //all records count
  });
  window.dataSource = dataSource;

  const columns: VTable.ColumnsDefine = [
    {
      field: '类别',
      tree: true,
      title: '类别',
      width: 'auto',
      sort: true
    },
    {
      field: '销售额',
      title: '销售额',
      width: 'auto',
      sort: true
      // tree: true,
    },
    {
      field: '利润',
      title: '利润',
      width: 'auto',
      sort: true
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    // records: [
    //   {
    //     类别: '办公用品',
    //     销售额: '129.696',
    //     数量: '2',
    //     利润: '60.704',
    //     children: [
    //       {
    //         类别: '信封', // 对应原子类别
    //         销售额: '125.44',
    //         数量: '2',
    //         利润: '42.56',
    //         children: [
    //           {
    //             类别: '黄色信封',
    //             销售额: '125.44',
    //             数量: '2',
    //             利润: '42.56'
    //           },
    //           {
    //             类别: '白色信封',
    //             销售额: '1375.92',
    //             数量: '3',
    //             利润: '550.2'
    //           }
    //         ]
    //       },
    //       {
    //         类别: '器具', // 对应原子类别
    //         销售额: '1375.92',
    //         数量: '3',
    //         利润: '550.2',
    //         children: [
    //           {
    //             类别: '订书机',
    //             销售额: '125.44',
    //             数量: '2',
    //             利润: '42.56'
    //           },
    //           {
    //             类别: '计算器',
    //             销售额: '1375.92',
    //             数量: '3',
    //             利润: '550.2'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     类别: '技术',
    //     销售额: '229.696',
    //     数量: '20',
    //     利润: '90.704',
    //     children: [
    //       {
    //         类别: '设备', // 对应原子类别
    //         销售额: '225.44',
    //         数量: '5',
    //         利润: '462.56'
    //       },
    //       {
    //         类别: '配件', // 对应原子类别
    //         销售额: '375.92',
    //         数量: '8',
    //         利润: '550.2'
    //       },
    //       {
    //         类别: '复印机', // 对应原子类别
    //         销售额: '425.44',
    //         数量: '7',
    //         利润: '34.56'
    //       },
    //       {
    //         类别: '电话', // 对应原子类别
    //         销售额: '175.92',
    //         数量: '6',
    //         利润: '750.2'
    //       }
    //     ]
    //   },
    //   {
    //     类别: '家具',
    //     销售额: '129.696',
    //     数量: '2',
    //     利润: '-60.704',
    //     children: [
    //       {
    //         类别: '桌子', // 对应原子类别
    //         销售额: '125.44',
    //         数量: '2',
    //         利润: '42.56',
    //         children: [
    //           {
    //             类别: '黄色桌子',
    //             销售额: '125.44',
    //             数量: '2',
    //             利润: '42.56'
    //           },
    //           {
    //             类别: '白色桌子',
    //             销售额: '1375.92',
    //             数量: '3',
    //             利润: '550.2'
    //           }
    //         ]
    //       },
    //       {
    //         类别: '椅子', // 对应原子类别
    //         销售额: '1375.92',
    //         数量: '3',
    //         利润: '550.2',
    //         children: [
    //           {
    //             类别: '老板椅',
    //             销售额: '125.44',
    //             数量: '2',
    //             利润: '42.56'
    //           },
    //           {
    //             类别: '沙发椅',
    //             销售额: '1375.92',
    //             数量: '3',
    //             利润: '550.2'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     类别: '生活家电（懒加载）',
    //     销售额: '229.696',
    //     数量: '20',
    //     利润: '90.704',
    //     children: true
    //   }
    // ],
    // dataSource,
    dataSource,
    columns,
    hierarchyExpandLevel: 10,
    rowSeriesNumber: {
      dragOrder: true
    }
  };
  const tableInstance = new VTable.ListTable(option);
  // tableInstance.dataSource = dataSource;
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
