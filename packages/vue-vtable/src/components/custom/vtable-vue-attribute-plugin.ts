/*
 * @Author: lym
 * @Date: 2025-02-24 09:32:53
 * @LastEditors: lym
 * @LastEditTime: 2025-03-20 19:35:09
 * @Description:
 */
import type {
  CommonDomOptions,
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
  isEqual,
  isFunction,
  isNil,
  isObject,
  isString,
  styleStringToObject,
  uniqArray
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
      /** 是否在视口内 */
      isInViewport: boolean;
      /** 上次位置 */
      lastPosition?: { x: number; y: number } | null;
      /** 上次样式 */
      lastStyle?: Record<string, any>;
    }
  >;
  /** 渲染队列 */
  private renderQueue = new Set<IGraphic>();
  /** 是否正在渲染 */
  private isRendering = false;

  /**
   * @description: 单元格变化后重新渲染组件，由 HtmlAttributePlugin 插件触发
   * @param {IGraphic} graphic
   * @return {*}
   */
  renderGraphicHTML(graphic: IGraphic) {
    if (!this.checkNeedRender(graphic)) {
      return;
    }
    // 加入异步渲染队列
    this.renderQueue.add(graphic);
    this.scheduleRender();
  }

  /**
   * @description: 渲染调度
   * @return {*}
   */
  private scheduleRender() {
    if (this.isRendering) {
      return;
    }

    this.isRendering = true;
    requestAnimationFrame(() => {
      this.renderQueue.forEach(graphic => {
        try {
          this.doRenderGraphic(graphic);
        } catch (error) {
          const { id } = this.getGraphicOptions(graphic) || {};
          this.removeElement(id, true);
        }
      });
      this.renderQueue.clear();
      this.isRendering = false;
    });
  }
  /**
   * @description: 单元格变化后实际组件渲染方法
   * @param {IGraphic} graphic
   * @return {*}
   */
  doRenderGraphic(graphic: IGraphic) {
    const { id, options } = this.getGraphicOptions(graphic);
    if (!id) {
      return;
    }
    const stage = graphic.stage;
    const { element, container: expectedContainer } = options;
    // 获取实际容器
    const actualContainer = expectedContainer ? checkFrozenContainer(graphic) : expectedContainer;
    // 检查是否需要移除旧容器
    let targetMap = this.htmlMap?.[id];
    if (targetMap && actualContainer && actualContainer !== targetMap.container) {
      // 容器变更
      this.removeElement(id);
      targetMap = null;
    }

    // 渲染或更新 Vue 组件
    if (!targetMap || !this.checkDom(targetMap.wrapContainer)) {
      const { wrapContainer, nativeContainer } = this.getWrapContainer(stage, actualContainer, { id, options });
      if (wrapContainer) {
        // 检查历史渲染节点
        const historyWrapContainer = document.getElementById(id);
        const dataRenderId = `${this.renderId}`;
        if (historyWrapContainer && historyWrapContainer.getAttribute('data-vue-renderId') !== dataRenderId) {
          // 历史渲染节点清除
          render(null, historyWrapContainer);
          historyWrapContainer.remove();
          this.removeWrapContainerEventListener(historyWrapContainer);
        }
        wrapContainer.id = id;
        wrapContainer.setAttribute('data-vue-renderId', dataRenderId);
        render(element, wrapContainer);
        targetMap = {
          wrapContainer,
          nativeContainer,
          container: actualContainer,
          renderId: this.renderId,
          graphic,
          isInViewport: true,
          lastPosition: null,
          lastStyle: {}
        };
        this.htmlMap[id] = targetMap;
      }
    } else {
      render(element, targetMap.wrapContainer);
    }

    // 更新样式并记录渲染 ID
    if (targetMap) {
      this.updateStyleOfWrapContainer(graphic, stage, targetMap.wrapContainer, targetMap.nativeContainer);
      targetMap.renderId = this.renderId;
    }
  }

  /**
   * @description: 获取渲染参数
   * @param {IGraphic} graphic
   * @return {*}
   */
  private getGraphicOptions(graphic: IGraphic) {
    // TODO render 组件接入 vue 类型
    //@ts-ignore
    const { vue } = graphic?.attribute || {};
    if (!vue) {
      return null;
    }
    const id = isNil(vue.id) ? graphic.id ?? graphic._uid : vue.id;
    return { id: `vue_${id}`, options: vue };
  }
  /**
   * @description: 检查是否需要渲染
   * @param {IGraphic} graphic
   * @return {*}
   */
  checkNeedRender(graphic: IGraphic) {
    const { id, options } = this.getGraphicOptions(graphic) || {};
    if (!id) {
      return false;
    }

    const stage = graphic.stage;
    if (!stage) {
      return false;
    }

    const { element } = options;
    if (!element) {
      return false;
    }

    const isInViewport = this.checkInViewport(graphic);
    // 不在可视区内暂时不需要移除，因为在 clearCacheContainer 方法中提前被移除了
    return isInViewport;
  }
  /**
   * @description: 判断当前是否在可视区内
   * @param {IGraphic} graphic
   * @return {*}
   */
  checkInViewport(graphic: IGraphic) {
    const { stage, globalAABBBounds: cBounds } = graphic;
    if (!stage) {
      return false;
    }
    // 设立缓冲区 100px，提前加载
    const BUFFER = 100;
    // 获取视口的AABB边界
    //@ts-ignore
    const { AABBBounds: vBounds } = stage;
    // 扩展视口判断范围
    const eBounds = {
      x1: vBounds.x1 - BUFFER,
      x2: vBounds.x2 + BUFFER,
      y1: vBounds.y1 - BUFFER,
      y2: vBounds.y2 + BUFFER
    };
    // 判断两个区域是否相交
    const isIntersecting =
      cBounds.x1 < eBounds.x2 && cBounds.x2 > eBounds.x1 && cBounds.y1 < eBounds.y2 && cBounds.y2 > eBounds.y1;

    return isIntersecting;
  }
  /**
   * @description: 检查 dom 是否存在
   * @param {HTMLElement} dom
   * @return {*}
   */
  checkDom(dom: HTMLElement) {
    if (!dom) {
      return false;
    }
    return document.contains(dom);
  }

  /**
   * @description: 清除所有 dom
   * @param {IGraphic} g
   * @return {*}
   */
  removeAllDom(g: IGraphic) {
    if (this.htmlMap) {
      Object.keys(this.htmlMap).forEach(key => {
        this.removeElement(key, true);
      });

      this.htmlMap = null;
    }
  }
  /**
   * @description: 移除元素
   * @param {string} id
   * @param {boolean} clear 强制清除
   * @return {*}
   * 目前涉及到页面重绘的操作(比如列宽拖动会使得图形重绘，id变更)，会有短暂的容器插拔现象
   */
  removeElement(id: string, clear?: boolean) {
    const record = this.htmlMap?.[id];
    if (!record) {
      return;
    }
    const { wrapContainer } = record;
    if (!wrapContainer) {
      return;
    }
    // 卸载子组件
    render(null, wrapContainer);
    if (!clear) {
      // 移除 dom 但保留在 htmlMap 中，供下次进入可视区时快速复用
      wrapContainer.remove();
      // 标记不在视口
      record.isInViewport = false;
    } else {
      this.checkDom(wrapContainer) && super.removeElement(id);
      // 清理引用
      delete this.htmlMap[id];
    }
    // 清理事件
    this.removeWrapContainerEventListener(wrapContainer);
  }

  /**
   * @description: 获取包裹容器
   * @param {IStage} stage
   * @param {string} userContainer
   * @param {CreateDOMParamsType} domParams
   * @return {*}
   */
  getWrapContainer(stage: IStage, userContainer?: string | HTMLElement | null, domParams?: any) {
    let nativeContainer: HTMLElement;
    if (userContainer) {
      nativeContainer =
        typeof userContainer === 'string' ? application.global.getElementById(userContainer) : userContainer;
    } else {
      nativeContainer = stage.window.getContainer();
    }

    const { id } = domParams || {};
    // 从 htmlMap 查找可复用 dom
    const record = this.htmlMap?.[id];
    if (record && !record.isInViewport) {
      const { wrapContainer } = record;
      if (!this.checkDom(wrapContainer)) {
        // 添加游离节点
        nativeContainer.appendChild(wrapContainer);
      }
      return {
        wrapContainer,
        nativeContainer
      };
    }

    return {
      wrapContainer: application.global.createDom({ tagName: 'div', parent: nativeContainer }),
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
    const { x: left, y: top } = this.calculatePosition(graphic, options.anchorType);
    const { left: offsetX, top: offsetTop } = this.calculateOffset(stage, nativeContainer, left, top);

    const { id } = this.getGraphicOptions(graphic) || {};
    const record = id ? this.htmlMap[id] : null;
    if (!record) {
      return;
    }

    // 位置变化检查
    const positionChanged =
      !record.lastPosition || record.lastPosition.x !== offsetX || record.lastPosition.y !== offsetTop;
    if (!positionChanged) {
      // 位置没有变化，无需更新样式
      return;
    }

    // 默认自定义区域内也可带动表格画布滚动
    const { pointerEvents = true, penetrateEventList = ['wheel'] } = options;
    const calculateStyle = this.parseDefaultStyleFromGraphic(graphic);
    // 单元格样式
    const style = this.convertCellStyle(graphic);
    Object.assign(calculateStyle, {
      overflow: 'hidden',
      ...(style || {}),
      ...(rest || {}),
      transform: `translate(${offsetX}px, ${offsetTop}px)`,
      boxSizing: 'border-box',
      display: visible !== false ? display || 'block' : 'none',
      pointerEvents: pointerEvents === true ? 'all' : pointerEvents || 'none',
      position: 'absolute'
    });

    if (calculateStyle.pointerEvents !== 'none') {
      this.removeWrapContainerEventListener(wrapContainer);
      uniqArray(penetrateEventList).forEach((event: any) => {
        if (event === 'wheel') {
          wrapContainer.addEventListener('wheel', this.onWheel);
          wrapContainer.addEventListener('wheel', e => e.preventDefault(), true);
        }
      });
    }

    if (type === 'text' && options.anchorType === 'position') {
      Object.assign(calculateStyle, this.getTransformOfText(graphic as IText));
    }
    this.applyUserStyles(options, calculateStyle, { offsetX, offsetTop, graphic, wrapContainer });

    // 样式变化检查
    const styleChanged = !isEqual(record.lastStyle, calculateStyle);
    if (styleChanged) {
      // TODO 确认是否需要对接 VTableBrowserEnvContribution
      application.global.updateDom(wrapContainer, {
        width,
        height,
        style: calculateStyle
      });

      record.lastStyle = calculateStyle;
    }
  }

  /**
   * @description: 转换单元格样式
   * @param {IGraphic} graphic
   * @return {*}
   */
  private convertCellStyle(graphic: IGraphic) {
    const { col, row, stage } = getTargetGroup(graphic);
    const style = stage?.table?.getCellStyle(col, row);
    if (!isObject(style)) {
      return;
    }
    const { lineHeight, padding, ...rest } = style as any;
    // TODO 表格提供具体解析方法，暂时只解析padding
    return {
      ...rest,
      padding: isArray(padding) ? padding.map(value => `${value}px`).join(' ') : padding
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
