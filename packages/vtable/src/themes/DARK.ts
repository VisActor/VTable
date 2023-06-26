import type { ITableThemeDefine, StylePropertyFunctionArg } from '../ts-types';

function getBackgroundColor(args: StylePropertyFunctionArg): string {
  const { row, table } = args;
  // if (row < table.frozenRowCount) {
  //   return "#FFF";
  // }
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
  underlayBackgroundColor: '#FFF',
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
      endColor: 'rgba(00, 24, 47, 0)'
    }
  },
  menuStyle: {
    color: '#000',
    highlightColor: '#2E68CF',
    fontSize: 12,
    fontFamily: 'sans-serif',
    highlightFont: '12px sans-serif',
    hoverBgColor: '#EEE'
  },
  selectionStyle: {
    cellBgColor: '#29364D',
    // inlineColumnBgColor: "#82b2f5",
    cellBorderColor: '#4284FF',
    cellBorderLineWidth: 2
  }
} as ITableThemeDefine;
