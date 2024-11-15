import type {
  IImage,
  IContext2d,
  IImageGraphicAttribute,
  IMarkAttribute,
  IGraphicAttribute,
  IThemeAttribute,
  IImageRenderContribution,
  IDrawContext
} from '@src/vrender';
import { BaseRenderContributionTime, injectable } from '@src/vrender';

/**
 * @description: image支持绘制部分形状
 * @return {*}
 */
@injectable()
export class BeforeImageRenderContribution implements IImageRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    image: IImage,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    imageAttribute: Required<IImageGraphicAttribute>,
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
    const { shape } = image.attribute as any;

    if (shape === 'circle') {
      const { width = imageAttribute.width, height = imageAttribute.height } = image.attribute;

      context.beginPath();
      context.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
      context.closePath();

      context.save();
      context.clip();
    }
  }
}

@injectable()
export class AfterImageRenderContribution implements IImageRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    image: IImage,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    imageAttribute: Required<IImageGraphicAttribute>,
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
    const { shape } = image.attribute as any;

    if (shape === 'circle') {
      context.restore();
    }
  }
}

/**
 * @description: image支持gif动态图片
 * @return {*}
 */
@injectable()
export class BeforeGifImageRenderContribution implements IImageRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    image: IImage,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    imageAttribute: Required<IImageGraphicAttribute>,
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
    const { isGif } = image.attribute as any;

    if (isGif && image.playing) {
      image.attribute.opacity = 0; // hack for static image
    }
  }
}

@injectable()
export class AfterGifImageRenderContribution implements IImageRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle = true;
  order = 0;
  drawShape(
    image: IImage,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    imageAttribute: Required<IImageGraphicAttribute>,
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
    const { isGif } = image.attribute as any;

    if (isGif && image.playing) {
      image.attribute.opacity = 1; // hack for static image
      context.globalAlpha = image.attribute.opacity;
      image.renderFrame(context, x, y);
    }
  }
}
