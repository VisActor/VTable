import type { RequiredTableThemeDefine } from '../ts-types';

export function getAxisStyle(axisStyle: RequiredTableThemeDefine['axisStyle']) {
  const style = {
    defaultAxisStyle: getSingleAxisStyle(axisStyle.defaultAxisStyle),
    leftAxisStyle: getSingleAxisStyle(axisStyle.leftAxisStyle),
    rightAxisStyle: getSingleAxisStyle(axisStyle.rightAxisStyle),
    topAxisStyle: getSingleAxisStyle(axisStyle.topAxisStyle),
    bottomAxisStyle: getSingleAxisStyle(axisStyle.bottomAxisStyle)
  };

  return style;
}

function getSingleAxisStyle(axisStyle?: RequiredTableThemeDefine['axisStyle']['defaultAxisStyle']) {
  if (!axisStyle) {
    return {};
  }

  return axisStyle; // to do: turn into get mode
}

export const defalutPoptipStyle = {
  visible: true,
  position: 'auto',
  padding: 8,
  titleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#4E5969'
  },
  contentStyle: {
    fontSize: 12,
    fill: '#4E5969'
  },
  panel: {
    visible: true,
    fill: '#fff',
    stroke: '#ffffff',
    lineWidth: 0,
    cornerRadius: 3,
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    size: 0,
    space: 12
  }
  // maxWidthPercent: 0.8
};
