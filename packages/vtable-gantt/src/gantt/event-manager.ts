import type { FederatedPointerEvent } from '@visactor/vrender-core';
import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { handleWhell } from './event/scroll';
import { throttle } from '../tools/util';

export class EventManager {
  _gantt: Gantt;
  _eventHandler: EventHandler;
  isDown: boolean = false;
  isDraging: boolean = false;
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
  // f
}

function bindContainerDomListener(eventManager: EventManager) {
  const table = eventManager._gantt;
  const stateManager = table.stateManager;
  const handler = eventManager._eventHandler;
  handler.on(table.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, stateManager, eventManager._gantt);
  });
}
