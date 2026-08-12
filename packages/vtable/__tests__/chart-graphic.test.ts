import { Chart } from '../src/scenegraph/graphic/chart';

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
      throw new Error('render before table instance is assigned');
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

describe('Chart graphic', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
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
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
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
        detectPickChartItem: false
      } as any);
    }).not.toThrow();

    const chartInstance = chart?.chartInstance as ThrowOnceChart;
    expect(chartInstance).toBeInstanceOf(ThrowOnceChart);
    expect(chartInstance.renderCount).toBe(1);
    expect(chartInstance.dirtyBoundsCount).toBe(0);

    jest.runOnlyPendingTimers();

    expect(chartInstance.renderCount).toBe(2);
    expect(chartInstance.dirtyBoundsCount).toBe(1);
    expect(consoleError).not.toHaveBeenCalled();
  });
});
