import type {
  IGroup,
  IContext2d,
  IGroupGraphicAttribute,
  IMarkAttribute,
  IGraphicAttribute,
  IThemeAttribute,
  IGroupRenderContribution,
  IDrawContext,
  IRectGraphicAttribute
} from '@src/vrender';
import { BaseRenderContributionTime, injectable, createRectPath } from '@src/vrender';
import type { Group } from '../group';
import { getCellHoverColor } from '../../../state/hover/is-cell-hover';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getCellMergeInfo } from '../../utils/get-cell-merge';
import { InteractionState } from '../../../ts-types';
import { isArray } from '@visactor/vutils';
import { getCellSelectColor } from '../../../state/select/is-cell-select-highlight';
import { renderStrokeWithCornerRadius } from './rect-contribution-render';

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
    drawContext: IDrawContext,
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
    drawContext: IDrawContext,
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
      // width = groupAttribute.width,
      // height = groupAttribute.height,
      // 基础border
      stroke = groupAttribute.stroke,
      strokeArrayColor = (groupAttribute as any).strokeArrayColor,
      strokeArrayWidth = (groupAttribute as any).strokeArrayWidth,

      lineWidth = groupAttribute.lineWidth,
      strokeColor = groupAttribute.stroke,

      cornerRadius = groupAttribute.cornerRadius
      // // select & hover border
      // highlightStroke = (groupAttribute as any).highlightStroke,
      // highlightStrokeArrayColor = (groupAttribute as any).highlightStrokeArrayColor,
      // highlightStrokeArrayWidth = (groupAttribute as any).highlightStrokeArrayWidth,
      // highlightStrokeArrayPart = (groupAttribute as any).highlightStrokeArrayPart,
    } = group.attribute as any;
    let { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;

    // lineWidth === 0 不绘制
    if (!stroke || (!Array.isArray(strokeArrayWidth) && lineWidth === 0)) {
      return;
    }

    let widthForStroke: number;
    let heightForStroke: number;
    if (Array.isArray(strokeArrayColor) || Array.isArray(strokeArrayWidth)) {
      if (
        (typeof lineWidth === 'number' && lineWidth & 1) ||
        (Array.isArray(strokeArrayWidth) && strokeArrayWidth.some(width => width & 1))
      ) {
        const table = (group.stage as any).table as BaseTableAPI;
        if (!table) {
          return;
        }
        const bottomRight = table?.theme?.cellBorderClipDirection === 'bottom-right';
        // let deltaWidth = 0;
        // let deltaHeight = 0;
        if (bottomRight) {
          x = Math.floor(x) - 0.5;
          y = Math.floor(y) - 0.5;
          if (group.role === 'cell') {
            const col = (group as any).col as number;
            const row = (group as any).row as number;
            if (col === 0) {
              x += 1;
            }
            if (row === 0) {
              y += 1;
            }
          }
        } else {
          x = Math.floor(x) + 0.5;
          y = Math.floor(y) + 0.5;
        }

        if (table.options.customConfig?._disableColumnAndRowSizeRound) {
          width = Math.round(width);
          height = Math.round(height);
        }
        const { width: widthFroDraw, height: heightFroDraw } = getCellSizeForDraw(
          group,
          Math.ceil(width),
          Math.ceil(height),
          bottomRight
        );
        widthForStroke = widthFroDraw;
        heightForStroke = heightFroDraw;
      } else {
        widthForStroke = Math.ceil(width);
        heightForStroke = Math.ceil(height);
      }

      // 带不同stroke边框
      if (!(cornerRadius === 0 || (isArray(cornerRadius) && (<number[]>cornerRadius).every(num => num === 0)))) {
        // let lastStrokeI = 0;
        // let lastStroke: any;
        context.beginPath();
        // debugger;
        createRectPath(
          context,
          x,
          y,
          widthForStroke,
          heightForStroke,
          cornerRadius,
          new Array(4).fill(0).map((_, i) => (x1: number, y1: number, x2: number, y2: number) => {
            renderStrokeWithCornerRadius(
              i,
              x1,
              y1,
              x2,
              y2,
              group,
              context,
              x,
              y,
              groupAttribute as any,
              stroke,
              strokeArrayWidth || lineWidth,
              strokeArrayColor || strokeColor,
              widthForStroke,
              heightForStroke
            );
          })
        );

        context.stroke();
      } else {
        renderStroke(
          group,
          context,
          x,
          y,
          groupAttribute,
          stroke,
          strokeArrayWidth || lineWidth,
          strokeArrayColor || strokeColor,
          // Math.ceil(width),
          // Math.ceil(height)
          widthForStroke,
          heightForStroke
        );
      }
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
  groupAttribute: Required<IGroupGraphicAttribute> | Required<IRectGraphicAttribute>,
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
  // }
  // const oldLineCap = context.lineCap;
  // context.lineCap = 'square';

  const { lineDash = groupAttribute.lineDash } = group.attribute as any;
  // const lineDash = context.getLineDash();
  let isDash = false;
  if (lineDash.length && lineDash.some((dash: number[] | null) => Array.isArray(dash))) {
    isDash = true;
  }
  // 单独处理每条边界，目前不考虑圆角
  context.beginPath();
  context.moveTo(x, y);

  const strokeTop = (isStrokeTrue || stroke[0]) && (isWidthNumber || strokeArrayWidth[0]);
  const strokeRight = (isStrokeTrue || stroke[1]) && (isWidthNumber || strokeArrayWidth[1]);
  const strokeBottom = (isStrokeTrue || stroke[2]) && (isWidthNumber || strokeArrayWidth[2]);
  const strokeLeft = (isStrokeTrue || stroke[3]) && (isWidthNumber || strokeArrayWidth[3]);

  // top
  if (strokeTop) {
    // context.lineTo(x + width, y);
    const deltaLeft = (isWidthNumber ? widthInfo.width : strokeArrayWidth[0]) / 2;
    const deltaRight = (isWidthNumber ? widthInfo.width : strokeArrayWidth[0]) / 2;
    if (isPart && Array.isArray(part[0])) {
      context.moveTo(x - deltaLeft + (width + deltaLeft + deltaRight) * part[0][0], y);
      context.lineTo(x - deltaLeft + (width + deltaLeft + deltaRight) * (part[0][1] - part[0][0]), y);
      context.moveTo(x + width + deltaRight, y);
    } else {
      context.moveTo(x - deltaLeft, y);
      context.lineTo(x + width + deltaRight, y);
    }
    if (isSplitDraw || isDash) {
      if (strokeArrayColor && strokeArrayColor[0]) {
        context.strokeStyle = strokeArrayColor[0];
      } else if (strokeArrayColor && !strokeArrayColor[0]) {
        context.strokeStyle = 'transparent';
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[0];
      }
      context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
      if (isDash) {
        context.setLineDash(lineDash[0] ?? []);
      }
      context.stroke();
      context.beginPath();
      context.moveTo(x + width, y);
    }
  } else {
    context.moveTo(x + width, y);
  }
  // right
  if (strokeRight) {
    // context.lineTo(x + width, y + height);
    const deltaTop = (isWidthNumber ? widthInfo.width : strokeArrayWidth[1]) / 2;
    const deltaBottom = (isWidthNumber ? widthInfo.width : strokeArrayWidth[1]) / 2;
    if (isPart && Array.isArray(part[1])) {
      context.moveTo(x + width, y - deltaTop + height * part[1][0]);
      context.lineTo(x + width, y - deltaTop + (height + deltaTop + deltaBottom) * (part[1][1] - part[1][0]));
      context.moveTo(x + width, y + height + deltaBottom);
    } else {
      context.moveTo(x + width, y - deltaTop);
      context.lineTo(x + width, y + height + deltaBottom);
    }
    if (isSplitDraw || isDash) {
      if (strokeArrayColor && strokeArrayColor[1]) {
        context.strokeStyle = strokeArrayColor[1];
      } else if (strokeArrayColor && !strokeArrayColor[1]) {
        context.strokeStyle = 'transparent';
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[1];
      }
      context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
      if (isDash) {
        context.setLineDash(lineDash[1] ?? []);
      }
      context.stroke();
      context.beginPath();
      context.moveTo(x + width, y + height);
    }
  } else {
    context.moveTo(x + width, y + height);
  }
  // bottom
  if (strokeBottom) {
    // context.lineTo(x, y + height);
    const deltaLeft = (isWidthNumber ? widthInfo.width : strokeArrayWidth[2]) / 2;
    const deltaRight = (isWidthNumber ? widthInfo.width : strokeArrayWidth[2]) / 2;
    if (isPart && Array.isArray(part[2])) {
      context.moveTo(x - deltaLeft + (width + deltaLeft + deltaRight) * part[2][0], y + height);
      context.lineTo(x - deltaLeft + (width + deltaLeft + deltaRight) * (part[2][1] - part[2][0]), y + height);
      context.moveTo(x - deltaLeft, y + height);
    } else {
      context.moveTo(x - deltaLeft, y + height);
      context.lineTo(x + width + deltaRight, y + height);
    }
    if (isSplitDraw || isDash) {
      if (strokeArrayColor && strokeArrayColor[2]) {
        context.strokeStyle = strokeArrayColor[2];
      } else if (strokeArrayColor && !strokeArrayColor[2]) {
        context.strokeStyle = 'transparent';
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[2];
      }
      context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
      if (isDash) {
        context.setLineDash(lineDash[2] ?? []);
      }
      context.stroke();
      context.beginPath();
      context.moveTo(x, y + height);
    }
  } else {
    context.moveTo(x, y + height);
  }
  // left
  if (strokeLeft) {
    // context.lineTo(x, y);
    const deltaTop = (isWidthNumber ? widthInfo.width : strokeArrayWidth[3]) / 2;
    const deltaBottom = (isWidthNumber ? widthInfo.width : strokeArrayWidth[3]) / 2;
    if (isPart && Array.isArray(part[3])) {
      context.moveTo(x, y - deltaTop + (height + deltaTop + deltaBottom) * part[3][0]);
      context.lineTo(x, y - deltaTop + (height + deltaTop + deltaBottom) * (part[3][1] - part[3][0]));
      context.moveTo(x, y - deltaTop);
    } else {
      context.moveTo(x, y - deltaTop);
      context.lineTo(x, y + height + deltaBottom);
    }
    if (isSplitDraw || isDash) {
      if (strokeArrayColor && strokeArrayColor[3]) {
        context.strokeStyle = strokeArrayColor[3];
      } else if (strokeArrayColor && !strokeArrayColor[3]) {
        context.strokeStyle = 'transparent';
      }
      if (!isWidthNumber) {
        context.lineWidth = strokeArrayWidth[3];
      }
      context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
      if (isDash) {
        context.setLineDash(lineDash[3] ?? []);
      }
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
  context.lineDashOffset = 0;
  // context.lineCap = oldLineCap;
  context.setLineDash([]);
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
    drawContext: IDrawContext,
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
      lineDash[0]?.length &&
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
    drawContext: IDrawContext,
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
      !(Array.isArray(lineDash) && lineDash.length && lineDash[0]?.length) ||
      Array.isArray(strokeArrayColor) ||
      Array.isArray(strokeArrayWidth)
    ) {
      return;
    }

    const table = (group.stage as any).table as BaseTableAPI;
    if (!table) {
      return;
    }

    // convert lineDash to number[][]
    const splitLineDash = isArray(lineDash[0]) ? getQuadLineDash(lineDash) : [lineDash, lineDash, lineDash, lineDash];

    // const { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;
    let { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;
    if (table.options.customConfig?._disableColumnAndRowSizeRound) {
      width = Math.round(width);
      height = Math.round(height);
    } else {
      width = Math.ceil(width);
      height = Math.ceil(height);
    }

    let widthForStroke;
    let heightForStroke;
    if (lineWidth & 1) {
      const bottomRight = table.theme.cellBorderClipDirection === 'bottom-right';
      const deltaWidth = 0;
      const deltaHeight = 0;
      if (bottomRight) {
        x = Math.floor(x) - 0.5;
        y = Math.floor(y) - 0.5;
        if (group.role === 'cell') {
          const col = (group as any).col as number;
          const row = (group as any).row as number;
          if (col === 0) {
            x += 1;
          }
          if (row === 0) {
            y += 1;
          }
        }
      } else {
        x = Math.floor(x) + 0.5;
        y = Math.floor(y) + 0.5;
      }

      const { width: widthFroDraw, height: heightFroDraw } = getCellSizeForDraw(
        group,
        Math.ceil(width + deltaWidth),
        Math.ceil(height + deltaHeight),
        bottomRight
      );
      widthForStroke = widthFroDraw;
      heightForStroke = heightFroDraw;
    } else {
      widthForStroke = Math.ceil(width);
      heightForStroke = Math.ceil(height);
    }
    context.setStrokeStyle(group, group.attribute, x, y, groupAttribute);
    // 分段设置lineDashOffset，实现虚线边框对齐
    // top
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + widthForStroke, y);
    context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
    context.setLineDash(splitLineDash[0] ?? []);
    context.stroke();

    // right
    context.beginPath();
    context.moveTo(x + widthForStroke, y);
    context.lineTo(x + widthForStroke, y + heightForStroke);
    context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
    context.setLineDash(splitLineDash[1] ?? []);
    context.stroke();

    // bottom
    context.beginPath();
    context.moveTo(x, y + heightForStroke);
    context.lineTo(x + widthForStroke, y + heightForStroke);
    context.lineDashOffset = context.currentMatrix.e / context.currentMatrix.a;
    context.setLineDash(splitLineDash[2] ?? []);
    context.stroke();

    // left
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + heightForStroke);
    context.lineDashOffset = context.currentMatrix.f / context.currentMatrix.d;
    context.setLineDash(splitLineDash[3] ?? []);
    context.stroke();

    context.lineDashOffset = 0;
    context.setLineDash([]);
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
    drawContext: IDrawContext,
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
      strokeArrayColor = (groupAttribute as any).strokeArrayColor,
      notAdjustPos
    } = group.attribute as any;

    if (
      notAdjustPos !== true && // 不需要调整位置
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
    drawContext: IDrawContext,
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
      strokeArrayColor = (groupAttribute as any).strokeArrayColor,
      notAdjustPos,
      cornerRadius = groupAttribute.cornerRadius
    } = group.attribute as any;

    let { width = groupAttribute.width, height = groupAttribute.height } = group.attribute;
    // width = Math.ceil(width);
    // height = Math.ceil(height);

    if (
      notAdjustPos !== true && // 不需要调整位置
      stroke &&
      Array.isArray(lineDash) &&
      !lineDash.length && // 非虚线
      !Array.isArray(strokeArrayColor) &&
      !Array.isArray(strokeArrayWidth) &&
      lineWidth & 1 // 奇数线宽
    ) {
      // if (group.role === 'cell') {
      //   const table = (group.stage as any).table as BaseTableAPI;
      //   let col = (group as any).col as number;
      //   let row = (group as any).row as number;
      //   const mergeInfo = getCellMergeInfo(table, col, row);
      //   if (mergeInfo) {
      //     col = mergeInfo.end.col;
      //     row = mergeInfo.end.row;
      //   }

      //   if (table && col === table.colCount - 1) {
      //     width -= 1;
      //   } else if (table && col === table.frozenColCount - 1 && table.scrollLeft) {
      //     width -= 1;
      //   }
      //   if (table && row === table.rowCount - 1) {
      //     height -= 1;
      //   } else if (table && row === table.frozenRowCount - 1 && table.scrollTop) {
      //     height -= 1;
      //   }
      // }

      const table = (group.stage as any).table as BaseTableAPI;
      if (!table) {
        return;
      }
      if (table.options.customConfig?._disableColumnAndRowSizeRound) {
        width = Math.round(width);
        height = Math.round(height);
      }

      context.beginPath();

      const bottomRight = table?.theme?.cellBorderClipDirection === 'bottom-right';
      const deltaWidth = 0;
      const deltaHeight = 0;
      if (bottomRight) {
        x = Math.floor(x) - 0.5;
        y = Math.floor(y) - 0.5;
        if (group.role === 'cell') {
          const col = (group as any).col as number;
          const row = (group as any).row as number;
          if (col === 0) {
            x += 1;
          }
          if (row === 0) {
            y += 1;
          }
        }
      } else {
        x = Math.floor(x) + 0.5;
        y = Math.floor(y) + 0.5;
      }

      const { width: widthFroDraw, height: heightFroDraw } = getCellSizeForDraw(
        group,
        Math.ceil(width),
        Math.ceil(height),
        bottomRight
      );

      if (cornerRadius) {
        // 测试后，cache对于重绘性能提升不大，但是在首屏有一定性能损耗，因此rect不再使用cache
        createRectPath(context, x, y, widthFroDraw + deltaWidth, heightFroDraw + deltaHeight, cornerRadius);
      } else {
        context.rect(x, y, widthFroDraw, heightFroDraw);
      }
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
    drawContext: IDrawContext,
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
      if (table) {
        const selectColor = getCellSelectColor(group as Group, table);
        if (selectColor) {
          // show select highlight when scrolling
          (group.attribute as any)._vtableHightLightFill = selectColor;
        } else if (table.stateManager.interactionState !== InteractionState.scrolling) {
          const hoverColor = getCellHoverColor(group as Group, table);
          if (hoverColor) {
            (group.attribute as any)._vtableHightLightFill = hoverColor;
          }
        }
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
    drawContext: IDrawContext,
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
    if ((group.attribute as any)._vtableHightLightFill) {
      if (fillCb) {
        // do nothing
        // fillCb(context, group.attribute, groupAttribute);
      } else if (fVisible) {
        const oldColor = group.attribute.fill;
        // draw hover fill
        group.attribute.fill = (group.attribute as any)._vtableHightLightFill as any;
        context.setCommonStyle(group, group.attribute, x, y, groupAttribute);
        context.fill();
        group.attribute.fill = oldColor;
        (group.attribute as any)._vtableHightLightFill = undefined;
      }
    }
  }
}

@injectable()
export class ClipBodyGroupBeforeRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    group: IGroup,
    context: IContext2d,
    xOrigin: number,
    yOrigin: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    drawContext: IDrawContext,
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
    const table = (group.stage as any).table as BaseTableAPI;
    if (!table) {
      return;
    }

    if ((group as Group).role === 'body') {
      const x = -(group.attribute.x ?? 0) + table.getFrozenColsWidth();
      const y = -(group.attribute.y ?? 0) + table.getFrozenRowsHeight();
      const width = group.parent.attribute.width - table.getFrozenColsWidth() - table.getRightFrozenColsWidth();
      const height = group.parent.attribute.height - table.getFrozenRowsHeight() - table.getBottomFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'row-header') {
      const x = 0;
      const y = -(group.attribute.y ?? 0) + table.getFrozenRowsHeight();
      const width = table.getFrozenColsWidth();
      const height = group.parent.attribute.height - table.getFrozenRowsHeight() - table.getBottomFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'col-header') {
      const x = -(group.attribute.x ?? 0) + table.getFrozenColsWidth();
      const y = 0;
      const width = group.parent.attribute.width - table.getFrozenColsWidth() - table.getRightFrozenColsWidth();
      const height = table.getFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'right-frozen') {
      const x = 0;
      const y = -(group.attribute.y ?? 0) + table.getFrozenRowsHeight();
      const width = table.getRightFrozenColsWidth();
      const height = group.parent.attribute.height - table.getFrozenRowsHeight() - table.getBottomFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'bottom-frozen') {
      const x = -(group.attribute.x ?? 0) + table.getFrozenColsWidth();
      const y = 0;
      const width = group.parent.attribute.width - table.getFrozenColsWidth() - table.getRightFrozenColsWidth();
      const height = table.getBottomFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'corner-header') {
      const x = 0;
      const y = 0;
      const width = table.getFrozenColsWidth();
      const height = table.getFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'corner-right-top-header') {
      const x = 0;
      const y = 0;
      const width = table.getRightFrozenColsWidth();
      const height = table.getFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'corner-right-bottom-header') {
      const x = 0;
      const y = 0;
      const width = table.getRightFrozenColsWidth();
      const height = table.getBottomFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    } else if ((group as Group).role === 'corner-left-bottom-header') {
      const x = 0;
      const y = 0;
      const width = table.getFrozenColsWidth();
      const height = table.getBottomFrozenRowsHeight();
      drawClipRect(context, x, y, width, height);
    }
  }
}

