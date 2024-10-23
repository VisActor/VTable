import type { FederatedPointerEvent } from '@src/vrender';
import { handleWhell, isHorizontalScrollable, isVerticalScrollable } from '../scroll';
import type { EventManager } from '../event';
import { IconFuncTypeEnum } from '../../ts-types';

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

  const globalTouchMoveCallback = (e: TouchEvent) => {
    if (eventManager.touchMove) {
      e.preventDefault();
    }
    if (!eventManager.isTouchdown || !isTouchEvent(e)) {
      return;
    }
    console.log('downIcon', eventManager.downIcon);
    if ((eventManager.downIcon?.attribute as any)?.funcType === IconFuncTypeEnum.dragReorder) {
      // console.log()
      e.preventDefault();
    } else {
      // collect four last touch pisitions
      if (eventManager.touchMovePoints.length > 4) {
        eventManager.touchMovePoints.shift();
      }
      eventManager.touchMovePoints.push({
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        timestamp: Date.now()
      });
      if (eventManager._enableTableScroll) {
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
      }
    }
  };
  window.addEventListener('touchmove', globalTouchMoveCallback, { passive: false });
  eventManager.globalEventListeners.push({
    name: 'touchmove',
    env: 'window',
    callback: globalTouchMoveCallback
  });

  const globalTouchEndCallback = (e: TouchEvent) => {
    eventManager.touchEnd = true;
    eventManager.touchMove = false;
    if (!eventManager.isTouchdown || !isTouchEvent(e)) {
      return;
    }
    if ((eventManager.downIcon?.attribute as any)?.funcType === IconFuncTypeEnum.dragReorder) {
      // console.log()
      e.preventDefault();
    } else {
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

        if (eventManager._enableTableScroll) {
          const firstPoint = eventManager.touchMovePoints[0];
          const lastPoint = eventManager.touchMovePoints[eventManager.touchMovePoints?.length - 1];
          const vX = (lastPoint.x - firstPoint.x) / (lastPoint.timestamp - firstPoint.timestamp);
          const vY = (lastPoint.y - firstPoint.y) / (lastPoint.timestamp - firstPoint.timestamp);
          //开始惯性滚动
          eventManager.inertiaScroll.startInertia(vX, vY, 0.95);
          table.eventManager.inertiaScroll.setScrollHandle((dx: number, dy: number) => {
            handleWhell({ deltaX: -dx, deltaY: -dy } as any, table.stateManager);
          });
        }
      }
    }
    eventManager.isTouchdown = false;
    eventManager.touchMovePoints = [];
  };
  window.addEventListener('touchend', globalTouchEndCallback);
  eventManager.globalEventListeners.push({
    name: 'touchend',
    env: 'window',
    callback: globalTouchEndCallback
  });

  const globalTouchCancelCallback = (e: TouchEvent) => {
    eventManager.touchEnd = true;
    eventManager.touchMove = false;
    if (!eventManager.isTouchdown) {
      return;
    }
    eventManager.isTouchdown = false;
    eventManager.touchMovePoints = [];
  };
  window.addEventListener('touchcancel', globalTouchCancelCallback);
  eventManager.globalEventListeners.push({
    name: 'touchcancel',
    env: 'window',
    callback: globalTouchCancelCallback
  });
}

function isTouchEvent(e: TouchEvent | MouseEvent): e is TouchEvent {
  return !!(e as TouchEvent).changedTouches;
}
