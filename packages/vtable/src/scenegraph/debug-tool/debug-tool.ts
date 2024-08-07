import type { FederatedPointerEvent, IStage, IRect, IGraphic } from '@src/vrender';
import { createRect, getTheme } from '@src/vrender';
import JSONFormatter from 'json-formatter-js';

export interface DebugToolOptions {
  container?: HTMLElement;
  infoPosition?: 'tl' | 'tr' | 'bl' | 'br';
  infoWidth?: number;
  infoHeight?: number;
  mode?: 'hover' | 'click';
  customGrapicKeys?: string[];
}

export class DebugTool {
  _stage: IStage;
  _infoContainer: HTMLElement;
  _highlightRect: HTMLElement;
  _target: IGraphic;
  // _rect: IRect;
  _mode: 'hover' | 'click' = 'hover';
  _customGrapicKeys?: string[];
  _modeTip: HTMLElement;
  _callback: {
    pointermove: (e: FederatedPointerEvent) => void;
    pointerup: (e: FederatedPointerEvent) => void;
    pointerleave: (e: FederatedPointerEvent) => void;
    keydown: (e: KeyboardEvent) => void;
  };

  constructor(stage: IStage, options?: DebugToolOptions) {
    this._stage = stage;
    this._callback = {} as any;

    if (options?.customGrapicKeys) {
      this._customGrapicKeys = options.customGrapicKeys;
    }

    // 创建信息框
    if (options?.container) {
      this._infoContainer = options.container;
    } else {
      this.createInfoContainer(options);
    }

    // 创建高亮矩形
    this.createHighlightRect();

    // 绑定stage事件
    this.bindStageEvent();

    // 绑定键盘事件
    this.bindKeyEvent();
  }

  createInfoContainer(options?: DebugToolOptions) {
    const position = options?.infoPosition || 'tr';
    const width = options?.infoWidth || 300;
    const height = options?.infoPosition || 400;
    this._infoContainer = document.createElement('div');
    this._infoContainer.style.position = 'fixed';
    this._infoContainer.style.width = `${width}px`;
    this._infoContainer.style.height = `${height}px`;
    this._infoContainer.style.backgroundColor = 'rgba(210, 210, 210, 0.3)';
    this._infoContainer.style.overflow = 'auto';
    this._infoContainer.style.display = 'none';
    switch (position) {
      case 'tl':
        this._infoContainer.style.top = '0px';
        this._infoContainer.style.left = '0px';
        break;
      case 'tr':
        this._infoContainer.style.top = '0px';
        this._infoContainer.style.right = `0px`;
        break;
      case 'bl':
        this._infoContainer.style.bottom = `0px`;
        this._infoContainer.style.left = '0px';
        break;
      case 'br':
        this._infoContainer.style.bottom = `0px`;
        this._infoContainer.style.right = `0px`;
        break;
    }

    // Tip
    // debug 模式：hover（shift + s改变模式；shift + d控制台输出target graphic）
    const tip = document.createElement('div');
    const tipSpan1 = document.createElement('span');
    tipSpan1.innerText = 'debug 模式：';
    tip.appendChild(tipSpan1);
    this._modeTip = document.createElement('span');
    this._modeTip.innerText = this._mode;
    tip.appendChild(this._modeTip);
    const tipSpan2 = document.createElement('span');
    tipSpan2.innerText = '（shift + s改变模式；shift + d控制台输出target graphic）';
    tip.appendChild(tipSpan2);
    this._infoContainer.appendChild(tip);

    // document.body.append(this._infoContainer);
    this._stage.window.getContainer().append(this._infoContainer);
  }

  createHighlightRect() {
    const container = this._stage.window.getContainer();
    this._highlightRect = document.createElement('div');
    this._highlightRect.style.display = 'absolute';
    this._highlightRect.style.border = '1px solid red';
    this._highlightRect.style.pointerEvents = 'none';
    this._highlightRect.style.position = 'absolute';
    container.appendChild(this._highlightRect);
  }

