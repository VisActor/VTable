import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

/**
 * 创建分页控制器
 */
function createPaginationControls(tableInstance: VTable.ListTable, allRecords: any[]) {
  // 创建分页控制器容器
  const paginationContainer = document.createElement('div');
  paginationContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #f5f5f5;
    border-top: 1px solid #ddd;
    font-family: Arial, sans-serif;
  `;

  // 创建页码信息显示
  const pageInfo = document.createElement('div');
  pageInfo.style.cssText = 'font-size: 14px; color: #666;';
  // 创建分页按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; gap: 10px; align-items: center;';

  // 创建按钮
  const firstBtn = createButton('首页', () => goToPage(0));
  const prevBtn = createButton('上一页', () => goToPage(Math.max(0, getCurrentPage() - 1)));
  const nextBtn = createButton('下一页', () => goToPage(Math.min(getTotalPages() - 1, getCurrentPage() + 1)));
  const lastBtn = createButton('末页', () => goToPage(getTotalPages() - 1));

  // 创建页码输入框
  const pageInput = document.createElement('input');
  pageInput.type = 'number';
  pageInput.min = '1';
  pageInput.style.cssText = 'width: 60px; padding: 4px; text-align: center; border: 1px solid #ddd; border-radius: 4px;';
  pageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput.value) - 1; // 转换为0基索引
      if (page >= 0 && page < getTotalPages()) {
        goToPage(page);
      }
    }
  });

  const goBtn = createButton('跳转', () => {
    const page = parseInt(pageInput.value) - 1; // 转换为0基索引
    if (page >= 0 && page < getTotalPages()) {
      goToPage(page);
    }
  });

  // 组装分页控制器
  buttonContainer.appendChild(firstBtn);
  buttonContainer.appendChild(prevBtn);
  buttonContainer.appendChild(nextBtn);
  buttonContainer.appendChild(lastBtn);
  buttonContainer.appendChild(document.createTextNode('跳转到第'));
  buttonContainer.appendChild(pageInput);
  buttonContainer.appendChild(document.createTextNode('页'));
  buttonContainer.appendChild(goBtn);

  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(buttonContainer);

  // 将分页控制器添加到表格容器后面
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer && tableContainer.parentNode) {
    // 确保表格容器有合适的样式
    if (tableContainer.parentNode instanceof HTMLElement) {
      tableContainer.parentNode.style.display = 'flex';
      tableContainer.parentNode.style.flexDirection = 'column';
    }
    tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
  }

  // 工具函数
  function createButton(text: string, onClick: () => void) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      padding: 6px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    btn.addEventListener('click', onClick);
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f0f0f0';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'white';
    });
    return btn;
  }

  function getCurrentPage(): number {
    return tableInstance.pagination?.currentPage || 0;
  }

  function getTotalPages(): number {
    const pagination = tableInstance.pagination;
    if (!pagination) return 1;
    return Math.ceil(pagination.totalCount / pagination.perPageCount);
  }

  function goToPage(page: number) {
    if (!tableInstance.pagination) return;
    
    console.log(`跳转到第 ${page + 1} 页`);
    tableInstance.updatePagination({
      currentPage: page,
      perPageCount: tableInstance.pagination.perPageCount,
      totalCount: allRecords.length
    });
    updatePageInfo();
  }

  function updatePageInfo() {
    const pagination = tableInstance.pagination;
    if (!pagination) return;
    
    const currentPage = pagination.currentPage + 1; // 显示时转换为1基索引
    const totalPages = getTotalPages();
    const startRecord = pagination.currentPage * pagination.perPageCount + 1;
    const endRecord = Math.min((pagination.currentPage + 1) * pagination.perPageCount, pagination.totalCount);
    
    pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页，显示第 ${startRecord}-${endRecord} 条，共 ${pagination.totalCount} 条记录`;
    pageInput.value = currentPage.toString();
    
    // 更新按钮状态
    (firstBtn as HTMLButtonElement).disabled = (prevBtn as HTMLButtonElement).disabled = currentPage === 1;
    (nextBtn as HTMLButtonElement).disabled = (lastBtn as HTMLButtonElement).disabled = currentPage === totalPages;
    
    // 更新按钮样式
    [firstBtn, prevBtn, nextBtn, lastBtn].forEach(btn => {
      const button = btn as HTMLButtonElement;
      button.style.opacity = button.disabled ? '0.5' : '1';
      button.style.cursor = button.disabled ? 'not-allowed' : 'pointer';
    });
  }

  // 初始化页码信息
  updatePageInfo();
}

