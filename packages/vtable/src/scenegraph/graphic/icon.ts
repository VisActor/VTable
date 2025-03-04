import type { IImageGraphicAttribute, ISetAttributeContext, ITextGraphicAttribute } from '@src/vrender';
import { Image, ResourceLoader, Text } from '@src/vrender';
import type { IIconBase } from '../../ts-types';
import type { ParsedFrame } from 'gifuct-js';
import { decompressFrames, parseGIF } from 'gifuct-js';

export interface IIconGraphicAttribute extends IImageGraphicAttribute {
  backgroundWidth?: number;
  backgroundHeight?: number;
  backgroundColor?: string;
  visibleTime?: string;
  funcType?: string;
  hoverImage?: string | HTMLImageElement | HTMLCanvasElement;
  originImage?: string | HTMLImageElement | HTMLCanvasElement;
  // margin?: [number, number, number, number];
  marginLeft?: number;
  marginRight?: number;
  shape?: 'circle' | 'square';
  interactive?: boolean;
}

export class Icon extends Image {
  declare attribute: IIconGraphicAttribute;
  role?: string;
  tooltip?: IIconBase['tooltip'];
  frameImageData?: ImageData;
  tempCanvas?: HTMLCanvasElement;
  tempCtx?: CanvasRenderingContext2D;
  gifCanvas?: HTMLCanvasElement;
  gifCtx?: CanvasRenderingContext2D;
  loadedFrames?: ParsedFrame[];
  frameIndex?: number;
  playing?: boolean;
  lastTime?: number;

  // eslint-disable-next-line no-useless-constructor
  constructor(params: IIconGraphicAttribute) {
    super(params);

    if (this.attribute.visibleTime === 'mouseenter_cell' || this.attribute.visibleTime === 'click_cell') {
      this.attribute.opacity = 0;
    }

    if (this.attribute.hoverImage) {
      this.attribute.originImage = this.attribute.image;
    }

    if ((this.attribute as any).isGif && (this.attribute as any).gif) {
      this.loadGif();
    }

    // if (this.attribute.margin) {
    //   this.attribute.boundsPadding = this.attribute.margin;
    //   this.attribute.dx = this.attribute.margin[3] ?? 0;
    // }
  }

  loadGif() {
    this.playing = false;
    ResourceLoader.GetFile((this.attribute as any).gif + '?role=gif' + `&radom=${Math.random()}`, 'arrayBuffer') // ?role=gif: hack for ResourceLoader cache
      .then((res: ArrayBuffer) => {
        const gif = parseGIF(res);
        const frames = decompressFrames(gif, true);
        this.renderGIF(frames);

        // hack for image resource
        (this as any).resources.set((this.attribute as any).image, {
          state: 'success',
          data: this.gifCanvas
        });
      })
      .catch((e: any) => {
        console.error('Gif load error: ', e);
      });
  }

  get backgroundWidth(): number {
    return this.attribute.backgroundWidth ?? this.attribute.width ?? 0;
  }

  get backgroundHeight(): number {
    return this.attribute.backgroundHeight ?? this.attribute.height ?? 0;
  }

  // protected tryUpdateAABBBounds() {
  //   super.tryUpdateAABBBounds();
  //   // 扩大范围
  //   const { width, height } = this.attribute;
  //   const { backgroundWidth = width, backgroundHeight = height } = this.attribute;
  //   const expandX = (backgroundWidth - width) / 2;
  //   const expandY = (backgroundHeight - height) / 2;
  //   this._AABBBounds.expand([expandY, expandX, expandY, expandX]);

  //   return this._AABBBounds;
  // }

  renderGIF(frames: ParsedFrame[]) {
    this.loadedFrames = frames;
    this.frameIndex = 0;

    if (!this.tempCanvas) {
      this.tempCanvas = document.createElement('canvas');
      this.tempCtx = this.tempCanvas.getContext('2d');
    }

    if (!this.gifCanvas) {
      this.gifCanvas = document.createElement('canvas');
      this.gifCtx = this.gifCanvas.getContext('2d');
    }

    this.gifCanvas.width = frames[0].dims.width;
    this.gifCanvas.height = frames[0].dims.height;

    this.playing = true;
    this.lastTime = new Date().getTime();
    this.animate().to({}, 1000, 'linear').loop(Infinity);
  }

  renderFrame(context: CanvasRenderingContext2D, x: number, y: number) {
    // get the frame
    const frame = this.loadedFrames[this.frameIndex || 0];

    if (frame.disposalType === 2) {
      this.gifCtx.clearRect(0, 0, this.gifCanvas.width, this.gifCanvas.height);
    }

    // draw the patch
    this.drawPatch(frame);

    // perform manipulation
    this.manipulate(context, x, y);

    // update the frame index
    // this.frameIndex++;
    const diff = new Date().getTime() - this.lastTime;
    if (frame.delay < diff) {
      // return;
      this.frameIndex++;
      this.lastTime = new Date().getTime();
    }
    if (this.frameIndex >= this.loadedFrames.length) {
      this.frameIndex = 0;
    }
  }

  drawPatch(frame: ParsedFrame) {
    const dims = frame.dims;

    if (
      !this.frameImageData ||
      dims.width !== this.frameImageData.width ||
      dims.height !== this.frameImageData.height
    ) {
      this.tempCanvas.width = dims.width;
      this.tempCanvas.height = dims.height;
      this.frameImageData = this.tempCtx.createImageData(dims.width, dims.height);
    }

    // set the patch data as an override
    this.frameImageData.data.set(frame.patch);

    // draw the patch back over the canvas
    this.tempCtx.putImageData(this.frameImageData, 0, 0);

    // gifCtx.drawImage(tempCanvas, dims.left, dims.top)
    // this.attribute.image = this.tempCanvas;

    this.gifCtx.drawImage(this.tempCanvas, dims.left, dims.top);
  }

  manipulate(context: CanvasRenderingContext2D, x: number, y: number) {
    context.drawImage(
      this.gifCanvas,
      0,
      0,
      this.gifCanvas.width,
      this.gifCanvas.height,
      x,
      y,
      this.attribute.width,
      this.attribute.height
    );
  }

  setAttribute(key: string, value: any, forceUpdateTag?: boolean, context?: ISetAttributeContext): void {
    super.setAttribute(key, value, forceUpdateTag, context);
    if (key === 'gif') {
      this.loadGif();
    }
  }

  setAttributes(
    params: Partial<IIconGraphicAttribute>,
    forceUpdateTag?: boolean,
    context?: ISetAttributeContext
  ): void {
    super.setAttributes(params, forceUpdateTag, context);
    if ((params as any).gif) {
      this.loadGif();
    }
  }
}

export class TextIcon extends Text {
  declare attribute: IIconGraphicAttribute;
  role?: string;
  tooltip?: IIconBase['tooltip'];

  constructor(params: ITextGraphicAttribute) {
    // default text icon style
    params.fill = params.fill ?? '#00F';
    params.fontSize = params.fontSize ?? 12;
    params.underline = params.underline ?? 1;
    params.textBaseline = params.textBaseline ?? 'top';
    params.cursor = params.cursor ?? 'pointer';
    super(params);
  }
}
