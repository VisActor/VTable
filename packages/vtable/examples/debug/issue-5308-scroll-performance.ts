import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const numberFormatter = new Intl.NumberFormat('zh-CN');

type PerfSample = {
  frameGaps: number[];
  longTasks: number[];
  scrollEvents: number;
  cellUpdates: number;
  cellUpdatesByType: Record<string, number>;
};

declare global {
  interface Window {
    issue5308Init: {
      rows: number;
      columns: number;
      recordsDuration: number;
      tableDuration?: number;
      ready: boolean;
    };
    issue5308Result?: {
      elapsed: number;
      jumpDuration?: number;
      frameGaps: number[];
      longTasks: number[];
      scrollEvents: number;
      cellUpdates: number;
      cellUpdatesByType: Record<string, number>;
    };
    issue5308Perf: PerfSample & {
      reset: () => void;
      table: VTable.ListTable;
    };
  }
}

function createRecords(rowCount: number) {
  const regions = ['华东', '华北', '华南', '西南', '东北'];
  const statuses = ['进行中', '已完成', '待确认', '已暂停'];

  return Array.from({ length: rowCount }, (_, index) => ({
    id: index + 1,
    account: `客户 ${String(index + 1).padStart(6, '0')}`,
    region: regions[index % regions.length],
    status: statuses[index % statuses.length],
    amount: (index * 7919) % 100000,
    updatedAt: `2026-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`
  }));
}

function createColumns(columnCount: number, complexCells: boolean): VTable.ColumnsDefine {
  const columns: VTable.ColumnsDefine = [
    { field: 'id', title: '序号', width: 88, style: { textAlign: 'right' } },
    { field: 'account', title: '客户', width: 156 }
  ];

  for (let index = 2; index < columnCount; index++) {
    const metricIndex = index - 1;
    if (complexCells && metricIndex <= 10) {
      columns.push({
        field: `checkbox_${metricIndex}`,
        title: `勾选 ${metricIndex}`,
        width: 220,
        cellType: 'checkbox',
        checked: args => (args.row + metricIndex) % 3 === 0,
        style: { textAlign: 'center', checkboxStyle: { checkedFill: '#1976d2' } }
      });
      continue;
    }
    if (complexCells && metricIndex <= 20) {
      columns.push({
        field: `switch_${metricIndex - 10}`,
        title: `开关 ${metricIndex - 10}`,
        width: 230,
        cellType: 'switch',
        checked: args => (args.row + metricIndex) % 2 === 0,
        checkedText: '开',
        uncheckedText: '关',
        style: {
          textAlign: 'center',
          color: '#fff',
          switchStyle: { checkedFill: '#14804a' }
        }
      });
      continue;
    }
    if (complexCells && metricIndex <= 30) {
      columns.push({
        field: `button_${metricIndex - 20}`,
        title: `操作 ${metricIndex - 20}`,
        width: 220,
        cellType: 'button',
        text: args => ((args.row + metricIndex) % 2 === 0 ? '查看' : '处理'),
        style: {
          textAlign: 'center',
          color: '#135fbd',
          buttonStyle: {
            buttonColor: '#eef5ff',
            buttonBorderColor: '#a9c8ec',
            buttonHoverColor: '#dcecff',
            buttonHoverBorderColor: '#1976d2',
            buttonBorderRadius: 4,
            buttonPadding: 6
          }
        }
      });
      continue;
    }
    if (complexCells && metricIndex <= 40) {
      columns.push({
        field: 'amount',
        title: `进度 ${metricIndex - 30}`,
        width: 240,
        cellType: 'progressbar',
        min: 0,
        max: 100000,
        fieldFormat: record => `${Math.round(record.amount / 1000)}%`,
        style: {
          textAlign: 'right',
          barHeight: 7,
          barBottom: 5,
          barColor: metricIndex % 2 === 0 ? '#1976d2' : '#14804a',
          barBgColor: '#e7ebef'
        }
      });
      continue;
    }
    columns.push({
      field: `metric_${metricIndex}`,
      title: `指标 ${metricIndex}`,
      width: index % 7 === 0 ? 180 : 170,
      fieldFormat: record => {
        switch (index % 5) {
          case 0:
            return record.region;
          case 1:
            return record.status;
          case 2:
            return numberFormatter.format(record.amount + metricIndex * 17);
          case 3:
            return record.updatedAt;
          default:
            return `${record.id}-${metricIndex}`;
        }
      },
      style: { textAlign: index % 5 === 2 ? 'right' : 'left' }
    });
  }

  return columns;
}

