import type { ITableThemeDefine, StylePropertyFunctionArg } from '../ts-types';

function getBackgroundColor(args: StylePropertyFunctionArg): string {
  const { row, table } = args;
  const index = row - table.frozenRowCount;
  if (!(index & 1)) {
    return '#FFF';
  }
  return '#fbfbfc';
}

/**
 * arco theme
 * @name ARCO
 * @memberof VTable.themes.choices
 */
export default {
  name: 'ARCO',
  underlayBackgroundColor: '#FFF',
  // selectionBgColor: '#CCE0FF',
  defaultStyle: {
    color: '#1B1F23',
    bgColor: '#EEF1F5',
    fontSize: 14,
    fontFamily: 'Arial,sans-serif',
    fontWeight: 600,
    lineHeight: 14,
    borderColor: '#e1e4e8',
    padding: [8, 12, 8, 12]
  },
  headerStyle: {
    color: '#1B1F23',
    bgColor: '#EEF1F5',
    // 优先使用 Arial 字体，等宽能够保证数字场景长度一致，英文加粗场景 Arial 没有 500 字重，所以使用 600
    fontSize: 14,
    fontFamily: 'Arial,sans-serif',
    fontWeight: 600,
    lineHeight: 14,
    borderColor: '#e1e4e8',
    padding: [8, 12, 8, 12],
    hover: {
      cellBgColor: '#c8daf6'
    }
    // click: {
    //   cellBgColor: '#c8daf6',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#3073f2', //['#e1e4e8', '#e1e4e8', '#3073f2', '#e1e4e8'],
    //   cellBorderLineWidth: 2, // [0, 1, 3, 1],
    // },
  },
  rowHeaderStyle: {
    color: '#1B1F23',
    bgColor: '#EEF1F5',
    fontSize: 12,
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    lineHeight: 12,
    borderColor: '#e1e4e8',
    padding: [8, 12, 8, 12],
    hover: {
      cellBgColor: '#c8daf6'
    }
    // click: {
    //   cellBgColor: '#c8daf6',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#3073f2', //['#e1e4e8', '#e1e4e8', '#3073f2', '#e1e4e8'],
    //   cellBorderLineWidth: 2, // [0, 1, 3, 1],
    // },
  },
  cornerHeaderStyle: {
    color: '#1B1F23',
    bgColor: '#EEF1F5',
    fontSize: 12,
    fontFamily: 'PingFang SC',
    fontWeight: 500,
    lineHeight: 12,
    borderColor: '#e1e4e8',
    padding: [8, 12, 8, 12],
    hover: {
      cellBgColor: '#c8daf6'
    }
    // click: {
    //   cellBgColor: '#c8daf6',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#3073f2', //['#e1e4e8', '#e1e4e8', '#3073f2', '#e1e4e8'],
    //   cellBorderLineWidth: 2, // [0, 1, 3, 1],
    // },
  },
  bodyStyle: {
    padding: [8, 12, 8, 12],
    color: '#141414',
    fontSize: 14,
    fontFamily: 'Arial,sans-serif',
    fontWeight: 400,
    textAlign: 'left',
    bgColor: getBackgroundColor,
    borderColor: '#e1e4e8',
    lineHeight: 14,
    hover: {
      cellBgColor: '#F7F8FA',
      inlineRowBgColor: '#F3F8FF',
      inlineColumnBgColor: '#F3F8FF'
    }
    // click: {
    //   cellBgColor: 'rgba(0, 0, 255,0.1)',
    //   cellBorderLineWidth: 2,
    //   inlineColumnBgColor: '#CCE0FF',
    //   inlineRowBgColor: '#00E0FF',
    //   cellBorderColor: '#3073f2',
    // },
  },
  frameStyle: {
    borderColor: '#d1d5da',
    borderLineWidth: 1,
    borderLineDash: [],
    cornerRadius: 4,
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
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8',
      color: '#1B1F23'
    },
    style: {
      bgColor: '#FFF',
      color: '#1B1F23',
      fontSize: 14
    }
  },
  // 网格线样式
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    backgroundColor: '#FFF'
  },
  // 甘特图任务条样式
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#ee8800',
      completedBarColor: '#91e8e0',
      width: 20,
      cornerRadius: 8,
      borderColor: 'black',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#3073f2',
      borderLineWidth: 1,
      fillColor: '#c8daf6',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#1B1F23',
      textAlign: 'left'
    }
  },
  // 时间轴表头样式
  timelineHeader: {
    backgroundColor: '#EEF1F5',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
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
    cellBgColor: 'rgba(0, 0, 255,0.1)',
    cellBorderLineWidth: 2,
    cellBorderColor: '#3073f2'
  },
  tooltipStyle: {
    bgColor: '#FFF',
    color: '#000',
    fontSize: 12,
    fontFamily: 'Arial,sans-serif'
  }
} as ITableThemeDefine;
