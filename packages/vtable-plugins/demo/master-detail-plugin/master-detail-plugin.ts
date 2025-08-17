import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

/**
 * 创建过滤控制器
 */
function createFilterControls(tableInstance: VTable.ListTable, allRecords: any[]) {
  // 创建过滤控制器容器
  const filterContainer = document.createElement('div');
  filterContainer.style.cssText = `
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    background: #e8f4fd;
    border-bottom: 1px solid #ddd;
    font-family: Arial, sans-serif;
    gap: 15px;
    flex-wrap: wrap;
  `;

  // 创建标题
  const title = document.createElement('span');
  title.textContent = '数据过滤：';
  title.style.cssText = 'font-weight: bold; color: #333; min-width: 70px;';

  // 部门过滤
  const departmentFilter = createFilterSelect('部门', [
    { value: '', text: '全部部门' },
    { value: 'Engineering', text: 'Engineering' },
    { value: 'Marketing', text: 'Marketing' },
    { value: 'Sales', text: 'Sales' },
    { value: 'HR', text: 'HR' },
    { value: 'Finance', text: 'Finance' },
    { value: 'IT', text: 'IT' },
    { value: 'Design', text: 'Design' }
  ]);

  // 职位过滤
  const positionFilter = createFilterSelect('职位', [
    { value: '', text: '全部职位' },
    { value: 'Senior Developer', text: 'Senior Developer' },
    { value: 'Marketing Manager', text: 'Marketing Manager' },
    { value: 'Sales Rep', text: 'Sales Rep' },
    { value: 'HR Manager', text: 'HR Manager' },
    { value: 'Financial Analyst', text: 'Financial Analyst' },
    { value: 'System Admin', text: 'System Admin' },
    { value: 'UX Designer', text: 'UX Designer' }
  ]);

  // 薪资范围过滤
  const salaryFilter = createFilterSelect('薪资范围', [
    { value: '', text: '全部薪资' },
    { value: '60000-70000', text: '6万-7万' },
    { value: '70000-80000', text: '7万-8万' },
    { value: '80000-90000', text: '8万-9万' },
    { value: '90000-100000', text: '9万-10万' }
  ]);

  // 姓名搜索框
  const nameSearchContainer = document.createElement('div');
  nameSearchContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';
  
  const nameLabel = document.createElement('span');
  nameLabel.textContent = '姓名搜索：';
  nameLabel.style.cssText = 'color: #333; font-size: 14px;';
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = '输入员工姓名...';
  nameInput.style.cssText = `
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 150px;
    font-size: 14px;
  `;

  nameSearchContainer.appendChild(nameLabel);
  nameSearchContainer.appendChild(nameInput);

  // 清除过滤按钮
  const clearBtn = createButton('清除过滤', () => {
    departmentFilter.value = '';
    positionFilter.value = '';
    salaryFilter.value = '';
    nameInput.value = '';
    applyFilters();
  });

  // 应用过滤按钮
  const applyBtn = createButton('应用过滤', applyFilters);
  applyBtn.style.background = '#007acc';
  applyBtn.style.borderColor = '#007acc';

  // 过滤状态显示
  const filterStatus = document.createElement('div');
  filterStatus.style.cssText = 'color: #666; font-size: 12px; margin-left: auto;';

  // 组装控制器
  filterContainer.appendChild(title);
  filterContainer.appendChild(departmentFilter);
  filterContainer.appendChild(positionFilter);
  filterContainer.appendChild(salaryFilter);
  filterContainer.appendChild(nameSearchContainer);
  filterContainer.appendChild(applyBtn);
  filterContainer.appendChild(clearBtn);
  filterContainer.appendChild(filterStatus);

  // 将过滤控制器添加到表格容器前面
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer && tableContainer.parentNode) {
    if (!tableContainer.parentNode.style || tableContainer.parentNode.style.display !== 'flex') {
      tableContainer.parentNode.style.display = 'flex';
      tableContainer.parentNode.style.flexDirection = 'column';
    }
    tableContainer.parentNode.insertBefore(filterContainer, tableContainer);
  }

  // 应用过滤逻辑
  function applyFilters() {
    const departmentValue = departmentFilter.value;
    const positionValue = positionFilter.value;
    const salaryValue = salaryFilter.value;
    const nameValue = nameInput.value.trim().toLowerCase();

    // 过滤数据
    let filteredRecords = allRecords.filter(record => {
      // 部门过滤
      if (departmentValue && record.department !== departmentValue) {
        return false;
      }

      // 职位过滤
      if (positionValue && record.position !== positionValue) {
        return false;
      }

      // 薪资范围过滤
      if (salaryValue) {
        const [minSalary, maxSalary] = salaryValue.split('-').map(Number);
        if (record.salary < minSalary || record.salary > maxSalary) {
          return false;
        }
      }

      // 姓名搜索
      if (nameValue && !record.name.toLowerCase().includes(nameValue)) {
        return false;
      }

      return true;
    });

    console.log(`过滤结果：从 ${allRecords.length} 条记录过滤到 ${filteredRecords.length} 条`);

    // 更新表格数据
    tableInstance.setRecords(filteredRecords, { restoreHierarchyState: false });

    // 更新分页信息
    if (tableInstance.pagination) {
      tableInstance.updatePagination({
        currentPage: 0, // 重置到第一页
        perPageCount: tableInstance.pagination.perPageCount,
        totalCount: filteredRecords.length
      });
    }

    // 更新过滤状态显示
    updateFilterStatus(filteredRecords.length);
  }

  // 更新过滤状态显示
  function updateFilterStatus(filteredCount: number) {
    const activeFilters = [];
    if (departmentFilter.value) activeFilters.push(`部门: ${departmentFilter.value}`);
    if (positionFilter.value) activeFilters.push(`职位: ${positionFilter.value}`);
    if (salaryFilter.value) activeFilters.push(`薪资: ${salaryFilter.value}`);
    if (nameInput.value.trim()) activeFilters.push(`姓名: ${nameInput.value.trim()}`);

    if (activeFilters.length > 0) {
      filterStatus.textContent = `已过滤 ${filteredCount}/${allRecords.length} 条记录 | ${activeFilters.join(', ')}`;
    } else {
      filterStatus.textContent = `显示全部 ${allRecords.length} 条记录`;
    }
  }

  // 创建过滤下拉框
  function createFilterSelect(label: string, options: { value: string; text: string }[]) {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; align-items: center; gap: 5px;';

    const labelElement = document.createElement('span');
    labelElement.textContent = `${label}：`;
    labelElement.style.cssText = 'color: #333; font-size: 14px; min-width: 50px;';

    const select = document.createElement('select');
    select.style.cssText = `
      padding: 5px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
      min-width: 120px;
    `;

    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      select.appendChild(optionElement);
    });

    container.appendChild(labelElement);
    container.appendChild(select);

    return select;
  }

  function createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 5px 12px;
      border: 1px solid #ddd;
      background: white;
      color: #333;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
    `;
    button.addEventListener('click', onClick);
    
    // 悬停效果
    button.addEventListener('mouseenter', () => {
      button.style.background = '#f0f0f0';
    });
    button.addEventListener('mouseleave', () => {
      if (button.style.background !== '#007acc') {
        button.style.background = 'white';
      }
    });
    
    return button;
  }

  // 实时搜索（可选）
  nameInput.addEventListener('input', () => {
    // 延迟搜索，避免频繁过滤
    clearTimeout((nameInput as any).searchTimeout);
    (nameInput as any).searchTimeout = setTimeout(applyFilters, 300);
  });

  // 初始化过滤状态
  updateFilterStatus(allRecords.length);
}

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
    // frozenRowCount: 3,
    // bottomFrozenRowCount: 2,
    // 启用多层表头树形展开折叠功能
    headerHierarchyType: 'grid-tree',
    // 设置默认展开层级（可选：1-只展开一层，2-展开两层，等等）
    headerExpandLevel: 2,
    // 分页配置
    pagination: {
      totalCount: records.length,
      currentPage: 0,
      perPageCount: 100
    },
    // theme: VTable.themes.BRIGHT,
    // 关键：将插件添加到 plugins 数组中
    plugins: [masterDetailPlugin]
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(option);
  
  // 创建分页控制器
  createPaginationControls(tableInstance, records);
  
  // 创建过滤控制器
  createFilterControls(tableInstance, records);
  
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;

  // 绑定调试工具
  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  return tableInstance;
}
