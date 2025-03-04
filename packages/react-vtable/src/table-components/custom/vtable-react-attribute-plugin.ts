import type {
  CommonDomOptions,
  CreateDOMParamsType,
  IGraphic,
  IGroup,
  IStage,
  IText,
  SimpleDomStyleOptions
} from '@visactor/vtable/es/vrender';
import { DefaultAttribute, ReactAttributePlugin, application } from '@visactor/vtable/es/vrender';
import { calculateAnchorOfBounds, isFunction, isNil, isObject, isString, styleStringToObject } from '@visactor/vutils';
import type { CreateDOMParamsTypeForVTable } from './vtable-browser-env-contribution';

export class VTableReactAttributePlugin extends ReactAttributePlugin {
  declare htmlMap: Record<
    string,
    {
      root?: any;
      unmount?: () => void;
      wrapContainer: HTMLElement;
      nativeContainer: HTMLElement;
      container: string | HTMLElement | null;
      renderId: number;
      graphic: IGraphic;
    }
  >;
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
    const { element } = react;
    let { container } = react;
    // deal with frozen container
    if (container) {
      container = checkFrozenContainer(graphic);
    }

    if (!(element && ReactDOM && (ReactDOM.createRoot || ReactDOM.render))) {
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
        if (!this.htmlMap) {
          this.htmlMap = {};
        }

        if (ReactDOM.createRoot) {
          const root = ReactDOM.createRoot(wrapContainer);
          root.render(element);
          this.htmlMap[id] = { root, wrapContainer, nativeContainer, container, renderId: this.renderId, graphic };
        } else {
          ReactDOM.render(element, wrapContainer);

          this.htmlMap[id] = {
            wrapContainer,
            nativeContainer,
            container,
            renderId: this.renderId,
            unmount: () => {
              ReactDOM.unmountComponentAtNode(wrapContainer);
            },
            graphic
          };
        }
      }
    } else {
      // update react element
      if (ReactDOM.createRoot) {
        this.htmlMap[id].root.render(element);
      } else {
        ReactDOM.render(element, this.htmlMap[id].wrapContainer);
      }
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
    const { pointerEvents, penetrateEventList = [] } = options;
    let calculateStyle = this.parseDefaultStyleFromGraphic(graphic);

    calculateStyle.display = graphic.attribute.visible !== false ? 'block' : 'none';
    // 事件穿透
    calculateStyle.pointerEvents = pointerEvents === true ? 'all' : pointerEvents ? pointerEvents : 'none';
    if (calculateStyle.pointerEvents !== 'none') {
      // 删除所有的事件
      this.removeWrapContainerEventListener(wrapContainer);
      // 监听所有的事件
      penetrateEventList.forEach(event => {
        if (event === 'wheel') {
          wrapContainer.addEventListener('wheel', this.onWheel);

          // hack for preventing drag touch cause page jump
          wrapContainer.addEventListener(
            'wheel',
            e => {
              e.preventDefault();
            },
            true
          );
        }
      });
    }

    // 定位wrapGroup
    if (!wrapContainer.style.position) {
      wrapContainer.style.position = 'absolute';
      // nativeContainer.style.position = 'relative'; // 'relative' will cause the problem of container position
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
      height: options.height,
      style: calculateStyle,
      graphic
    } as CreateDOMParamsTypeForVTable);
  }

  protected drawHTML() {
    if (application?.global?.env === 'browser') {
      (this.pluginService.stage as any).children // fix interactive layer problem
        .sort((a: IGraphic, b: IGraphic) => {
          return (a.attribute.zIndex ?? DefaultAttribute.zIndex) - (b.attribute.zIndex ?? DefaultAttribute.zIndex);
        })
        .forEach((group: IGroup) => {
          this.renderGroupHTML(group);
        });

      this.clearCacheContainer();
    }
  }
}

function checkFrozenContainer(graphic: IGraphic) {
  const targetGroup = getTargetGroup(graphic);
  if (!targetGroup) {
    return null;
  }
  const { col, row, stage } = targetGroup;
  let { container } = graphic.attribute.react;
  const { table } = stage as any;
  // deal with react dom container
  if (
    container === table.bodyDomContainer &&
    col < table.frozenColCount &&
    row >= table.rowCount - table.bottomFrozenRowCount
  ) {
    container = table.bottomFrozenBodyDomContainer;
  } else if (
    container === table.bodyDomContainer &&
    col >= table.colCount - table.rightFrozenColCount &&
    row >= table.rowCount - table.bottomFrozenRowCount
  ) {
    container = table.rightFrozenBottomDomContainer;
  } else if (container === table.bodyDomContainer && row >= table.rowCount - table.bottomFrozenRowCount) {
    container = table.bottomFrozenBodyDomContainer;
  } else if (container === table.bodyDomContainer && col < table.frozenColCount) {
    container = table.frozenBodyDomContainer;
  } else if (container === table.bodyDomContainer && col >= table.colCount - table.rightFrozenColCount) {
    container = table.rightFrozenBodyDomContainer;
  } else if (container === table.headerDomContainer && col < table.frozenColCount) {
    container = table.frozenHeaderDomContainer;
  } else if (container === table.headerDomContainer && col >= table.colCount - table.rightFrozenColCount) {
    container = table.rightFrozenHeaderDomContainer;
  }

  // graphic.attribute.react.container = container;
  return container;
}

function getTargetGroup(target: any) {
  while (target && target.parent) {
    if (target.name === 'custom-container') {
      return target;
    }
    target = target.parent;
  }
  return null;
}
