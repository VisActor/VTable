import { RotateTablePlugin } from '../src/rotate-table';

describe('RotateTablePlugin', () => {
  it('should instantiate', () => {
    // mock ListTable 必要属性和方法
    const mockTable = {
      rotate90WithTransform: jest.fn(),
      cancelTransform: jest.fn(),
      getElement: jest.fn(() => ({})),
    } as any;
    // mock vglobal
    const vglobal = { getViewportSize: jest.fn(() => ({ x1: 0, y1: 0, x2: 100, y2: 100 })) };
    // @ts-ignore
    global.vglobal = vglobal;
    const plugin = new RotateTablePlugin();
    plugin.table = mockTable;
    expect(plugin).toBeInstanceOf(RotateTablePlugin);
    expect(plugin.name).toBe('Rotate Table');
  });

  it('should have id and runTime', () => {
    const plugin = new RotateTablePlugin();
    expect(plugin.id).toBe('rotate-table');
    expect(Array.isArray(plugin.runTime)).toBe(true);
  });
});
