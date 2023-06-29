import type { StateManeger } from '../state/state';

export function handleWhell(event: WheelEvent, state: StateManeger) {
  let { deltaX, deltaY } = event;
  // 如果按住了shift 则进行横向滚动 纵向不滚动
  if (event.shiftKey && event.deltaY) {
    //mac电脑按住shift 鼠标滚动deltaX和deltaY是自动互换的，所以此逻辑只针对windows电脑有效及mac触摸板有效
    deltaX = deltaY;
    deltaY = 0;
  }
  const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(deltaX, deltaY, { horizontal: 1, vertical: 1 });

  if (optimizedDeltaX) {
    state.setScrollLeft(state.scroll.horizontalBarPos + optimizedDeltaX);
    state.showHorizontalScrollBar(true);
  }
  if (optimizedDeltaY) {
    state.setScrollTop(state.scroll.verticalBarPos + optimizedDeltaY);
    state.showVerticalScrollBar(true);
  }

  if (
    event.cancelable &&
    ((deltaY !== 0 && isVerticalScrollable(deltaY, state)) || (deltaX !== 0 && isHorizontalScrollable(deltaX, state)))
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

  return [Math.ceil(deltaX * ratio.horizontal), Math.ceil(deltaY * ratio.vertical)];
}

export function isVerticalScrollable(deltaY: number, state: StateManeger) {
  return !isScrollToTop(deltaY, state) && !isScrollToBottom(deltaY, state);
}

export function isHorizontalScrollable(deltaX: number, state: StateManeger) {
  return !isScrollToLeft(deltaX, state) && !isScrollToRight(deltaX, state);
}

function isScrollToTop(deltaY: number, state: StateManeger) {
  const totalHeight = state.table.getAllRowsHeight() - state.table.scenegraph.height;
  return totalHeight !== 0 && deltaY <= 0 && state.scroll.verticalBarPos < 1;
}

function isScrollToBottom(deltaY: number, state: StateManeger) {
  const totalHeight = state.table.getAllRowsHeight() - state.table.scenegraph.height;
  return totalHeight !== 0 && deltaY >= 0 && Math.abs(state.scroll.verticalBarPos - totalHeight) < 1;
}

function isScrollToLeft(deltaX: number, state: StateManeger) {
  const totalWidth = state.table.getAllColsWidth() - state.table.scenegraph.width;
  return totalWidth !== 0 && deltaX <= 0 && state.scroll.horizontalBarPos < 1;
}

function isScrollToRight(deltaX: number, state: StateManeger) {
  const totalWidth = state.table.getAllColsWidth() - state.table.scenegraph.width;
  return totalWidth !== 0 && deltaX >= 0 && Math.abs(state.scroll.horizontalBarPos - totalWidth) < 1;
}
