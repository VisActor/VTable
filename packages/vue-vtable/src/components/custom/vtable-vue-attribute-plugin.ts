import { CUSTOM_CONTAINER_NAME, CUSTOM_MERGE_PRE_NAME } from '@visactor/vtable';
import type {
  CommonDomOptions,
  IGraphic,
  IGroup,
  IPlugin,
  IStage,
  IText,
  SimpleDomStyleOptions
} from '@visactor/vtable/es/vrender';
import { HtmlAttributePlugin, vglobal } from '@visactor/vtable/es/vrender';
import {
  calculateAnchorOfBounds,
  isArray,
  isEqual,
  isFunction,
  isNil,
  isObject,
  isString,
  styleStringToObject
} from '@visactor/vutils';
import type { VNode } from 'vue';
import { render } from 'vue';

/**
 * 表格自定义组件集成插件
 */
export class VTableVueAttributePlugin extends HtmlAttributePlugin implements IPlugin {
  name: string = 'VTableVueAttributePlugin';
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
      // 最后访问的时间戳
      lastAccessed?: number;
    }
  >;
  /** 渲染队列 */
  private renderQueue = new Set<IGraphic>();
  /** 是否正在渲染 */
  private isRendering = false;
  /** 最大缓存节点数(兜底值) */
  private MAX_CACHE_COUNT = 100;
  /** 记录节点访问顺序(LRU用) */
  private accessQueue: string[] = [];
  /** 目标可视区区(可视区外一定范围内的节点，保留) */
  private VIEWPORT_BUFFER = 100;
  /** 缓冲区(非可视区且非缓冲区的节点需清理) */
  private BUFFER_ZONE = 500;
  // 新增批量更新队列
  private styleUpdateQueue = new Map<string, Partial<CSSStyleDeclaration>>();
  /** 样式更新中 */
  private styleUpdateRequested = false;
  /** 事件集 */
  private eventHandlers = new WeakMap<HTMLElement, (e: WheelEvent) => void>();
  /** 当前上下文 */
  currentContext?: any;

  constructor(currentContext?: any) {
    super();
    this.currentContext = currentContext;
  }

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
    vglobal.getRequestAnimationFrame()(() => {
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
    // 校验并传递上下文
    this.checkToPassAppContext(element, graphic);
    // 渲染或更新 Vue 组件
    if (!targetMap || !this.checkDom(targetMap.wrapContainer)) {
      // 缓存节点检查
      this.checkAndClearCache(graphic);
      const { wrapContainer, nativeContainer, reuse } = this.getWrapContainer(stage, actualContainer, { id, options });
      if (wrapContainer) {
        const dataRenderId = `${this.renderId}`;
        wrapContainer.id = id;
        wrapContainer.setAttribute('data-vue-renderId', dataRenderId);
        // 先隐藏
        wrapContainer.style.display = 'none';
        if (!reuse) {
          // 仅在非复用时需要重新渲染
          render(element, wrapContainer);
        }
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
    }

    // 更新样式并记录渲染 ID
    if (targetMap) {
      targetMap.renderId = this.renderId;
      targetMap.lastAccessed = Date.now();
      this.updateAccessQueue(id);
      this.updateStyleOfWrapContainer(graphic, stage, targetMap.wrapContainer, targetMap.nativeContainer);
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
   * @description: 校验并传递上下文
   * @param {VNode} vnode
   * @param {IGraphic} graphic
   * @return {*}
   */
  private checkToPassAppContext(vnode: VNode, graphic: IGraphic) {
    try {
      const customConfig = this.getCustomConfig(graphic);
      const userAppContext = customConfig?.getVueUserAppContext?.() ?? this.currentContext;
      // 简单校验合法性
      if (!!userAppContext?.components && !!userAppContext?.directives) {
        vnode.appContext = userAppContext;
      }
    } catch (error) {}
  }
  /**
   * @description: 获取自定义配置
   * @param {IGraphic} graphic
   * @return {*}
   */
  private getCustomConfig(graphic: IGraphic) {
    const target = getTargetGroup(graphic);
    return target?.stage?.table?.options?.customConfig;
  }
  /**
   * @description: 检查是否需要渲染
   * @param {IGraphic} graphic
   * @return {*}
   */
  private checkNeedRender(graphic: IGraphic) {
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
   * @description: 判断是否在可视范围内
   * @param {IGraphic} graphic
   * @return {*}
   */
  private checkInViewport(graphic: IGraphic) {
    return this.checkInViewportByZone(graphic, this.VIEWPORT_BUFFER);
  }
  /**
   * @description: 判断是否在缓冲区内
   * @param {IGraphic} graphic
   * @return {*}
   */
  private checkInBuffer(graphic: IGraphic) {
    return this.checkInViewportByZone(graphic, this.BUFFER_ZONE);
  }
  /**
   * @description: 判断当前是否在指定视口范围内
   * @param {IGraphic} graphic
   * @param {number} buffer
   * @return {*}
   */
  private checkInViewportByZone(graphic: IGraphic, buffer: number = 0) {
    const { stage, globalAABBBounds: cBounds } = graphic;
    if (!stage) {
      return false;
    }
    // 获取视口的AABB边界
    //@ts-ignore
    const { AABBBounds: vBounds } = stage;
    // 扩展视口判断范围
    const eBounds = {
      x1: vBounds.x1 - buffer,
      x2: vBounds.x2 + buffer,
      y1: vBounds.y1 - buffer,
      y2: vBounds.y2 + buffer
    };
    // 判断两个区域是否相交
    const isIntersecting =
      cBounds.x1 < eBounds.x2 && cBounds.x2 > eBounds.x1 && cBounds.y1 < eBounds.y2 && cBounds.y2 > eBounds.y1;

    return isIntersecting;
  }

  /**
   * @description: 节点访问顺序队列
   * @param {string} id
   * @return {*}
   */
  private updateAccessQueue(id: string) {
    // 移除旧记录
    const index = this.accessQueue.indexOf(id);
    if (index > -1) {
      this.accessQueue.splice(index, 1);
    }
    // 添加到队列头部
    this.accessQueue.unshift(id);
  }

  /**
   * @description: 在添加新节点前检查缓存大小
   * @param {IGraphic} graphic
   * @return {*}
   */
  private checkAndClearCache(graphic: IGraphic) {
    const { viewportNodes, bufferNodes, cacheNodes } = this.classifyNodes();
    const total = viewportNodes.length + bufferNodes.length + cacheNodes.length;
    const customConfig = this.getCustomConfig(graphic);
    const maxTotal = customConfig?.maxDomCacheCount ?? this.MAX_CACHE_COUNT;

    // 仅当总数超过阈值时清理
    if (total <= maxTotal) {
      return;
    }
    const exceedingCount = total - maxTotal;

    // 优先清理缓存区节点: 移除缓存区的前 exceedingCount 个节点
    let toRemove = cacheNodes.slice(0, exceedingCount);

    // 若缓存区节点不满足阈值，为了控制内存占用率，按最后访问时间清除最早访问的缓冲区节点
    if (toRemove.length < exceedingCount) {
      const bufferCandidates = bufferNodes
        .sort((a, b) => this.htmlMap[a].lastAccessed - this.htmlMap[b].lastAccessed)
        .slice(0, exceedingCount - toRemove.length);
      toRemove = toRemove.concat(bufferCandidates);
    }

    // 执行清理
    toRemove.forEach(id => this.removeElement(id, true));
  }

  /**
   * @description: 节点按可视区/缓存区/缓冲区分类
   * @return {*}
   */
  private classifyNodes() {
    /** 可视区节点 */
    const viewportNodes: string[] = [];
    /** 缓冲区节点 */
    const bufferNodes: string[] = [];
    /** 既不在可视区也不在缓冲区的节点 */
    const cacheNodes: string[] = [];

    Object.keys(this.htmlMap).forEach(id => {
      const node = this.htmlMap[id];
      if (node.isInViewport) {
        viewportNodes.push(id);
      } else if (this.checkInBuffer(node.graphic)) {
        bufferNodes.push(id);
      } else {
        cacheNodes.push(id);
      }
    });

    return {
      viewportNodes,
      bufferNodes,
      cacheNodes
    };
  }
  /**
   * @description: 检查 dom 是否存在
   * @param {HTMLElement} dom
   * @return {*}
   */
  private checkDom(dom: HTMLElement) {
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
    if (!clear) {
      // 移除 dom 但保留在 htmlMap 中，供下次进入可视区时快速复用
      wrapContainer.remove();
      // 标记不在视口
      record.isInViewport = false;
      // 清理访问队列
      const index = this.accessQueue.indexOf(id);
      if (index > -1) {
        this.accessQueue.splice(index, 1);
      }
    } else {
      // 卸载子组件
      render(null, wrapContainer);
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
      nativeContainer = typeof userContainer === 'string' ? vglobal.getElementById(userContainer) : userContainer;
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
        reuse: true,
        wrapContainer,
        nativeContainer
      };
    }

    return {
      wrapContainer: vglobal.createDom({ tagName: 'div', parent: nativeContainer }),
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
    const { pointerEvents } = options;
    const calculateStyle = this.parseDefaultStyleFromGraphic(graphic);
    // 单元格样式
    const style = this.convertCellStyle(graphic);
    Object.assign(calculateStyle, {
      width: `${width}px`,
      height: `${height}px`,
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
      this.checkToAddEventListener(wrapContainer);
    }

    if (type === 'text' && options.anchorType === 'position') {
      Object.assign(calculateStyle, this.getTransformOfText(graphic as IText));
    }
    this.applyUserStyles(options, calculateStyle, { offsetX, offsetTop, graphic, wrapContainer });

    // 样式变化检查
    const styleChanged = !isEqual(record.lastStyle, calculateStyle);
    if (styleChanged) {
      this.styleUpdateQueue.set(wrapContainer.id, calculateStyle);
      // 请求批量更新
      this.requestStyleUpdate();
      // TODO 确认是否需要对接 VTableBrowserEnvContribution
      // vglobal.updateDom(wrapContainer, {
      //   width,
      //   height,
      //   style: calculateStyle
      // });

      record.lastStyle = calculateStyle;
    }
  }

  /**
   * @description: 事件监听器管理
   * @param {HTMLElement} wrapContainer
   * @return {*}
   */
  private checkToAddEventListener(wrapContainer: HTMLElement) {
    if (!this.eventHandlers.has(wrapContainer)) {
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        this.onWheel(e);
      };
      wrapContainer.addEventListener('wheel', handler, { passive: false });
      this.eventHandlers.set(wrapContainer, handler);
    }
  }

  /**
   * @description: 样式更新
   * @return {*}
   */
  private requestStyleUpdate() {
    if (!this.styleUpdateRequested) {
      this.styleUpdateRequested = true;
      vglobal.getRequestAnimationFrame()(() => {
        this.styleUpdateQueue.forEach((changes, id) => {
          const container = this.htmlMap?.[id]?.wrapContainer;
          if (container) {
            Object.assign(container.style, changes);
          }
        });
        this.styleUpdateQueue.clear();
        this.styleUpdateRequested = false;
      });
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
    const containerTL = vglobal.getElementTopLeft(nativeContainer, false);
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
    if (target.name === CUSTOM_CONTAINER_NAME || (target.name || '').startsWith(CUSTOM_MERGE_PRE_NAME)) {
      return target;
    }
    target = target.parent;
  }
  return { col: -1, row: -1, stage: null };
}
