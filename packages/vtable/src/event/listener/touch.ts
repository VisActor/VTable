import type { FederatedPointerEvent } from '@visactor/vrender';
import { handleWhell, isHorizontalScrollable, isVerticalScrollable } from '../scroll';
import type { EventManeger } from '../event';
import type { StateManeger } from '../../state/state';

export function bindTouchListener(eventManeger: EventManeger) {
  const table = eventManeger.table;
  const stateManeger = table.stateManeger;
  const scenegraph = table.scenegraph;

  // deal width touch scrolling in mobile devices
  eventManeger.touchMovePoints = [];
  table.scenegraph.tableGroup.addEventListener('touchstart', (e: FederatedPointerEvent) => {
    if (e.target.isChildOf(scenegraph.component.vScrollBar) || e.target.isChildOf(scenegraph.component.vScrollBar)) {
      return;
    }
    eventManeger.isTouchdown = true;
    eventManeger.touchMovePoints.push({
      x: e.page.x,
      y: e.page.y,
      timestamp: Date.now()
    });
  });

  window.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (eventManeger.touchMove) {
        e.preventDefault();
      }
      if (!eventManeger.isTouchdown || !isTouchEvent(e)) {
        return;
      }

      // collect four last touch pisitions
      if (eventManeger.touchMovePoints.length > 4) {
        eventManeger.touchMovePoints.shift();
      }
      eventManeger.touchMovePoints.push({
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        timestamp: Date.now()
      });

      const deltaX =
        -eventManeger.touchMovePoints[eventManeger.touchMovePoints.length - 1].x +
        eventManeger.touchMovePoints[eventManeger.touchMovePoints.length - 2].x;
      const deltaY =
        -eventManeger.touchMovePoints[eventManeger.touchMovePoints.length - 1].y +
        eventManeger.touchMovePoints[eventManeger.touchMovePoints.length - 2].y;
      handleWhell({ deltaX, deltaY } as any, stateManeger);

      if (
        e.cancelable &&
        ((deltaY !== 0 && isVerticalScrollable(deltaY, stateManeger)) ||
          (deltaX !== 0 && isHorizontalScrollable(deltaX, stateManeger)))
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener('touchend', (e: TouchEvent) => {
    eventManeger.touchEnd = true;
    eventManeger.touchMove = false;
    if (!eventManeger.isTouchdown || !isTouchEvent(e)) {
      return;
    }
    if (eventManeger.touchMovePoints?.length) {
      if (eventManeger.touchMovePoints.length > 4) {
        eventManeger.touchMovePoints.shift();
      }
      eventManeger.touchMovePoints.push({
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        timestamp: Date.now()
      });
      // compute inertia parameter
      const firstPoint = eventManeger.touchMovePoints[0];
      const lastPoint = eventManeger.touchMovePoints[eventManeger.touchMovePoints?.length - 1];
      const vX = (lastPoint.x - firstPoint.x) / (lastPoint.timestamp - firstPoint.timestamp);
      const vY = (lastPoint.y - firstPoint.y) / (lastPoint.timestamp - firstPoint.timestamp);
      //开始惯性滚动
      startInertia(vX, vY, stateManeger);
    }

    eventManeger.isTouchdown = false;
    eventManeger.touchMovePoints = [];
  });

  window.addEventListener('touchcancel', (e: TouchEvent) => {
    eventManeger.touchEnd = true;
    eventManeger.touchMove = false;
    if (!eventManeger.isTouchdown) {
      return;
    }
    eventManeger.isTouchdown = false;
    eventManeger.touchMovePoints = [];
  });
}

function isTouchEvent(e: TouchEvent | MouseEvent): e is TouchEvent {
  return !!(e as TouchEvent).changedTouches;
}

/**
 * @description: start inertia scrolling, speed decrease by 0.95/16ms
 * @param {number} vX
 * @param {number} vY
 * @param {StateManeger} stateManeger
 * @return {*}
 */
function startInertia(vX: number, vY: number, stateManeger: StateManeger) {
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
    handleWhell({ deltaX: -dx, deltaY: -dy } as any, stateManeger);
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
