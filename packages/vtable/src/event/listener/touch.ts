import type { FederatedPointerEvent } from '@src/vrender';
import { handleWhell, isHorizontalScrollable, isVerticalScrollable } from '../scroll';
import type { EventManager } from '../event';
import type { StateManager } from '../../state/state';

export function bindTouchListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;
  const scenegraph = table.scenegraph;

  // deal width touch scrolling in mobile devices
  eventManager.touchMovePoints = [];
  table.scenegraph.tableGroup.addEventListener('touchstart', (e: FederatedPointerEvent) => {
    if (e.target.isChildOf(scenegraph.component.vScrollBar) || e.target.isChildOf(scenegraph.component.vScrollBar)) {
      return;
    }
    eventManager.isTouchdown = true;
    eventManager.touchMovePoints.push({
      x: e.page.x,
      y: e.page.y,
      timestamp: Date.now()
    });
  });

  window.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (eventManager.touchMove) {
        e.preventDefault();
      }
      if (!eventManager.isTouchdown || !isTouchEvent(e)) {
        return;
      }

      // collect four last touch pisitions
      if (eventManager.touchMovePoints.length > 4) {
        eventManager.touchMovePoints.shift();
      }
      eventManager.touchMovePoints.push({
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        timestamp: Date.now()
      });

      const deltaX =
        -eventManager.touchMovePoints[eventManager.touchMovePoints.length - 1].x +
        eventManager.touchMovePoints[eventManager.touchMovePoints.length - 2].x;
      const deltaY =
        -eventManager.touchMovePoints[eventManager.touchMovePoints.length - 1].y +
        eventManager.touchMovePoints[eventManager.touchMovePoints.length - 2].y;
      handleWhell({ deltaX, deltaY } as any, stateManager);

      if (
        e.cancelable &&
        (table.internalProps.overscrollBehavior === 'none' ||
          (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0 && isVerticalScrollable(deltaY, stateManager)) ||
          (Math.abs(deltaY) <= Math.abs(deltaX) && deltaX !== 0 && isHorizontalScrollable(deltaX, stateManager)))
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener('touchend', (e: TouchEvent) => {
    eventManager.touchEnd = true;
    eventManager.touchMove = false;
    if (!eventManager.isTouchdown || !isTouchEvent(e)) {
      return;
    }
    if (eventManager.touchMovePoints?.length) {
      if (eventManager.touchMovePoints.length > 4) {
        eventManager.touchMovePoints.shift();
      }
      eventManager.touchMovePoints.push({
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        timestamp: Date.now()
      });
      // compute inertia parameter
      const firstPoint = eventManager.touchMovePoints[0];
      const lastPoint = eventManager.touchMovePoints[eventManager.touchMovePoints?.length - 1];
      const vX = (lastPoint.x - firstPoint.x) / (lastPoint.timestamp - firstPoint.timestamp);
      const vY = (lastPoint.y - firstPoint.y) / (lastPoint.timestamp - firstPoint.timestamp);
      //开始惯性滚动
      startInertia(vX, vY, stateManager);
    }

    eventManager.isTouchdown = false;
    eventManager.touchMovePoints = [];
  });

  window.addEventListener('touchcancel', (e: TouchEvent) => {
    eventManager.touchEnd = true;
    eventManager.touchMove = false;
    if (!eventManager.isTouchdown) {
      return;
    }
    eventManager.isTouchdown = false;
    eventManager.touchMovePoints = [];
  });
}

function isTouchEvent(e: TouchEvent | MouseEvent): e is TouchEvent {
  return !!(e as TouchEvent).changedTouches;
}

/**
 * @description: start inertia scrolling, speed decrease by 0.95/16ms
 * @param {number} vX
 * @param {number} vY
 * @param {StateManager} stateManager
 * @return {*}
 */
function startInertia(vX: number, vY: number, stateManager: StateManager) {
  let time = Date.now();
  const friction = 0.95;
  const inertia = () => {
    const now = Date.now();
    const dffTime = now - time;
    let stopped = true;
    const f = Math.pow(friction, dffTime / 16);
    const newVX = f * vX;
    const newVY = f * vY;
    let dx = 0;
    let dy = 0;
    if (Math.abs(newVX) > 0.05) {
      stopped = false;
      dx = ((vX + newVX) / 2) * dffTime;
    }
    if (Math.abs(newVY) > 0.05) {
      stopped = false;
      dy = ((vY + newVY) / 2) * dffTime;
    }
    handleWhell({ deltaX: -dx, deltaY: -dy } as any, stateManager);
    if (stopped) {
      return;
    }
    time = now;
    vX = newVX;
    vY = newVY;

    requestAnimationFrame(inertia);
  };
  requestAnimationFrame(inertia);
}
