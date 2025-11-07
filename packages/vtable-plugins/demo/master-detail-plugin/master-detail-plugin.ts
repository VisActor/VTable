// 该case测试的是分页，基本表格的分组与折叠，使用的是DetailGridOptions的动态配置函数
// defaultColWidth,defaultHeaderColWidth,defaultRowHeight,defaultHeaderRowHeight
// widthMode heightMode 为standard
import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

/**
 * 创建分页控制器
 */
function createPaginationControls(tableInstance: VTable.ListTable, allRecords: unknown[]) {
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
  pageInput.style.cssText =
    'width: 60px; padding: 4px; text-align: center; border: 1px solid #ddd; border-radius: 4px;';
  pageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput.value, 10) - 1; // 转换为0基索引
      if (page >= 0 && page < getTotalPages()) {
        goToPage(page);
      }
    }
  });

  const goBtn = createButton('跳转', () => {
    const page = parseInt(pageInput.value, 10) - 1; // 转换为0基索引
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
    if (!pagination || !pagination.totalCount || !pagination.perPageCount) {
      return 1;
    }
    return Math.ceil(pagination.totalCount / pagination.perPageCount);
  }

  function goToPage(page: number) {
    if (!tableInstance.pagination) {
      return;
    }
    // 跳转到指定页面
    tableInstance.updatePagination({
      currentPage: page,
      perPageCount: tableInstance.pagination.perPageCount,
      totalCount: allRecords.length
    });
    updatePageInfo();
  }

  function updatePageInfo() {
    const pagination = tableInstance.pagination;
    if (!pagination || pagination.currentPage === undefined || !pagination.perPageCount || !pagination.totalCount) {
      return;
    }
    const currentPage = pagination.currentPage + 1; // 显示时转换为1基索引
    const totalPages = getTotalPages();
    const startRecord = pagination.currentPage * pagination.perPageCount + 1;
    const endRecord = Math.min((pagination.currentPage + 1) * pagination.perPageCount, pagination.totalCount);
    pageInfo.textContent =
      `第 ${currentPage} 页，共 ${totalPages} 页，` +
      `显示第 ${startRecord}-${endRecord} 条，共 ${pagination.totalCount} 条记录`;
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
    hierarchyState: 'collapse',
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
  const records = generateEmployeeData(752);

  // 创建主从表插件实例
  const masterDetailPlugin = new MasterDetailPlugin({
    detailTableOptions: ({ data, bodyRowIndex }) => {
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
          rowResizeMode: 'all',
          theme: VTable.themes.BRIGHT,
          style: {
            margin: 20,
            height: 'auto'
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
          height: 'auto'
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
          sort: true
        },
        {
          field: 'status',
          title: '状态',
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
    // 默认尺寸配置（由 demo 提供，可在实例化插件或表格时覆盖）
    defaultColWidth: 200,
    defaultRowHeight: 30,
    defaultHeaderRowHeight: 40,
    autoWrapText: true,
    headerHierarchyType: 'grid-tree',
    headerExpandLevel: 2,
    widthMode: 'standard',
    heightMode: 'standard',
    autoFillWidth: true,
    theme: VTable.themes.SIMPLIFY,
    hierarchyTextStartAlignment: true,
    // 分页配置
    pagination: {
      totalCount: records.length,
      currentPage: 0,
      perPageCount: 100
    },
    rowResizeMode: 'all',
    // theme: VTable.themes.BRIGHT,
    plugins: [masterDetailPlugin]
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(option);
  // 添加子表事件监听示例
  setupSubTableEventListeners(tableInstance);
  setTimeout(() => {
    tableInstance.toggleHierarchyState(0, 2);
    tableInstance.toggleHierarchyState(0, 5);
    setTimeout(() => {
      demonstrateFilterSubTables(masterDetailPlugin);
    }, 1000);
  }, 100);

  // 创建分页控制器
  createPaginationControls(tableInstance, records);
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;
  return tableInstance;
}

/**
 * 设置子表事件监听示例
 */
function setupSubTableEventListeners(tableInstance: VTable.ListTable) {
  // 监听子表的单元格点击事件
  tableInstance.on(VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT, args => {
    const { plugin, pluginEventInfo } = args;
    // 检查是否是主从表插件的事件，并且只处理单元格点击事件
    if (
      plugin &&
      (plugin as { name?: string }).name === 'Master Detail Plugin' &&
      pluginEventInfo?.eventType === VTable.TABLE_EVENT_TYPE.CLICK_CELL
    ) {
      const eventInfo = pluginEventInfo;
      // eslint-disable-next-line no-console
      console.log('子表单元格点击事件:', {
        eventType: eventInfo.eventType,
        masterRowIndex: eventInfo.masterRowIndex,
        masterBodyRowIndex: eventInfo.masterBodyRowIndex,
        originalEventArgs: eventInfo.originalEventArgs
      });
    }
  });
}

function demonstrateFilterSubTables(masterDetailPlugin: MasterDetailPlugin) {
  // 1. 按部门筛选
  const engineeringSubTables = masterDetailPlugin.filterSubTables((bodyRowIndex, subTable, record) =>
    Boolean(record && typeof record === 'object' && 'department' in record && record.department === 'Engineering')
  );
  console.log(`Engineering部门: ${engineeringSubTables.length}个子表`);
  console.log(engineeringSubTables);
  engineeringSubTables.forEach(({ bodyRowIndex, subTable, record }) => {
    // 对子表实例进行事件监听
    subTable.on(VTable.TABLE_EVENT_TYPE.CLICK_CELL, args => {
      console.log(`Engineering部门子表(行${bodyRowIndex})单元格点击:`, args);
    });
  });
  // 2. 按薪资筛选
  const highSalarySubTables = masterDetailPlugin.filterSubTables((bodyRowIndex, subTable, record) =>
    Boolean(
      record &&
        typeof record === 'object' &&
        'salary' in record &&
        typeof record.salary === 'number' &&
        record.salary > 80000
    )
  );
  console.log(`高薪员工: ${highSalarySubTables.length}个子表`);
  console.log(highSalarySubTables);
  // 3. 按行索引筛选
  const firstFiveSubTables = masterDetailPlugin.filterSubTables(bodyRowIndex => bodyRowIndex < 5);
  console.log(`前5行: ${firstFiveSubTables.length}个子表, ${firstFiveSubTables}`);
  console.log(firstFiveSubTables);
  // 4. 按子表数据量筛选
  const largeSubTables = masterDetailPlugin.filterSubTables(
    (bodyRowIndex, subTable) => (subTable.records?.length || 0) > 5
  );
  console.log(`数据量>5: ${largeSubTables.length}个子表, ${largeSubTables}`);
  console.log(largeSubTables);
  // 5. 复合条件筛选
  const marketingHighSalary = masterDetailPlugin.filterSubTables((bodyRowIndex, subTable, record) => {
    if (!record || typeof record !== 'object') {
      return false;
    }
    return (
      'department' in record &&
      record.department === 'Marketing' &&
      'salary' in record &&
      typeof record.salary === 'number' &&
      record.salary > 70000
    );
  });
  console.log(`Marketing高薪: ${marketingHighSalary.length}个子表, ${marketingHighSalary}`);
  console.log(marketingHighSalary);
  // 6. 根据子表内数据筛选 - 筛选包含特定项目名称的子表
  const projectASubTables = masterDetailPlugin.filterSubTables((bodyRowIndex, subTable, record) => {
    if (!subTable.records || !Array.isArray(subTable.records)) {
      return false;
    }
    return subTable.records.some(
      projectRecord =>
        projectRecord &&
        typeof projectRecord === 'object' &&
        'project' in projectRecord &&
        typeof projectRecord.project === 'string' &&
        projectRecord.project.includes('项目A')
    );
  });
  console.log(`包含项目A的子表: ${projectASubTables.length}个`);
  console.log(projectASubTables);
}
