import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { FilterPlugin } from '../../src/filter';
const CONTAINER_ID = 'vTable';

/**
 * 生成展示筛选功能的演示数据
 * 包含各种类型的数据：文本、数值、日期、布尔值、颜色等
 */
const generateDemoData = (count: number) => {
  const colors = ['#f5a623', '#7ed321', '#bd10e0', '#4a90e2', '#50e3c2', '#ff5a5f', '#000000'];
  const departments = ['研发部', '市场部', '销售部', '人事部', '财务部', '设计部', '客服部', '运营部'];

  return Array.from(new Array(count)).map((_, i) => {
    const salary = Math.floor(5000 + Math.random() * 15000);
    const sales = Math.floor(10000 + Math.random() * 90000);
    const isSelected = i % 3 === 0;
    const option = i === 1;

    return {
      id: i + 1,
      name: `员工${i + 1}`,
      gender: i % 2 === 0 ? '男' : '女',
      salary,
      sales,
      isFullTime: i % 5 !== 0,
      department: departments[i % departments.length],
      favoriteColor: colors[i % colors.length],
      status: i % 3 === 0 ? '在职' : i % 3 === 1 ? '请假' : '离职',
      isSelected,
      option,
      avatar:
        '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#' +
        colors[i % colors.length].substring(1) +
        '" stroke="#333" stroke-width="1"/></svg>'
    };
  });
};

export function createTable() {
  const records = generateDemoData(50);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 60,
      sort: true
    },
    {
      field: 'name',
      title: '姓名',
      width: 120,
      sort: true
    },
    {
      field: 'gender',
      title: '性别',
      width: 100
    },
    // {
    //   field: 'avatar',
    //   title: '头像',
    //   width: 100,
    //   cellType: 'image',
    //   keepAspectRatio: true
    // },
    {
      field: 'salary',
      title: '薪资',
      width: 120,
      sort: true,
      fieldFormat(record) {
        return '￥' + record.salary
      }
    },
    {
      field: 'sales',
      title: '销售额',
      width: 150,
      sort: true,
      fieldFormat(record) {
        return '￥' + record.sales
      }
    },
    {
      field: 'department',
      title: '部门',
      width: 100
    },
    // {
    //   field: 'favoriteColor',
    //   title: '喜好',
    //   width: 120,
    //   style: {
    //     bgColor: (args: any) => args.value
    //   }
    // },
    {
      field: 'status',
      title: '状态',
      width: 120,
      style: {
        textAlign: 'center',
        // color: (args: any) => {
        //   const { value } = args;
        //   if (value === '在职') {
        //     return '#7ed321';
        //   }
        //   if (value === '请假') {
        //     return '#f5a623';
        //   }
        //   return '#ff5a5f'; // 离职
        // }
      }
    },
    {
      field: 'isSelected',
      title: '选择',
      width: 100,
      cellType: 'checkbox'
    },
    {
      field: 'option',
      title: '选项',
      width: 100,
      cellType: 'radio'
    }
  ];

  const filterPlugin = new FilterPlugin({});
  (window as any).filterPlugin = filterPlugin;

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    padding: 10,
    plugins: [filterPlugin]
  };
  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
