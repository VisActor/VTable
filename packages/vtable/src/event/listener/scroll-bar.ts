import { throttle } from '../../tools/util';
import { InteractionState } from '../../ts-types';
import type { EventManeger } from '../event';

export function bindScrollBarListener(eventManeger: EventManeger) {
  const table = eventManeger.table;
  const stateManeger = table.stateManeger;
  const scenegraph = table.scenegraph;

  // 监听滚动条组件pointover事件
  scenegraph.component.vScrollBar.addEventListener('pointerover', (e: any) => {
    stateManeger.showVerticalScrollBar();
  });
  scenegraph.component.hScrollBar.addEventListener('pointerover', (e: any) => {
    stateManeger.showHorizontalScrollBar();
  });
  scenegraph.component.vScrollBar.addEventListener('pointerout', (e: any) => {
    if (stateManeger.interactionState === InteractionState.scrolling) {
      return;
    }
    stateManeger.hideVerticalScrollBar();
  });
  scenegraph.component.hScrollBar.addEventListener('pointerout', (e: any) => {
    if (stateManeger.interactionState === InteractionState.scrolling) {
      return;
    }
    stateManeger.hideHorizontalScrollBar();
  });
  // 目前ScrollBar的pointerdown事件回调内有e.stopPropagation，因此无法通过vScrollBar监听，先使用_slider监听
  (scenegraph.component.vScrollBar as any)._slider.addEventListener('pointerdown', () => {
    if (stateManeger.interactionState !== InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.scrolling);
    }
  });
  scenegraph.component.vScrollBar.addEventListener('pointerup', () => {
    stateManeger.fastScrolling = false;
    if (stateManeger.interactionState === InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.component.vScrollBar.addEventListener('pointerupoutside', () => {
    stateManeger.fastScrolling = false;
    if (stateManeger.interactionState === InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.default);
    }
  });
  // 目前ScrollBar的pointerdown事件回调内有e.stopPropagation，因此无法通过hScrollBar监听，先使用_slider监听
  (scenegraph.component.hScrollBar as any)._slider.addEventListener('pointerdown', () => {
    if (stateManeger.interactionState !== InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.scrolling);
    }
  });
  scenegraph.component.hScrollBar.addEventListener('pointerup', () => {
    stateManeger.fastScrolling = false;
    if (stateManeger.interactionState === InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.default);
    }
  });
  scenegraph.component.hScrollBar.addEventListener('pointerupoutside', () => {
    stateManeger.fastScrolling = false;
    if (stateManeger.interactionState === InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.default);
    }
  });

  const throttleVerticalWheel = throttle(stateManeger.updateVerticalScrollBar, 20);
  const throttleHorizontalWheel = throttle(stateManeger.updateHorizontalScrollBar, 20);

  // 监听滚动条组件scroll事件
  scenegraph.component.vScrollBar.addEventListener('scroll', (e: any) => {
    stateManeger.fastScrolling = true;
    if (stateManeger.interactionState !== InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.scrolling);
    }
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleVerticalWheel(ratio, e);
  });

  scenegraph.component.hScrollBar.addEventListener('scroll', (e: any) => {
    stateManeger.fastScrolling = true;
    if (stateManeger.interactionState !== InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.scrolling);
    }
    const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
    throttleHorizontalWheel(ratio);
  });
}
