/*
 * @Author: lym
 * @Date: 2025-02-24 09:32:53
 * @LastEditors: lym
 * @LastEditTime: 2025-02-26 16:20:42
 * @Description:
 */
import type {
  CommonDomOptions,
  CreateDOMParamsType,
  IGraphic,
  IGroup,
  IPlugin,
  IStage,
  IText,
  SimpleDomStyleOptions
} from '@visactor/vtable/es/vrender';
import { HtmlAttributePlugin, application } from '@visactor/vtable/es/vrender';
import {
  calculateAnchorOfBounds,
  isArray,
  isFunction,
  isNil,
  isObject,
  isString,
  styleStringToObject
} from '@visactor/vutils';
import { render } from 'vue';

/**
 * 表格自定义组件集成插件
 */
export class VTableVueAttributePlugin extends HtmlAttributePlugin implements IPlugin {
  declare htmlMap: Record<
    string,
    {
      /** 包裹容器 */
      wrapContainer: HTMLElement;
      /** 原生容器 */
      nativeContainer: HTMLElement;
      /** 挂载到的 table 容器 */
      container: string | HTMLElement | null;
      /** 渲染ID */
      renderId: number;
      /** 图形 */
      graphic: IGraphic;
    }
  >;

  /**
   * @description: 移除元素
   * @param {string} id
   * @return {*}
   */
  removeElement(id: string) {
    const record = this.htmlMap?.[id];
    if (!record) {
      return;
    }
    const { wrapContainer } = record;
    // 1. 卸载组件
    if (wrapContainer) {
      render(null, wrapContainer);
    }
    // 2. 移除DOM
    super.removeElement(id);
    // 3. 清理事件
    this.removeWrapContainerEventListener(wrapContainer);
    // 4. 清理引用
    delete this.htmlMap[id];
  }
  /**
   * @description: 单元格变化后重新渲染组件，由 HtmlAttributePlugin 插件触发
   * @param {IGraphic} graphic
   * @return {*}
   */
  renderGraphicHTML(graphic: IGraphic) {
    // TODO render 组件接入 vue 类型
    // @ts-ignore
    const { vue } = graphic.attribute;
    if (!vue) {
      return;
    }

    const stage = graphic.stage;
    if (!stage) {
      return;
    }

    const { element, container: expectedContainer } = vue;
    if (!element) {
      return;
    }

    // 获取实际容器
    const actualContainer = expectedContainer ? checkFrozenContainer(graphic) : expectedContainer;
    const id = isNil(vue.id) ? `${graphic.id ?? graphic._uid}_vue` : vue.id;
    // 检查是否需要移除旧容器
    let targetMap = this.htmlMap?.[id];
    if (targetMap && actualContainer && actualContainer !== targetMap.container) {
      this.removeElement(id);
      targetMap = null;
    }

    // 渲染或更新 Vue 组件
    if (!targetMap) {
      const { wrapContainer, nativeContainer } = this.getWrapContainer(stage, actualContainer);
      if (wrapContainer) {
        render(element, wrapContainer);
        targetMap = {
          wrapContainer,
          nativeContainer,
          container: actualContainer,
          renderId: this.renderId,
          graphic
        };
        this.htmlMap[id] = targetMap;
      }
    } else {
      render(element, targetMap.wrapContainer);
    }

    // 更新样式并记录渲染 ID
    if (targetMap) {
      this.updateStyleOfWrapContainer(graphic, stage, targetMap.wrapContainer, targetMap.nativeContainer);
      this.htmlMap[id].renderId = this.renderId;
    }
  }

  /**
   * @description: 获取包裹容器
   * @param {IStage} stage
   * @param {string} userContainer
   * @param {CreateDOMParamsType} domParams
   * @return {*}
   */
  getWrapContainer(stage: IStage, userContainer?: string | HTMLElement | null, domParams?: CreateDOMParamsType) {
    let nativeContainer: HTMLElement;
    if (userContainer) {
      nativeContainer =
        typeof userContainer === 'string' ? application.global.getElementById(userContainer) : userContainer;
    } else {
      nativeContainer = stage.window.getContainer();
    }

    return {
      wrapContainer: application.global.createDom({ tagName: 'div', parent: nativeContainer, ...domParams }),
      nativeContainer
    };
  }

  /**
   * @description: 更新包裹容器样式
   * @param {IGraphic} graphic
   * @param {IStage} stage
   * @param {HTMLElement} wrapContainer
   * @param {HTMLElement} nativeContainer
   * @return {*}
   */
  updateStyleOfWrapContainer(
    graphic: IGraphic,
    stage: IStage,
    wrapContainer: HTMLElement,
    nativeContainer: HTMLElement
  ) {
    const { attribute, type } = graphic as IGroup;
    //@ts-ignore
    const { vue: options, width, height, visible, display, ...rest } = attribute || {};
    // 默认自定义区域内也可带动表格画布滚动
    const { pointerEvents = true, penetrateEventList = ['wheel'] } = options;
    const calculateStyle = this.parseDefaultStyleFromGraphic(graphic);
    // 单元格样式
    const style = this.convertCellStyle(graphic);
    Object.assign(calculateStyle, {
      overflow: 'hidden',
      ...(style || {}),
      ...(rest || {}),
      boxSizing: 'border-box',
      display: visible !== false ? display || 'block' : 'none',
      pointerEvents: pointerEvents === true ? 'all' : pointerEvents || 'none',
      position: 'absolute'
    });

    if (calculateStyle.pointerEvents !== 'none') {
      this.removeWrapContainerEventListener(wrapContainer);
      penetrateEventList.forEach(event => {
        if (event === 'wheel') {
          wrapContainer.addEventListener('wheel', this.onWheel);
          wrapContainer.addEventListener('wheel', e => e.preventDefault(), true);
        }
      });
    }

    const { x: left, y: top } = this.calculatePosition(graphic, options.anchorType);
    const { left: offsetX, top: offsetTop } = this.calculateOffset(stage, nativeContainer, left, top);

    calculateStyle.left = `${offsetX}px`;
    calculateStyle.top = `${offsetTop}px`;

    if (type === 'text' && options.anchorType === 'position') {
      Object.assign(calculateStyle, this.getTransformOfText(graphic as IText));
    }

    this.applyUserStyles(options, calculateStyle, { offsetX, offsetTop, graphic, wrapContainer });

    // TODO 确认是否需要对接 VTableBrowserEnvContribution
    application.global.updateDom(wrapContainer, {
      width,
      height,
      style: calculateStyle
    });
  }

