import type { ITableThemeDefine, StylePropertyFunctionArg } from '../ts-types';

function getBackgroundColor(args: StylePropertyFunctionArg): string {
  const { row, table } = args;
  const index = row - table.frozenRowCount;
  if (!(index & 1)) {
    return '#2d3137';
  }
  return '#282a2e';
}

/**
 * dark theme
 * @name DARK
 * @memberof VTable.themes.DARK
 */
export default {
  name: 'DARK',
  underlayBackgroundColor: 'transparent',
  // selectionBgColor: '#CCE0FF',
  defaultStyle: {
    color: '#D3D5DA',
    bgColor: '#373b45',
    fontSize: 12,
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    lineHeight: 12,
    borderColor: '#444A54',
    padding: [8, 12, 8, 12],
    hover: {
      cellBgColor: '#2F4774'
    }
    // click: {
    //   cellBgColor: 'rgba(0, 0, 255,0.1)',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#4284FF',
    //   cellBorderLineWidth: 2,
    // },
  },
  headerStyle: {
    color: '#D3D5DA',
    bgColor: '#373b45',
    fontSize: 12,
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    lineHeight: 12,
    borderColor: '#444A54',
    padding: [8, 12, 8, 12],
    hover: {
      cellBgColor: '#2F4774'
    }
    // click: {
    //   cellBgColor: '#2F4774',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#4284FF',
    //   cellBorderLineWidth: 2,
    // },
  },
  rowHeaderStyle: {},
  cornerHeaderStyle: {},
  bodyStyle: {
    color: '#e5e7ea',
    bgColor: getBackgroundColor,
    fontSize: 12,
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    lineHeight: 12,
    borderColor: '#444A54',
    padding: [8, 12, 8, 12],
    hover: {
      cellBgColor: '#29364D'
    }
    // click: {
    //   cellBgColor: '#29364D',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#4284FF',
    //   cellBorderLineWidth: 2,
    // },
  },
  frameStyle: {
    borderColor: '#d1d5da',
    borderLineWidth: 1,
    borderLineDash: [],
    cornerRadius: 10,
    shadowBlur: 6,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(00, 24, 47, 0.06)'
  },
  columnResize: {
    lineWidth: 1,
    lineColor: '#416EFF',
    bgColor: '#D9E2FF',
    width: 3
  },
  frozenColumnLine: {
    shadow: {
      width: 4,
      startColor: 'rgba(00, 24, 47, 0.05)',
      endColor: 'rgba(00, 24, 47, 0)',
      visible: 'always'
    }
  },
  // menuStyle: {
  //   color: '#000',
  //   highlightColor: '#2E68CF',
  //   fontSize: 12,
  //   fontFamily: 'Arial,sans-serif',
  //   highlightFontSize: 12,
  //   highlightFontFamily: 'Arial,sans-serif',
  //   hoverBgColor: '#EEE'
  // },
  selectionStyle: {
    cellBgColor: 'rgba(255, 255, 255, 0.1)',
    // inlineColumnBgColor: "#82b2f5",
    cellBorderColor: '#4284FF',
    cellBorderLineWidth: 2
  },
  tooltipStyle: {
    bgColor: '#FFF',
    color: '#000',
    fontSize: 12,
    fontFamily: 'Arial,sans-serif'
  },
  functionalIconsStyle: {
    sort_color: '#FFFFFF',
    sort_color_opacity: '0.75',
    sort_color_2: '#416EFF',
    sort_color_opacity_2: '1',
    frozen_color: '#FFFFFF',
    frozen_color_opacity: '0.75',
    collapse_color: '#FFF',
    collapse_color_opacity: '0.75',
    expand_color: '#FFF',
    expand_color_opacity: '0.75',
    dragReorder_color: '#FFF',
    dragReorder_color_opacity: '0.75'
  },
  // 行号列样式
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#373b45',
      borderColor: '#444A54',
      color: '#D3D5DA'
    },
    style: {
      bgColor: '#2d3137',
      color: '#D3D5DA',
      fontSize: 12
    }
  },
  // 网格线样式
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    },
    backgroundColor: '#282a2e'
  },
  // 甘特图任务条样式
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#4284FF',
      completedBarColor: '#2F4774',
      width: 20,
      cornerRadius: 8,
      borderColor: '#4284FF',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#4284FF',
      borderLineWidth: 1,
      fillColor: '#2F4774',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'PingFang SC',
      fontSize: 12,
      color: '#D3D5DA',
      textAlign: 'left'
    }
  },
  // 时间轴表头样式
  timelineHeader: {
    backgroundColor: '#373b45',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    }
  }
} as ITableThemeDefine;
