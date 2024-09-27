import type { ITableThemeDefine, StylePropertyFunctionArg } from '../ts-types';

function getBackgroundColor(args: StylePropertyFunctionArg): string {
  const { row, table } = args;
  // if (row < table.frozenRowCount) {
  //   return "#FFF";
  // }
  const index = row - table.frozenRowCount;
  if (!(index & 1)) {
    return '#F4F8FF';
  }
  return '#FFF';
}

/**
 * basic theme
 * @name BRIGHT
 * @memberof VTable.themes.choices
 */
export default {
  name: 'BRIGHT',
  underlayBackgroundColor: '#FFF',
  // selectionBgColor: '#CCE0FF',
  defaultStyle: {
    color: '#FFF',
    bgColor: '#5389FF',
    borderColor: '#5286FA',
    hover: {
      cellBgColor: '#2E67E3'
    }
    // click: {
    //   cellBgColor: '#2E67E3',
    // },
  },
  headerStyle: {
    color: '#FFF',
    bgColor: '#5389FF',
    borderColor: '#A1C1FF',
    hover: {
      //   cellBorderColor: "#003fff",
      cellBgColor: '#2E67E3'
    }
    // click: {
    //   cellBgColor: '#2E67E3',
    // },
  },

  bodyStyle: {
    color: '#000',
    bgColor: getBackgroundColor,
    borderColor: '#E0EAFE',
    hover: {
      cellBgColor: '#E9EFFD'
    }
    // click: {
    //   cellBgColor: 'rgba(0, 0, 255,0.1)',
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
      startColor: '#CBDCFE',
      endColor: '#CBDCFE'
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
    cellBgColor: 'rgba(0, 0, 255,0.1)'
  },
  tooltipStyle: {
    bgColor: '#FFF',
    color: '#000',
    fontSize: 12,
    fontFamily: 'Arial,sans-serif'
  }
} as ITableThemeDefine;