// 生成测试数据
const generateEmployeeData = (count: number) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'IT', 'Design'];
  const positions = [
    'Senior Developer',
    'Marketing Manager',
    'Sales Rep',
    'HR Manager',
    'Financial Analyst',
    'System Admin',
    'UX Designer'
  ];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    department: departments[i % 7],
    position: positions[i % 7],
    salary: 65000 + Math.floor(Math.random() * 35000),
    status: 'Active',
    // 只有部分记录有子数据
    children:
      i % 3 === 0
        ? [
            {
              project: `项目A-${i + 1}`,
              role: '负责人',
              startDate: '2024-01-15',
              endDate: '2024-12-31',
              progress: 85
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目C-${i + 1}`,
              role: '顾问',
              startDate: '2024-02-10',
              endDate: '2024-11-20',
              progress: 78
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            }
          ]
        : undefined
  }));
};

export function createTable() {
  const records = generateEmployeeData(701);

  // 创建主从表插件实例
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'employee-detail-plugin',
    detailGridOptions: ({ data, bodyRowIndex }) => {
      if (bodyRowIndex === 0) {
        return {
          columns: [
            {
              field: 'project',
              title: '项目名称',
              width: 180
            },
            {
              field: 'role',
              title: '项目角色',
              width: 120
            },
            {
              field: 'startDate',
              title: '开始日期',
              width: 100
            },
            {
              field: 'endDate',
              title: '结束日期',
              width: 100
            },
            {
              field: 'progress',
              title: '项目进度',
              width: 100,
              fieldFormat: (value: number) => `${value}%`
            }
          ],
          theme: VTable.themes.BRIGHT,
          style: {
            margin: 20,
            height: 300
          }
        };
      }
      return {
        columns: [
          {
            field: 'project',
            title: '项目名称',
            width: 180
          },
          {
            field: 'role',
            title: '项目角色',
            width: 120
          },
          {
            field: 'startDate',
            title: '开始日期',
            width: 100
          },
          {
            field: 'endDate',
            title: '结束日期',
            width: 100
          },
          {
            field: 'progress',
            title: '项目进度',
            width: 100,
            fieldFormat: (value: number) => `${value}%`
          }
        ],
        theme: VTable.themes.DARK,
        style: {
          margin: 20,
          height: 300
        }
      };
    }
  });

  // 主表列定义 - 使用多层表头分组结构
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      title: '员工基本信息',
      columns: [
        {
          field: 'name',
          title: '员工姓名',
          width: 120,
          sort: true,
          headerType: 'text',
          filter: {
            filterable: true,
            filterFunc: (value: unknown, filterValue: string) => {
              return String(value).toLowerCase().includes(filterValue.toLowerCase());
            }
          }
        },
        {
          title: '组织架构',
          columns: [
            {
              field: 'department',
              title: '部门',
              width: 120,
              sort: true,
              headerType: 'text',
              filter: {
                filterable: true,
                filters: [
                  { value: 'Engineering', text: 'Engineering' },
                  { value: 'Marketing', text: 'Marketing' },
                  { value: 'Sales', text: 'Sales' },
                  { value: 'HR', text: 'HR' },
                  { value: 'Finance', text: 'Finance' },
                  { value: 'IT', text: 'IT' },
                  { value: 'Design', text: 'Design' }
                ]
              }
            },
            {
              field: 'position',
              title: '职位',
              width: 150,
              sort: true
            }
          ]
        }
      ]
    },
    {
      title: '薪酬状态',
      columns: [
        {
          field: 'salary',
          title: '薪资',
          width: 100,
          sort: true,
          fieldFormat: (value: number) => `$${value.toLocaleString()}`
        },
        {
          field: 'status',
          title: '状态',
          width: 80,
          sort: true
        }
      ]
    }
  ] as VTable.TYPES.ColumnsDefine;

  // 表格配置选项
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    autoFillWidth: true,
    defaultRowHeight: 40,
    frozenRowCount: 3,
    headerHierarchyType: 'grid-tree',
    headerExpandLevel: 2,
    // 分页配置
    pagination: {
      totalCount: records.length,
      currentPage: 0,
      perPageCount: 100
    },
    // theme: VTable.themes.BRIGHT,
    plugins: [masterDetailPlugin]
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(option);

  // 创建分页控制器
  createPaginationControls(tableInstance, records);
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;

  // 绑定调试工具
  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  return tableInstance;
}
