# 筛选插件

VTable 提供了功能强大的筛选插件，支持按值筛选和按条件筛选两种模式，帮助用户快速过滤和查找表格数据。

## 功能特性

- **按值筛选**：从列的所有唯一值中选择要显示的数据
- **按条件筛选**：使用操作符设置筛选条件（等于、大于、包含等）
- **多种操作符**：支持文本、数值、布尔值等不同类型的筛选操作
- **列级别控制**：可以为特定列启用或禁用筛选功能
- **状态持久化**：支持筛选状态的保存和恢复
- **智能图标**：自动显示筛选状态图标

## 筛选插件配置选项

`FilterPlugin` 筛选插件可以配置以下参数：

```typescript
export interface FilterOptions {
  /** 筛选器 ID，用于唯一标识筛选器 */
  id?: string;
  /** 筛选器图标 */
  filterIcon?: VTable.TYPES.ColumnIconOption;
  /** 筛选器激活图标 */
  filteringIcon?: VTable.TYPES.ColumnIconOption;
  /** 筛选功能启用钩子函数，返回指定列是否启用筛选功能 */
  enableFilter?: (field: number | string, column: VTable.TYPES.ColumnDefine) => boolean;
  /** 默认是否启用筛选（当 enableFilter 未定义时使用） */
  defaultEnabled?: boolean;
  /** 筛选模式：按值筛选、按条件筛选 */
  filterModes?: FilterMode[];
  /**
   * 筛选器样式
   * 如果样式配置更新, 需在更新图表之前额外调用 `filterPlugin.updateStyles`
   * */
  styles?: FilterStyles;
  /** 自定义筛选分类 */
  conditionCategories?: FilterOperatorCategoryOption[];
  /** 自定义筛选选项展示格式 */
  checkboxItemFormat?: (rawValue: any, formatValue: any) => any;
  /** 多个筛选器之间是否联动
   * @default true
   */
  syncFilterItemsState?: boolean;
}
```

### 配置参数说明

| 参数名                 | 类型                                     | 默认值                     | 说明                   |
| ---------------------- | ---------------------------------------- | -------------------------- | ---------------------- |
| `id`                   | string                                   | `filter-${Date.now()}`     | 插件实例唯一标识符     |
| `filterIcon`           | ColumnIconOption                         | 默认筛选图标               | 未激活状态的筛选图标   |
| `filteringIcon`        | ColumnIconOption                         | 默认激活图标               | 激活状态的筛选图标     |
| `enableFilter`         | function                                 | -                          | 自定义列筛选启用逻辑   |
| `defaultEnabled`       | boolean                                  | true                       | 默认是否启用筛选       |
| `filterModes`          | FilterMode[]                             | ['byValue', 'byCondition'] | 支持的筛选模式         |
| `styles`               | FilterStyles                             | -                          | 自定义筛选器样式       |
| `conditionCategories`  | FilterOperatorCategoryOption[]           | -                          | 自定义筛选分类         |
| `checkboxItemFormat`   | (rawValue: any, formatValue: any) => any | -                          | 自定义筛选选项展示格式 |
| `syncFilterItemsState` | boolean                                  | true                       | 多个筛选器之间是否联动 |

### 筛选操作符

插件支持以下筛选操作符：

**通用操作符**

- `equals` - 等于
- `notEquals` - 不等于

**数值操作符**

- `greaterThan` - 大于
- `lessThan` - 小于
- `greaterThanOrEqual` - 大于等于
- `lessThanOrEqual` - 小于等于
- `between` - 介于
- `notBetween` - 不介于

**文本操作符**

- `contains` - 包含
- `notContains` - 不包含
- `startsWith` - 开始于
- `notStartsWith` - 不开始于
- `endsWith` - 结束于
- `notEndsWith` - 不结束于

**布尔操作符**

- `isChecked` - 已选中
- `isUnchecked` - 未选中

## 使用示例

### 基本使用

