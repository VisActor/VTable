// mock @visactor/vtable-gantt，确保 Gantt 是构造函数
jest.mock('@visactor/vtable-gantt', () => {
  class FakeGantt {
    options: any;
    records: any[];
    taskListTableInstance: any;
    getAllDateColsWidth: () => number;
    getAllRowsHeight: () => number;
    canvas: any;
    scenegraph: any;
    release: () => void;
    setPixelRatio: () => void;
    constructor() {
      this.options = { taskListTable: {}, records: [] };
      this.records = [];
      this.taskListTableInstance = {
        getAllColsWidth: () => 100,
        canvas: { width: 100, height: 200 },
        getAllRowsHeight: () => 300,
        scenegraph: { tableGroup: { setAttribute: jest.fn() } }
      };
      this.getAllDateColsWidth = () => 200;
      this.getAllRowsHeight = () => 300;
      this.canvas = { width: 300, height: 200 };
      this.setPixelRatio = jest.fn();
      this.scenegraph = {
        ganttGroup: { setAttribute: jest.fn() },
        stage: { render: jest.fn() }
      };
      this.release = jest.fn();
    }
  }
  return {
    Gantt: FakeGantt,
    plugins: { IGanttPlugin: class {} }
  };
});

import { ExportGanttPlugin } from '../src/gantt-export-image';

// mock window & DOM
Object.defineProperty(window, 'devicePixelRatio', { value: 2 });
global.requestAnimationFrame = (cb) => { cb(0); return 0; };

// mock document.createElement & body
const mockCanvas = {
  getContext: jest.fn(() => ({
    fillStyle: '',
    fillRect: jest.fn(),
    drawImage: jest.fn(),
  })),
  toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
  width: 0,
  height: 0,
  style: {},
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getBoundingClientRect: jest.fn(() => ({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: jest.fn() })),
};
const mockDiv = {
  style: {},
  appendChild: jest.fn(),
  remove: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getBoundingClientRect: jest.fn(() => ({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: jest.fn() })),
};
const mockLink = {
  download: '',
  href: '',
  click: jest.fn(),
  style: {},
};
// 直接 mock document.createElement
jest.spyOn(document, 'createElement').mockImplementation((tag) => {
  if (tag === 'canvas') return mockCanvas as any;
  if (tag === 'a') return mockLink as any;
  return mockDiv as any;
});
// mock body.appendChild/removeChild
jest.spyOn(document.body, 'appendChild').mockImplementation(jest.fn());
jest.spyOn(document.body, 'removeChild').mockImplementation(jest.fn());

// 测试用例

describe('ExportGanttPlugin', () => {
  let plugin: ExportGanttPlugin;

  beforeEach(() => {
    plugin = new ExportGanttPlugin();
    jest.clearAllMocks();
  });

  it('run 方法应设置 gantt 实例', () => {
    const gantt = new (require('@visactor/vtable-gantt').Gantt)();
    plugin.run(gantt);
    // @ts-ignore
    expect(plugin._gantt).toBe(gantt);
  });

  it('run 方法未传入 gantt 实例应输出错误', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    plugin.run();
    expect(spy).toHaveBeenCalledWith('ExportGanttPlugin: Gantt instance not provided to run method.');
    spy.mockRestore();
  });

  it('exportToImage 未初始化 gantt 时返回 undefined 并输出错误', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await plugin.exportToImage();
    expect(result).toBeUndefined();
    expect(spy).toHaveBeenCalledWith('ExportGanttPlugin: Gantt instance not available.');
    spy.mockRestore();
  });

  it('exportToImage 正常导出', async () => {
    const gantt = new (require('@visactor/vtable-gantt').Gantt)();
    plugin.run(gantt);
    const result = await plugin.exportToImage({ fileName: 'test', type: 'png', quality: 0.8, backgroundColor: '#fff', scale: 2 });
    expect(typeof result).toBe('string');
    expect(result).toContain('data:image/png;base64');
    // 检查导出流程相关 DOM 操作被调用
    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it('exportToImage 导出异常时抛出错误', async () => {
    const gantt = new (require('@visactor/vtable-gantt').Gantt)();
    plugin.run(gantt);
    // mock getAllRowsHeight 抛错
    gantt.getAllRowsHeight = () => { throw new Error('mock error'); };
    await expect(plugin.exportToImage()).rejects.toThrow('甘特图导出失败: mock error');
  });

  it('release 方法应清空 gantt', () => {
    const gantt = new (require('@visactor/vtable-gantt').Gantt)();
    plugin.run(gantt);
    plugin.release();
    // @ts-ignore
    expect(plugin._gantt).toBeNull();
  });
});
