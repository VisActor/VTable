import { CarouselAnimationPlugin } from '../src/carousel-animation';

describe('CarouselAnimationPlugin', () => {
  it('should instantiate with default options', () => {
    // mock BaseTableAPI 必要属性和方法
    const mockTableAPI = {
      id: 'mock-id',
      recordsCount: 0,
      rowCount: 0,
      colCount: 0,
      on: jest.fn(),
      off: jest.fn(),
      // 可根据插件内部用到的属性继续补充
    } as any;
    // 传递 options 参数，避免 undefined 报错
    const plugin = new CarouselAnimationPlugin(mockTableAPI, {});
    expect(plugin).toBeInstanceOf(CarouselAnimationPlugin);
    expect(plugin.table).toBe(mockTableAPI);
  });

  it('should set options correctly', () => {
    const mockTableAPI = { on: jest.fn(), off: jest.fn() } as any;
    const plugin = new CarouselAnimationPlugin(mockTableAPI, { rowCount: 5, colCount: 3, animationDuration: 100, animationDelay: 200 });
    expect(plugin.rowCount).toBe(5);
    expect(plugin.colCount).toBe(3);
    expect(plugin.animationDuration).toBe(100);
    expect(plugin.animationDelay).toBe(200);
  });
});
