/*eslint no-bitwise:0*/

import type { ITableThemeDefine, StylePropertyFunctionArg } from '../ts-types';

function getFrozenRowsBorderColor(args: StylePropertyFunctionArg): string[] {
  const {
    row,
    table: { frozenRowCount }
  } = args;
  if (frozenRowCount - 1 === row) {
    return ['#f2f2f2', '#f2f2f2', '#ccc7c7', '#f2f2f2'];
  }
  return ['#f2f2f2'];
}
function getBorderColor(args: StylePropertyFunctionArg): (string | null)[] {
  const { col, table } = args;
  const { colCount, frozenColCount } = table;
  const top: string | null = '#ccc7c7';
  const bottom: string | null = '#ccc7c7';
  // if (recordRowCount > 1) {
  //   const startRow = table.getRecordStartRowByRecordIndex(row);
  //   const endRow = startRow + recordRowCount - 1;
  //   if (startRow !== row) {
  //     top = null;
  //   }
  //   if (endRow !== row) {
  //     bottom = null;
  //   }
  // }
  if (frozenColCount - 1 === col) {
    return [top, '#f2f2f2', bottom, null];
  }
  if (colCount - 1 === col) {
    return [top, '#f2f2f2', bottom, null];
  }

  return [top, null, bottom, null];
}
/**
 * material design theme
 * @name SIMPLIFY
 * @memberof VTable.themes.choices
 */
export default {
  name: 'SIMPLIFY',
  // selectionBgColor: '#CCE0FF',
  underlayBackgroundColor: '#FFF',

  defaultStyle: {
    borderColor: getBorderColor,
    // click: { cellBorderColor: '#FD5', cellBgColor: '#6FA8DC' },
    hover: { cellBorderColor: '#0000FF', cellBgColor: '#D0E0E3' },
    bgColor: '#FFF'
  },
  headerStyle: {
    color: 'rgba(0, 0, 0, 0.87)',
    borderColor: getFrozenRowsBorderColor
  },
  bodyStyle: {
    // rowsBgColor:'#FFF',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  frameStyle: {
    borderColor: '#f2f2f2',
    borderLineWidth: 1
  },
  columnResize: {
    lineWidth: 1,
    lineColor: '#416EFF',
    bgColor: '#D9E2FF'
  },
  selectionStyle: { cellBorderColor: '#FD5', cellBgColor: 'rgba(111, 168, 220, 0.1)' },
  tooltipStyle: {
    bgColor: '#FFF',
    color: '#000',
    fontSize: 12,
    fontFamily: 'Arial,sans-serif'
  },
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#FFF',
      borderColor: '#f2f2f2',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    style: {
      bgColor: '#FFF',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: 14
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#ccc7c7'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#ccc7c7'
    },
    backgroundColor: '#FFF'
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#6FA8DC',
      completedBarColor: '#D0E0E3',
      width: 20,
      cornerRadius: 8,
      borderColor: '#6FA8DC',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#6FA8DC',
      borderLineWidth: 1,
      fillColor: '#D0E0E3',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.87)',
      textAlign: 'left'
    }
  },
  timelineHeader: {
    backgroundColor: '#FFF',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f2f2f2'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#ccc7c7'
    }
  }
} as ITableThemeDefine;
