import type { FederatedPointerEvent, FederatedWheelEvent } from '@visactor/vtable/es/vrender';

import type { Gantt } from '../Gantt';
import { InteractionState } from '../ts-types';
import type { EventManager } from './event-manager';
import { throttle } from '../tools/util';
import type { StateManager } from '../state/state-manager';
/**
 *
 * @param event
 * @param state
 * @param isWheelEvent 是否是由鼠标或者触摸板原生滚动事件触发进入？
 */
export function handleWhell(
  event: FederatedWheelEvent,
  state: StateManager,
  gantt: Gantt,
  isWheelEvent: boolean = true
) {
  let { deltaX, deltaY } = event;
  // 如果按住了shift 则进行横向滚动 纵向不滚动
  if (event.shiftKey && event.deltaY) {
    //mac电脑按住shift 鼠标滚动deltaX和deltaY是自动互换的，所以此逻辑只针对windows电脑有效及mac触摸板有效
    deltaX = deltaY;
    deltaY = 0;
  }
  const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(deltaX, deltaY, { horizontal: 1, vertical: 1 });
  if (optimizedDeltaX || optimizedDeltaY) {
    // if (state.interactionState !== InteractionState.scrolling) {
    //   state.updateInteractionState(InteractionState.scrolling);
    // }
  }

  if (optimizedDeltaX) {
    state.setScrollLeft(state.scroll.horizontalBarPos + optimizedDeltaX);
    gantt.scenegraph.scrollbarComponent.showHorizontalScrollBar(true);
  }
  if (optimizedDeltaY) {
    state.setScrollTop(state.scroll.verticalBarPos + optimizedDeltaY);
    gantt.scenegraph.scrollbarComponent.showVerticalScrollBar(true);
  }
  isWheelEvent && state.resetInteractionState();
  if (
    event.cancelable &&
    (state._gantt.parsedOptions.overscrollBehavior === 'none' ||
      (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0 && isVerticalScrollable(deltaY, state)) ||
      (Math.abs(deltaY) <= Math.abs(deltaX) && deltaX !== 0 && isHorizontalScrollable(deltaX, state)))
  ) {
    event.preventDefault();
  }
}

interface ScrollSpeedRatio {
  horizontal?: number;
  vertical?: number;
}

/**
 * 优化滚动方向，对于小角度的滚动，固定为一个方向
 * @param x
 * @param y
 * @param ratio
 */
function optimizeScrollXY(x: number, y: number, ratio: ScrollSpeedRatio): [number, number] {
  const ANGLE = 2; // 调参 根据斜率来调整xy方向的划分
  const angle = Math.abs(x / y);

  // 经过滚动优化之后的 x, y
  const deltaX = angle <= 1 / ANGLE ? 0 : x;
  const deltaY = angle > ANGLE ? 0 : y;

  return [Math.ceil(deltaX * (ratio.horizontal ?? 0)), Math.ceil(deltaY * (ratio.vertical ?? 0))];
}

export function isVerticalScrollable(deltaY: number, state: StateManager) {
  const totalHeight = state._gantt.getAllRowsHeight() - state._gantt.scenegraph.height;
  if (totalHeight === 0) {
    return false;
  }
  return !isScrollToTop(deltaY, state) && !isScrollToBottom(deltaY, state);
}

export function isHorizontalScrollable(deltaX: number, state: StateManager) {
  const totalWidth = state._gantt.getAllDateColsWidth() - state._gantt.scenegraph.width;
  if (totalWidth === 0) {
    return false;
  }
  return !isScrollToLeft(deltaX, state) && !isScrollToRight(deltaX, state);
}

function isScrollToTop(deltaY: number, state: StateManager) {
  const totalHeight = state._gantt.getAllRowsHeight() - state._gantt.scenegraph.height;
  return totalHeight !== 0 && deltaY <= 0 && state.scroll.verticalBarPos < 1;
}

function isScrollToBottom(deltaY: number, state: StateManager) {
  const totalHeight = state._gantt.getAllRowsHeight() - state._gantt.scenegraph.height;
  return totalHeight !== 0 && deltaY >= 0 && Math.abs(state.scroll.verticalBarPos - totalHeight) < 1;
}

function isScrollToLeft(deltaX: number, state: StateManager) {
  const totalWidth = state._gantt.getAllDateColsWidth() - state._gantt.scenegraph.width;
  return totalWidth !== 0 && deltaX <= 0 && state.scroll.horizontalBarPos < 1;
}

function isScrollToRight(deltaX: number, state: StateManager) {
  const totalWidth = state._gantt.getAllDateColsWidth() - state._gantt.scenegraph.width;
  return totalWidth !== 0 && deltaX >= 0 && Math.abs(state.scroll.horizontalBarPos - totalWidth) < 1;
}

