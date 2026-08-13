import { Chart } from '../src/scenegraph/graphic/chart';

const GET_CELL_ADDRESS_ERROR_MESSAGE =
  "Cannot destructure property 'col' of 'getCellAddressByRecord(...)' as it is undefined.";

class MockChart {
  static globalConfig = { uniqueTooltip: false };

  spec: unknown;
  option: unknown;

  constructor(spec: unknown, option: unknown) {
    this.spec = spec;
    this.option = option;
  }

  renderSync() {
    // noop
  }

  getStage() {
    return {
      enableDirtyBounds() {
        // noop
      }
    };
  }
}

class ThrowOnceChart extends MockChart {
  renderCount = 0;
  dirtyBoundsCount = 0;

  renderSync() {
    this.renderCount++;
    if (this.renderCount === 1) {
      throw new TypeError(GET_CELL_ADDRESS_ERROR_MESSAGE);
    }
  }

  getStage() {
    return {
      enableDirtyBounds: () => {
        this.dirtyBoundsCount++;
      }
    };
  }
}

class InvalidSpecChart extends ThrowOnceChart {
  renderSync() {
    this.renderCount++;
    throw new Error('invalid chart spec');
  }
}

class MissingCellAddressChart extends ThrowOnceChart {
  renderSync() {
    this.renderCount++;
    throw new TypeError(GET_CELL_ADDRESS_ERROR_MESSAGE);
  }
}

describe('Chart graphic', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('keeps runtime refs when VRender builds static state snapshots', () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement & { __vtable__?: unknown };
    const tableRef: { internalProps?: unknown } = {};
    tableRef.internalProps = { element: { __vtable__: tableRef } };
    canvas.__vtable__ = tableRef;

    const chart = new Chart(false, {
      stroke: false,
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      canvas,
      mode: 'desktop-browser',
      modeParams: {},
      spec: { type: 'bar' },
      ClassType: MockChart,
      chartInstance: undefined,
      dataId: 'data',
      data: [],
      cellPadding: [0, 0, 0, 0],
      dpr: 1,
      axes: [],
      tableChartOption: {},
      detectPickChartItem: false
    } as any);

    expect(chart.attribute.canvas).toBe(canvas);
    expect((chart as any).baseAttributes.canvas).toBe(canvas);

    expect(() => (chart as any).buildStaticAttributeSnapshot()).not.toThrow();

    chart.setAttributes({ width: 120, height: 90 });
    expect(chart.attribute.canvas).toBe(canvas);
    expect(chart.attribute.chartInstance).toBe(chart.chartInstance);
    expect(chart.attribute.chartInstance).toBe((chart as any).baseAttributes.chartInstance);
  });

  test('defers constructor render errors so chart instances can be assigned before retrying', () => {
    jest.useFakeTimers();
    const canvas = document.createElement('canvas');

    let chart: Chart | undefined;
    expect(() => {
      chart = new Chart(false, {
        stroke: false,
        x: 0,
        y: 0,
        width: 100,
        height: 80,
        canvas,
        mode: 'desktop-browser',
        modeParams: {},
        spec: { type: 'bar' },
        ClassType: ThrowOnceChart,
        chartInstance: undefined,
        dataId: 'data',
        data: [],
        cellPadding: [0, 0, 0, 0],
        dpr: 1,
        axes: [],
        tableChartOption: {},
        detectPickChartItem: false,
        deferRenderForTableConstructor: true
      } as any);
    }).not.toThrow();

    const chartInstance = chart?.chartInstance as ThrowOnceChart;
    expect(chartInstance).toBeInstanceOf(ThrowOnceChart);
    expect(chartInstance.renderCount).toBe(1);
    expect(chartInstance.dirtyBoundsCount).toBe(0);

    jest.runOnlyPendingTimers();

    expect(chartInstance.renderCount).toBe(2);
    expect(chartInstance.dirtyBoundsCount).toBe(1);
  });

  test('throws non-recoverable constructor render errors synchronously', () => {
    jest.useFakeTimers();
    const canvas = document.createElement('canvas');

    let chart: Chart | undefined;
    expect(() => {
      chart = new Chart(false, {
        stroke: false,
        x: 0,
        y: 0,
        width: 100,
        height: 80,
        canvas,
        mode: 'desktop-browser',
        modeParams: {},
        spec: { type: 'bar' },
        ClassType: InvalidSpecChart,
        chartInstance: undefined,
        dataId: 'data',
        data: [],
        cellPadding: [0, 0, 0, 0],
        dpr: 1,
        axes: [],
        tableChartOption: {},
        detectPickChartItem: false
      } as any);
    }).toThrow('invalid chart spec');

    expect(chart).toBeUndefined();
    expect(jest.getTimerCount()).toBe(0);
  });

  test('throws unmatched getCellAddressByRecord errors synchronously', () => {
    jest.useFakeTimers();
    const canvas = document.createElement('canvas');

    let chart: Chart | undefined;
    expect(() => {
      chart = new Chart(false, {
        stroke: false,
        x: 0,
        y: 0,
        width: 100,
        height: 80,
        canvas,
        mode: 'desktop-browser',
        modeParams: {},
        spec: { type: 'bar' },
        ClassType: MissingCellAddressChart,
        chartInstance: undefined,
        dataId: 'data',
        data: [],
        cellPadding: [0, 0, 0, 0],
        dpr: 1,
        axes: [],
        tableChartOption: {},
        detectPickChartItem: false
      } as any);
    }).toThrow(GET_CELL_ADDRESS_ERROR_MESSAGE);

    expect(chart).toBeUndefined();
    expect(jest.getTimerCount()).toBe(0);
  });
});
