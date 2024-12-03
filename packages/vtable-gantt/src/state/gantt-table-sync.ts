import type { Gantt } from '../Gantt';
import { TasksShowMode } from '../ts-types';

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
        gantt.stateManager.setScrollTop(verticalBarPos, false);
      }
    });
  }
}
export function syncEditCellFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('change_cell_value', (args: any) => {
    const { col, row, rawValue, changedValue } = args;
    gantt._refreshTaskBar(row - gantt.taskListTableInstance.columnHeaderLevelCount);
    // const record = gantt.getRecordByIndex(row - gantt.taskListTableInstance.columnHeaderLevelCount);
    // debugger;
  });
}

export function syncTreeChangeFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('tree_hierarchy_state_change', (args: any) => {
    gantt._syncPropsFromTable();

    gantt.scenegraph.refreshTaskBarsAndGrid();
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
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate
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
