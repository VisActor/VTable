import * as VTable from '@visactor/vtable';
// import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
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

/**
 * 模拟接口请求数据
 * @param startIndex
 * @param num
 * @returns
 */
const getRecordsWithAjax = (startIndex, num) => {
  // console.log('getRecordsWithAjax', startIndex, num);
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('getRecordsWithAjax', startIndex, num);
      const records = [];
      for (let i = 0; i < num; i++) {
        records.push(generatePersons(startIndex + i));
      }
      resolve(records);
    }, 500);
  });
};

export function createTable() {
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
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 120
      // sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200
      // sort: true
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
    columns,
    container: document.getElementById(CONTAINER_ID)
  };

  const instance = new ListTable(option);
  instance.dataSource = dataSource;

  // bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
