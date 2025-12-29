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
          zIndex: 99999,
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
      checkboxItemFormat: (rawValue, formatValue) => rawValue,
      onFilterRecordsEnd: records => {
        console.log('records', records);
        records.push(null);
        // return records;
      }
    };
  };
  const filterPlugin = new FilterPlugin(getTableFilterPluginAttrFromProps());
  const option = {
    container: document.getElementById(CONTAINER_ID),
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
          return '￥' + datum.RMLcpglcOTHo;
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
    // animationAppear: {
    //   duration: 100,
    //   delay: 0,
    //   type: 'one-by-one',
    //   direction: 'row'
    // },
    hash: '0fa7dcedd7d638eff65f3a5bd3906361',
    width: 400,
    height: 245,
    plugins: [filterPlugin]
  };

  const tableInstance = new VTable.ListTable(option);

  window.tableInstance = tableInstance;

  // 数据更新
  // setTimeout(() => {
  //   filterPlugin.updatePluginOptions({
  //     styles: {
  //       searchInput: {
  //         placeholder: 'xxx',
  //         color: 'blue'
  //       },
  //       optionItem: {
  //         display: 'flex',
  //         justifyContent: 'space-between',
  //         alignItems: 'center',
  //         padding: '8px 5px',
  //         color: 'blue'
  //       },
  //       filterMenu: {
  //         color: 'red'
  //       }
  //     },
  //     onFilterRecordsEnd: records => {
  //       console.log('onFilterRecordsEnd-2');
  //       records.push(null, undefined);
  //     }
  //   });
  //   console.log('update');
  //   tableInstance.updateOption({
  //     ...option,
  //     plugins: [filterPlugin],
  //     records: [...generateDemoData(50, '第二次'), null, undefined]
  //   });
  // }, 2000);

  // 插件更新
  // setTimeout(() => {
  //   console.log('update');
  //   tableInstance.updateOption({
  //     ...option,
  //     plugins: [filterPlugin]
  //   });
  // }, 8000);

  // 实例释放
  // setTimeout(() => {
  //   tableInstance.release();
  // }, 3000);

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
