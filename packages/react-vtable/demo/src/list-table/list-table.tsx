import { useState } from 'react';
import { ListTable, VTable } from '../../../src';
import data from '../../data/list-data.json';

const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';

function App() {
  // const option = {
  //   header: [
  //     {
  //       field: '0',
  //       caption: '名称'
  //     },
  //     {
  //       field: '1',
  //       caption: '年龄'
  //     },
  //     {
  //       field: '2',
  //       caption: '性别'
  //     },
  //     {
  //       field: '3',
  //       caption: '爱好'
  //     }
  //   ],
  //   records: new Array(1000).fill(['张三', 18, '男', '🏀'])
  // };

  const columns = [
    {
      field: 'Order ID',
      title: 'Order ID',
      width: 'auto',
      sort: true
    },
    {
      field: 'Customer ID',
      title: 'Customer ID',
      width: 'auto'
    },
    {
      field: 'Product Name',
      title: 'Product Name',
      width: 'auto'
    },
    {
      field: 'Category',
      title: 'Category',
      width: 'auto'
    },
    {
      field: 'Sub-Category',
      title: 'Sub-Category',
      width: 'auto'
    },
    {
      field: 'Region',
      title: 'Region',
      width: 'auto'
    },
    {
      field: 'City',
      title: 'City',
      width: 'auto'
    },
    {
      field: 'Order Date',
      title: 'Order Date',
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
      field: 'Profit',
      title: 'Profit',
      width: 'auto'
    }
  ];

  const [record, setRecord] = useState(data.slice(0, 100));

  const option: VTable.ListTableConstructorOptions = {
    records: record,
    columns,
    widthMode: 'standard',
    groupBy: ['Category'],
    // hierarchyExpandLevel: Infinity,
    theme: VTable.themes.DEFAULT.extends({
      groupTitleStyle: {
        fontWeight: 'bold',
        // bgColor: '#3370ff'
        bgColor: args => {
          const { col, row, table } = args;
          const index = table.getGroupTitleLevel(col, row);
          if (index !== undefined) {
            return titleColorPool[index % titleColorPool.length];
          }
        }
      }
    }),
    editor: 'input',
    sortState: {
      field: 'Order ID',
      order: 'asc'
    }
    // groupTitleCustomLayout: args => {
    //   const { table, row, col, rect } = args;
    //   const record = table.getCellOriginRecord(col, row);
    //   const { height, width } = rect ?? table.getCellRect(col, row);
    //   const container = new VTable.CustomLayout.Group({
    //     height,
    //     width,
    //     display: 'flex',
    //     flexDirection: 'row',
    //     flexWrap: 'nowrap',
    //     cursor: 'pointer',
    //     alignItems: 'center'
    //   });
    //   container.addEventListener('click', e => {
    //     // 折叠后单元格的行列值会变化，需要动态获取
    //     const { col, row } = e.target.parent;
    //     table.toggleHierarchyState(col, row);
    //   });
    //   const icon = new VTable.CustomLayout.Image({
    //     id: 'icon0',
    //     width: 40,
    //     height: 40,
    //     image: bloggerAvatar,
    //     cornerRadius: 20,
    //     boundsPadding: [0, 20, 0, 20 + table.getGroupTitleLevel(col, row) * 20]
    //   });
    //   container.add(icon);
    //   const bloggerName = new VTable.CustomLayout.Text({
    //     text: record.vtableMergeName,
    //     fontSize: 13,
    //     fontFamily: 'sans-serif',
    //     fill: 'black'
    //   });
    //   container.add(bloggerName);
    //   return {
    //     rootContainer: container,
    //     renderDefault: false
    //   };
    // },
    // enableTreeStickCell: true
  };

  // setTimeout(() => {
  //   setRecord(data.slice(100, 200));
  // }, 1000);

  return <ListTable option={option} />;
}

export default App;
