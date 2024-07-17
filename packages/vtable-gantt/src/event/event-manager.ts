import type { FederatedPointerEvent, Group } from '@visactor/vrender-core';
import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { handleWhell } from '../event/scroll';
import { throttle } from '../tools/util';
import { InteractionState } from '../ts-types';

export class EventManager {
  _gantt: Gantt;
  _eventHandler: EventHandler;
  isDown: boolean = false;
  isDraging: boolean = false;
  LastPointerXY: { x: number; y: number };
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
  const eventManager = event;
  const stateManager = gantt.stateManager;
  scene.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    gantt.eventManager.LastPointerXY = { x: e.x, y: e.y };
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    if (e.target?.name === 'task-bar') {
      stateManager.startMoveTaskBar(e.target, e.x);
      stateManager.updateInteractionState(InteractionState.grabing);
    }
  });

  scene.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    const lastX = gantt.eventManager.LastPointerXY?.x ?? e.x;
    const lastY = gantt.eventManager.LastPointerXY?.y ?? e.y;
    if (stateManager.interactionState === InteractionState.grabing) {
      if (Math.abs(lastX - e.x) + Math.abs(lastY - e.y) >= 1) {
        if (stateManager.isMoveingTaskBar()) {
          stateManager.dealTaskBarMove(e);
        }
        gantt.eventManager.LastPointerXY = { x: e.x, y: e.y };
      }
    }
  });

  scene.stage.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    if (stateManager.interactionState === 'grabing') {
      stateManager.updateInteractionState(InteractionState.default);
      if (stateManager.isMoveingTaskBar()) {
        stateManager.endMoveTaskBar(e.x, e.y);
      }
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
}
