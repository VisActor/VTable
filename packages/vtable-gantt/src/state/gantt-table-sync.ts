import type { Gantt } from '../Gantt';

export function syncScrollStateToTable(gantt: Gantt) {
  const { scroll } = gantt.stateManager;
  const { verticalBarPos } = scroll;
  gantt.taskListTableInstance.stateManager.setScrollTop(verticalBarPos, false);
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
export function syncResizeStateFromTable(gantt: Gantt) {
  // if (gantt.taskListTableInstance && gantt.options.taskListTable?.width === 'auto') {
  //   gantt.taskListTableInstance?.on('resize_column', (args: any) => {
  //     gantt.taskTableWidth = gantt.taskListTableInstance.getAllColsWidth() + gantt.taskListTableInstance.tableX * 2;
  //     gantt.element.style.left = gantt.taskTableWidth ? `${gantt.taskTableWidth}px` : '0px';
  //     gantt._resize();
  //   });
  // }
}
export function syncEditCellFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('change_cell_value', (args: any) => {
    const { col, row, rawValue, changedValue } = args;
    gantt.refreshTaskBar(row - gantt.taskListTableInstance.columnHeaderLevelCount);
    // const record = gantt.getRecordByIndex(row - gantt.listTableInstance.columnHeaderLevelCount);
    // debugger;
  });
}

export function syncDragOrderFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('change_header_position', (args: any) => {
    gantt.scenegraph.refreshTaskBars();
    const left = gantt.stateManager.scroll.horizontalBarPos;
    const top = gantt.stateManager.scroll.verticalBarPos;
    gantt.scenegraph.setX(-left);
    gantt.scenegraph.setY(-top);
  });
}

export function syncTreeChangeFromTable(gantt: Gantt) {
  gantt.taskListTableInstance?.on('tree_hierarchy_state_change', (args: any) => {
    gantt._syncPropsFromTable();
    gantt.verticalSplitResizeLine.style.height = gantt.drawHeight + 'px'; //'100%';
    gantt.scenegraph.refreshTaskBarsAndGrid();
    const left = gantt.stateManager.scroll.horizontalBarPos;
    const top = gantt.stateManager.scroll.verticalBarPos;
    gantt.scenegraph.setX(-left);
    gantt.scenegraph.setY(-top);
  });
}
