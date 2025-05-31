const vrenderMock = {
  registerGlobalEventTransformer: jest.fn(),
  registerWindowEventTransformer: jest.fn(),
  matrixAllocate: { allocate: jest.fn(() => ({ translate: jest.fn(), rotate: jest.fn() })) },
  transformPointForCanvas: jest.fn(),
  mapToCanvasPointForCanvas: jest.fn(),
  vglobal: {}
};
jest.mock('@visactor/vtable/es/vrender', () => vrenderMock);

describe('RotateTablePlugin', () => {
  beforeEach(() => {
    jest.resetModules();
    global.vglobal = vrenderMock.vglobal;
  });

  it('should handle rotate90WithTransform correctly', () => {
    const { rotate90WithTransform } = require('../src/rotate-table');
    const mockRotateDom = document.createElement('div');
    const mockTable = {
      pluginManager: { getPluginByName: jest.fn(() => ({ matrix: null, vglobal_mapToCanvasPoint: null })) },
      getElement: jest.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 100 }) })),
      scenegraph: { stage: { window: {} } },
      rotateDegree: 0
    } as any;
    rotate90WithTransform.call(mockTable, mockRotateDom);
    expect(mockTable.rotateDegree).toBe(90);
    expect(mockRotateDom.style.transform).toBe('rotate(90deg)');
    expect(vrenderMock.registerGlobalEventTransformer).toHaveBeenCalled();
    expect(vrenderMock.registerWindowEventTransformer).toHaveBeenCalled();
  });

  it('should handle cancelTransform correctly', () => {
    const { cancelTransform } = require('../src/rotate-table');
    const mockRotateDom = document.createElement('div');
    const mockTable = {
      pluginManager: { getPluginByName: jest.fn(() => ({ vglobal_mapToCanvasPoint: jest.fn() })) },
      getElement: jest.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 100 }) })),
      scenegraph: { stage: { window: {} } },
      rotateDegree: 90
    } as any;
    cancelTransform.call(mockTable, mockRotateDom);
    expect(mockTable.rotateDegree).toBe(0);
    expect(mockRotateDom.style.transform).toBe('none');
    expect(vrenderMock.registerGlobalEventTransformer).toHaveBeenCalled();
    expect(vrenderMock.registerWindowEventTransformer).toHaveBeenCalled();
  });
});