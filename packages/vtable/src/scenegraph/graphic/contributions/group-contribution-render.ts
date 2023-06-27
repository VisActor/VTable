import { injectable } from 'inversify';
import type {
  IGroup,
  IContext2d,
  IGroupGraphicAttribute,
  IMarkAttribute,
  IGraphicAttribute,
  IThemeAttribute,
  IGroupRenderContribution
} from '@visactor/vrender';
import { BaseRenderContributionTime } from '@visactor/vrender';
import type { Group } from '../group';
import { getCellHoverColor } from '../../../state/hover/is-cell-hover';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getQuadProps } from '../../utils/padding';
import { getCellMergeInfo } from '../../utils/get-cell-merge';

// const highlightDash: number[] = [];

// SplitGroupContribution处理分段渲染stroke
// stroke/strokeArrayWidth/strokeArrayColor 为数组时调用
@injectable()
export class SplitGroupBeforeRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    const {
      stroke = groupAttribute.stroke,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor
      // highlightStroke = (groupAttribute as any).highlightStroke,
      // highlightStrokeArrayWidth = (groupAttribute as any).highlightStrokeArrayWidth,
      // width = groupAttribute.width,
      // height = groupAttribute.height,
    } = group.attribute as any;

    if (stroke && (Array.isArray(strokeArrayWidth) || Array.isArray(strokeArrayColor))) {
      doFillOrStroke.doStroke = false;
    }

    // if (highlightStroke) {
    //   // 依据highlightStroke信息调整clip范围，以实现在单个单元格显示highlight border
    //   let xDist = x;
    //   let yDist = y;
    //   let widthDist = width;
    //   let heightDist = height;
    //   if (highlightStroke[0] && highlightStrokeArrayWidth[0]) {
    //     // top
    //     yDist -= highlightStrokeArrayWidth[0] / 2;
    //     heightDist += highlightStrokeArrayWidth[0] / 2;
    //   }
    //   if (highlightStroke[1] && highlightStrokeArrayWidth[1]) {
    //     // right
    //     widthDist += highlightStrokeArrayWidth[1] / 2;
    //   }
    //   if (highlightStroke[2] && highlightStrokeArrayWidth[2]) {
    //     // bottom
    //     heightDist += highlightStrokeArrayWidth[2] / 2;
    //   }
    //   if (highlightStroke[3] && highlightStrokeArrayWidth[3]) {
    //     // left
    //     xDist -= highlightStrokeArrayWidth[3] / 2;
    //     widthDist += highlightStrokeArrayWidth[3] / 2;
    //   }

    //   context.beginPath();
    //   context.rect(xDist, yDist, widthDist, heightDist);
    // }
  }
}
@injectable()
export class SplitGroupAfterRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const {
      width = groupAttribute.width,
      height = groupAttribute.height,
      // 基础border
      stroke = groupAttribute.stroke,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth,

      lineWidth = groupAttribute.lineWidth,
      strokeColor = groupAttribute.stroke
      // // select & hover border
      // highlightStroke = (groupAttribute as any).highlightStroke,
      // highlightStrokeArrayColor = (groupAttribute as any).highlightStrokeArrayColor,
      // highlightStrokeArrayWidth = (groupAttribute as any).highlightStrokeArrayWidth,
      // highlightStrokeArrayPart = (groupAttribute as any).highlightStrokeArrayPart,
    } = group.attribute as any;

    // lineWidth === 0 不绘制
    if (!stroke || (!Array.isArray(strokeArrayWidth) && lineWidth === 0)) {
      return;
    }

    if (Array.isArray(strokeArrayColor) || Array.isArray(strokeArrayWidth)) {
      if (
        (typeof lineWidth === 'number' && lineWidth & 1) ||
        (Array.isArray(strokeArrayWidth) && strokeArrayWidth.some(width => width & 1))
      ) {
        x = Math.floor(x) + 0.5;
        y = Math.floor(y) + 0.5;
      }
      renderStroke(
        group,
        context,
        x,
        y,
        groupAttribute,
        stroke,
        strokeArrayWidth || lineWidth,
        strokeArrayColor || strokeColor,
        Math.ceil(width),
        Math.ceil(height)
      );
    }
  }
}

/**
 * @description: 判断线宽是否需要分别渲染（线宽不同）
 * @param {number} widthArray
 * @return {*}
 */
export function getWidthInfo(widthArray: number[] | number) {
  if (!Array.isArray(widthArray)) {
    return {
      isSplitDraw: false,
      width: widthArray
    };
  }

  let temp;
  for (let i = 0; i < widthArray.length; i++) {
    const width = widthArray[i];
    if (width) {
      if (!temp) {
        temp = width;
      } else if (width !== temp) {
        return {
          isSplitDraw: true
        };
      }
    }
  }

  return {
    isSplitDraw: false,
    width: temp
  };
}

