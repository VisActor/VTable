/*eslint no-bitwise:0*/

import type { ITableThemeDefine, StylePropertyFunctionArg } from '../ts-types';

function getBackgroundColor(args: StylePropertyFunctionArg): string {
  const { row, table } = args;
  // if (row < table.frozenRowCount) {
  //   return "#FFF";
  // }
  const index = row - table.frozenRowCount;
  if (!(index & 1)) {
    return '#FAF9FB';
  }
  return '#FDFDFD';
}

/**
 * default theme
 * @name DEFAULT
 * @memberof VTable.themes.DEFAULT
 */
export default {
  name: 'DEFAULT',
  underlayBackgroundColor: '#FFF',
  // selectionBgColor: '#CCE0FF',
  defaultStyle: {
    borderColor: '#E1E4E8',
    color: '#000',
    bgColor: '#ECF1F5'
  },
  headerStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    bgColor: '#ECF1F5',
    hover: {
      //   cellBorderColor: "#003fff",
      cellBgColor: '#CCE0FF',
      inlineRowBgColor: '#F3F8FF',
      inlineColumnBgColor: '#F3F8FF'
    }
    // click: {
    //   cellBgColor: '#82b2f5',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#0000ff',
    //   cellBorderLineWidth: 2, // [0, 1, 3, 1],
    // },
  },
  rowHeaderStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    bgColor: '#ECF1F5',
    // click: {
    //   cellBgColor: '#82b2f5',
    //   // inlineColumnBgColor: "#82b2f5",
    //   cellBorderColor: '#0000ff',
    //   cellBorderLineWidth: 2, // [0, 1, 3, 1],
    // },
    hover: {
      //   cellBorderColor: "#003fff",
      cellBgColor: '#CCE0FF',
      inlineRowBgColor: '#F3F8FF',
      inlineColumnBgColor: '#F3F8FF'
    }
  },
  cornerHeaderStyle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  bodyStyle: {
    fontSize: 14,
    bgColor: getBackgroundColor,
    hover: {
      // cellBorderColor: "#003fff",
      cellBgColor: '#CCE0FF',
      inlineRowBgColor: '#F3F8FF',
      inlineColumnBgColor: '#F3F8FF'
      // cellBorderLineWidth:2
    }
    // click: {
    //   cellBgColor: 'rgba(0, 0, 255,0.1)',
    //   cellBorderLineWidth: 2,
    //   inlineColumnBgColor: '#CCE0FF',
    //   inlineRowBgColor: '#CCE0FF',
    //   cellBorderColor: '#0000ff',
    // },
  },
  frameStyle: {
    borderColor: '#E1E4E8',
    borderLineWidth: 1,
    borderLineDash: [],
    cornerRadius: 0,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'black'
  },
  columnResize: {
    lineWidth: 1,
    lineColor: '#416EFF',
    bgColor: '#D9E2FF',
    width: 3
  },
  frozenColumnLine: {
    shadow: {
      width: 3,
      startColor: 'rgba(225, 228, 232, 0.6)',
      endColor: 'rgba(225, 228, 232, 0.6)',
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
    cellBgColor: 'rgba(0, 0, 255,0.1)',
    cellBorderLineWidth: 2,
    cellBorderColor: '#0000ff'
  },
  tooltipStyle: {
    bgColor: '#FFF',
    color: '#000',
    fontSize: 12,
    fontFamily: 'Arial,sans-serif'
  },
  // 行号列样式
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#ECF1F5',
      borderColor: '#E1E4E8',
      color: '#000'
    },
    style: {
      bgColor: '#FAF9FB',
      color: '#000',
      fontSize: 14
    }
  },
  // 网格线样式
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    },
    backgroundColor: '#FDFDFD'
  },
  // 甘特图任务条样式
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#3073f2',
      completedBarColor: '#CCE0FF',
      width: 20,
      cornerRadius: 8,
      borderColor: '#3073f2',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#3073f2',
      borderLineWidth: 1,
      fillColor: '#CCE0FF',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#000',
      textAlign: 'left'
    }
  },
  // 时间轴表头样式
  timelineHeader: {
    backgroundColor: '#ECF1F5',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    }
  }
} as ITableThemeDefine;
