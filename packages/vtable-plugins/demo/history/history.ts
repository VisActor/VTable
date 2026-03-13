import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { InputEditor } from '@visactor/vtable-editors';
import { FilterOperatorCategory, FilterPlugin } from '../../src/filter';
import { HistoryPlugin } from '../../src/history';

const CONTAINER_ID = 'vTable';

const inputEditor = new InputEditor({});
VTable.register.editor('input', inputEditor);

const generateDemoData = (count: number, prefix: string) => {
  const colors = ['#f5a623', '#7ed321', '#bd10e0', '#4a90e2', '#50e3c2', '#ff5a5f', '#000000'];
  const departments = ['研发部', '市场部', '销售部', '人事部', '财务部', '设计部', '客服部', '运营部'];
  const provinces = ['河北', '河南', '山西', '湖北', '内蒙古', '湖南', '广东', '浙江', '四川', '北京', '上海'];

  return Array.from(new Array(count)).map((_, i) => {
    const salary = Math.floor(5000 + Math.random() * 15000);
    const sales = Math.floor(10000 + Math.random() * 90000);
    const profit = Number(((sales - salary) / 100).toFixed(2));
    const isSelected = i % 3 === 0;
    const option = i === 1;

    return {
      id: i + 1,
      name: `${prefix}_员工${i + 1}`,
      gender: i % 2 === 0 ? '男' : '女',
      salary,
      sales,
      profit,
      seniority: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
      isFullTime: i % 5 !== 0,
      department: departments[i % departments.length],
      fromProvince: provinces[i % provinces.length],
      toProvince: provinces[(i + 3) % provinces.length],
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

const createToolbar = (actions: Record<string, () => void>) => {
  const chartContainer = document.getElementById('chartContainer');
  if (!chartContainer) {
    return;
  }

  let bar = document.getElementById('history-toolbar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'history-toolbar';
    bar.style.display = 'flex';
    bar.style.flexWrap = 'wrap';
    bar.style.gap = '8px';
    bar.style.padding = '10px 12px';
    bar.style.marginBottom = '8px';
    bar.style.background = '#0E1119';
    bar.style.border = '1px solid #272A30';
    bar.style.borderRadius = '6px';
    bar.style.color = '#fff';
    chartContainer.prepend(bar);
  }

  bar.innerHTML = '';
  Object.keys(actions).forEach(label => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = label;
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '4px';
    btn.style.border = '1px solid #2b2f36';
    btn.style.background = '#151a23';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.onclick = () => actions[label]?.();
    bar.appendChild(btn);
  });
};

const getFilterPluginOptions = (): any => {
  const filterProps = {
    visible: false,
    fillColor: '#0E1119',
    strokeColor: '#272A30',
    strokeWidth: 0,
    borderRadius: 4,
    highlightColor: '#006EFF',
    defaultColor: '#000',
    textStyle: {
      color: '#FFF',
      fontFamily: 'SourceHanSansCN-Normal',
      fontSize: 12
    }
  };

  const {
    fillColor,
    strokeColor,
    strokeWidth,
    borderRadius,
    highlightColor,
    defaultColor,
    textStyle: { color: textColor, fontFamily: textFontFamily, fontSize: textFontSize }
  } = filterProps;

  return {
    syncFilterItemsState: false,
    filterModes: ['byValue', 'byCondition'],
    filterIcon: {
      name: 'filter-icon',
      type: 'svg' as const,
      width: 12,
      height: 12,
      positionType: VTable.TYPES.IconPosition.right,
      cursor: 'pointer',
      marginRight: 4,
      svg: `<svg class="icon" viewBox="0 0 1664 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" transform="translate(0,30)"><path d="M89.6 179.2A89.6 89.6 0 0 1 89.6 0h1408a89.6 89.6 0 0 1 0 179.2H89.6z m256 384a89.6 89.6 0 0 1 0-179.2h896a89.6 89.6 0 0 1 0 179.2h-896z m256 384a89.6 89.6 0 0 1 0-179.2h384a89.6 89.6 0 0 1 0 179.2h-384z" fill="${defaultColor}"></path></svg>`
    },
    filteringIcon: {
      name: 'filtering-icon',
      type: 'svg' as const,
      width: 12,
      height: 12,
      positionType: VTable.TYPES.IconPosition.right,
      cursor: 'pointer',
      marginRight: 4,
      svg: `<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" transform="translate(0,30)"><path d="M971.614323 53.05548L655.77935 412.054233C635.196622 435.434613 623.906096 465.509377 623.906096 496.583302v495.384307c0 28.975686-35.570152 43.063864-55.353551 21.781723l-159.865852-171.256294c-5.495389-5.895053-8.59279-13.688514-8.592789-21.781722V496.583302c0-31.073925-11.290526-61.148688-31.873254-84.429153L52.385677 53.05548C34.200936 32.472751 48.888611 0 76.365554 0h871.268892c27.476943 0 42.164618 32.472751 23.979877 53.05548z" fill="${highlightColor}"></path></svg>`
    },
    styles: {
      filterMenu: {
        position: 'absolute',
        backgroundColor: fillColor,
        border: `${strokeWidth}px solid ${strokeColor}`,
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        zIndex: 99999,
        borderRadius: `${borderRadius}px`,
        color: textColor,
        fontFamily: textFontFamily,
        fontSize: `${textFontSize}px`
      },
      searchInput: {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #272a30',
        borderRadius: '4px',
        backgroundColor: '#0e1119',
        boxSizing: 'border-box',
        placeholder: '请输入关键字搜索',
        color: textColor
      },
      tabsContainer: {
        borderBottom: '0px solid #e0e0e0'
      },
      tabStyle: (isActive: boolean) => ({
        backgroundColor: 'transparent',
        border: 'none',
        flex: '1',
        padding: '10px 15px',
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? highlightColor : defaultColor,
        borderBottom: isActive ? `3px solid ${highlightColor}` : '2px solid transparent'
      }),
      countSpan: {
        color: 'transparent'
      },
      footerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderTop: '0px solid #e0e0e0',
        backgroundColor: 'transparent'
      },
      footerButton: (isPrimary: boolean) => ({
        padding: '6px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '5px',
        backgroundColor: isPrimary ? highlightColor : 'transparent',
        color: isPrimary ? defaultColor : highlightColor,
        borderColor: isPrimary ? highlightColor : 'transparent'
      }),
      clearLink: {
        color: highlightColor,
        textDecoration: 'none'
      },
      conditionContainer: {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: fillColor,
        color: textColor
      },
      formLabel: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'normal',
        backgroundColor: 'transparent',
        color: textColor
      },
      operatorSelect: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        border: '1px solid #272a30',
        borderRadius: '4px',
        backgroundColor: '#0e1119',
        color: textColor
      },
      rangeInputContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: fillColor,
        color: textColor
      }
    },
    conditionCategories: [
      { value: 'all', label: '全部' },
      { value: 'text', label: '文本' },
      { value: 'number', label: '数值' },
      { value: FilterOperatorCategory.CHECKBOX, label: '复选框' }
    ],
    checkboxItemFormat: (rawValue: any) => rawValue
  };
};

