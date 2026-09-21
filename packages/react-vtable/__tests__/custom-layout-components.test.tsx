/* eslint-env jest */
import React from 'react';
import { Group } from '@visactor/vtable/es/vrender';
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

    expect(() => {
      testReconciler.updateContainer(component, container, null);
      testReconciler.flushSyncWork?.();
      testReconciler.flushPassiveEffects?.();
    }).not.toThrow();

    testReconciler.updateContainer(null, container, null);
    testReconciler.flushSyncWork?.();
    testReconciler.flushPassiveEffects?.();
  });
});
