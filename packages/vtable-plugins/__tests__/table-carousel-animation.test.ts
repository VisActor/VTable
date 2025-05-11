import { TableCarouselAnimationPlugin } from '../src/table-carousel-animation';

describe('TableCarouselAnimationPlugin', () => {
  it('should instantiate with default options', () => {
    const plugin = new TableCarouselAnimationPlugin();
    expect(plugin).toBeInstanceOf(TableCarouselAnimationPlugin);
    expect(plugin.name).toBe('Table Carousel Animation');
  });

  it('should set options correctly', () => {
    const plugin = new TableCarouselAnimationPlugin({ rowCount: 5, colCount: 3, animationDuration: 100, animationDelay: 200 });
    expect(plugin.rowCount).toBe(5);
    expect(plugin.colCount).toBe(3);
    expect(plugin.animationDuration).toBe(100);
    expect(plugin.animationDelay).toBe(200);
  });
});