  bindStageEvent() {
    this._callback.pointermove = (e: FederatedPointerEvent) => {
      if (this._mode !== 'hover') {
        // do nothing
      } else if (e.target && (e.target as unknown as IGraphic) !== this._target) {
        // 更新bounds
        this._target = e.target as unknown as IGraphic;
        this.addHighlightBounds(this._target.globalAABBBounds);
        setTimeout(() => {
          this.updateInfo();
        }, 100);
      } else if (!e.target) {
        this._target = undefined;
        // this.removeHighlightBounds();
        this.clearInfo();
      }
    };
    this._stage.addEventListener('pointermove', this._callback.pointermove);

    this._callback.pointerup = (e: FederatedPointerEvent) => {
      if (this._mode !== 'click') {
        // do nothing
      } else if (e.target && (e.target as unknown as IGraphic) !== this._target) {
        // 更新bounds
        this._target = e.target as unknown as IGraphic;
        this.addHighlightBounds(this._target.globalAABBBounds);
        setTimeout(() => {
          this.updateInfo();
        }, 100);
      } else if (!e.target) {
        this._target = undefined;
        // this.removeHighlightBounds();
        this.clearInfo();
      }
    };
    this._stage.addEventListener('pointerup', this._callback.pointerup);

    this._callback.pointerleave = (e: FederatedPointerEvent) => {
      if (this._mode === 'hover') {
        this._target = undefined;
        // this.removeHighlightBounds();
        this.clearInfo();
      }
    };
    this._stage.addEventListener('pointerleave', this._callback.pointerleave);
  }

  addHighlightBounds(bounds: any) {
    // 使用VRender绘制高亮框会导致触发多余渲染，因此使用dom
    // this._rect.setAttributes({
    //   x: bounds.x1,
    //   y: bounds.y1,
    //   width: bounds.width(),
    //   height: bounds.height(),
    //   visible: true,
    // });

    // // 保证rect在最上层
    // this._stage.defaultLayer.appendChild(this._rect);
    // this._stage.renderNextFrame();

    const table = (this._stage as any).table;
    const stage = table.scenegraph.stage;
    const stageMatrix = stage.window.getViewBoxTransform();

    this._highlightRect.style.left = `${bounds.x1 + (stageMatrix.e ?? 0) + (table.options.viewBox?.x1 ?? 0)}px`;
    this._highlightRect.style.top = `${bounds.y1 + (stageMatrix.f ?? 0) + (table.options.viewBox?.y1 ?? 0)}px`;
    this._highlightRect.style.width = `${bounds.width()}px`;
    this._highlightRect.style.height = `${bounds.height()}px`;

    // console.log(this._highlightRect.style.left);
  }

  // removeHighlightBounds() {
  //   this._rect.setAttribute('visible', false);
  //   this._stage.renderNextFrame();
  // }

  updateInfo() {
    if (!this._target) {
      return;
    }
    // this._infoContainer.innerHTML = '';
    if (this._infoContainer.children.length > 1) {
      this._infoContainer.removeChild(this._infoContainer.children[1]);
    }
    this._infoContainer.style.display = 'block';

    const info = {
      customKeys: {},
      type: this._target.type,
      // role: (this._target as any).role,
      globalX: this._target.globalTransMatrix.e,
      globalY: this._target.globalTransMatrix.f,
      attribute: this._target.attribute,
      theme: getTheme(this._target)[this._target.type],
      target: this._target
    };

    if (this._customGrapicKeys) {
      this._customGrapicKeys.forEach(key => {
        info.customKeys[key] = this._target[key];
      });
    } else {
      delete info.customKeys;
    }

    const formatter = new JSONFormatter(info, 2);
    this._infoContainer.appendChild(formatter.render());
  }

  clearInfo() {
    this._infoContainer.style.display = 'none';
  }

  updateMode() {
    this._modeTip.innerText = this._mode;
  }

  bindKeyEvent() {
    this._callback.keydown = (e: KeyboardEvent) => {
      if (e.key === 'D') {
        console.log(this._target);
      } else if (e.key === 'S') {
        switch (this._mode) {
          case 'click':
            this._mode = 'hover';
            break;
          case 'hover':
            this._mode = 'click';
            break;
        }
        this.updateMode();
      }
    };
    window.addEventListener('keydown', this._callback.keydown);
  }

  release() {
    // 移除信息框
    document.body.removeChild(this._infoContainer);

    // 移除高亮框
    this._highlightRect.parentElement.removeChild(this._highlightRect);

    // 解绑stage事件
    // this._stage.defaultLayer.removeChild(this._rect);
    this._stage.removeEventListener('pointermove', this._callback.pointermove);
    this._stage.removeEventListener('pointerup', this._callback.pointerup);
    this._stage.removeEventListener('pointerleave', this._callback.pointerleave);

    // 解绑键盘事件
    window.removeEventListener('keydown', this._callback.keydown);
  }
}
