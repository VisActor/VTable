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
      } else {
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
      } else {
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
      } else {
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
      } else {
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

export function createRectPath(
  path: ICustomPath2D | IContext2d,
  x: number,
  y: number,
  width: number,
  height: number,
  rectCornerRadius: number | number[],
  edgeCb?: IEdgeCb[]
) {
  if (width < 0) {
    x += width;
    width = -width;
  }
  if (height < 0) {
    y += height;
    height = -height;
  }
  // 匹配cornerRadius
  let cornerRadius: vec4;
  if (isNumber(rectCornerRadius, true)) {
    rectCornerRadius = abs(rectCornerRadius);
    cornerRadius = [
      <number>rectCornerRadius,
      <number>rectCornerRadius,
      <number>rectCornerRadius,
      <number>rectCornerRadius
    ];
  } else if (Array.isArray(rectCornerRadius)) {
    const cornerRadiusArr: number[] = rectCornerRadius as number[];
    let cr0;
    let cr1;
    let cr2;
    let cr3;
    switch (cornerRadiusArr.length) {
      case 0:
        cornerRadius = [0, 0, 0, 0];
        break;
      case 1:
        cr0 = abs(cornerRadiusArr[0]);
        cornerRadius = [cr0, cr0, cr0, cr0];
        break;
      case 2:
      case 3:
        cr0 = abs(cornerRadiusArr[0]);
        cr1 = abs(cornerRadiusArr[1]);
        cornerRadius = [cr0, cr1, cr0, cr1];
        break;
      default:
        cornerRadius = cornerRadiusArr as [number, number, number, number];
        cornerRadius[0] = abs(cornerRadius[0]);
        cornerRadius[1] = abs(cornerRadius[1]);
        cornerRadius[2] = abs(cornerRadius[2]);
        cornerRadius[3] = abs(cornerRadius[3]);
        break;
    }
  } else {
    cornerRadius = [0, 0, 0, 0];
  }

  // 当宽度小于0 或者 cornerRadius 极小时，不绘制 cornerRadius
  if (width < 0 || cornerRadius[0] + cornerRadius[1] + cornerRadius[2] + cornerRadius[3] < 1e-12) {
    return path.rect(x, y, width, height);
  }

  const [leftTop, rightTop, rightBottom, leftBottom]: [vec2, vec2, vec2, vec2] = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height]
  ];
  //
  // *(leftTopPoint1)******************(rightTopPoint1)
  // (leftTopPoint2)                  (rightTopPoint2)
  // *                                *
  // *                                *
  // (leftBottomPoint2)               (rightBottomPoint2)
  // *(leftBottomPoint1)***************(rightBottomPoint1)
  //
  const maxCornerRadius = Math.min(width / 2, height / 2);
  const _cornerRadius: vec4 = [
    Math.min(maxCornerRadius, cornerRadius[0]),
    Math.min(maxCornerRadius, cornerRadius[1]),
    Math.min(maxCornerRadius, cornerRadius[2]),
    Math.min(maxCornerRadius, cornerRadius[3])
  ];
  const leftTopPoint1: vec2 = [leftTop[0] + _cornerRadius[0], leftTop[1]];
  const leftTopPoint2: vec2 = [leftTop[0], leftTop[1] + _cornerRadius[0]];
  const rightTopPoint1: vec2 = [rightTop[0] - _cornerRadius[1], rightTop[1]];
  const rightTopPoint2: vec2 = [rightTop[0], rightTop[1] + _cornerRadius[1]];
  const rightBottomPoint1: vec2 = [rightBottom[0] - _cornerRadius[2], rightBottom[1]];
  const rightBottomPoint2: vec2 = [rightBottom[0], rightBottom[1] - _cornerRadius[2]];
  const leftBottomPoint1: vec2 = [leftBottom[0] + _cornerRadius[3], leftBottom[1]];
  const leftBottomPoint2: vec2 = [leftBottom[0], leftBottom[1] - _cornerRadius[3]];

  path.moveTo(leftTopPoint1[0], leftTopPoint1[1]);

  // 上边
  edgeCb && edgeCb[0]
    ? edgeCb[0](leftTopPoint1[0], leftTopPoint1[1], rightTopPoint1[0], rightTopPoint1[1])
    : path.lineTo(rightTopPoint1[0], rightTopPoint1[1]);
  if (!arrayEqual(rightTopPoint1, rightTopPoint2)) {
    // arc from rightTopPoint1 to rightTopPoint2
    path.moveTo(rightTopPoint1[0], rightTopPoint1[1]);
    const centerX = rightTopPoint1[0];
    const centerY = rightTopPoint1[1] + _cornerRadius[1];
    path.arc(
      centerX,
      centerY,
      _cornerRadius[1],
      -halfPi,
      0,
      // Math.atan2(rightTopPoint1[1] - centerY, rightTopPoint1[0] - centerX),
      // Math.atan2(rightTopPoint2[1] - centerY, rightTopPoint2[0] - centerX),
      false
    );
    // path.stroke();

    // path.arcTo(rightTop[0], rightTop[1], rightTopPoint2[0], rightTopPoint2[1], _cornerRadius[1]);
  }

  // 右边
  edgeCb && edgeCb[1]
    ? edgeCb[1](rightTopPoint2[0], rightTopPoint2[1], rightBottomPoint2[0], rightBottomPoint2[1])
    : path.lineTo(rightBottomPoint2[0], rightBottomPoint2[1]);
  if (!arrayEqual(rightBottomPoint1, rightBottomPoint2)) {
    // arc from rightBottomPoint2 to rightTopPoint1
    const centerX = rightBottomPoint2[0] - _cornerRadius[2];
    const centerY = rightBottomPoint2[1];
    path.moveTo(rightBottomPoint2[0], rightBottomPoint2[1]);
    path.arc(
      centerX,
      centerY,
      _cornerRadius[2],
      0,
      halfPi,
      // Math.atan2(rightBottomPoint2[1] - centerY, rightBottomPoint2[0] - centerX),
      // Math.atan2(rightBottomPoint1[1] - centerY, rightBottomPoint1[0] - centerX),
      false
    );
    // path.stroke();
    // path.arcTo(rightBottom[0], rightBottom[1], rightBottomPoint1[0], rightBottomPoint1[1], _cornerRadius[2]);
  }

  edgeCb && edgeCb[2]
    ? edgeCb[2](rightBottomPoint1[0], rightBottomPoint1[1], leftBottomPoint1[0], leftBottomPoint1[1])
    : path.lineTo(leftBottomPoint1[0], leftBottomPoint1[1]);
  if (!arrayEqual(leftBottomPoint1, leftBottomPoint2)) {
    // arc from leftBottomPoint1 to leftBottomPoint2
    const centerX = leftBottomPoint1[0];
    const centerY = leftBottomPoint1[1] - _cornerRadius[3];
    path.moveTo(leftBottomPoint1[0], leftBottomPoint1[1]);
    path.arc(
      centerX,
      centerY,
      _cornerRadius[3],
      halfPi,
      pi,
      // Math.atan2(leftBottomPoint1[1] - centerY, leftBottomPoint1[0] - centerX),
      // Math.atan2(leftBottomPoint2[1] - centerY, leftBottomPoint2[0] - centerX),
      false
    );
    // path.stroke();
    // path.arcTo(leftBottom[0], leftBottom[1], leftBottomPoint2[0], leftBottomPoint2[1], _cornerRadius[3]);
  }

  edgeCb && edgeCb[3]
    ? edgeCb[3](leftBottomPoint2[0], leftBottomPoint2[1], leftTopPoint2[0], leftTopPoint2[1])
    : path.lineTo(leftTopPoint2[0], leftTopPoint2[1]);
  if (!arrayEqual(leftTopPoint1, leftTopPoint2)) {
    const centerX = leftTopPoint1[0];
    const centerY = leftTopPoint1[1] + _cornerRadius[0];
    path.moveTo(leftTopPoint2[0], leftTopPoint2[1]);
    path.arc(
      centerX,
      centerY,
      _cornerRadius[0],
      pi,
      pi + halfPi,
      // Math.atan2(leftTopPoint2[1] - centerY, leftTopPoint2[0] - centerX),
      // Math.atan2(leftTopPoint1[1] - centerY, leftTopPoint1[0] - centerX) + Math.PI * 2,
      false
    );
    // path.stroke();
    // path.arcTo(leftTop[0], leftTop[1], leftTopPoint1[0], leftTopPoint1[1], _cornerRadius[0]);
  }
  !edgeCb && path.closePath();
  return path;
}
