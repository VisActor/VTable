// @ts-nocheck

global.__VERSION__ = 'none';

import { Gantt } from '../src/index';

describe('Gantt._sortScales', () => {
  // Regression test for https://github.com/VisActor/VTable/issues/5159
  // When only `zoomScale` is configured (so `timelineHeader.scales` is still
  // undefined), `_sortScales` used to crash on `timelineScales.length`.
  test('does not throw when timelineHeader.scales is undefined', () => {
    const context = {
      options: { timelineHeader: {} },
      parsedOptions: {}
    };

    expect(() => Gantt.prototype._sortScales.call(context)).not.toThrow();
    expect(context.parsedOptions.sortedTimelineScales.map(scale => scale.unit)).toEqual(['day']);
    expect(context.parsedOptions.reverseSortedTimelineScales.map(scale => scale.unit)).toEqual(['day']);
  });

  test('does not share mutable default scale objects across calls', () => {
    const firstContext = {
      options: {},
      parsedOptions: {}
    };
    const secondContext = {
      options: {},
      parsedOptions: {}
    };

    Gantt.prototype._sortScales.call(firstContext);
    firstContext.parsedOptions.sortedTimelineScales[0].timelineDates = ['stale'];
    Gantt.prototype._sortScales.call(secondContext);

    expect(secondContext.parsedOptions.sortedTimelineScales[0].timelineDates).toBeUndefined();
  });

  test('still sorts the configured scales', () => {
    const context = {
      options: { timelineHeader: { scales: [{ unit: 'day' }, { unit: 'month' }] } },
      parsedOptions: {}
    };

    Gantt.prototype._sortScales.call(context);

    expect(context.parsedOptions.sortedTimelineScales.map(scale => scale.unit)).toEqual(['month', 'day']);
    expect(context.parsedOptions.reverseSortedTimelineScales.map(scale => scale.unit)).toEqual(['day', 'month']);
  });

  test('uses zoomScale current level when timelineHeader.scales is undefined', () => {
    const context = {
      options: {
        timelineHeader: {
          zoomScale: {
            enabled: true,
            levels: [
              [
                { unit: 'month', step: 1 },
                { unit: 'day', step: 1 }
              ]
            ]
          }
        }
      },
      zoomScaleManager: {
        config: {
          levels: [
            [
              { unit: 'month', step: 1 },
              { unit: 'day', step: 1 }
            ]
          ]
        },
        getCurrentLevel: () => 0
      },
      parsedOptions: {}
    };

    Gantt.prototype._sortScales.call(context);

    expect(context.options.timelineHeader.scales.map(scale => scale.unit)).toEqual(['month', 'day']);
    expect(context.parsedOptions.sortedTimelineScales.map(scale => scale.unit)).toEqual(['month', 'day']);
    expect(context.parsedOptions.reverseSortedTimelineScales.map(scale => scale.unit)).toEqual(['day', 'month']);
  });
});