```javascript
import * as VTable from '@visactor/vtable';
import { FilterPlugin } from '@visactor/vtable-plugins';

// 创建筛选插件
const filterPlugin = new FilterPlugin({});

// 创建表格配置
const option = {
  records: data,
  columns: [
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 100 },
    { field: 'department', title: '部门', width: 150 },
    { field: 'salary', title: '薪资', width: 120 }
  ],
  plugins: [filterPlugin]
};

// 创建表格实例
const tableInstance = new VTable.ListTable(document.getElementById('container'), option);
```

### 高级配置

```javascript
// 自定义筛选启用逻辑
const filterPlugin = new FilterPlugin({
  // 自定义哪些列启用筛选
  enableFilter: (field, column) => {
    // ID 列不启用筛选
    return field !== 'id' && column.title;
  },

  // 只启用按值筛选
  filterModes: ['byValue'],

  // 自定义图标
  filterIcon: {
    name: 'custom-filter',
    type: 'svg',
    width: 16,
    height: 16,
    svg: '<svg>...</svg>'
  }
});
```

### 列级别筛选控制

```javascript
const columns = [
  { field: 'name', title: '姓名', width: 120 }, // 默认启用筛选
  { field: 'age', title: '年龄', width: 100, filter: false }, // 禁用筛选
  { field: 'department', title: '部门', width: 150 } // 默认启用筛选
];
```

### 状态持久化

```javascript
// 获取当前筛选状态
const filterState = filterPlugin.getFilterState();

// 保存到本地存储
localStorage.setItem('tableFilterState', JSON.stringify(filterState));

// 从本地存储恢复
const savedState = JSON.parse(localStorage.getItem('tableFilterState'));
if (savedState) {
  filterPlugin.setFilterState(savedState);
}
```

## 完整示例

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包 @visactor/vtable-plugins
// import { FilterPlugin } from '@visactor/vtable-plugins';
// 正常使用方式 const filterPlugin = new FilterPlugin({});
// 官网编辑器中将 VTable.plugins 重命名成了 VTablePlugins

const generateDemoData = count => {
  const departments = ['研发部', '市场部', '销售部', '人事部', '财务部'];
  const statuses = ['在职', '请假', '离职'];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    age: 22 + Math.floor(Math.random() * 20),
    department: departments[i % departments.length],
    salary: 5000 + Math.floor(Math.random() * 15000),
    status: statuses[i % statuses.length],
    isFullTime: i % 3 !== 0
  }));
};

const filterPlugin = new VTablePlugins.FilterPlugin({
  filterModes: ['byValue', 'byCondition']
});

const option = {
  records: generateDemoData(50),
  columns: [
    { field: 'id', title: 'ID', width: 60 },
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 100 },
    { field: 'department', title: '部门', width: 120 },
    { field: 'salary', title: '薪资', width: 120, fieldFormat: record => '￥' + record.salary },
    { field: 'status', title: '状态', width: 100 },
    { field: 'isFullTime', title: '全职', width: 80, cellType: 'checkbox' }
  ],
  plugins: [filterPlugin]
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

## 大屏业务场景案例

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包 @visactor/vtable-plugins
// import { FilterPlugin } from '@visactor/vtable-plugins';
// 正常使用方式 const filterPlugin = new FilterPlugin({});
// 官网编辑器中将 VTable.plugins 重命名成了 VTablePlugins

