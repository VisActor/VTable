import { VRender } from '@visactor/vtable';
import { calculateAnchorOfBounds, isFunction, isNil, isObject, isString, styleStringToObject } from '@visactor/vutils';

const { ReactAttributePlugin, application } = VRender;
type CommonDomOptions = VRender.CommonDomOptions;
type CreateDOMParamsType = VRender.CreateDOMParamsType;
type IGraphic = VRender.CreateDOMParamsType;
type IStage = VRender.CreateDOMParamsType;
type IText = VRender.CreateDOMParamsType;
type SimpleDomStyleOptions = VRender.CreateDOMParamsType;

export class VTableReactAttributePlugin extends ReactAttributePlugin {
  removeElement(id: string) {
    super.removeElement(id);
    delete this.htmlMap[id];
  }

  renderGraphicHTML(graphic: IGraphic) {
    const { react } = graphic.attribute;
    if (!react) {
      return;
    }
    const stage = graphic.stage;
    if (!stage) {
      return;
    }
    const ReactDOM = stage.params.ReactDOM;
    const { element, container } = react;
    if (!(element && ReactDOM && ReactDOM.createRoot)) {
      return;
    }
    const id = isNil(react.id) ? `${graphic.id ?? graphic._uid}_react` : react.id;

    if (this.htmlMap && this.htmlMap[id] && container && container !== this.htmlMap[id].container) {
      this.removeElement(id);
    }

    if (!this.htmlMap || !this.htmlMap[id]) {
      // createa a wrapper contianer to be the root of react element
      const { wrapContainer, nativeContainer } = this.getWrapContainer(stage, container);

      if (wrapContainer) {
        const root = ReactDOM.createRoot(wrapContainer);
        root.render(element);

        if (!this.htmlMap) {
          this.htmlMap = {};
        }

        this.htmlMap[id] = { root, wrapContainer, nativeContainer, container, renderId: this.renderId };
      }
    } else {
      // update react element
      this.htmlMap[id].root.render(element);
    }

    if (!this.htmlMap || !this.htmlMap[id]) {
      return;
    }

    const { wrapContainer, nativeContainer } = this.htmlMap[id];

    this.updateStyleOfWrapContainer(graphic, stage, wrapContainer, nativeContainer, react);
    this.htmlMap[id].renderId = this.renderId;
  }

  getWrapContainer(stage: IStage, userContainer?: string | HTMLElement | null, domParams?: CreateDOMParamsType) {
    let nativeContainer;
    if (userContainer) {
      if (typeof userContainer === 'string') {
        nativeContainer = application.global.getElementById(userContainer);
      } else {
        nativeContainer = userContainer;
      }
    } else {
      nativeContainer = stage.window.getContainer();
    }
    // 创建wrapGroup
    return {
      wrapContainer: application.global.createDom({ tagName: 'div', parent: nativeContainer, ...domParams }),
      nativeContainer
    };
  }

  updateStyleOfWrapContainer(
    graphic: IGraphic,
    stage: IStage,
    wrapContainer: HTMLElement,
    nativeContainer: HTMLElement,
    options: SimpleDomStyleOptions & CommonDomOptions
  ) {
    const { pointerEvents } = options;
    let calculateStyle = this.parseDefaultStyleFromGraphic(graphic);

    calculateStyle.display = graphic.attribute.visible !== false ? 'block' : 'none';
    // 事件穿透
    calculateStyle.pointerEvents = pointerEvents === true ? 'all' : pointerEvents ? pointerEvents : 'none';
    // 定位wrapGroup
    if (!wrapContainer.style.position) {
      wrapContainer.style.position = 'absolute';
      nativeContainer.style.position = 'relative';
    }
    let left: number = 0;
    let top: number = 0;
    const b = graphic.globalAABBBounds;

    let anchorType = options.anchorType;

    if (isNil(anchorType)) {
      anchorType = graphic.type === 'text' ? 'position' : 'boundsLeftTop';
    }

    if (anchorType === 'boundsLeftTop') {
      // 兼容老的配置，统一配置
      anchorType = 'top-left';
    }
    if (anchorType === 'position' || b.empty()) {
      const matrix = graphic.globalTransMatrix;
      left = matrix.e;
      top = matrix.f;
    } else {
      const anchor = calculateAnchorOfBounds(b, anchorType);

      left = anchor.x;
      top = anchor.y;
    }

    // 查看wrapGroup的位置
    // const wrapGroupTL = application.global.getElementTopLeft(wrapGroup, false);
    const containerTL = application.global.getElementTopLeft(nativeContainer, false);
    const windowTL = stage.window.getTopLeft(false);
    const offsetX = left + windowTL.left - containerTL.left;
    const offsetTop = top + windowTL.top - containerTL.top;
    // wrapGroup.style.transform = `translate(${offsetX}px, ${offsetTop}px)`;
    calculateStyle.left = `${offsetX}px`;
    calculateStyle.top = `${offsetTop}px`;

    if (graphic.type === 'text' && anchorType === 'position') {
      calculateStyle = {
        ...calculateStyle,
        ...this.getTransformOfText(graphic as IText)
      };
    }

    if (isFunction(options.style)) {
      const userStyle = options.style(
        { top: offsetTop, left: offsetX, width: b.width(), height: b.height() },
        graphic,
        wrapContainer
      );

      if (userStyle) {
        calculateStyle = { ...calculateStyle, ...userStyle };
      }
    } else if (isObject(options.style)) {
      calculateStyle = { ...calculateStyle, ...options.style };
    } else if (isString(options.style) && options.style) {
      calculateStyle = { ...calculateStyle, ...styleStringToObject(options.style as string) };
    }

    // 更新样式
    application.global.updateDom(wrapContainer, {
      width: options.width,
      height: options.width,
      style: calculateStyle,
      graphic
    });
  }
}
