import type {
  IDrawItemInterceptorContribution,
  IGraphic,
  IRenderService,
  IDrawContext,
  IDrawContribution,
  IGraphicRenderDrawParams,
  IImage
} from '@src/vrender';
import { injectable, createImage } from '@src/vrender';
import * as icons from '../../../icons';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
let loadingImage: IImage;

@injectable()
export class VTableDrawItemInterceptorContribution implements IDrawItemInterceptorContribution {
  order: number = 1;
  interceptors: IDrawItemInterceptorContribution[];
  constructor() {
    this.interceptors = [new ImageDrawItemInterceptorContribution()];
  }
  afterDrawItem(
    graphic: IGraphic,
    renderService: IRenderService,
    drawContext: IDrawContext,
    drawContribution: IDrawContribution,
    params?: IGraphicRenderDrawParams
  ): boolean {
    for (let i = 0; i < this.interceptors.length; i++) {
      if (
        this.interceptors[i].afterDrawItem &&
        this.interceptors[i].afterDrawItem(graphic, renderService, drawContext, drawContribution, params)
      ) {
        return true;
      }
    }
    return false;
  }

  beforeDrawItem(
    graphic: IGraphic,
    renderService: IRenderService,
    drawContext: IDrawContext,
    drawContribution: IDrawContribution,
    params?: IGraphicRenderDrawParams
  ): boolean {
    // 【性能方案】判定写在外层,减少遍历判断耗时，10000条数据减少1ms
    if (
      (!graphic.in3dMode || drawContext.in3dInterceptor) &&
      !graphic.shadowRoot &&
      !(graphic.baseGraphic || graphic.attribute.globalZIndex || graphic.interactiveGraphic)
    ) {
      return false;
    }

    for (let i = 0; i < this.interceptors.length; i++) {
      if (
        this.interceptors[i].beforeDrawItem &&
        this.interceptors[i].beforeDrawItem(graphic, renderService, drawContext, drawContribution, params)
      ) {
        return true;
      }
    }
    return false;
  }
}

export class ImageDrawItemInterceptorContribution implements IDrawItemInterceptorContribution {
  order: number = 1;

  afterDrawItem(
    graphic: IGraphic,
    renderService: IRenderService,
    drawContext: IDrawContext,
    drawContribution: IDrawContribution,
    params?: IGraphicRenderDrawParams
  ): boolean {
    if (graphic.type === 'image') {
      this.drawItem(graphic, renderService, drawContext, drawContribution, params);
    }
    return false;
  }

  protected drawItem(
    graphic: IImage,
    renderService: IRenderService,
    drawContext: IDrawContext,
    drawContribution: IDrawContribution,
    params?: IGraphicRenderDrawParams
  ): boolean {
    const { image: url, gif } = graphic.attribute as any;

    if (gif && graphic.playing) {
      return false;
    }
    if (!url || !graphic.resources) {
      return false;
    }
    const res = graphic.resources.get(url);
    if (!res || res.state !== 'loading') {
      return false;
    }

    if (!loadingImage) {
      const regedIcons = icons.get();
      const svg = (regedIcons.loading_pic as any).svg;
      const width = (regedIcons.loading_pic as any).width;
      const height = (regedIcons.loading_pic as any).height;
      loadingImage = createImage({
        width,
        height,
        image: svg
      });
    }
    const { image: loadingUrl } = loadingImage.attribute;
    if (!url || !loadingImage.resources) {
      return false;
    }
    const loadingRes = loadingImage.resources.get(loadingUrl);
    if (loadingRes.state !== 'success') {
      return false;
    }

    const { context } = drawContext;
    context.highPerformanceSave();
    // 直接transform
    graphic.parent && context.setTransformFromMatrix(graphic.parent.globalTransMatrix, true);
    graphic.glyphHost &&
      graphic.glyphHost.parent &&
      context.setTransformFromMatrix(graphic.glyphHost.parent.globalTransMatrix, true);

    const b = graphic.AABBBounds;

    const { width, height } = calcKeepAspectRatioSize(
      loadingRes.data.width,
      loadingRes.data.height,
      b.width(),
      b.height()
    );

    context.drawImage(loadingRes.data, b.x1 + (b.width() - width) / 2, b.y1 + (b.height() - height) / 2, width, height);

    context.highPerformanceRestore();

    return true;
  }
}