export function createTable() {
  const records = generateDemoData(30, '示例');

  const historyPlugin = new HistoryPlugin({
    maxHistory: 200,
    enableCompression: true
  });
  // const filterPlugin = new FilterPlugin(getFilterPluginOptions());
  const filterPlugin = new FilterPlugin({});

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns: [
      {
        field: 'id',
        title: '序号',
        width: 70,
        sort: true,
        editor: 'input'
      },
      {
        field: 'name',
        title: '姓名',
        width: 140,

        editor: 'input',
        sort: true
      },
      {
        field: 'department',
        title: '部门',
        width: 120,

        editor: 'input',
        sort: true
      },
      {
        field: 'fromProvince',
        title: 'From Province',
        width: 140,

        editor: 'input'
      },
      {
        field: 'toProvince',
        title: 'To Province',
        width: 140,

        editor: 'input'
      },
      {
        field: 'salary',
        title: 'Salary',
        width: 110,

        sort: true,
        editor: 'input'
      },
      {
        field: 'sales',
        title: 'Sales',
        width: 110,

        sort: true,
        editor: 'input'
      },
      {
        field: 'profit',
        title: 'Profit',
        width: 110,

        sort: true,
        editor: 'input',
        fieldFormat: (datum: any) => {
          const v = datum?.profit;
          if (v == null || Number.isNaN(v)) {
            return '';
          }
          return `￥${v}`;
        }
      }
    ],
    widthMode: 'adaptive',
    heightMode: 'standard',
    autoFillHeight: true,
    defaultRowHeight: 34,
    editor: 'input',
    editCellTrigger: ['api', 'keydown', 'doubleclick'],
    menu: {
      renderMode: 'html'
    },
    columnResizeMode: 'all',
    plugins: [historyPlugin, filterPlugin]
  };

  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;

  createToolbar({
    'Undo (Ctrl/Cmd+Z)': () => historyPlugin.undo(),
    'Redo (Ctrl/Cmd+Y)': () => historyPlugin.redo(),
    'Start Tx': () => historyPlugin.startTransaction(),
    'End Tx': () => historyPlugin.endTransaction(),
    Clear: () => historyPlugin.clear(),
    'Add Row': () => {
      const next = generateDemoData(1, '新增')[0];
      const idx = (tableInstance as any).records?.length ?? 0;
      (tableInstance as any).addRecord?.(next, idx);
    },
    'Delete Last Row': () => {
      const len = (tableInstance as any).records?.length ?? 0;
      if (len <= 0) {
        return;
      }
      (tableInstance as any).deleteRecords?.([len - 1]);
    },
    'Update First Row': () => {
      const len = (tableInstance as any).records?.length ?? 0;
      if (len <= 0) {
        return;
      }
      const old = (tableInstance as any).records?.[0] ?? {};
      const next = { ...old, name: `${old?.name ?? '员工'}_更新`, sales: Math.floor(10000 + Math.random() * 90000) };
      (tableInstance as any).updateRecords?.([next], [0]);
    }
  });

  bindDebugTool((tableInstance as any).scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
