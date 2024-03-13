import type {
  IContext2d,
  IDrawContext,
  IGraphicAttribute,
  IMarkAttribute,
  IText,
  ITextGraphicAttribute,
  ITextRenderContribution,
  IThemeAttribute
} from '@src/vrender';
import {
  BaseRenderContributionTime,
  calculateLineHeight,
  injectable,
  textDrawOffsetX,
  textLayoutOffsetY
} from '@src/vrender';
import { isString } from '@visactor/vutils';
import { textMeasure } from '../../utils/text-measure';

@injectable()
export class SuffixTextBeforeRenderContribution implements ITextRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    text: IText,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    textAttribute: Required<ITextGraphicAttribute>,
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
      text: str,
      underline = textAttribute.underline,
      lineThrough = textAttribute.lineThrough,
      direction = textAttribute.direction,
      // lineHeight = textAttribute.lineHeight,
      whiteSpace = textAttribute.whiteSpace,
      fontSize = textAttribute.fontSize,
      verticalMode = textAttribute.verticalMode,
      ellipsis = textAttribute.ellipsis,
      textAlign = textAttribute.textAlign,
      textBaseline = textAttribute.textBaseline,
      x: originX = textAttribute.x,
      y: originY = textAttribute.y
    } = text.attribute;

    let isEmpty: boolean = false;
    if (Array.isArray(text)) {
      const layoutData = text.cache?.layoutData;
      if (ellipsis && layoutData && layoutData.lines.every(line => line.str === '')) {
        isEmpty = true;
      }
    } else {
      const { cache } = text;
      if (ellipsis && cache && cache.clipedText === '' && cache.clipedWidth === 0) {
        isEmpty = true;
      }
    }

    if (!isEmpty) {
      return;
    }

    const textStr = isString(ellipsis) ? ellipsis : '...';
    const lineHeight = calculateLineHeight(text.attribute.lineHeight, fontSize) ?? fontSize;

    let dy = 0;
    if (lineHeight !== fontSize) {
      if (textBaseline === 'top') {
        dy = (lineHeight - fontSize) / 2;
      } else if (textBaseline === 'middle') {
        // middle do nothing
      } else if (textBaseline === 'bottom') {
        dy = -(lineHeight - fontSize) / 2;
      } else {
        // alphabetic do nothing
        // dy = (lineHeight - fontSize) / 2 - fontSize * 0.79;
      }
    }
    if (doStroke) {
      if (strokeCb) {
        strokeCb(context, text.attribute, textAttribute);
      } else if (sVisible) {
        context.setStrokeStyle(text, text.attribute, originX - x, originY - y, textAttribute);
        context.strokeText(textStr, originX, originY + dy);
      }
    }
    if (doFill) {
      if (fillCb) {
        fillCb(context, text.attribute, textAttribute);
      } else if (fVisible) {
        context.setCommonStyle(text, text.attribute, originX - x, originY - y, textAttribute);
        context.fillText(textStr, originX, originY + dy);
        this.drawUnderLine(underline, lineThrough, text, originX, originY + dy, 0, textAttribute, context, textStr);
      }
    }
  }

  drawUnderLine(
    underline: number,
    lineThrough: number,
    text: IText,
    x: number,
    y: number,
    z: number,
    textAttribute: Required<ITextGraphicAttribute>,
    context: IContext2d,
    textStr: string
  ) {
    if (lineThrough + underline <= 0) {
      return;
    }

    const {
      textAlign = textAttribute.textAlign,
      textBaseline = textAttribute.textBaseline,
      fontSize = textAttribute.fontSize,
      fontFamily = textAttribute.fontFamily,
      fontWeight = textAttribute.fontWeight,
      fontStyle = textAttribute.fontStyle,
      fill = textAttribute.fill,
      opacity = textAttribute.opacity,
      underlineOffset = textAttribute.underlineOffset,
      underlineDash = textAttribute.underlineDash,
      fillOpacity = textAttribute.fillOpacity
    } = text.attribute;

    if (!underline && !lineThrough) {
      return;
    }
    // const w = text.clipedWidth;
    const w = textMeasure.measureTextWidth(textStr, {
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle
    });
    const offsetX = textDrawOffsetX(textAlign, w);
    const offsetY = textLayoutOffsetY(textBaseline, fontSize, fontSize);
    const attribute = { lineWidth: 0, stroke: fill, opacity, strokeOpacity: fillOpacity };
    if (underline) {
      attribute.lineWidth = underline;
      context.setStrokeStyle(text, attribute, x, y, textAttribute);
      context.setLineDash(underlineDash);
      context.beginPath();
      const dy = y + offsetY + fontSize + underlineOffset;
      context.moveTo(x + offsetX, dy, z);
      context.lineTo(x + offsetX + w, dy, z);
      context.stroke();
    }
    if (lineThrough) {
      attribute.lineWidth = lineThrough;
      context.setStrokeStyle(text, attribute, x, y, textAttribute);
      context.beginPath();
      const dy = y + offsetY + fontSize / 2;
      context.moveTo(x + offsetX, dy, z);
      context.lineTo(x + offsetX + w, dy, z);
      context.stroke();
    }
  }
}
