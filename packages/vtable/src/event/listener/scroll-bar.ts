import { throttle } from '../../tools/util';
import { InteractionState } from '../../ts-types';
import type { EventManager } from '../event';

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
  // 目前ScrollBar的pointerdown事件回调内有e.stopPropagation，因此无法通过vScrollBar监听，先使用_slider监听
  (scenegraph.component.vScrollBar as any)._slider.addEventListener('pointerdown', () => {
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
  });
  scenegraph.component.vScrollBar.addEventListener('pointerup', () => {
    stateManager.fastScrolling = false;
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
  // 目前ScrollBar的pointerdown事件回调内有e.stopPropagation，因此无法通过hScrollBar监听，先使用_slider监听
  (scenegraph.component.hScrollBar as any)._slider.addEventListener('pointerdown', () => {
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
  });
  scenegraph.component.hScrollBar.addEventListener('pointerup', () => {
    stateManager.fastScrolling = false;
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

  const throttleVerticalWheel = throttle(stateManager.updateVerticalScrollBar, 20);
  const throttleHorizontalWheel = throttle(stateManager.updateHorizontalScrollBar, 20);

  // 监听滚动条组件scroll事件
  scenegraph.component.vScrollBar.addEventListener('scroll', (e: any) => {
    stateManager.fastScrolling = true;
    if (stateManager.interactionState !== InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.scrolling);
    }
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleVerticalWheel(ratio, e);
  });

  scenegraph.component.hScrollBar.addEventListener('scroll', (e: any) => {
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
