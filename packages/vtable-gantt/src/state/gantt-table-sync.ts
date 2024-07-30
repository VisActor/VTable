import type { Gantt } from '../Gantt';

export function syncScrollStateToTable(gantt: Gantt) {
  const { scroll } = gantt.stateManager;
  const { verticalBarPos } = scroll;
  gantt.listTableInstance.stateManager.setScrollTop(verticalBarPos, false);
}

export function syncScrollStateFromTable(gantt: Gantt) {
  if (gantt.listTableInstance) {
    gantt.listTableInstance.on('scroll', (args: any) => {
      if (args.scrollDirection === 'vertical') {
        const { scroll } = gantt.listTableInstance.stateManager;
        const { verticalBarPos } = scroll;
        gantt.stateManager.setScrollTop(verticalBarPos, false);
      }
    });
  }
}
export function syncResizeStateFromTable(gantt: Gantt) {
  if (gantt.listTableInstance && gantt.options.taskTable?.width === 'auto') {
    gantt.listTableInstance.on('resize_column', (args: any) => {
      gantt.taskTableWidth = gantt.listTableInstance.getAllColsWidth() + gantt.listTableInstance.tableX * 2;
      gantt.element.style.left = gantt.taskTableWidth ? `${gantt.taskTableWidth}px` : '0px';
      gantt._resize();
    });
  }
}
export function syncEditCellFromTable(gantt: Gantt) {
  gantt.listTableInstance.on('change_cell_value', (args: any) => {
    const { col, row, rawValue, changedValue } = args;
    gantt.updateRecord(row - gantt.listTableInstance.columnHeaderLevelCount);
    // const record = gantt.getRecordByIndex(row - gantt.listTableInstance.columnHeaderLevelCount);
    // debugger;
  });
}

export function syncDragOrderFromTable(gantt: Gantt) {
  gantt.listTableInstance.on('change_header_position', (args: any) => {
    const { dragOrder, dragOrderIndex } = args;
    gantt.scenegraph.refreshTaskBars();
  });
}

export function syncTreeChangeFromTable(gantt: Gantt) {
  gantt.listTableInstance.on('tree_hierarchy_state_change', (args: any) => {
    // const { dragOrder, dragOrderIndex } = args;

    gantt.syncStateFromTable();
    gantt.scenegraph.refreshTaskBarsAndGrid();
    const left = gantt.stateManager.scroll.horizontalBarPos;
    const top = gantt.stateManager.scroll.verticalBarPos;
    gantt.scenegraph.setX(-left);
    gantt.scenegraph.setY(-top);
  });
}
