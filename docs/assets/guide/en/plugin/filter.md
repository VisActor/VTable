# Filter Plugin

VTable provides a powerful filter plugin that supports both value-based filtering and condition-based filtering modes, helping users quickly filter and search table data.

## Features

- **Value-based filtering**: Select data to display from all unique values in a column
- **Condition-based filtering**: Set filter conditions using operators (equals, greater than, contains, etc.)
- **Multiple operators**: Support filtering operations for different data types (text, numeric, boolean)
- **Column-level control**: Enable or disable filtering for specific columns
- **State persistence**: Support saving and restoring filter states
- **Smart icons**: Automatically display filter status icons

## Filter Plugin Configuration Options

`FilterPlugin` can be configured with the following parameters:

```typescript
export interface FilterOptions {
  /** Filter ID for unique identification */
  id?: string;
  /** Filter icon */
  filterIcon?: VTable.TYPES.ColumnIconOption;
  /** Active filter icon */
  filteringIcon?: VTable.TYPES.ColumnIconOption;
  /** Hook function to determine if filtering is enabled for a column */
  enableFilter?: (field: number | string, column: VTable.TYPES.ColumnDefine) => boolean;
  /** Default enabled state when enableFilter is not defined */
  defaultEnabled?: boolean;
  /** Filter modes: value-based filtering, condition-based filtering */
  filterModes?: FilterMode[];
  /**
   * Filter styles
   * If style configuration is updated, you need to additionally call `filterPlugin.updateStyles` before updating the chart
   */
  styles?: FilterStyles;
  /** Custom filter categories */
  conditionCategories?: FilterOperatorCategoryOption[];
  /** Custom filter option display format */
  checkboxItemFormat?: (rawValue: any, formatValue: any) => any;
  /** Whether multiple filters are linked
   * @default true
   */
  syncFilterItemsState?: boolean;
}
```

### Configuration Parameters

| Parameter              | Type                                     | Default                    | Description                         |
| ---------------------- | ---------------------------------------- | -------------------------- | ----------------------------------- |
| `id`                   | string                                   | `filter-${Date.now()}`     | Plugin instance unique identifier   |
| `filterIcon`           | ColumnIconOption                         | Default filter icon        | Filter icon for inactive state      |
| `filteringIcon`        | ColumnIconOption                         | Default active icon        | Filter icon for active state        |
| `enableFilter`         | function                                 | -                          | Custom column filter enable logic   |
| `defaultEnabled`       | boolean                                  | true                       | Default filter enabled state        |
| `filterModes`          | FilterMode[]                             | ['byValue', 'byCondition'] | Supported filter modes              |
| `styles`               | FilterStyles                             | -                          | Custom filter styles                |
| `conditionCategories`  | FilterOperatorCategoryOption[]           | -                          | Custom filter categories            |
| `checkboxItemFormat`   | (rawValue: any, formatValue: any) => any | -                          | Custom filter option display format |
| `syncFilterItemsState` | boolean                                  | true                       | Whether multiple filters are linked |

### Filter Operators

The plugin supports the following filter operators:

**General Operators**

- `equals` - Equals
- `notEquals` - Not equals

**Numeric Operators**

- `greaterThan` - Greater than
- `lessThan` - Less than
- `greaterThanOrEqual` - Greater than or equal
- `lessThanOrEqual` - Less than or equal
- `between` - Between
- `notBetween` - Not between

**Text Operators**

- `contains` - Contains
- `notContains` - Does not contain
- `startsWith` - Starts with
- `notStartsWith` - Does not start with
- `endsWith` - Ends with
- `notEndsWith` - Does not end with

**Boolean Operators**

- `isChecked` - Is checked
- `isUnchecked` - Is unchecked

## Usage Examples

### Basic Usage

```javascript
import * as VTable from '@visactor/vtable';
import { FilterPlugin } from '@visactor/vtable-plugins';

// Create filter plugin
const filterPlugin = new FilterPlugin({});

// Create table configuration
const option = {
  records: data,
  columns: [
    { field: 'name', title: 'Name', width: 120 },
    { field: 'age', title: 'Age', width: 100 },
    { field: 'department', title: 'Department', width: 150 },
    { field: 'salary', title: 'Salary', width: 120 }
  ],
  plugins: [filterPlugin]
};

// Create table instance
const tableInstance = new VTable.ListTable(document.getElementById('container'), option);
```

