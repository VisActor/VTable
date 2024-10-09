import type { StateManager } from '../state/state';
import { InteractionState } from '../ts-types';
import type { FederatedWheelEvent } from '@src/vrender';

/**
 *
 * @param event
 * @param state
 * @param isWheelEvent 是否是由鼠标或者触摸板原生滚动事件触发进入？
 */
export function handleWhell(event: FederatedWheelEvent, state: StateManager, isWheelEvent: boolean = true) {
  let { deltaX, deltaY } = event;
  // 如果按住了shift 则进行横向滚动 纵向不滚动
  if (event.shiftKey && event.deltaY) {
    //mac电脑按住shift 鼠标滚动deltaX和deltaY是自动互换的，所以此逻辑只针对windows电脑有效及mac触摸板有效
    deltaX = deltaY;
    deltaY = 0;
  }
  const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(deltaX, deltaY, { horizontal: 1, vertical: 1 });
  if (optimizedDeltaX || optimizedDeltaY) {
    if (state.interactionState !== InteractionState.scrolling) {
      state.updateInteractionState(InteractionState.scrolling);
    }
  }

  if (optimizedDeltaX) {
    state.setScrollLeft(state.scroll.horizontalBarPos + optimizedDeltaX, event);
    state.showHorizontalScrollBar(true);
  }
  if (optimizedDeltaY) {
    state.setScrollTop(state.scroll.verticalBarPos + optimizedDeltaY, event);
    state.showVerticalScrollBar(true);
  }
  isWheelEvent && state.resetInteractionState(state.interactionStateBeforeScroll);
  if (
    event.nativeEvent?.cancelable &&
    (state.table.internalProps.overscrollBehavior === 'none' ||
      (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0 && isVerticalScrollable(deltaY, state)) ||
      (Math.abs(deltaY) <= Math.abs(deltaX) && deltaX !== 0 && isHorizontalScrollable(deltaX, state)))
  ) {
    event.nativeEvent.preventDefault();
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
  const totalHeight = state.table.getAllRowsHeight() - state.table.scenegraph.height;
  if (totalHeight === 0) {
    return false;
  }
  return !isScrollToTop(deltaY, state) && !isScrollToBottom(deltaY, state);
}

export function isHorizontalScrollable(deltaX: number, state: StateManager) {
  const totalWidth = state.table.getAllColsWidth() - state.table.scenegraph.width;
  if (totalWidth === 0) {
    return false;
  }
  return !isScrollToLeft(deltaX, state) && !isScrollToRight(deltaX, state);
}

function isScrollToTop(deltaY: number, state: StateManager) {
  const totalHeight = state.table.getAllRowsHeight() - state.table.scenegraph.height;
  return totalHeight !== 0 && deltaY <= 0 && state.scroll.verticalBarPos < 1;
}

function isScrollToBottom(deltaY: number, state: StateManager) {
  // 这里加入tolerance，避免出现无用滚动
  const sizeTolerance = state.table.options.customConfig?._disableColumnAndRowSizeRound ? 1 : 0;

  const totalHeight = state.table.getAllRowsHeight() - state.table.scenegraph.height;
  return totalHeight !== 0 && deltaY >= 0 && Math.abs(state.scroll.verticalBarPos - totalHeight) < 1 + sizeTolerance;
}

function isScrollToLeft(deltaX: number, state: StateManager) {
  const totalWidth = state.table.getAllColsWidth() - state.table.scenegraph.width;
  return totalWidth !== 0 && deltaX <= 0 && state.scroll.horizontalBarPos < 1;
}

function isScrollToRight(deltaX: number, state: StateManager) {
  // 这里加入tolerance，避免出现无用滚动
  const sizeTolerance = state.table.options.customConfig?._disableColumnAndRowSizeRound ? 1 : 0;

  const totalWidth = state.table.getAllColsWidth() - state.table.scenegraph.width;
  return totalWidth !== 0 && deltaX >= 0 && Math.abs(state.scroll.horizontalBarPos - totalWidth) < 1 + sizeTolerance;
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
