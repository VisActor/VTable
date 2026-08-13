import { Chart } from '../src/scenegraph/graphic/chart';
import { createChartCellGroup } from '../src/scenegraph/group-creater/cell-type/chart-cell';
import { Group } from '../src/scenegraph/graphic/group';
import * as register from '../src/register';
import { chartTypes } from '../src/chartModule';

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
    delete chartTypes['mock-chart'];
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
        shouldDeferRenderError: () => true
      } as any);
    }).not.toThrow();

    const chartInstance = chart?.chartInstance as ThrowOnceChart;
    expect(chartInstance).toBeInstanceOf(ThrowOnceChart);
    expect(chartInstance.renderCount).toBe(1);
    expect(chartInstance.dirtyBoundsCount).toBe(0);

    jest.runOnlyPendingTimers();

    expect(chartInstance.renderCount).toBe(2);
    expect(chartInstance.dirtyBoundsCount).toBe(1);
    expect(chart?.renderRetryTimer).toBeUndefined();
  });

  test('clears deferred constructor render retry on release', () => {
    jest.useFakeTimers();
    const canvas = document.createElement('canvas');

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
      ClassType: ThrowOnceChart,
      chartInstance: undefined,
      dataId: 'data',
      data: [],
      cellPadding: [0, 0, 0, 0],
      dpr: 1,
      axes: [],
      tableChartOption: {},
      detectPickChartItem: false,
      shouldDeferRenderError: () => true
    } as any);

    const chartInstance = chart.chartInstance as ThrowOnceChart;
    expect(chartInstance.renderCount).toBe(1);
    expect(jest.getTimerCount()).toBe(1);

    chart.release();

    expect(jest.getTimerCount()).toBe(0);
    jest.runOnlyPendingTimers();
    expect(chartInstance.renderCount).toBe(1);
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

  test('throws constructor render errors synchronously when the defer predicate rejects them', () => {
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
        detectPickChartItem: false,
        shouldDeferRenderError: () => false
      } as any);
    }).toThrow(GET_CELL_ADDRESS_ERROR_MESSAGE);

    expect(chart).toBeUndefined();
    expect(jest.getTimerCount()).toBe(0);
  });

  test('uses createChartCellGroup production gates before deferring constructor render errors', () => {
    jest.useFakeTimers();
    const canvas = document.createElement('canvas');
    const record = { indicator: 1 };
    const columnGroup = new Group({});
    register.chartModule('mock-chart', ThrowOnceChart);
    const table = {
      canvas,
      colCount: 2,
      rowCount: 2,
      theme: {
        cellInnerBorder: true,
        frameStyle: {}
      },
      options: {
        mode: 'desktop-browser',
        modeParams: {},
        chartOption: {}
      },
      internalProps: {
        pixelRatio: 1,
        layoutMap: {
          getChartAxes: (): any[] => [],
          setChartInstance: jest.fn()
        }
      },
      scenegraph: {
        stage: {
          window: {
            getContext: () => ({ canvas })
          }
        }
      },
      _isConstructingPivotChart: true,
      _getCellStyle: () => ({}),
      getCellValue: () => [record],
      getCellAddressByRecord: jest.fn(value => (value === record ? { col: 1, row: 1 } : undefined)),
      isPivotChart: () => true
    };
    const cellTheme = { group: {} };

    const cellGroup = createChartCellGroup(
      null,
      columnGroup,
      0,
      0,
      1,
      1,
      100,
      80,
      [0, 0, 0, 0],
      '',
      'mock-chart',
      { type: 'bar', label: { dataFilter: (): any[] => [] } },
      undefined,
      'data',
      table as any,
      cellTheme as any,
      true,
      false,
      false
    );

    const chart = cellGroup.lastChild as Chart;
    const chartInstance = chart.chartInstance as ThrowOnceChart;
    expect(chartInstance.renderCount).toBe(1);
    expect(jest.getTimerCount()).toBe(1);

    jest.runOnlyPendingTimers();

    expect(chartInstance.renderCount).toBe(2);
    expect(table.getCellAddressByRecord).toHaveBeenCalledWith(record);
    expect(table.internalProps.layoutMap.setChartInstance).toHaveBeenCalledWith(1, 1, chartInstance);
  });
});