export function createTable() {
  const params = new URLSearchParams(window.location.search);
  const rowCount = Number(params.get('rows')) || 100000;
  const columnCount = Number(params.get('cols')) || 120;
  const complexCells = params.get('cells') !== 'text';
  const frozen = params.get('frozen') !== 'off';
  const rightFrozen = frozen && params.get('rightFrozen') !== 'off';
  const bottomFrozen = frozen && params.get('bottomFrozen') !== 'off';
  const crossHighlight = params.get('cross') !== 'off';
  const samples: PerfSample = {
    frameGaps: [],
    longTasks: [],
    scrollEvents: 0,
    cellUpdates: 0,
    cellUpdatesByType: {}
  };
  let lastFrame = performance.now();
  let measurementStart = Infinity;
  let frameRequestId = 0;
  let automationRequestId = 0;
  let automationTimerId = 0;
  let released = false;
  let longTaskObserver: PerformanceObserver | undefined;

  const recordFrame = (time: number) => {
    if (released) {
      return;
    }
    const gap = time - lastFrame;
    lastFrame = time;
    if (time >= measurementStart) {
      samples.frameGaps.push(gap);
      if (samples.frameGaps.length > 1000) {
        samples.frameGaps.shift();
      }
    }
    frameRequestId = requestAnimationFrame(recordFrame);
  };
  frameRequestId = requestAnimationFrame(recordFrame);

  if ('PerformanceObserver' in window) {
    longTaskObserver = new PerformanceObserver(list => {
      list
        .getEntries()
        .filter(entry => entry.startTime + entry.duration >= measurementStart)
        .forEach(entry => samples.longTasks.push(entry.duration));
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  }

  const recordsStart = performance.now();
  const records = createRecords(rowCount);
  window.issue5308Init = {
    rows: rowCount,
    columns: columnCount,
    recordsDuration: performance.now() - recordsStart,
    ready: false
  };

  const tableStart = performance.now();
  const table = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, {
    columns: createColumns(columnCount, complexCells),
    records,
    widthMode: 'standard',
    defaultRowHeight: 36,
    defaultHeaderRowHeight: 40,
    frozenColCount: frozen ? 2 : 0,
    rightFrozenColCount: rightFrozen ? 2 : 0,
    frozenRowCount: frozen ? 3 : 0,
    bottomFrozenRowCount: bottomFrozen ? 2 : 0,
    hover: { highlightMode: crossHighlight ? 'cross' : 'row' },
    select: { highlightMode: crossHighlight ? 'cross' : 'row' },
    theme: VTable.themes.ARCO.extends({
      headerStyle: {
        bgColor: '#eef2f6',
        color: '#263340',
        fontWeight: 600,
        borderColor: '#d6dce3'
      },
      bodyStyle: { color: '#344251', borderColor: '#e1e5e9' },
      frameStyle: { borderColor: '#bcc5cf', borderLineWidth: 1 },
      scrollStyle: { visible: 'always', width: 9, hoverOn: true }
    })
  });
  window.issue5308Init.tableDuration = performance.now() - tableStart;

  const scenegraph = table.scenegraph as typeof table.scenegraph & {
    updateCellContent: (col: number, row: number, forceFastUpdate?: boolean) => unknown;
  };
  const updateCellContent = scenegraph.updateCellContent.bind(scenegraph);
  scenegraph.updateCellContent = (col, row, forceFastUpdate) => {
    const type = complexCells
      ? col < 2
        ? 'text'
        : col <= 11
        ? 'checkbox'
        : col <= 21
        ? 'switch'
        : col <= 31
        ? 'button'
        : col <= 41
        ? 'progressbar'
        : 'text'
      : 'text';
    samples.cellUpdates++;
    samples.cellUpdatesByType[type] = (samples.cellUpdatesByType[type] ?? 0) + 1;
    return updateCellContent(col, row, forceFastUpdate);
  };

  table.on(VTable.ListTable.EVENT_TYPE.SCROLL, () => {
    samples.scrollEvents++;
  });

  const reset = () => {
    window.issue5308Result = undefined;
    samples.frameGaps.length = 0;
    samples.longTasks.length = 0;
    samples.scrollEvents = 0;
    samples.cellUpdates = 0;
    samples.cellUpdatesByType = {};
    measurementStart = performance.now();
    lastFrame = measurementStart;
  };

  const isScenegraphIdle = () => {
    const proxy = table.scenegraph.proxy;
    return (
      !proxy.isProgressing &&
      proxy.colUpdatePos > proxy.colEnd &&
      proxy.rowUpdatePos > proxy.rowEnd &&
      proxy.currentCol >= proxy.totalCol &&
      proxy.currentRow >= proxy.totalRow
    );
  };

  const waitForScenegraphIdle = (callback: () => void) => {
    const check = () => {
      if (released) {
        return;
      }
      if (!isScenegraphIdle()) {
        automationTimerId = window.setTimeout(check, 16);
        return;
      }
      automationTimerId = window.setTimeout(() => {
        if (released) {
          return;
        }
        if (isScenegraphIdle()) {
          callback();
        } else {
          check();
        }
      });
    };
    check();
  };

  window.issue5308Perf = Object.assign(samples, {
    table,
    reset
  });
  window.tableInstance = table;

  const originalRelease = table.release.bind(table);
  table.release = ((...args: Parameters<typeof table.release>) => {
    released = true;
    cancelAnimationFrame(frameRequestId);
    cancelAnimationFrame(automationRequestId);
    clearTimeout(automationTimerId);
    longTaskObserver?.disconnect();
    return originalRelease(...args);
  }) as typeof table.release;

  const reportResult = (start: number, jumpDuration?: number) => {
    waitForScenegraphIdle(() => {
      automationTimerId = window.setTimeout(() => {
        automationTimerId = window.setTimeout(() => {
          if (released) {
            return;
          }
          window.issue5308Result = {
            elapsed: performance.now() - start,
            jumpDuration,
            frameGaps: [...samples.frameGaps],
            longTasks: [...samples.longTasks],
            scrollEvents: samples.scrollEvents,
            cellUpdates: samples.cellUpdates,
            cellUpdatesByType: { ...samples.cellUpdatesByType }
          };
        });
      });
    });
  };

  waitForScenegraphIdle(() => {
    reset();
    window.issue5308Init.ready = true;

    if (params.get('jump') === '1') {
      automationTimerId = window.setTimeout(() => {
        reset();
        const maxScrollTop = Math.max(0, table.getAllRowsHeight() - table.tableNoFrameHeight);
        const maxScrollLeft = Math.max(0, table.getAllColsWidth() - table.tableNoFrameWidth);
        const start = performance.now();
        table.setScrollTop(maxScrollTop / 2);
        table.setScrollLeft(maxScrollLeft / 2);
        const jumpDuration = performance.now() - start;
        reportResult(start, jumpDuration);
      });
    }

    if (params.get('auto') === '1') {
      reset();
      const start = performance.now();
      const duration = Number(params.get('duration')) || 2000;
      const maxScrollTop = Math.max(0, table.getAllRowsHeight() - table.tableNoFrameHeight);
      const maxScrollLeft = Math.max(0, table.getAllColsWidth() - table.tableNoFrameWidth);
      const scroll = (time: number) => {
        if (released) {
          return;
        }
        const progress = Math.min(1, (time - start) / duration);
        table.setScrollTop(maxScrollTop * progress);
        table.setScrollLeft(maxScrollLeft * progress);
        if (progress < 1) {
          automationRequestId = requestAnimationFrame(scroll);
          return;
        }
        reportResult(start);
      };
      automationRequestId = requestAnimationFrame(scroll);
    }
  });
}
