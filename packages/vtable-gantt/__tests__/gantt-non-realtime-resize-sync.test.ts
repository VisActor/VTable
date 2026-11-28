// @ts-nocheck

global.__VERSION__ = 'none';

import { createDiv } from './dom';
import { Gantt } from '../src/index';
// 真正发出 RESIZE_COLUMN / RESIZE_ROW 事件的是 table-group 中的 end wrapper（pointerup 路径），
// 这里直接复用它来模拟拖拽结束，验证跨包布局同步。
import { endResizeCol } from '../../vtable/src/event/listener/table-group';

function createGantt(resize: any) {
  const container = createDiv();
  const option = {
    records: [{ id: 1, title: '任务', startDate: '2024-07-01', endDate: '2024-07-02', progress: 50 }],
    taskListTable: {
      columns: [
        { field: 'title', title: '任务名称', width: 180 },
        { field: 'id', title: 'ID', width: 120 }
      ],
      tableWidth: 'auto',
      resize
    },
    timelineHeader: {
      colWidth: 50,
      scales: [{ unit: 'day', step: 1 }]
    },
    minDate: '2024-07-01',
    maxDate: '2024-07-07'
  };
  const gantt = new Gantt(container, option);
  return { gantt, container };
}

/**
 * 忠实模拟一次把第 col 列加宽 delta 像素的拖拽：start -> move(含过程事件) -> up。
 * 过程事件 RESIZE_COLUMN 在真实场景中由 container-dom 的 pointermove 回调发出，这里一并复刻，
 * 以便区分实时/非实时两种模式下过程事件携带的列宽是否为最新值。
 */
function dragResizeCol(table: any, col: number, delta: number) {
  const startX = table.getColsWidth(0, col); // 列右边界的大致 x
  table.stateManager.startResizeCol(col, startX, 50);
  // 一次 pointermove，传入完整位移
  table.stateManager.updateResizeCol(startX + delta, 50);
  // container-dom 在每次 pointermove 后发出 RESIZE_COLUMN，携带“当前” getColWidth
  if (table.hasListeners('resize_column')) {
    table.fireListeners('resize_column', { col, colWidth: table.getColWidth(col) });
  }
  // pointerup：走真实的 end wrapper，非实时模式在此提交并补发过程事件
  endResizeCol(table);
}

describe('gantt non-realtime resize layout sync', () => {
  test('non-realtime column resize should sync taskTableWidth after commit', () => {
    const { gantt, container } = createGantt({ realtime: false });
    const table = gantt.taskListTableInstance;
    const border = gantt.parsedOptions.outerFrameStyle.borderLineWidth as number;
    expect(table.internalProps.resizeRealtime).toBe(false);

    const widthBefore = gantt.taskTableWidth;
    const colWidthBefore = table.getColWidth(0);

    dragResizeCol(table, 0, 60);

    const colWidthAfter = table.getColWidth(0);
    // 列宽确实变宽
    expect(colWidthAfter).toBeGreaterThan(colWidthBefore);
    // 关键断言：甘特图任务列表宽度已随最终列宽同步，而不是停留在旧值。
    // 修复前，拖拽过程事件携带旧列宽、结束时又不再发 resize_column，taskTableWidth 会停在 widthBefore。
    expect(gantt.taskTableWidth).toBe(table.getAllColsWidth() + border);
    expect(gantt.taskTableWidth).toBeGreaterThan(widthBefore);

    gantt.release?.();
    container.remove();
  });

  test('non-realtime shrink should also sync (no leftover gap)', () => {
    const { gantt, container } = createGantt({ realtime: false });
    const table = gantt.taskListTableInstance;
    const border = gantt.parsedOptions.outerFrameStyle.borderLineWidth as number;

    const widthBefore = gantt.taskTableWidth;
    dragResizeCol(table, 0, -60);

    expect(gantt.taskTableWidth).toBe(table.getAllColsWidth() + border);
    expect(gantt.taskTableWidth).toBeLessThan(widthBefore);

    gantt.release?.();
    container.remove();
  });

  test('realtime mode keeps syncing as before', () => {
    const { gantt, container } = createGantt({ realtime: true });
    const table = gantt.taskListTableInstance;
    const border = gantt.parsedOptions.outerFrameStyle.borderLineWidth as number;
    expect(table.internalProps.resizeRealtime).not.toBe(false);

    dragResizeCol(table, 0, 60);

    expect(gantt.taskTableWidth).toBe(table.getAllColsWidth() + border);

    gantt.release?.();
    container.remove();
  });
});
