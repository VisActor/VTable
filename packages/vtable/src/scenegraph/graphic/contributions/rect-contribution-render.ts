import type {
  IRect,
  IContext2d,
  IRectGraphicAttribute,
  IMarkAttribute,
  IGraphicAttribute,
  IThemeAttribute,
  IRectRenderContribution,
  IGroup,
  IGroupGraphicAttribute,
  IDrawContext,
  ICustomPath2D
} from '@src/vrender';
import { BaseRenderContributionTime, injectable } from '@src/vrender';
import { getWidthInfo, renderStroke } from './group-contribution-render';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import type { vec2, vec4 } from '@visactor/vutils';
import { abs, arrayEqual, halfPi, isArray, isNumber, pi } from '@visactor/vutils';
import { createRectPath } from '@src/vrender';

@injectable()
export class SplitRectBeforeRenderContribution implements IRectRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    rect: IRect,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    rectAttribute: Required<IRectGraphicAttribute>,
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
    // const { stroke = rectAttribute.stroke } = group.attribute as any;

    // if (Array.isArray(stroke)) {
    //   doFillOrStroke.doStroke = false;
    // }

    const {
      stroke = rectAttribute.stroke,
      strokeArrayWidth = (rectAttribute as any).strokeArrayWidth,
      strokeArrayColor = (rectAttribute as any).strokeArrayColor
    } = rect.attribute as any;

    if (stroke && (Array.isArray(stroke) || Array.isArray(strokeArrayWidth) || Array.isArray(strokeArrayColor))) {
      doFillOrStroke.doStroke = false;
    }
  }
}

@injectable()
export class SplitRectAfterRenderContribution implements IRectRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    rect: IRect,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    rectAttribute: Required<IRectGraphicAttribute>,
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
    // const {
    //   width = rectAttribute.width,
    //   height = rectAttribute.height,
    //   stroke = rectAttribute.stroke
    // } = group.attribute as any;

    // if (!Array.isArray(stroke)) {
    //   return;
    // }

    // context.setStrokeStyle(group, group.attribute, x, y, rectAttribute);
    // // 单独处理每条边界，目前不考虑圆角
    // context.beginPath();
    // context.moveTo(x, y);
    // // top
    // if (stroke[0]) {
    //   context.lineTo(x + width, y);
    // } else {
    //   context.moveTo(x + width, y);
    // }
    // // right
    // if (stroke[1]) {
    //   context.lineTo(x + width, y + height);
    // } else {
    //   context.moveTo(x + width, y + height);
    // }
    // // bottom
    // if (stroke[2]) {
    //   context.lineTo(x, y + height);
    // } else {
    //   context.moveTo(x, y + height);
    // }
    // // left
    // if (stroke[3]) {
    //   // 没有close path是，起点和终点不连续，需要调整y保证不出现缺口
    //   const adjustY = stroke[0] ? y - context.lineWidth / 2 : y;
    //   context.lineTo(x, adjustY);
    // } else {
    //   context.moveTo(x, y);
    // }

    // context.stroke();

    const {
      width = rectAttribute.width,
      height = rectAttribute.height,
      // 基础border
      stroke = rectAttribute.stroke,
      strokeArrayColor = (rectAttribute as any).strokeArrayColor,
      strokeArrayWidth = (rectAttribute as any).strokeArrayWidth,

      lineWidth = rectAttribute.lineWidth,
      strokeColor = rectAttribute.stroke,

      cornerRadius = rectAttribute.cornerRadius
      // // select & hover border
      // highlightStroke = (rectAttribute as any).highlightStroke,
      // highlightStrokeArrayColor = (rectAttribute as any).highlightStrokeArrayColor,
      // highlightStrokeArrayWidth = (rectAttribute as any).highlightStrokeArrayWidth,
      // highlightStrokeArrayPart = (rectAttribute as any).highlightStrokeArrayPart,
    } = rect.attribute as any;

    if (!stroke || (!Array.isArray(strokeArrayWidth) && lineWidth === 0)) {
      return;
    }

    if (Array.isArray(stroke) || Array.isArray(strokeArrayColor) || Array.isArray(strokeArrayWidth)) {
      // let dx = 0;
      // let dy = 0;
      const deltaWidth = 0;
      const deltaHeight = 0;
      if (
        rect.name !== 'border-rect' && // border-rect not need offset
        rect.name !== 'table-border-rect' && // table-border-rect not need offset
        ((typeof lineWidth === 'number' && lineWidth & 1) ||
          (Array.isArray(strokeArrayWidth) && strokeArrayWidth.some(width => width & 1)))
      ) {
        // const table = (rect.stage as any).table as BaseTableAPI;
        // const bottomRight = table.theme.cellBorderClipDirection === 'bottom-right';
        // if (bottomRight) {
        //   x = Math.floor(x) - 0.5;
        //   y = Math.floor(y) - 0.5;
        //   deltaWidth = 0.5;
        //   deltaHeight = 0.5;
        // } else {
        x = Math.floor(x) + 0.5;
        y = Math.floor(y) + 0.5;
        // }
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
          width,
          height,
          cornerRadius,
          new Array(4).fill(0).map((_, i) => (x1: number, y1: number, x2: number, y2: number) => {
            renderStrokeWithCornerRadius(
              i,
              x1,
              y1,
              x2,
              y2,
              rect,
              context,
              x,
              y,
              rectAttribute,
              stroke,
              strokeArrayWidth || lineWidth,
              strokeArrayColor || strokeColor,
              Math.ceil(width + deltaWidth),
              Math.ceil(height + deltaHeight)
            );
          })
        );

        context.stroke();
      } else {
        renderStroke(
          rect as IGroup,
          context,
          x,
          y,
          rectAttribute,
          stroke,
          strokeArrayWidth || lineWidth,
          strokeArrayColor || strokeColor,
          Math.ceil(width + deltaWidth),
          Math.ceil(height + deltaHeight)
        );
      }
    }
  }
}

