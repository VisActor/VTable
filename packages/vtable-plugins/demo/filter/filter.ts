import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { FilterOperatorCategory, FilterPlugin } from '../../src/filter';
import { ListTable } from '@visactor/vtable';
const CONTAINER_ID = 'vTable';

/**
 * 生成展示筛选功能的演示数据
 * 包含各种类型的数据：文本、数值、日期、布尔值、颜色等
 */
const generateDemoData = (count: number, prefix: string) => {
  const colors = ['#f5a623', '#7ed321', '#bd10e0', '#4a90e2', '#50e3c2', '#ff5a5f', '#000000'];
  const departments = ['研发部', '市场部', '销售部', '人事部', '财务部', '设计部', '客服部', '运营部'];

  return Array.from(new Array(count)).map((_, i) => {
    const salary = Math.floor(5000 + Math.random() * 15000);
    const sales = Math.floor(10000 + Math.random() * 90000);
    const isSelected = i % 3 === 0;
    const option = i === 1;

    return {
      id: i + 1,
      name: `${prefix}_员工${i + 1}`,
      gender: i % 2 === 0 ? '男' : '女',
      salary,
      sales,
      seniority: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
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
  const records = generateDemoData(50, '第一次');
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
      sort: true,
      headerIcon: {
        type: 'svg',
        svg: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#ff5a5f" stroke="#333" stroke-width="1"/></svg>',
        width: 20,
        height: 20,
        name: 'name-icon',
        positionType: VTable.TYPES.IconPosition.absoluteRight,
        marginRight: 30
      }
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
        return '￥' + record.salary;
      }
    },
    {
      field: 'sales',
      title: '销售额',
      width: 150,
      sort: true,
      fieldFormat(record) {
        return '￥' + record.sales;
      }
    },
    {
      field: 'seniority',
      title: '工龄',
      width: 100,
      sort: true
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
        textAlign: 'center'
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

  const filterPlugin = new FilterPlugin({
    styles: {
      filterMenu: {
        display: 'none',
        position: 'absolute',
        backgroundColor: '#0E1119',
        border: '0px solid #272A30',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        zIndex: '100',
        borderRadius: '4px',
        color: '#FFF',
        fontFamily: 'SourceHanSansCN-Normal',
        fontSize: '12px'
      },
      filterPanel: {
        padding: '10px',
        display: 'block'
      },
      searchContainer: {
        padding: '5px'
      },
      searchInput: {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #272a30',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
        backgroundColor: '#0e1119',
        color: 'red'
      },
      optionsContainer: {
        maxHeight: '200px',
        overflowY: 'auto',
        marginTop: '10px'
      },
      optionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 5px',
        color: 'red'
      },
      optionLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        flexGrow: '1',
        fontWeight: 'normal'
      },
      checkbox: {
        marginRight: '10px'
      },
      countSpan: {
        color: '#888',
        fontSize: '12px'
      },
      tabsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        borderBottom: '0px solid #e0e0e0'
      },
      footerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderTop: '0px solid #e0e0e0',
        backgroundColor: 'transparent'
      },
      clearLink: {
        color: '#006EFF',
        textDecoration: 'none'
      },
      conditionContainer: {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#0E1119'
      },
      formLabel: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'normal',
        backgroundColor: 'transparent'
      },
      operatorSelect: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        border: '1px solid #272a30',
        borderRadius: '4px',
        boxSizing: 'border-box',
        backgroundColor: '#0e1119',
        color: 'red'
      },
      rangeInputContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#0E1119'
      },
      addLabel: {
        display: 'none',
        padding: '0 5px'
      }
    },
    conditionCategories: [
      { value: FilterOperatorCategory.ALL, label: '全部' },
      { value: FilterOperatorCategory.TEXT, label: '文本' },
      { value: FilterOperatorCategory.NUMBER, label: '数值' }
      // { value: FilterOperatorCategory.COLOR, label: '颜色' },
      // { value: FilterOperatorCategory.CHECKBOX, label: '复选框' },
      // { value: FilterOperatorCategory.RADIO, label: '单选框' }
    ],
    syncCheckboxCheckedState: false
  });
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
  tableInstance.on(ListTable.EVENT_TYPE.FILTER_MENU_SHOW, (...args) => {
    console.log('filter_menu_show', args);
    tableInstance.arrangeCustomCellStyle({ col: 1, row: 0 }, 'header_highlight');
  });

  tableInstance.on(ListTable.EVENT_TYPE.FILTER_MENU_HIDE, (...args) => {
    console.log('filter_menu_hide', args);
    tableInstance.arrangeCustomCellStyle({ col: 1, row: 0 }, 'header_highlight');
  });

  tableInstance.registerCustomCellStyle('header_highlight', {
    bgColor: 'red'
  });

  setTimeout(() => {
    filterPlugin.updatePluginOptions({
      styles: {
        optionItem: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 5px',
          color: 'blue'
        }
      }
    });
    console.log('update');
    tableInstance.updateOption({
      ...option,
      plugins: [filterPlugin],
      records: generateDemoData(50, '第二次')
    });
  }, 5000);

  // setTimeout(() => {
  //   console.log('update');
  //   tableInstance.updateOption({
  //     ...option,
  //     plugins: [filterPlugin]
  //   });
  // }, 8000);

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  tableInstance.on('click_cell', (...args) => {
    console.log('click_cell', args);
  });
  tableInstance.on('icon_click', (...args) => {
    args[0].event.stopPropagation();
    args[0].event.preventDefault();
    console.log('icon_click');
  });
}
