import type { FederatedPointerEvent } from '@src/vrender';
import { throttle } from '../../tools/util';
import type { ListTableAPI } from '../../ts-types';
import { InteractionState } from '../../ts-types';
import type { EventManager } from '../event';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet } from '../util';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';

export function bindScrollBarListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;
  const scenegraph = table.scenegraph;

  // 监听滚动条组件pointover事件
  scenegraph.component.vScrollBar.addEventListener('pointerover', (e: any) => {
    stateManager.showVerticalScrollBar();
  });
  scenegraph.component.hScrollBar.addEventListener('pointerover', (e: any) => {
    stateManager.showHorizontalScrollBar();
  });
  scenegraph.component.vScrollBar.addEventListener('pointerout', (e: any) => {
    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    stateManager.hideVerticalScrollBar();
  });
  scenegraph.component.hScrollBar.addEventListener('pointerout', (e: any) => {
    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    stateManager.hideHorizontalScrollBar();
  });
  scenegraph.component.vScrollBar.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    scenegraph.table.stateManager.updateCursor('default');
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成可拖拽
  });
  scenegraph.component.vScrollBar.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成拖拽状态
    if ((scenegraph.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
      scenegraph.table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
        event: e.nativeEvent
      });
    }
  });
  scenegraph.component.vScrollBar.addEventListener('scrollDown', (e: FederatedPointerEvent) => {
    scenegraph.table.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    scenegraph.table.eventManager.isDown = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    scenegraph.table.stateManager.hideMenu();
    (scenegraph.table as ListTableAPI).editorManager?.completeEdit();
    if ((scenegraph.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
      scenegraph.table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
        event: e.nativeEvent
      });
    }
  });
  scenegraph.component.vScrollBar.addEventListener('pointerup', () => {
    stateManager.fastScrolling = false;
    scenegraph.table.eventManager.isDraging = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.component.vScrollBar.addEventListener('pointerupoutside', () => {
    stateManager.fastScrolling = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.component.vScrollBar.addEventListener('scrollUp', (e: FederatedPointerEvent) => {
    scenegraph.table.eventManager.isDraging = false;
  });

  scenegraph.component.hScrollBar.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    scenegraph.table.stateManager.updateCursor('default');
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成可拖拽
  });
  scenegraph.component.hScrollBar.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    e.stopPropagation(); //防止冒泡到stage上 检测到挨着列间隔线判断成拖拽状态
    if ((scenegraph.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
      scenegraph.table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
        event: e.nativeEvent
      });
    }
  });
  scenegraph.component.hScrollBar.addEventListener('scrollDown', (e: FederatedPointerEvent) => {
    scenegraph.table.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    scenegraph.table.eventManager.isDown = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    scenegraph.table.stateManager.hideMenu();
    (scenegraph.table as ListTableAPI).editorManager?.completeEdit();
    if ((scenegraph.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
      scenegraph.table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
        event: e.nativeEvent
      });
    }
  });
  scenegraph.component.hScrollBar.addEventListener('pointerup', () => {
    stateManager.fastScrolling = false;
    scenegraph.table.eventManager.isDraging = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.component.hScrollBar.addEventListener('pointerupoutside', () => {
    stateManager.fastScrolling = false;
    if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.component.hScrollBar.addEventListener('scrollUp', (e: FederatedPointerEvent) => {
    scenegraph.table.eventManager.isDraging = false;
  });
  const throttleVerticalWheel = throttle(stateManager.updateVerticalScrollBar, 20);
  const throttleHorizontalWheel = throttle(stateManager.updateHorizontalScrollBar, 20);

  // 监听滚动条组件scroll事件
  scenegraph.component.vScrollBar.addEventListener('scrollDrag', (e: any) => {
    if (scenegraph.table.eventManager.isDown) {
      scenegraph.table.eventManager.isDraging = true;
    }
    stateManager.fastScrolling = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleVerticalWheel(ratio, e);
  });

  scenegraph.component.hScrollBar.addEventListener('scrollDrag', (e: any) => {
    if (scenegraph.table.eventManager.isDown) {
      scenegraph.table.eventManager.isDraging = true;
    }
    stateManager.fastScrolling = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    // stateManager.table.scenegraph.proxy.isSkipProgress = true;
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleHorizontalWheel(ratio);
    // setTimeout(() => {
    //   console.log('isSkipProgress', false);
    //   stateManager.table.scenegraph.proxy.isSkipProgress = false;
    // }, 10);
  });
}
