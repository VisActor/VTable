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