const columnStyle = {
  textAlign: 'center',
  borderColor: ['rgba(63,63,86,0)', null, null, null],
  borderLineWidth: [1, 0, 0, 0],
  borderLineDash: [null, null, null, null],
  padding: [0, 0, 0, 0],
  hover: {
    cellBgColor: 'rgba(186, 215, 255, 0.7)',
    inlineRowBgColor: 'rgba(186, 215, 255, 0.3)',
    inlineColumnBgColor: 'rgba(186, 215, 255, 0.3)'
  },
  fontFamily: 'D-DIN',
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontVariant: 'normal',
  color: 'rgba(255,255,255,1)',
  lineHeight: 18,
  underline: false
};
const headerStyle = {
  textAlign: 'center',
  borderColor: [null, null, null, null],
  borderLineWidth: [null, 0, 0, 0],
  borderLineDash: [null, null, null, null],
  padding: [0, 0, 0, 0],
  hover: {
    cellBgColor: 'rgba(0, 100, 250, 0.16)',
    inlineRowBgColor: 'rgba(255, 255, 255, 0)',
    inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
  },
  frameStyle: {
    borderColor: [null, null, null, null],
    borderLineWidth: 2
  },
  fontFamily: 'SourceHanSansCN-Normal',
  fontSize: 12,
  fontVariant: 'normal',
  fontStyle: 'normal',
  fontWeight: 'bold',
  color: '#FFFFFF',
  bgColor: '#0e305c',
  lineHeight: 18,
  underline: false
};
// filter特殊配置:
// 1. syncFilterItemsState:
//  - 配置为false, 表示:
//    - 筛选面板不同步数据, 用户配置什么条件筛选器就回显什么条件, 筛选结果为多个筛选器共同作用的结果
//    - 对于值筛选而言, 配置筛选且生效后, 更新数据, 则新数据不会被自动加到已勾选配置中, 即不被选中
// 2. styles: 自定义样式
// 3. conditionCategories: 条件筛选的筛选类型
// 4. checkboxItemFormat: 通过回调保证筛选项展示为原始值
const getTableFilterPluginAttrFromProps = () => {
  const filterProps = {
    visible: false,
    fillColor: '#0E1119',
    strokeColor: '#272A30',
    strokeWidth: 0,
    borderRadius: 4,
    highlightColor: '#006EFF',
    defaultColor: '#FFF',
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
    textStyle: { color: textColor, fontFamily: textFontFamily, fontSize: textFontSize, fontWeight: fontFontWeight }
  } = filterProps;
  return {
    syncFilterItemsState: false,
    filterModes: ['byValue', 'byCondition'],
    filterIcon: {
      name: 'filter-icon',
      type: 'svg',
      width: 12,
      height: 12,
      positionType: 'right',
      cursor: 'pointer',
      marginRight: 4,
      svg: `<svg t="1752821809070" class="icon" viewBox="0 0 1664 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12092" width="200" height="200" transform="translate(0,30)"><path d="M89.6 179.2A89.6 89.6 0 0 1 89.6 0h1408a89.6 89.6 0 0 1 0 179.2H89.6z m256 384a89.6 89.6 0 0 1 0-179.2h896a89.6 89.6 0 0 1 0 179.2h-896z m256 384a89.6 89.6 0 0 1 0-179.2h384a89.6 89.6 0 0 1 0 179.2h-384z" fill="${defaultColor}" p-id="12093"></path></svg>`
    },
    filteringIcon: {
      name: 'filtering-icon',
      type: 'svg',
      width: 12,
      height: 12,
      positionType: 'right',
      cursor: 'pointer',
      marginRight: 4,
      svg: `<svg t="1752821771292" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11926" width="200" height="200" transform="translate(0,30)"><path d="M971.614323 53.05548L655.77935 412.054233C635.196622 435.434613 623.906096 465.509377 623.906096 496.583302v495.384307c0 28.975686-35.570152 43.063864-55.353551 21.781723l-159.865852-171.256294c-5.495389-5.895053-8.59279-13.688514-8.592789-21.781722V496.583302c0-31.073925-11.290526-61.148688-31.873254-84.429153L52.385677 53.05548C34.200936 32.472751 48.888611 0 76.365554 0h871.268892c27.476943 0 42.164618 32.472751 23.979877 53.05548z" fill="${highlightColor}" p-id="11927"></path></svg>`
    },
    styles: {
      // 筛选菜单
      filterMenu: {
        position: 'absolute',
        backgroundColor: fillColor,
        border: `${strokeWidth}px solid ${strokeColor}`,
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        zIndex: '100',
        borderRadius: `${borderRadius}px`,
        color: textColor,
        fontFamily: textFontFamily,
        fontSize: `${textFontSize}px`
      },

      // 搜索输入框
      searchInput: {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #272a30',
        borderRadius: '4px',
        backgroundColor: '#0e1119',
        boxSizing: 'border-box',
        // vtable内部没有做国际化, 所以这里也不做国际化
        placeholder: '请输入关键字搜索',
        color: textColor
      },
      tabsContainer: {
        borderBottom: '0px solid #e0e0e0'
      },

      // 标签样式
      tabStyle: isActive => ({
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

      // 页脚容器
      footerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderTop: '0px solid #e0e0e0',
        backgroundColor: 'transparent'
      },

      footerButton: isPrimary => ({
        padding: '6px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '5px',
        backgroundColor: isPrimary ? highlightColor : 'transparent',
        color: isPrimary ? defaultColor : highlightColor,
        borderColor: isPrimary ? highlightColor : 'transparent'
      }),

      // 清除链接
      clearLink: {
        color: highlightColor,
        textDecoration: 'none'
      },

      // 按钮样式
      buttonStyle: (isPrimary = false) => ({
        padding: '6px 12px',
        border: '1px solid #ccc',
        borderRadius: `${borderRadius}px`,
        cursor: 'pointer',
        marginLeft: '5px',
        backgroundColor: isPrimary ? highlightColor : 'white',
        color: isPrimary ? 'white' : textColor,
        borderColor: isPrimary ? highlightColor : '#ccc'
      }),

      // === 条件筛选相关样式 ===

      // 条件筛选容器
      conditionContainer: {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: fillColor,
        color: textColor
      },

      // 表单标签样式
      formLabel: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'normal',
        backgroundColor: 'transparent',
        color: textColor
      },

      // 操作符选择框样式
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
      { value: 'number', label: '数值' }
      // { value: FilterOperatorCategory.COLOR, label: '颜色' },
      // { value: FilterOperatorCategory.CHECKBOX, label: '复选框' },
      // { value: FilterOperatorCategory.RADIO, label: '单选框' }
    ],
    checkboxItemFormat: (rawValue, formatValue) => rawValue
  };
};
const filterPlugin = new VTablePlugins.FilterPlugin(getTableFilterPluginAttrFromProps());
const option = {
  columns: [
    {
      field: '0#LINE_NUMBER_DIM_ID_STR',
      title: '序号',
      width: '12%',
      style: columnStyle
    },
    {
      field: 'PZwFghHcsvwt',
      title: 'From Province',
      showSort: false,
      style: columnStyle,
      headerStyle,
      width: '29.333333333333332%'
    },
    {
      field: 'CKQPX3dQXKYk',
      title: 'To Province',
      showSort: false,
      style: columnStyle,
      headerStyle,
      width: '29.333333333333332%'
    },
    {
      firstRow: 0.8,
      field: 'RMLcpglcOTHo',
      title: 'Profit',
      showSort: false,
      style: columnStyle,
      headerStyle,
      width: '29.333333333333332%',
      fieldFormat: datum => {
        return '￥' + datum['RMLcpglcOTHo'];
      }
    }
  ],
  records: [
    {
      PZwFghHcsvwt: '河北',
      CKQPX3dQXKYk: '河南',
      RMLcpglcOTHo: 0.8,
      '0#LINE_NUMBER_DIM_ID_STR': 1,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '山西',
      CKQPX3dQXKYk: '湖北',
      RMLcpglcOTHo: 15,
      '0#LINE_NUMBER_DIM_ID_STR': 2,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '内蒙古',
      CKQPX3dQXKYk: '湖南',
      RMLcpglcOTHo: 50,
      '0#LINE_NUMBER_DIM_ID_STR': 3,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '辽宁',
      CKQPX3dQXKYk: '广东',
      RMLcpglcOTHo: 15,
      '0#LINE_NUMBER_DIM_ID_STR': 4,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '吉林',
      CKQPX3dQXKYk: '广西',
      RMLcpglcOTHo: 57,
      '0#LINE_NUMBER_DIM_ID_STR': 5,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '江西',
      CKQPX3dQXKYk: '湖南',
      RMLcpglcOTHo: 44,
      '0#LINE_NUMBER_DIM_ID_STR': 6,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '山东',
      CKQPX3dQXKYk: '福建',
      RMLcpglcOTHo: 20,
      '0#LINE_NUMBER_DIM_ID_STR': 7,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '河南',
      CKQPX3dQXKYk: '广东',
      RMLcpglcOTHo: 65,
      '0#LINE_NUMBER_DIM_ID_STR': 8,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '湖北',
      CKQPX3dQXKYk: '江西',
      RMLcpglcOTHo: 40,
      '0#LINE_NUMBER_DIM_ID_STR': 9,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    },
    {
      PZwFghHcsvwt: '湖南',
      CKQPX3dQXKYk: '湖北',
      RMLcpglcOTHo: 35,
      '0#LINE_NUMBER_DIM_ID_STR': 10,
      '0#LINE_NUMBER_ICON':
        '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
    }
  ],
  theme: {
    underlayBackgroundColor: 'rgba(255,255,255,0)',
    headerStyle,
    bodyStyle: {
      bgColor: ({ row, col }) => {
        return row % 2 === 0 ? 'rgba(16,34,58,1)' : 'rgba(12,9,41,1)';
      }
    }
  },
  transpose: false,
  widthMode: 'adaptive',
  columnResizeMode: 'all',
  heightMode: 'standard',
  heightAdaptiveMode: 'all',
  autoFillHeight: true,
  autoWrapText: true,
  maxCharactersNumber: 256,
  defaultHeaderColWidth: 'auto',
  keyboardOptions: {
    selectAllOnCtrlA: true,
    copySelected: false
  },
  menu: {
    renderMode: 'html'
  },
  disableScroll: true,
  customConfig: {
    _disableColumnAndRowSizeRound: true,
    imageMargin: 4,
    multilinesForXTable: true,
    shrinkSparklineFirst: true,
    limitContentHeight: false
  },
  frozenColCount: 0,
  showHeader: true,
  hover: {
    disableHover: true
  },
  select: {
    highlightMode: 'row',
    headerSelectMode: 'cell',
    blankAreaClickDeselect: true,
    disableSelect: true
  },
  autoHeightInAdaptiveMode: false,
  defaultRowHeight: 61.25,
  animationAppear: {
    duration: 100,
    delay: 0,
    type: 'one-by-one',
    direction: 'row'
  },
  hash: '0fa7dcedd7d638eff65f3a5bd3906361',
  width: 400,
  height: 245,
  plugins: [filterPlugin]
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

## 使用说明

1. **点击筛选图标**：点击列标题右侧的筛选图标打开筛选面板
2. **按值筛选**：在筛选面板中选择要显示的值
3. **按条件筛选**：选择操作符并输入筛选条件
4. **应用筛选**：点击"确认"按钮应用筛选条件
5. **清除筛选**：点击"清除筛选"链接移除当前列的筛选

## 注意事项

- 筛选插件目前仅支持 `ListTable`，不支持 `PivotTable`
- 使用列级别筛选控制时，需要在列定义中添加 `filter` 属性
- `syncFilterItemsState`默认为true, 此时筛选状态会在表格配置更新时自动同步
- 建议为大数据量表格启用筛选功能以提升用户体验
- 如果样式配置更新, 需在更新图表之前额外调用 `filterPlugin.updateStyles`

# 本插件贡献者及文档作者

[PoorShawn](https://github.com/PoorShawn)