const precision = Math.pow(2, 24);

function drawClipRect(context: IContext2d, x: number, y: number, width: number, height: number) {
  context.beginPath();

  const matrix = context.applyedMatrix;
  if (Math.abs(matrix.f) > precision || Math.abs(matrix.g) > precision) {
    // hack for precision problem in CanvasRenderingContext2D
    // if position is too big, disable clip
    context.rect(x - precision, y - precision, width + precision * 2, height + precision * 2);
  } else {
    context.rect(x, y, width, height);
  }
}

// @injectable()
// export class ClipBodyGroupAfterRenderContribution implements IGroupRenderContribution {
//   time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
//   useStyle = true;
//   order = 0;
//   drawShape(
//     group: IGroup,
//     context: IContext2d,
//     x: number,
//     y: number,
//     doFill: boolean,
//     doStroke: boolean,
//     fVisible: boolean,
//     sVisible: boolean,
//     groupAttribute: Required<IGroupGraphicAttribute>,
//     drawContext: IDrawContext,
//     fillCb?: (
//       ctx: IContext2d,
//       markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
//       themeAttribute: IThemeAttribute
//     ) => boolean,
//     strokeCb?: (
//       ctx: IContext2d,
//       markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
//       themeAttribute: IThemeAttribute
//     ) => boolean
//   ) {
//     // 处理hover颜色
//     if ((group as Group).role === 'body') {
//     }
//   }
// }