export function renderStroke(
  group: IGroup,
  context: IContext2d,
  x: number,
  y: number,
  groupAttribute: Required<IGroupGraphicAttribute>,
  stroke: boolean | [boolean, boolean, boolean, boolean],
  strokeArrayWidth: [number, number, number, number] | undefined,
  strokeArrayColor: [string, string, string, string] | undefined,
  width: number,
  height: number,
  isHighlight?: boolean,
  part?: ([number, number] | undefined)[]
) {
  const widthInfo = getWidthInfo(strokeArrayWidth);
  const isWidthNumber = !Array.isArray(strokeArrayWidth);
  const isStrokeTrue = !Array.isArray(stroke);
  // 渲染部分线段，part: [[0, 0.5], undifined, undifined, undifined]
  // 同样上右下左，范围0-1，[0, 0.5]即只渲染前一半
  const isPart = Array.isArray(part);
  const isSplitDraw = Array.isArray(strokeArrayColor) || widthInfo.isSplitDraw;

  context.setStrokeStyle(group, group.attribute, x, y, groupAttribute);
  // if (isHighlight) {
  //   context.setLineDash(highlightDash);
  //   context.lineCap = 'square';
  // }
  const lineDash = context.getLineDash();
  let isDash = false;
  if (lineDash.length) {
    isDash = true;
  }
  // 单独处理每条边界，目前不考虑圆角
  context.beginPath();
  context.moveTo(x, y);

  // top
  if ((isStrokeTrue || stroke[0]) && (isWidthNumber || strokeArrayWidth[0])) {
    // context.lineTo(x + width, y);
    if (isPart && Array.isArray(part[0])) {
      context.moveTo(x + width * part[0][0], y);
      context.lineTo(x + width * (part[0][1] - part[0][0]), y);
      context.moveTo(x + width, y);
    } else {
      context.moveTo(x, y);
      context.lineTo(x + width, y);
    }
    if ((isSplitDraw || isDash) && (!strokeArrayColor || strokeArrayColor[0])) {
      if (strokeArrayColor) {
        context.strokeStyle = strokeArrayColor[0];
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[0];
      }
      context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
      context.stroke();
      context.beginPath();
      context.moveTo(x + width, y);
    }
  } else {
    context.moveTo(x + width, y);
  }
  // right
  if ((isStrokeTrue || stroke[1]) && (isWidthNumber || strokeArrayWidth[1])) {
    // context.lineTo(x + width, y + height);
    if (isPart && Array.isArray(part[1])) {
      context.moveTo(x + width, y + height * part[1][0]);
      context.lineTo(x + width, y + height * (part[1][1] - part[1][0]));
      context.moveTo(x + width, y + height);
    } else {
      context.moveTo(x + width, y);
      context.lineTo(x + width, y + height);
    }
    if ((isSplitDraw || isDash) && (!strokeArrayColor || strokeArrayColor[1])) {
      if (strokeArrayColor) {
        context.strokeStyle = strokeArrayColor[1];
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[1];
      }
      context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
      context.stroke();
      context.beginPath();
      context.moveTo(x + width, y + height);
    }
  } else {
    context.moveTo(x + width, y + height);
  }
  // bottom
  if ((isStrokeTrue || stroke[2]) && (isWidthNumber || strokeArrayWidth[2])) {
    // context.lineTo(x, y + height);
    if (isPart && Array.isArray(part[2])) {
      context.moveTo(x + width * part[2][0], y + height);
      context.lineTo(x + width * (part[2][1] - part[2][0]), y + height);
      context.moveTo(x, y + height);
    } else {
      context.moveTo(x, y + height);
      context.lineTo(x + width, y + height);
    }
    if ((isSplitDraw || isDash) && (!strokeArrayColor || strokeArrayColor[2])) {
      if (strokeArrayColor) {
        context.strokeStyle = strokeArrayColor[2];
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[2];
      }
      context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
      context.stroke();
      context.beginPath();
      context.moveTo(x, y + height);
    }
  } else {
    context.moveTo(x, y + height);
  }
  // left
  if ((isStrokeTrue || stroke[3]) && (isWidthNumber || strokeArrayWidth[3])) {
    // context.lineTo(x, y);
    if (isPart && Array.isArray(part[3])) {
      context.moveTo(x, y + height * part[3][0]);
      context.lineTo(x, y + height * (part[3][1] - part[3][0]));
      context.moveTo(x, y);
    } else {
      context.moveTo(x, y);
      context.lineTo(x, y + height);
    }
    if ((isSplitDraw || isDash) && (!strokeArrayColor || strokeArrayColor[3])) {
      if (strokeArrayColor) {
        context.strokeStyle = strokeArrayColor[3];
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[3];
      }
      context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    }
  } else {
    context.moveTo(x, y);
  }

  if (!isSplitDraw && !isDash) {
    // context.strokeStyle = strokeArrayColor;
    if (!isWidthNumber && widthInfo.width) {
      context.lineWidth = widthInfo.width;
    }
    context.stroke();
  }
}

