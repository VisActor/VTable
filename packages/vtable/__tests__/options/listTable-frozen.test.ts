// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/marketsales.json';
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-frozen init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const columns = [
    {
      field: '订单 ID',
      caption: '订单 ID',
      sort: true,
      width: 'auto',
      description: '这是订单的描述信息',
      style: {
        fontFamily: 'Arial',
        fontSize: 14
      }
    },
    {
      field: '订单日期',
      caption: '订单日期'
    },
    {
      field: '发货日期',
      caption: '发货日期'
    },
    {
      field: '客户名称',
      caption: '客户名称',
      style: {
        padding: [10, 0, 10, 60]
      }
    },
    {
      field: '邮寄方式',
      caption: '邮寄方式'
    },
    {
      field: '省/自治区',
      caption: '省/自治区'
    },
    {
      field: '产品名称',
      caption: '产品名称'
    },
    {
      field: '类别',
      caption: '类别'
    },
    {
      field: '子类别',
      caption: '子类别'
    },
    {
      field: '销售额',
      caption: '销售额'
    },
    {
      field: '数量',
      caption: '数量'
    },
    {
      field: '折扣',
      caption: '折扣'
    },
    {
      field: '利润',
      caption: '利润'
    }
  ];
  const option = {
    columns,
    defaultColWidth: 150,
    allowFrozenColCount: 5,
    frozenColCount: 2
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable frozenColCount', () => {
    expect(listTable.frozenColCount).toBe(2);
  });
  test('listTable frozenColCount set', () => {
    listTable.frozenColCount = 4;
    expect(listTable.frozenColCount).toBe(4);
    listTable.release();
  });
});

describe('listTable frozen columns in transpose mode', () => {
  function mockResizeObserver() {
    const originalResizeObserver = global.ResizeObserver;
    const observer = {
      observe: jest.fn(),
      disconnect: jest.fn()
    };
    let callback: ResizeObserverCallback;

    global.ResizeObserver = jest.fn(function (resizeObserverCallback: ResizeObserverCallback) {
      callback = resizeObserverCallback;
      return observer;
    });

    return {
      callback: () => callback,
      observer,
      restore: () => {
        global.ResizeObserver = originalResizeObserver;
      }
    };
  }

  function mockTimers() {
    const originalSetTimeout = global.setTimeout;
    const originalClearTimeout = global.clearTimeout;
    const timers = new Map<number, () => void>();
    let timerId = 0;

    global.setTimeout = jest.fn((callback: () => void) => {
      timerId += 1;
      timers.set(timerId, callback);
      return timerId as unknown as ReturnType<typeof setTimeout>;
    });
    global.clearTimeout = jest.fn((id: number) => {
      timers.delete(id);
    });

    return {
      runAll: () => {
        for (const [id, callback] of timers) {
          timers.delete(id);
          callback();
        }
      },
      restore: () => {
        global.setTimeout = originalSetTimeout;
        global.clearTimeout = originalClearTimeout;
      }
    };
  }

  function createZeroWidthTransposeTable() {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '0px';
    containerDom.style.height = '300px';

    return {
      containerDom,
      transposeTable: new ListTable(containerDom, {
        columns: [
          { field: 'name', title: 'Name', width: 120 },
          { field: 'value', title: 'Value', width: 120 }
        ],
        records: Array.from({ length: 10 }, (_, index) => ({
          name: `name-${index}`,
          value: `value-${index}`
        })),
        defaultColWidth: 120,
        frozenColCount: 2,
        transpose: true
      })
    };
  }

  test('keeps configured columns frozen after a zero-width mount and scrolling', () => {
    const resizeObserver = mockResizeObserver();
    const { containerDom, transposeTable } = createZeroWidthTransposeTable();
    const timers = mockTimers();

    try {
      expect(resizeObserver.observer.observe).toHaveBeenCalledWith(containerDom);
      const resize = jest.spyOn(transposeTable, 'resize');
      containerDom.style.width = '400px';
      resizeObserver.callback()([{ contentRect: { width: 400 } } as ResizeObserverEntry], resizeObserver.observer);

      expect(resize).toHaveBeenCalledTimes(1);
      timers.runAll();

      expect(transposeTable.frozenColCount).toBe(2);
      expect(transposeTable.scenegraph.getColGroup(0).parent).toBe(transposeTable.scenegraph.rowHeaderGroup);
      expect(transposeTable.scenegraph.getColGroup(1).parent).toBe(transposeTable.scenegraph.rowHeaderGroup);
      expect(transposeTable.scenegraph.getColGroup(2).parent).toBe(transposeTable.scenegraph.bodyGroup);

      transposeTable.setScrollLeft(240);

      expect(transposeTable.scrollLeft).toBeGreaterThan(0);
      expect(transposeTable.scenegraph.getColGroup(0).parent).toBe(transposeTable.scenegraph.rowHeaderGroup);
      expect(transposeTable.scenegraph.getColGroup(1).parent).toBe(transposeTable.scenegraph.rowHeaderGroup);
      expect(transposeTable.scenegraph.getColGroup(2).parent).toBe(transposeTable.scenegraph.bodyGroup);
      expect(resizeObserver.observer.disconnect).toHaveBeenCalledTimes(1);
    } finally {
      transposeTable.release();
      resizeObserver.restore();
      timers.restore();
    }
  });

  test('cancels the queued frozen-column check when released', () => {
    const resizeObserver = mockResizeObserver();
    const { containerDom, transposeTable } = createZeroWidthTransposeTable();
    const timers = mockTimers();

    try {
      const checkFrozen = jest.spyOn(transposeTable.stateManager, 'checkFrozen');
      containerDom.style.width = '400px';
      resizeObserver.callback()([{ contentRect: { width: 400 } } as ResizeObserverEntry], resizeObserver.observer);

      const checksBeforeRelease = checkFrozen.mock.calls.length;
      transposeTable.release();
      timers.runAll();

      expect(checkFrozen).toHaveBeenCalledTimes(checksBeforeRelease);
    } finally {
      if (!transposeTable.isReleased) {
        transposeTable.release();
      }
      resizeObserver.restore();
      timers.restore();
    }
  });
});
