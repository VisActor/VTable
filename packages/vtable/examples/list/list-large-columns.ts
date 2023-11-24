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
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const generatePersons = count => {
    return Array.from(new Array(count)).map((_, i) => {
      const first = generateRandomString(14);
      const last = generateRandomString(4);
      return {
        id: i + 1,
        email: `${first}_${last}@xxx.com`,
        name: first,
        lastName: last
      };
    });
  };

  const records = generatePersons(50);
  console.log(`05-拆出来合并列.html 44 [records]`, records);

  const columns = [
    // {
    //   field: 'id',
    //   caption: 'ID',
    //   width: 80,
    //   sort: true
    // },
    // {
    //   field: 'email',
    //   caption: 'email',
    //   width: 250,
    //   cellType: 'link',
    //   sort: true
    // },
    ...new Array(800).fill('').map((v, index) => {
      return {
        field: 'full name',
        caption: 'Full name',
        headerStyle: {
          textAlign: 'center'
        },
        columns: [
          {
            field: 'name',
            caption: 'First Name',
            width: 150,
            headerStyle: {
              textAlign: 'center'
            }
          },
          {
            field: 'lastName',
            caption: 'Last Name',
            width: 150,
            headerStyle: {
              textAlign: 'center'
            },
            style: {
              // https://visactor.io/vtable/guide/theme_and_style/style
              textAlign: 'center',
              // color: '#fff',
              color: args => {
                const lastName = args.value;
                if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(lastName[0])) {
                  return '#fff';
                }
                return '#333';
              },
              // bgColor: 'green',
              bgColor: args => {
                const lastName = args.value;
                if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(lastName[0])) {
                  return 'red';
                }
                return args.row % 2 === 0 ? '#fff' : '#fbfbfc';
              }
            }
          }
        ]
      };
    })
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    // frozenColCount: 1,
    allowFrozenColCount: 0,
    defaultRowHeight: 34,
    defaultHeaderRowHeight: 34,
    hover: {
      // highlightMode: 'cross'
    },
    theme: VTable.themes.ARCO.extends({
      bodyStyle: {
        // hover: {
        //   cellBgColor: '#FFC0CB',
        //   inlineRowBgColor: '#FFD700', // 金色
        //   inlineColumnBgColor: '#ADFF2F' // 绿黄色
        // }
      },
      scrollStyle: {
        width: 15
      },
      headerStyle: {
        // fontWeight: 100
      }
    }),
    select: {
      disableSelect: true,
      disableHeaderSelect: true
    },
    pagination: {
      perPageCount: 20,
      currentPage: 1
    }
  };

  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
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

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
