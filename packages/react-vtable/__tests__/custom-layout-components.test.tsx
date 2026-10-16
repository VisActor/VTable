/* eslint-env jest */
/* global document */
import React from 'react';
import { Group } from '@visactor/vtable/es/vrender';
import { createStageFromVRenderApp } from '@visactor/vtable/es/vrender-app';
import { Button, Link } from '../src/components';
import { createReconcilerContainer, reconcilor } from '../src/table-components/custom/reconciler';

type TestReconciler = typeof reconcilor & {
  flushSyncWork?: () => unknown;
  flushPassiveEffects?: () => unknown;
};

describe('custom layout components', () => {
  test.each([
    ['Link', React.createElement(Link, null, 'View')],
    ['Button', React.createElement(Button, null, 'View')]
  ])('%s can mount before its graphic is attached to a stage', (_, component) => {
    const detachedGroup = new Group({});
    const container = createReconcilerContainer(detachedGroup);
    const testReconciler = reconcilor as TestReconciler;
    const canvas = document.createElement('canvas');
    const { stage, releaseAppRef } = createStageFromVRenderApp(
      {
        canvas,
        width: 200,
        height: 80
      },
      { mode: 'browser', scope: 'react-custom-layout-components' }
    );

    try {
      expect(() => {
        testReconciler.updateContainer(component, container, null);
        testReconciler.flushSyncWork?.();
        testReconciler.flushPassiveEffects?.();
      }).not.toThrow();

      const graphic = detachedGroup.firstChild;
      expect(graphic).toBeTruthy();
      expect(graphic.stage).toBeFalsy();

      stage.defaultLayer.add(detachedGroup);
      stage.render();

      expect(detachedGroup.firstChild).toBe(graphic);
      expect(graphic.stage).toBe(stage);
    } finally {
      testReconciler.updateContainer(null, container, null);
      testReconciler.flushSyncWork?.();
      testReconciler.flushPassiveEffects?.();
      stage.release();
      releaseAppRef();
    }
  });
});