// DashGroupContribution处理虚线边框对齐
// lineDash 为非空数组时调用
@injectable()
export class DashGroupBeforeRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    const {
      lineDash = groupAttribute.lineDash,
      stroke = groupAttribute.stroke,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth
    } = group.attribute as any;

    if (
      stroke &&
      Array.isArray(lineDash) &&
      lineDash.length &&
      !Array.isArray(strokeArrayColor) &&
      !Array.isArray(strokeArrayWidth)
    ) {
      doFillOrStroke.doStroke = false;
    }
  }
}
@injectable()
export class DashGroupAfterRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const {
      lineDash = groupAttribute.lineDash,
      stroke = groupAttribute.stroke,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth,
      lineWidth = groupAttribute.lineWidth
    } = group.attribute as any;

    if (
      !stroke ||
      !(Array.isArray(lineDash) && lineDash.length) ||
      Array.isArray(strokeArrayColor) ||
      Array.isArray(strokeArrayWidth)
    ) {
      return;
    }

    // const { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;
    let { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;
    width = Math.ceil(width);
    height = Math.ceil(height);

    if (lineWidth & 1) {
      x = Math.floor(x) + 0.5;
      y = Math.floor(y) + 0.5;
    }
    context.setStrokeStyle(group, group.attribute, x, y, groupAttribute);
    // 分段设置lineDashOffset，实现虚线边框对齐
    // top
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
    context.stroke();

    // right
    context.beginPath();
    context.moveTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
    context.stroke();

    // bottom
    context.beginPath();
    context.moveTo(x, y + height);
    context.lineTo(x + width, y + height);
    context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
    context.stroke();

    // left
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + height);
    context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
    context.stroke();
  }
}

// AdjustPosGroupContribution处理线宽为奇数时stroke位置偏移0.5px
// lineWidth 为奇数时调用
@injectable()
export class AdjustPosGroupBeforeRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    const {
      lineWidth = groupAttribute.lineWidth,
      stroke = groupAttribute.stroke,
      lineDash = groupAttribute.lineDash,
      // width = groupAttribute.width,
      // height = groupAttribute.height,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor
    } = group.attribute as any;

    if (
      stroke &&
      Array.isArray(lineDash) &&
      !lineDash.length && // 非虚线
      !Array.isArray(strokeArrayColor) &&
      !Array.isArray(strokeArrayWidth) &&
      lineWidth & 1 // 奇数线宽
    ) {
      doFillOrStroke.doStroke = false;
    }
  }
}

@injectable()
export class AdjustPosGroupAfterRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const {
      lineWidth = groupAttribute.lineWidth,
      stroke = groupAttribute.stroke,
      lineDash = groupAttribute.lineDash,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor
    } = group.attribute as any;

    let { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;
    width = Math.ceil(width);
    height = Math.ceil(height);

    if (
      stroke &&
      Array.isArray(lineDash) &&
      !lineDash.length && // 非虚线
      !Array.isArray(strokeArrayColor) &&
      !Array.isArray(strokeArrayWidth) &&
      lineWidth & 1 // 奇数线宽
    ) {
      if (group.role === 'cell') {
        const table = (group.stage as any).table as BaseTableAPI;
        let col = (group as any).col as number;
        let row = (group as any).row as number;
        const mergeInfo = getCellMergeInfo(table, col, row);
        if (mergeInfo) {
          col = mergeInfo.end.col;
          row = mergeInfo.end.row;
        }

        if (table && col === table.colCount - 1) {
          width -= 1;
        } else if (table && col === table.frozenColCount - 1 && table.scrollLeft) {
          width -= 1;
        }
        if (table && row === table.rowCount - 1) {
          height -= 1;
        } else if (table && row === table.frozenRowCount - 1 && table.scrollTop) {
          height -= 1;
        }
      }
      context.beginPath();
      x = Math.floor(x) + 0.5;
      y = Math.floor(y) + 0.5;
      context.rect(x, y, width, height);
      context.setStrokeStyle(group, group.attribute, x, y, groupAttribute);
      context.stroke();
    }
  }
}

@injectable()
export class AdjustColorGroupBeforeRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    // 处理hover颜色
    if ((group as Group).role === 'cell') {
      const table = (group.stage as any).table as BaseTableAPI;
      const hoverColor = getCellHoverColor(group as Group, table);
      if (hoverColor) {
        (group as any).oldColor = group.attribute.fill;
        group.attribute.fill = hoverColor;
      }
    }
  }
}

@injectable()
export class AdjustColorGroupAfterRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    // 处理hover颜色
    if ('oldColor' in group) {
      group.attribute.fill = group.oldColor as any;
      delete group.oldColor;
    }
  }
}
