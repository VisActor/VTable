// @ts-nocheck
jest.mock('@visactor/vtable', () => {
  const vrender = jest.requireActual('../../vtable/src/vrender');

  return {
    matrixAllocate: vrender.matrixAllocate,
    transformPointForCanvas: vrender.transformPointForCanvas,
    mapToCanvasPointForCanvas: vrender.mapToCanvasPointForCanvas,
    registerGlobalEventTransformer: vrender.registerGlobalEventTransformer,
    registerWindowEventTransformer: vrender.registerWindowEventTransformer,
    vglobal: {
      mapToCanvasPoint: jest.fn(),
      setEventListenerTransformer: jest.fn()
    },
    TABLE_EVENT_TYPE: {
      INITIALIZED: 'initialized'
    }
  };
});

import { vglobal } from '@visactor/vtable';
import { cancelTransform } from '../src/rotate-table';

global.__VERSION__ = 'none';

describe('RotateTablePlugin cancel transform - issue #5235', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('keeps wheel preventDefault connected to the native event after canceling rotation', () => {
    const tableElement = document.createElement('div');
    jest.spyOn(tableElement, 'getBoundingClientRect').mockReturnValue({
      x: 40,
      y: 80,
      left: 40,
      top: 80,
      right: 640,
      bottom: 480,
      width: 600,
      height: 400,
      toJSON: () => ({})
    });

    const originalMapToCanvasPoint = vglobal.mapToCanvasPoint;
    const windowSetEventListenerTransformer = jest.fn();
    let globalTransformer;

    jest.spyOn(vglobal, 'setEventListenerTransformer').mockImplementation(transformer => {
      globalTransformer = transformer;
    });

    const table = {
      rotateDegree: 90,
      getElement: () => tableElement,
      scenegraph: {
        stage: {
          window: {
            setEventListenerTransformer: windowSetEventListenerTransformer
          }
        }
      },
      pluginManager: {
        getPluginByName: () => ({
          vglobal_mapToCanvasPoint: originalMapToCanvasPoint
        })
      }
    };

    cancelTransform.call(table, document.createElement('div'));

    const nativeWheelEvent = new WheelEvent('wheel', {
      cancelable: true,
      clientX: 120,
      clientY: 160,
      deltaY: 40
    });
    const transformedWheelEvent = globalTransformer(nativeWheelEvent);

    transformedWheelEvent.preventDefault();

    expect(transformedWheelEvent).toBe(nativeWheelEvent);
    expect(nativeWheelEvent.defaultPrevented).toBe(true);
    expect(windowSetEventListenerTransformer).toHaveBeenCalledTimes(1);
    expect(table.rotateDegree).toBe(0);
    expect(vglobal.mapToCanvasPoint).toBe(originalMapToCanvasPoint);
  });
});
