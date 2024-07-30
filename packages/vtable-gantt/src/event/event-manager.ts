import type { FederatedPointerEvent, Group } from '@visactor/vrender-core';
import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { handleWhell } from '../event/scroll';
import { throttle } from '../tools/util';
import { InteractionState } from '../ts-types';
import { isValid } from '@visactor/vutils';
import { getPixelRatio } from '../tools/pixel-ratio';

export class EventManager {
  _gantt: Gantt;
  _eventHandler: EventHandler;
  isDown: boolean = false;
  isDraging: boolean = false;
  lastDragPointerXYOnTableGroup: { x: number; y: number };

  // lastDragPointerXYOnResizeLine: { x: number; y: number };
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this._eventHandler = new EventHandler();
    this.bindEvent();
  }

  // 绑定DOM事件
  bindEvent() {
    bindTableGroupListener(this);
    bindContainerDomListener(this);
    // bindScrollBarListener(this);
  }
}
function bindTableGroupListener(event: EventManager) {
  const scene = event._gantt.scenegraph;
  const gantt = event._gantt;
  const stateManager = gantt.stateManager;
  scene.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    gantt.eventManager.lastDragPointerXYOnTableGroup = { x: e.x, y: e.y };
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    if (e.target?.name === 'task-bar' || e.target?.name === 'task-bar-hover-shadow') {
      stateManager.startMoveTaskBar(e.target, e.x, e.y);
      stateManager.updateInteractionState(InteractionState.grabing);
    } else if (e.target?.name === 'task-bar-hover-shadow-left-icon') {
      stateManager.startResizeTaskBar(e.target, e.x, e.y, 'left');
      stateManager.updateInteractionState(InteractionState.grabing);
    } else if (e.target?.name === 'task-bar-hover-shadow-right-icon') {
      stateManager.startResizeTaskBar(e.target, e.x, e.y, 'right');
      stateManager.updateInteractionState(InteractionState.grabing);
    }
  });

  scene.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    const lastX = gantt.eventManager.lastDragPointerXYOnTableGroup?.x ?? e.x;
    const lastY = gantt.eventManager.lastDragPointerXYOnTableGroup?.y ?? e.y;
    if (stateManager.interactionState === InteractionState.grabing) {
      if (Math.abs(lastX - e.x) + Math.abs(lastY - e.y) >= 1) {
        if (stateManager.isMoveingTaskBar()) {
          stateManager.dealTaskBarMove(e);
        } else if (stateManager.isResizingTaskBar()) {
          stateManager.dealTaskBartResize(e);
        }
        gantt.eventManager.lastDragPointerXYOnTableGroup = { x: e.x, y: e.y };
      }
    } else if (stateManager.interactionState === InteractionState.default) {
      console.log(e.target?.name, e.target?.name === 'task-bar-hover-shadow-left-icon');
      if (
        e.target?.name === 'task-bar' ||
        e.target?.name === 'task-bar-hover-shadow' ||
        e.target?.name === 'task-bar-hover-shadow-left-icon' ||
        e.target?.name === 'task-bar-hover-shadow-right-icon'
      ) {
        console.log('show');
        stateManager.showTaskBarHover(e);
      } else {
        console.log('hide');
        stateManager.hideTaskBarHover();
      }
    }
  });

  scene.stage.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    if (stateManager.interactionState === 'grabing') {
      stateManager.updateInteractionState(InteractionState.default);
      if (stateManager.isMoveingTaskBar()) {
        stateManager.endMoveTaskBar(e.x);
      } else if (stateManager.isResizingTaskBar()) {
        stateManager.endtResizeTaskBar(e.x);
      }
    }
  });

  scene.tableGroup.addEventListener('pointerenter', (e: FederatedPointerEvent) => {
    if (
      (gantt.scrollStyle.horizontalVisible && gantt.scrollStyle.horizontalVisible === 'focus') ||
      (!gantt.scrollStyle.horizontalVisible && gantt.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.showHorizontalScrollBar();
    }
    if (
      (gantt.scrollStyle.verticalVisible && gantt.scrollStyle.verticalVisible === 'focus') ||
      (!gantt.scrollStyle.verticalVisible && gantt.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.showVerticalScrollBar();
    }
  });

  scene.tableGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
    if (
      (gantt.scrollStyle.horizontalVisible && gantt.scrollStyle.horizontalVisible === 'focus') ||
      (!gantt.scrollStyle.horizontalVisible && gantt.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.hideHorizontalScrollBar();
    }
    if (
      (gantt.scrollStyle.verticalVisible && gantt.scrollStyle.verticalVisible === 'focus') ||
      (!gantt.scrollStyle.verticalVisible && gantt.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.hideVerticalScrollBar();
    }
  });
}

function bindContainerDomListener(eventManager: EventManager) {
  const gantt = eventManager._gantt;
  const stateManager = gantt.stateManager;
  const handler = eventManager._eventHandler;
  handler.on(gantt.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, stateManager, eventManager._gantt);
  });

  handler.on(gantt.getContainer(), 'resize', e => {
    // if (table.canvasSizeSeted) {
    //   return;
    // }
    if (e.width === 0 && e.height === 0) {
      // 临时绕行解决因为display设置为none产生的问题
      return;
    }
    if (!isValid(gantt.options.pixelRatio)) {
      gantt.setPixelRatio(getPixelRatio());
    }
    if (!e.windowSizeNotChange) {
      gantt._resize();
    }
  });

  gantt.resizeLine?.addEventListener('mousedown', e => {
    console.log('mousedown resizeLine');
    // eventManager.lastDragPointerXYOnResizeLine = { x: e.x, y: e.y };
    stateManager.updateInteractionState(InteractionState.grabing);
    stateManager.startResizeTableWidth(e);
  });
  document.body.addEventListener('mousemove', (e: MouseEvent) => {
    if (stateManager.isResizingTableWidth()) {
      stateManager.dealResizeTableWidth(e);
    }
  });
  document.body.addEventListener('mouseup', () => {
    if (stateManager.isResizingTableWidth()) {
      stateManager.updateInteractionState(InteractionState.default);
      stateManager.endResizeTableWidth();
    }
  });
}
