import { getAdaptiveWidth } from '../src/scenegraph/layout/compute-col-width';

describe('adaptive width with resized columns', () => {
  test('keeps manually resized columns fixed while distributing remaining width', () => {
    const widths = [120, 100, 100, 100];
    const table: any = {
      internalProps: {
        _widthResizedColMap: new Set([0])
      },
      options: {},
      widthMode: 'adaptive',
      defaultColWidth: 80,
      getColWidth: jest.fn((col: number) => widths[col]),
      getMaxColWidth: jest.fn(() => Number.MAX_SAFE_INTEGER),
      getMinColWidth: jest.fn(() => 10),
      getBodyColumnType: jest.fn(() => 'text'),
      _adjustColWidth: jest.fn((_col: number, width: number) => width),
      _setColWidth: jest.fn((col: number, width: number) => {
        widths[col] = width;
      })
    };

    getAdaptiveWidth(800, 0, 4, false, [], table);

    expect(widths[0]).toBe(120);
    expect(widths.slice(1)).toEqual([227, 227, 226]);
    expect(widths.reduce((sum, width) => sum + width, 0)).toBe(800);
  });

  test('keeps autoFillWidth resized columns in width distribution', () => {
    const widths = [85, 100, 180, 100];
    const table: any = {
      internalProps: {
        _widthResizedColMap: new Set([0])
      },
      options: {},
      widthMode: 'standard',
      autoFillWidth: true,
      defaultColWidth: 80,
      getColWidth: jest.fn((col: number) => widths[col]),
      getMaxColWidth: jest.fn(() => Number.MAX_SAFE_INTEGER),
      getMinColWidth: jest.fn(() => 10),
      getBodyColumnType: jest.fn(() => 'text'),
      _adjustColWidth: jest.fn((_col: number, width: number) => width),
      _setColWidth: jest.fn((col: number, width: number) => {
        widths[col] = width;
      })
    };

    getAdaptiveWidth(800, 0, 4, false, [], table);

    expect(widths[0]).toBe(146);
    expect(widths.slice(1)).toEqual([172, 310, 172]);
    expect(widths.reduce((sum, width) => sum + width, 0)).toBe(800);
  });
});