export class InertiaScroll {
  friction: number;
  lastTime: number;
  speedX: number;
  speedY: number;
  stateManager: StateManager;
  runingId: number;
  scrollHandle: (dx: number, dy: number) => void;
  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
  }
  setScrollHandle(scrollHandle: (dx: number, dy: number) => void) {
    this.scrollHandle = scrollHandle;
  }

  startInertia(speedX: number, speedY: number, friction: number) {
    this.lastTime = Date.now();
    this.speedX = speedX;
    this.speedY = speedY;
    this.friction = friction;
    if (!this.runingId) {
      this.runingId = requestAnimationFrame(this.inertia.bind(this));
    }
  }
  inertia() {
    const now = Date.now();
    const dffTime = now - this.lastTime;
    let stopped = true;
    const f = Math.pow(this.friction, dffTime / 16);
    const newSpeedX = f * this.speedX;
    const newSpeedY = f * this.speedY;
    let dx = 0;
    let dy = 0;
    if (Math.abs(newSpeedX) > 0.05) {
      stopped = false;
      dx = ((this.speedX + newSpeedX) / 2) * dffTime;
    }
    if (Math.abs(newSpeedY) > 0.05) {
      stopped = false;
      dy = ((this.speedY + newSpeedY) / 2) * dffTime;
    }
    this.scrollHandle?.(dx, dy);
    if (stopped) {
      this.runingId = null;
      return;
    }
    this.lastTime = now;
    this.speedX = newSpeedX;
    this.speedY = newSpeedY;

    this.runingId = requestAnimationFrame(this.inertia.bind(this));
  }
  endInertia() {
    cancelAnimationFrame(this.runingId);
    this.runingId = null;
  }
  isInertiaScrolling() {
    return !!this.runingId;
  }
}

export function bindScrollBarListener(eventManager: EventManager) {
  const table = eventManager._gantt;
  const stateManager = table.stateManager;
  const scenegraph = table.scenegraph;

  // 监听滚动条组件pointover事件
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('pointerover', (e: any) => {
    scenegraph.scrollbarComponent.showVerticalScrollBar();
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('pointerover', (e: any) => {
    scenegraph.scrollbarComponent.showHorizontalScrollBar();
  });
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('pointerout', (e: any) => {
    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    scenegraph.scrollbarComponent.hideVerticalScrollBar();
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('pointerout', (e: any) => {
    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    scenegraph.scrollbarComponent.hideHorizontalScrollBar();
  });
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    // scenegraph._gantt.stateManager.updateCursor('default');
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成可拖拽
  });
  // scenegraph.scrollbarComponent.vScrollBar.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
  //   e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成拖拽状态
  //   if ((scenegraph._gantt as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
  //     scenegraph._gantt.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
  //       event: e.nativeEvent
  //     });
  //   }
  // });
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('scrollDown', (e: FederatedPointerEvent) => {
    // scenegraph._gantt.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    scenegraph._gantt.eventManager.isDown = true;

    // if ((scenegraph._gantt as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
    //   scenegraph._gantt.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
    //     event: e.nativeEvent
    //   });
    // }
  });
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('pointerup', () => {
    // stateManager.fastScrolling = false;
    scenegraph._gantt.eventManager.isDraging = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('pointerupoutside', () => {
    // stateManager.fastScrolling = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('scrollUp', (e: FederatedPointerEvent) => {
    scenegraph._gantt.eventManager.isDraging = false;
  });

  scenegraph.scrollbarComponent.hScrollBar.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    // scenegraph._gantt.stateManager.updateCursor('default');
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成可拖拽
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成拖拽状态
    // if ((scenegraph._gantt as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
    //   scenegraph._gantt.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
    //     event: e.nativeEvent
    //   });
    // }
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('scrollDown', (e: FederatedPointerEvent) => {
    // scenegraph._gantt.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    scenegraph._gantt.eventManager.isDown = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }

    // if ((scenegraph._gantt as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
    //   scenegraph._gantt.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
    //     event: e.nativeEvent
    //   });
    // }
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('pointerup', () => {
    // stateManager.fastScrolling = false;
    // scenegraph._gantt.eventManager.isDraging = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('pointerupoutside', () => {
    // stateManager.fastScrolling = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.scrollbarComponent.hScrollBar.addEventListener('scrollUp', (e: FederatedPointerEvent) => {
    scenegraph._gantt.eventManager.isDraging = false;
  });
  const throttleVerticalWheel = throttle(stateManager.updateVerticalScrollBar, 20);
  const throttleHorizontalWheel = throttle(stateManager.updateHorizontalScrollBar, 20);

  // 监听滚动条组件scroll事件
  scenegraph.scrollbarComponent.vScrollBar.addEventListener('scrollDrag', (e: any) => {
    if (scenegraph._gantt.eventManager.isDown) {
      scenegraph._gantt.eventManager.isDraging = true;
    }
    // stateManager.fastScrolling = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleVerticalWheel(ratio, e);
  });

  scenegraph.scrollbarComponent.hScrollBar.addEventListener('scrollDrag', (e: any) => {
    if (scenegraph._gantt.eventManager.isDown) {
      scenegraph._gantt.eventManager.isDraging = true;
    }
    stateManager.fastScrolling = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    // stateManager._gantt.scenegraph.proxy.isSkipProgress = true;
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleHorizontalWheel(ratio);
  });
}
