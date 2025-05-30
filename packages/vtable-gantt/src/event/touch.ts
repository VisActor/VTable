import { vglobal } from '@visactor/vtable/es/vrender';
import type { FederatedPointerEvent } from '@visactor/vtable/es/vrender';
import { handleWhell, isHorizontalScrollable, isVerticalScrollable } from './scroll';
import type { EventManager } from './event-manager';

export function bindTouchListener(eventManager: EventManager) {
  const gantt = eventManager._gantt;
  const stateManager = gantt.stateManager;
  const scenegraph = gantt.scenegraph;
  if ((vglobal as any).envContribution.supportsTouchEvents === false) {
    return;
  }
  // 阻止右键事件
  vglobal.addEventListener(
    'contextmenu',
    e => {
      e.stopPropagation();
      e.preventDefault();
    },
    // 捕获阶段就阻止
    { capture: true }
  );
  // deal width touch scrolling in mobile devices
  eventManager.touchMovePoints = [];
  gantt.scenegraph.ganttGroup.addEventListener('touchstart', (e: FederatedPointerEvent) => {
    if (
      e.target.isChildOf(scenegraph.scrollbarComponent.vScrollBar) ||
      e.target.isChildOf(scenegraph.scrollbarComponent.hScrollBar)
    ) {
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
    if (eventManager.isLongTouch) {
      e.preventDefault();
    }
    if (!eventManager.isTouchdown || !isTouchEvent(e)) {
      return;
    }
    eventManager.isTouchMove = true;

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
      handleWhell(e as any, stateManager, gantt);

      if (
        e.cancelable &&
        (gantt.parsedOptions.overscrollBehavior === 'none' ||
          (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0 && isVerticalScrollable(deltaY, stateManager)) ||
          (Math.abs(deltaY) <= Math.abs(deltaX) && deltaX !== 0 && isHorizontalScrollable(deltaX, stateManager)))
      ) {
        e.preventDefault();
      }
    }
  };
  vglobal.addEventListener('touchmove', globalTouchMoveCallback, { passive: false });
  eventManager.globalEventListeners.push({
    name: 'touchmove',
    env: 'vglobal',
    callback: globalTouchMoveCallback
  });

  const globalTouchEndCallback = (e: TouchEvent) => {
    eventManager.touchEnd = true;
    eventManager.isLongTouch = false;
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

      if (eventManager._enableTableScroll) {
        const firstPoint = eventManager.touchMovePoints[0];
        const lastPoint = eventManager.touchMovePoints[eventManager.touchMovePoints?.length - 1];
        const vX = (lastPoint.x - firstPoint.x) / (lastPoint.timestamp - firstPoint.timestamp);
        const vY = (lastPoint.y - firstPoint.y) / (lastPoint.timestamp - firstPoint.timestamp);
        //开始惯性滚动
        eventManager.inertiaScroll.startInertia(vX, vY, 0.95);
        gantt.eventManager.inertiaScroll.setScrollHandle((dx: number, dy: number) => {
          handleWhell({ deltaX: -dx, deltaY: -dy } as any, gantt.stateManager, gantt);
        });
      }
    }

    eventManager.isTouchdown = false;
    eventManager.isTouchMove = false;
    eventManager.isDraging = false;
    eventManager.touchMovePoints = [];
  };
  vglobal.addEventListener('touchend', globalTouchEndCallback);
  eventManager.globalEventListeners.push({
    name: 'touchend',
    env: 'vglobal',
    callback: globalTouchEndCallback
  });

  const globalTouchCancelCallback = (e: TouchEvent) => {
    eventManager.touchEnd = true;
    eventManager.isLongTouch = false;

    if (!eventManager.isTouchdown) {
      return;
    }
    eventManager.isTouchdown = false;
    eventManager.isTouchMove = false;
    eventManager.touchMovePoints = [];
    eventManager.isDraging = false;
  };
  vglobal.addEventListener('touchcancel', globalTouchCancelCallback);
  eventManager.globalEventListeners.push({
    name: 'touchcancel',
    env: 'vglobal',
    callback: globalTouchCancelCallback
  });
}

function isTouchEvent(e: TouchEvent | MouseEvent): e is TouchEvent {
  return !!(e as TouchEvent).changedTouches;
}
