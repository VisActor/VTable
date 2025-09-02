// 该case测试树形结构配置checkbox的功能
import * as VTable from '@visactor/vtable';

const CONTAINER_ID = 'vTable';

// 声明全局变量类型
declare global {
  interface Window {
    tableInstance?: VTable.ListTable;
  }
}

// 定义树形数据接口
interface TreeRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  children?: TreeRecord[];
}

// 生成树形结构数据
function generateTreeData(): TreeRecord[] {
  return [
    {
      id: '1',
      name: '组织架构',
      type: '根节点',
      status: '正常',
      children: [
        {
          id: '1-1',
          name: '技术部门',
          type: '部门',
          status: '正常',
          children: [
            {
              id: '1-1-1',
              name: '前端组',
              type: '小组',
              status: '正常',
              children: [
                { id: '1-1-1-1', name: '张三', type: '员工', status: '在职' },
                { id: '1-1-1-2', name: '李四', type: '员工', status: '在职' }
              ]
            },
            {
              id: '1-1-2',
              name: '后端组',
              type: '小组',
              status: '正常',
              children: [
                { id: '1-1-2-1', name: '王五', type: '员工', status: '在职' },
                { id: '1-1-2-2', name: '赵六', type: '员工', status: '请假' }
              ]
            }
          ]
        },
        {
          id: '1-2',
          name: '市场部门',
          type: '部门',
          status: '正常',
          children: [
            {
              id: '1-2-1',
              name: '销售组',
              type: '小组',
              status: '正常',
              children: [
                { id: '1-2-1-1', name: '钱七', type: '员工', status: '在职' },
                { id: '1-2-1-2', name: '孙八', type: '员工', status: '在职' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: '项目管理',
      type: '根节点',
      status: '正常',
      children: [
        {
          id: '2-1',
          name: 'VTable项目',
          type: '项目',
          status: '进行中',
          children: [
            { id: '2-1-1', name: '需求分析', type: '任务', status: '已完成' },
            { id: '2-1-2', name: '开发实现', type: '任务', status: '进行中' },
            { id: '2-1-3', name: '测试验收', type: '任务', status: '待开始' }
          ]
        }
      ]
    }
  ];
}

export function createTable(): VTable.ListTable {
  const treeData = generateTreeData();

  // 配置列定义
  const columns: VTable.TYPES.ColumnsDefine = [
    {
      field: 'name',
      title: '名称',
      width: 'auto',
      tree: true
    },
    {
      field: 'type',
      title: '类型',
      width: 100
    },
    {
      field: 'status',
      title: '状态',
      width: 100
    },
    {
      field: 'check',
      title: 'checkbox',
      width: 120,
      cellType: 'checkbox'
      // disable: true
    }
  ];

  // 创建表格实例
  const tableInstance = new VTable.ListTable({
    container: document.getElementById(CONTAINER_ID) as HTMLElement,
    columns,
    records: treeData,
    defaultRowHeight: 32,
    hierarchyIndent: 20,
    hierarchyExpandLevel: 2,
    widthMode: 'standard',
    heightMode: 'autoHeight',
    autoWrapText: true,
    limitMaxAutoWidth: 600,
    rowSeriesNumber: {
      width: 'auto',
      cellType: 'checkbox'
    }
  });

  // 监听checkbox状态变化
  tableInstance.on('checkbox_state_change', args => {
    // eslint-disable-next-line no-console
    console.log('Checkbox状态变化:', args);
  });

  // 监听单元格点击事件
  tableInstance.on('click_cell', args => {
    // eslint-disable-next-line no-console
    console.log('单元格点击:', args);
  });

  // 监听树节点展开/折叠事件
  tableInstance.on('tree_hierarchy_state_change', args => {
    // eslint-disable-next-line no-console
    console.log('树节点状态变化:', args);
  });

  // 绑定调试工具（如果需要）
  window.tableInstance = tableInstance;
  
  return tableInstance;
}
