import { TableCarouselAnimationPlugin } from '../src/table-carousel-animation';

describe('TableCarouselAnimationPlugin', () => {
  let mockTable;
  let plugin;

  beforeEach(() => {
    mockTable = {
      frozenRowCount: 0,
      frozenColCount: 0,
      scenegraph: {
        proxy: {
          screenTopRow: 0,
          screenLeftCol: 0
        }
      },
      scrollToRow: jest.fn(),
      scrollToCol: jest.fn(),
      isReleased: false
    };
    plugin = new TableCarouselAnimationPlugin();
    plugin.table = mockTable;
  });

  it('should instantiate with default options', () => {
    expect(plugin).toBeInstanceOf(TableCarouselAnimationPlugin);
    expect(plugin.name).toBe('Table Carousel Animation');
    expect(plugin.animationDuration).toBe(500);
    expect(plugin.animationDelay).toBe(1000);
    expect(plugin.autoPlay).toBe(false);
  });

  it('should set options correctly', () => {
    const customPlugin = new TableCarouselAnimationPlugin({
      rowCount: 5,
      colCount: 3,
      animationDuration: 100,
      animationDelay: 200,
      autoPlay: true,
      autoPlayDelay: 500
    });
    expect(customPlugin.rowCount).toBe(5);
    expect(customPlugin.colCount).toBe(3);
    expect(customPlugin.animationDuration).toBe(100);
    expect(customPlugin.animationDelay).toBe(200);
    expect(customPlugin.autoPlay).toBe(true);
    expect(customPlugin.autoPlayDelay).toBe(500);
  });

  it('should initialize table on run', () => {
    const newPlugin = new TableCarouselAnimationPlugin();
    newPlugin.run(null, null, mockTable);
    expect(newPlugin.table).toBe(mockTable);
  });

  it('should reset state', () => {
    plugin.row = 10;
    plugin.col = 10;
    plugin.reset();
    expect(plugin.playing).toBe(false);
    expect(plugin.row).toBe(mockTable.frozenRowCount);
    expect(plugin.col).toBe(mockTable.frozenColCount);
  });

  it('should throw error if table is not initialized on play', () => {
    const newPlugin = new TableCarouselAnimationPlugin();
    expect(() => newPlugin.play()).toThrow('table is not initialized');
  });

  it('should call updateRow on play', () => {
    plugin.rowCount = 1;
    plugin.play();
    expect(plugin.playing).toBe(true);
  });

  it('should pause the animation', () => {
    plugin.playing = true;
    plugin.pause();
    expect(plugin.playing).toBe(false);
  });

  it('should update row with custom function', () => {
    const customDistRow = jest.fn().mockReturnValue({ distRow: 5 });
    const customPlugin = new TableCarouselAnimationPlugin({
      customDistRowFunction: customDistRow
    });
    customPlugin.table = mockTable;
    customPlugin.row = 0; // 关键：补上这一行
    customPlugin.playing = true;
    customPlugin.updateRow();
    expect(customDistRow).toHaveBeenCalledWith(0, mockTable);
    expect(mockTable.scrollToRow).toHaveBeenCalledWith(5, expect.objectContaining({
      duration: 500,
      easing: 'linear'
    }));
  });

  it('should update column with custom function', () => {
    const customDistCol = jest.fn().mockReturnValue({ distCol: 5 });
    const customPlugin = new TableCarouselAnimationPlugin({
      customDistColFunction: customDistCol
    });
    customPlugin.table = mockTable;
    customPlugin.col = 0; // 关键：补上这一行
    customPlugin.playing = true;
    customPlugin.updateCol();
    expect(customDistCol).toHaveBeenCalledWith(0, mockTable);
    expect(mockTable.scrollToCol).toHaveBeenCalledWith(5, expect.objectContaining({
      duration: 500,
      easing: 'linear'
    }));
  });
});