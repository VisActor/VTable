import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { handleWhell } from './event/scroll';

export class EventManager {
  _gantt: Gantt;
  _eventHandler: EventHandler;
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this._eventHandler = new EventHandler();
    this.bindEvent();
  }

  // 绑定DOM事件
  bindEvent() {
    bindTableGroupListener(this);
    bindContainerDomListener(this);
    bindScrollBarListener(this);
  }
}
function bindTableGroupListener(event: EventManager) {
  // f
}

function bindContainerDomListener(event: EventManager) {
  const eventManager = event;
  const table = eventManager._gantt;
  const handler = eventManager._eventHandler;
  handler.on(table.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, event._gantt);
  });
}

function bindScrollBarListener(event: EventManager) {
  // f
}
