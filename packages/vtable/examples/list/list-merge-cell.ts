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
  const records = new Array(1000).fill(generatePersons(1000));
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
      width: 'auto',
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
    records,
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    allowFrozenColCount: 3,
    // frozenColCount: 2,
    autoWrapText: true,
    heightMode: 'autoHeight',
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
      // else if (col > 0 && col < 3 && row > 1 && row < 4) {
      //   return {
      //     range: {
      //       start: {
      //         col: 1,
      //         row: 2
      //       },
      //       end: {
      //         col: 2,
      //         row: 3
      //       }
      //     },
      //     customLayout: args => {
      //       const { table, row, col, rect } = args;
      //       const record = {
      //         bloggerId: 1,
      //         bloggerName: 'Virtual Anchor Xiaohua',
      //         bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
      //         fansCount: 400,
      //         worksCount: 10,
      //         viewCount: 5,
      //         city: 'Dream City',
      //         tags: ['game', 'anime', 'food']
      //       };
      //       const { height, width } = rect ?? table.getCellRect(col, row);
      //       const percentCalc = VTable.CustomLayout.percentCalc;

      //       const container = new VTable.CustomLayout.Group({
      //         height,
      //         width,
      //         display: 'flex',
      //         flexDirection: 'row',
      //         flexWrap: 'nowrap'
      //       });
      //       const containerLeft = new VTable.CustomLayout.Group({
      //         height: percentCalc(100),
      //         width: 60,
      //         display: 'flex',
      //         flexDirection: 'column',
      //         alignItems: 'center',
      //         justifyContent: 'space-around'
      //       });
      //       container.add(containerLeft);

      //       const icon0 = new VTable.CustomLayout.Image({
      //         id: 'icon0',
      //         width: 50,
      //         height: 50,
      //         image: record.bloggerAvatar,
      //         cornerRadius: 25
      //       });
      //       containerLeft.add(icon0);

      //       const containerRight = new VTable.CustomLayout.Group({
      //         height: percentCalc(100),
      //         width: percentCalc(100, -60),
      //         display: 'flex',
      //         flexDirection: 'column',
      //         flexWrap: 'nowrap'
      //       });
      //       container.add(containerRight);

      //       const containerRightTop = new VTable.CustomLayout.Group({
      //         height: percentCalc(50),
      //         width: percentCalc(100),
      //         display: 'flex',
      //         alignItems: 'flex-end'
      //       });

      //       const containerRightBottom = new VTable.CustomLayout.Group({
      //         height: percentCalc(50),
      //         width: percentCalc(100),
      //         display: 'flex',
      //         alignItems: 'center'
      //       });

      //       containerRight.add(containerRightTop);
      //       containerRight.add(containerRightBottom);

      //       const bloggerName = new VTable.CustomLayout.Text({
      //         text: record.bloggerName,
      //         fontSize: 13,
      //         fontFamily: 'sans-serif',
      //         fill: 'black'
      //       });
      //       containerRightTop.add(bloggerName);

      //       const location = new VTable.CustomLayout.Image({
      //         id: 'location',
      //         image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg',
      //         width: 15,
      //         height: 15,
      //         boundsPadding: [0, 0, 0, 10]
      //       });
      //       containerRightTop.add(location);

      //       const locationName = new VTable.CustomLayout.Text({
      //         text: record.city,
      //         fontSize: 11,
      //         fontFamily: 'sans-serif',
      //         fill: '#6f7070'
      //       });
      //       containerRightTop.add(locationName);

      //       for (let i = 0; i < record?.tags?.length ?? 0; i++) {
      //         const tag = new VTable.CustomLayout.Tag({
      //           text: record.tags[i],
      //           textStyle: {
      //             fontSize: 10,
      //             fontFamily: 'sans-serif',
      //             fill: 'rgb(51, 101, 238)'
      //           },
      //           panel: {
      //             visible: true,
      //             fill: '#f4f4f2',
      //             cornerRadius: 5
      //           },
      //           space: 5,
      //           boundsPadding: [0, 0, 0, 5]
      //         });
      //         containerRightBottom.add(tag);
      //       }
      //       return {
      //         rootContainer: container,
      //         renderDefault: false
      //       };
      //     }
      //   };
      // }
    }
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  // tableInstance.dataSource = dataSource;

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