### Advanced Configuration

```javascript
// Custom filter enable logic
const filterPlugin = new FilterPlugin({
  // Customize which columns enable filtering
  enableFilter: (field, column) => {
    // ID column does not enable filtering
    return field !== 'id' && column.title;
  },

  // Only enable value-based filtering
  filterModes: ['byValue'],

  // Custom icons
  filterIcon: {
    name: 'custom-filter',
    type: 'svg',
    width: 16,
    height: 16,
    svg: '<svg>...</svg>'
  }
});
```

### Column-level Filter Control

```javascript
const columns = [
  { field: 'name', title: 'Name', width: 120 }, // Default enable filtering
  { field: 'age', title: 'Age', width: 100, filter: false }, // Disable filtering
  { field: 'department', title: 'Department', width: 150 } // Default enable filtering
];
```

### State Persistence

```javascript
// Get current filter state
const filterState = filterPlugin.getFilterState();

// Save to local storage
localStorage.setItem('tableFilterState', JSON.stringify(filterState));

// Restore from local storage
const savedState = JSON.parse(localStorage.getItem('tableFilterState'));
if (savedState) {
  filterPlugin.setFilterState(savedState);
}
```

## Complete Example

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// When using, you need to import the plugin package @visactor/vtable-plugins
// import { FilterPlugin } from '@visactor/vtable-plugins';
// Normal usage: const filterPlugin = new FilterPlugin({});
// In the website editor, VTable.plugins is renamed to VTablePlugins

const generateDemoData = count => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses = ['Active', 'On Leave', 'Inactive'];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
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
    { field: 'name', title: 'Name', width: 120 },
    { field: 'age', title: 'Age', width: 100 },
    { field: 'department', title: 'Department', width: 120 },
    { field: 'salary', title: 'Salary', width: 120, fieldFormat: record => '$' + record.salary },
    { field: 'status', title: 'Status', width: 100 },
    { field: 'isFullTime', title: 'Full Time', width: 80, cellType: 'checkbox' }
  ],
  plugins: [filterPlugin]
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

## Large Screen Business Scenario Examples

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// When using, you need to import the plugin package @visactor/vtable-plugins
// import { FilterPlugin } from '@visactor/vtable-plugins';
// Normal usage: const filterPlugin = new FilterPlugin({});
// In the website editor, VTable.plugins is renamed to VTablePlugins
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
// Special filter configuration:
// 1. syncFilterItemsState:
//  - When set to false, it means:
//    - The filter panel does not sync with data, the filter displays whatever conditions the user configures, and the filter result is the combined effect of multiple filters
//    - For value filtering, after configuring and applying filters, when data is updated, new data will not be automatically added to the checked configuration, i.e., will not be selected
// 2. styles: Custom styles
// 3. conditionCategories: Filter types for condition-based filtering
// 4. checkboxItemFormat: Ensure filter options display as original values through callback
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

      clearLink: {
        color: highlightColor,
        textDecoration: 'none'
      },

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

## Usage Instructions

1. **Click filter icon**: Click the filter icon on the right side of the column header to open the filter panel
2. **Value-based filtering**: Select values to display in the filter panel
3. **Condition-based filtering**: Select operators and input filter conditions
4. **Apply filter**: Click the "Confirm" button to apply filter conditions
5. **Clear filter**: Click the "Clear Filter" link to remove filters for the current column

## Notes

- The filter plugin currently only supports `ListTable`, not `PivotTable`
- When using column-level filter control, you need to add the `filter` property to column definitions
- `syncFilterItemsState` defaults to true, in which case the filter state will automatically sync when the table configuration is updated
- It is recommended to enable filtering for large data tables to improve user experience
- If the style configuration is updated, you need to additionally call `filterPlugin.updateStyles` before updating the chart

# This plugin was contributed by

[PoorShawn](https://github.com/PoorShawn)