export function renderStrokeWithCornerRadius(
  i: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: IRect,
  context: IContext2d,
  x: number,
  y: number,
  rectAttribute: Required<IRectGraphicAttribute>,
  stroke: any,
  strokeArrayWidth: any,
  strokeArrayColor: any,
  width: number,
  height: number
) {
  const group = rect;
  const groupAttribute = rectAttribute;

  // if (stroke[i]) {
  //   if (!(lastStrokeI === i - 1 && stroke[i] === lastStroke)) {
  //     context.setStrokeStyle(rect, { ...rect.attribute, stroke: stroke[i] }, x, y, rectAttribute);
  //     context.beginPath();
  //     context.moveTo(x1, y1);
  //     lastStroke = stroke[i];
  //   }
  //   lastStrokeI = i;
  //   context.lineTo(x2, y2);
  //   context.stroke();
  //   if (i === 3) {
  //     context.beginPath();
  //   }
  // }

  const widthInfo = getWidthInfo(strokeArrayWidth);
  const isWidthNumber = !Array.isArray(strokeArrayWidth);
  const isStrokeTrue = !Array.isArray(stroke);
  const isSplitDraw = Array.isArray(strokeArrayColor) || widthInfo.isSplitDraw;

  context.setStrokeStyle(rect, rect.attribute, x, y, rectAttribute);
  const { lineDash = groupAttribute.lineDash } = group.attribute as any;
  // const lineDash = context.getLineDash();
  let isDash = false;
  if (lineDash.length && lineDash.some((dash: number[] | null) => Array.isArray(dash))) {
    isDash = true;
  }

  // 单独处理每条边界，目前不考虑圆角
  // context.beginPath();
  context.moveTo(x, y);

  const strokeTop = (isStrokeTrue || stroke[0]) && (isWidthNumber || strokeArrayWidth[0]);
  const strokeRight = (isStrokeTrue || stroke[1]) && (isWidthNumber || strokeArrayWidth[1]);
  const strokeBottom = (isStrokeTrue || stroke[2]) && (isWidthNumber || strokeArrayWidth[2]);
  const strokeLeft = (isStrokeTrue || stroke[3]) && (isWidthNumber || strokeArrayWidth[3]);

  // top
  if (strokeTop && i === 0) {
    // context.lineTo(x + width, y);
    const deltaLeft = (isWidthNumber ? widthInfo.width : strokeArrayWidth[0]) / 2;
    const deltaRight = (isWidthNumber ? widthInfo.width : strokeArrayWidth[0]) / 2;

    // context.moveTo(x - deltaLeft, y);
    // context.lineTo(x + width + deltaRight, y);
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);

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
      // context.moveTo(x + width, y);
    }
  } else if (i === 0) {
    context.moveTo(x + width, y);
  }
  // right
  if (strokeRight && i === 1) {
    // context.lineTo(x + width, y + height);
    const deltaTop = (isWidthNumber ? widthInfo.width : strokeArrayWidth[1]) / 2;
    const deltaBottom = (isWidthNumber ? widthInfo.width : strokeArrayWidth[1]) / 2;

    // context.moveTo(x + width, y - deltaTop);
    // context.lineTo(x + width, y + height + deltaBottom);
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);

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
  } else if (i === 1) {
    context.moveTo(x + width, y + height);
  }
  // bottom
  if (strokeBottom && i === 2) {
    // context.lineTo(x, y + height);
    const deltaLeft = (isWidthNumber ? widthInfo.width : strokeArrayWidth[2]) / 2;
    const deltaRight = (isWidthNumber ? widthInfo.width : strokeArrayWidth[2]) / 2;

    // context.moveTo(x - deltaLeft, y + height);
    // context.lineTo(x + width + deltaRight, y + height);
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);

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
  } else if (i === 2) {
    context.moveTo(x, y + height);
  }
  // left
  if (strokeLeft && i === 3) {
    // context.lineTo(x, y);
    const deltaTop = (isWidthNumber ? widthInfo.width : strokeArrayWidth[3]) / 2;
    const deltaBottom = (isWidthNumber ? widthInfo.width : strokeArrayWidth[3]) / 2;

    // context.moveTo(x, y - deltaTop);
    // context.lineTo(x, y + height + deltaBottom);
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);

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
  } else if (i === 3) {
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

  context.closePath();
}

type IEdgeCb = (x1: number, y1: number, x2: number, y2: number) => void;
