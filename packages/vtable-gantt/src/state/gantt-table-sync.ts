import type { Gantt } from '../Gantt';
import { updateSplitLineAndResizeLine } from '../gantt-helper';
import { TasksShowMode, TaskType } from '../ts-types';

export function syncScrollStateToTable(gantt: Gantt) {
  const { scroll } = gantt.stateManager;
  const { verticalBarPos } = scroll;
  gantt.taskListTableInstance.stateManager.setScrollTop(verticalBarPos, undefined, false);
}

export function syncScrollStateFromTable(gantt: Gantt) {
  if (gantt.taskListTableInstance) {
    gantt.taskListTableInstance?.on('scroll', (args: any) => {
      if (args.scrollDirection === 'vertical') {
        const { scroll } = gantt.taskListTableInstance.stateManager;
        const { verticalBarPos } = scroll;
        if (gantt.stateManager.scroll.verticalBarPos !== verticalBarPos) {
          gantt.stateManager.setScrollTop(verticalBarPos, false);
        }
      }
    });
  }
}
export function syncEditCellFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('change_cell_value', (args: any) => {
    const { col, row } = args;
    if (!gantt.taskListTableInstance.isHeader(col, row)) {
      gantt._refreshTaskBar(row - gantt.taskListTableInstance.columnHeaderLevelCount);
    }
    // const record = gantt.getRecordByIndex(row - gantt.taskListTableInstance.columnHeaderLevelCount);
    // debugger;
  });
}

export function syncTreeChangeFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('tree_hierarchy_state_change', (args: any) => {
    // Get the changed record and its hierarchy state from the event args
    const { row, hierarchyState } = args;

    if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
      // For Project_Sub_Tasks_Inline mode, we need to ensure the record's hierarchy state is updated
      // before refreshing the task bars
      const recordIndex = row - gantt.taskListTableInstance.columnHeaderLevelCount;
      const record = gantt.getRecordByIndex(recordIndex);

      if (record && record.type === TaskType.PROJECT && record.children?.length > 0) {
        // Update the record's hierarchyState explicitly to ensure it's synchronized
        // console.log(
        //   `Updating hierarchyState for record at index ${recordIndex} from ${record.hierarchyState} to ${hierarchyState}`
        // );
        record.hierarchyState = hierarchyState;
      }
    }

    gantt._syncPropsFromTable();
    gantt.scenegraph.refreshTaskBarsAndGrid();

    if (
      gantt.taskListTableInstance.checkHasColumnAutoWidth() &&
      (gantt.options.taskListTable?.tableWidth === 'auto' || gantt.taskTableWidth === -1)
    ) {
      // 和监听resize_column事件处理逻辑一致
      _syncTableSize(gantt);
    }

    const left = gantt.stateManager.scroll.horizontalBarPos;
    const top = gantt.stateManager.scroll.verticalBarPos;
    gantt.scenegraph.setX(-left);
    gantt.scenegraph.setY(-top);
  });
}
export function syncSortFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('after_sort', (args: any) => {
    gantt.scenegraph.refreshTaskBars();
    const left = gantt.stateManager.scroll.horizontalBarPos;
    const top = gantt.stateManager.scroll.verticalBarPos;
    gantt.scenegraph.setX(-left);
    gantt.scenegraph.setY(-top);
  });
}
export function syncDragOrderFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('change_header_position', (args: any) => {
    if (
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ||
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline
    ) {
      gantt.scenegraph.refreshTaskBarsAndGrid();
    } else {
      gantt.scenegraph.refreshTaskBars();
    }
    gantt.scenegraph.dragOrderLine.hideDragLine();
    const left = gantt.stateManager.scroll.horizontalBarPos;
    const top = gantt.stateManager.scroll.verticalBarPos;
    gantt.scenegraph.setX(-left);
    gantt.scenegraph.setY(-top);
  });
  gantt.taskListTableInstance?.on('change_header_position_start', (args: any) => {
    const { col, row, x, y, backX, lineX, backY, lineY, event } = args;

    gantt.scenegraph.dragOrderLine.showDragLine(lineY);
    gantt.scenegraph.updateNextFrame();
  });
  gantt.taskListTableInstance?.on('changing_header_position', (args: any) => {
    const { col, row, x, y, backX, lineX, backY, lineY, event } = args;
    gantt.scenegraph.dragOrderLine.showDragLine(lineY);
    gantt.scenegraph.updateNextFrame();
  });
  gantt.taskListTableInstance?.on('change_header_position_fail', (args: any) => {
    gantt.scenegraph.dragOrderLine.hideDragLine();
    gantt.scenegraph.updateNextFrame();
  });
}

export function syncTableWidthFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('resize_column', (args: any) => {
    _syncTableSize(gantt);
  });
}

function _syncTableSize(gantt: Gantt) {
  const oldTaskTableWidth: number = gantt.taskTableWidth;

  const allColsWidth = gantt.taskListTableInstance.getAllColsWidth();
  gantt.taskTableWidth =
    (Array.isArray(allColsWidth) ? allColsWidth.reduce((a, b) => a + b, 0) : allColsWidth) +
    gantt.parsedOptions.outerFrameStyle.borderLineWidth;
  if (gantt.options?.taskListTable?.maxTableWidth) {
    gantt.taskTableWidth = Math.min(gantt.options?.taskListTable?.maxTableWidth, gantt.taskTableWidth);
  }
  if (gantt.options?.taskListTable?.minTableWidth) {
    gantt.taskTableWidth = Math.max(gantt.options?.taskListTable?.minTableWidth, gantt.taskTableWidth);
  }
  if (oldTaskTableWidth === gantt.taskTableWidth) {
    return;
  }
  gantt.element.style.left = gantt.taskTableWidth ? `${gantt.taskTableWidth}px` : '0px';
  const tableHeightValue =
    typeof gantt.tableNoFrameHeight === 'number'
      ? gantt.tableNoFrameHeight
      : Array.isArray(gantt.tableNoFrameHeight)
      ? gantt.tableNoFrameHeight[0] ?? 0
      : Number(gantt.tableNoFrameHeight) || 0;
  const tableHeight: number = Number(tableHeightValue) || 0;
  const borderWidth =
    typeof gantt.parsedOptions.outerFrameStyle.borderLineWidth === 'number'
      ? gantt.parsedOptions.outerFrameStyle.borderLineWidth
      : Array.isArray(gantt.parsedOptions.outerFrameStyle.borderLineWidth)
      ? gantt.parsedOptions.outerFrameStyle.borderLineWidth[0] ?? 0
      : 0;
  gantt.taskListTableInstance.setCanvasSize(gantt.taskTableWidth, tableHeight + borderWidth * 2);
  gantt._updateSize();
  updateSplitLineAndResizeLine(gantt);

  if (gantt.zoomScaleManager) {
    gantt.zoomScaleManager.handleTableWidthChange();
  }
}