function getCellSizeForDraw(group: any, width: number, height: number, bottomRight: boolean) {
  const table = group.stage.table as BaseTableAPI;
  if (!table) {
    return { width, height };
  }
  if (group.role === 'cell') {
    let col = group.col as number;
    let row = group.row as number;
    const mergeInfo = getCellMergeInfo(table, col, row);
    if (mergeInfo) {
      col = mergeInfo.end.col;
      row = mergeInfo.end.row;
    }

    if (col === table.colCount - 1 && !bottomRight) {
      width -= 1;
    } else if (col === table.frozenColCount - 1 && table.scrollLeft && !bottomRight) {
      width -= 1;
    } else if (col === 0 && bottomRight) {
      width -= 1;
    }
    if (row === table.rowCount - 1 && !bottomRight) {
      height -= 1;
    } else if (row === table.frozenRowCount - 1 && table.scrollTop && !bottomRight) {
      height -= 1;
    } else if (row === 0 && bottomRight) {
      height -= 1;
    }
  } else if (group.role === 'corner-frozen') {
    if (table.scrollLeft && !bottomRight) {
      width -= 1;
    }
    if (table.scrollTop && !bottomRight) {
      height -= 1;
    }
  }

  return { width, height };
}

function getQuadLineDash(lineDash: number[][]) {
  if (lineDash.length === 1) {
    return [lineDash[0], lineDash[0], lineDash[0], lineDash[0]];
  } else if (lineDash.length === 2) {
    return [lineDash[0], lineDash[1], lineDash[0], lineDash[1]];
  }
  // 不考虑三个数的情况，三个数是用户传错了
  return lineDash;
}