  /**
   * @description: 转换单元格样式
   * @param {IGraphic} graphic
   * @return {*}
   */
  private convertCellStyle(graphic: IGraphic) {
    const { col, row, stage } = getTargetGroup(graphic);
    const style = stage?.table?.getCellStyle(col, row);
    if (!style) {
      return;
    }
    // TODO 表格提供具体解析方法，暂时只解析padding
    return {
      ...style,
      padding: isArray(style.padding) ? style.padding.map(value => `${value}px`).join(' ') : style.padding
    };
  }

  /**
   * @description: 位置计算
   * @param {IGraphic} graphic
   * @param {string} anchorType
   * @return {*}
   */
  private calculatePosition(graphic: IGraphic, anchorType?: string) {
    const bounds = graphic.globalAABBBounds;
    if (anchorType === 'position' || bounds.empty()) {
      const matrix = graphic.globalTransMatrix;
      return { x: matrix.e, y: matrix.f };
    }
    return calculateAnchorOfBounds(bounds, anchorType || 'top-left');
  }

  /**
   * @description: 偏移计算
   * @param {IStage} stage
   * @param {HTMLElement} nativeContainer
   * @param {number} x
   * @param {number} y
   * @return {*}
   */
  private calculateOffset(stage: IStage, nativeContainer: HTMLElement, x: number, y: number) {
    const containerTL = application.global.getElementTopLeft(nativeContainer, false);
    const windowTL = stage.window.getTopLeft(false);
    return {
      left: x + windowTL.left - containerTL.left,
      top: y + windowTL.top - containerTL.top
    };
  }

  /**
   * @description: 应用用户样式
   * @param {SimpleDomStyleOptions & CommonDomOptions} options
   * @param {Record<string, any>} baseStyle
   * @param {Object} context
   * @return {*}
   */
  private applyUserStyles(
    options: SimpleDomStyleOptions & CommonDomOptions,
    baseStyle: Record<string, any>,
    context: { offsetX: number; offsetTop: number; graphic: IGraphic; wrapContainer: HTMLElement }
  ) {
    if (isFunction(options.style)) {
      const userStyle = options.style(
        {
          top: context.offsetTop,
          left: context.offsetX,
          width: context.graphic.globalAABBBounds.width(),
          height: context.graphic.globalAABBBounds.height()
        },
        context.graphic,
        context.wrapContainer
      );
      Object.assign(baseStyle, userStyle);
    } else if (isObject(options.style)) {
      Object.assign(baseStyle, options.style);
    } else if (isString(options.style)) {
      Object.assign(baseStyle, styleStringToObject(options.style));
    }
  }
}

/**
 * @description: 检查冻结容器
 * @param {IGraphic} graphic
 * @return {*}
 */
function checkFrozenContainer(graphic: IGraphic) {
  const { col, row, stage } = getTargetGroup(graphic);
  // @ts-ignore
  let container = graphic.attribute.vue?.container;
  const { table } = stage;

  if (container === table.bodyDomContainer) {
    if (col < table.frozenColCount && row >= table.rowCount - table.bottomFrozenRowCount) {
      container = table.bottomFrozenBodyDomContainer;
    } else if (
      col >= table.colCount - table.rightFrozenColCount &&
      row >= table.rowCount - table.bottomFrozenRowCount
    ) {
      container = table.rightFrozenBottomDomContainer;
    } else if (row >= table.rowCount - table.bottomFrozenRowCount) {
      container = table.bottomFrozenBodyDomContainer;
    } else if (col < table.frozenColCount) {
      container = table.frozenBodyDomContainer;
    } else if (col >= table.colCount - table.rightFrozenColCount) {
      container = table.rightFrozenBodyDomContainer;
    }
  } else if (container === table.headerDomContainer) {
    if (col < table.frozenColCount) {
      container = table.frozenHeaderDomContainer;
    } else if (col >= table.colCount - table.rightFrozenColCount) {
      container = table.rightFrozenHeaderDomContainer;
    }
  }

  return container;
}

/**
 * @description: 获取目标组
 * @param {any} target
 * @return {*}
 */
function getTargetGroup(target: any) {
  while (target?.parent) {
    if (target.name === 'custom-container') {
      return target;
    }
    target = target.parent;
  }
  return { col: -1, row: -1, stage: null };
}
