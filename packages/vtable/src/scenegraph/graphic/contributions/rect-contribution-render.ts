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
  IDrawContext
} from '@src/vrender';
import { BaseRenderContributionTime, injectable } from '@src/vrender';
import { renderStroke } from './group-contribution-render';
import type { BaseTableAPI } from '../../../ts-types/base-table';

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
      strokeColor = rectAttribute.stroke
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

// 判断是否为整数，如果是整数，需要偏移0.5px
function isInteger(num: number) {
  return num % 1 === 0;
}
