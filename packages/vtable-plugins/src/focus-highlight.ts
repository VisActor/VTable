import type { INode } from '@visactor/vtable/es/vrender';
import { createRect } from '@visactor/vtable/es/vrender';
import type { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
import { isSameRange } from '@visactor/vtable/es/tools/cell-range';
import type { CellAddress, CellRange } from '@visactor/vtable/es/ts-types';
import type { plugins } from '@visactor/vtable';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';
import { cellInRange } from '@visactor/vtable/es/tools/helper';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
export interface FocusHighlightPluginOptions {
  id?: string;
  fill?: string;
  opacity?: number;
  highlightRange?: CellAddress | CellRange; //初始化聚焦高亮范围
}

export class FocusHighlightPlugin implements plugins.IVTablePlugin {
  id = `focus-highlight`;
  name = 'Focus Highlight';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED, TABLE_EVENT_TYPE.SELECTED_CELL, TABLE_EVENT_TYPE.SELECTED_CLEAR];
  table: BaseTableAPI;
  range?: CellRange;
  pluginOptions: FocusHighlightPluginOptions;

  constructor(
    options: FocusHighlightPluginOptions = {
      fill: '#000',
      opacity: 0.5,
      highlightRange: undefined
    }
  ) {
    this.id = options.id ?? this.id;
    this.pluginOptions = Object.assign(
      {
        fill: '#000',
        opacity: 0.5
      },
      options
    );
  }
  run(...args: any[]) {
    if (!this.table) {
      this.table = args[2] as BaseTableAPI;
    }
    if (args[1] === TABLE_EVENT_TYPE.INITIALIZED) {
      this.pluginOptions.highlightRange && this.setFocusHighlightRange(this.pluginOptions.highlightRange);
    } else if (args[1] === TABLE_EVENT_TYPE.SELECTED_CELL) {
      const posCell = this.table.stateManager.select.cellPos;
      if (this.table.isHeader(posCell.col, posCell.row)) {
        this.setFocusHighlightRange(undefined);
      } else {
        const ranges = this.table.stateManager.select.ranges;
        const min_col = 0;
        const max_col = this.table.colCount - 1;
        const min_row = Math.min(ranges[0].start.row, ranges[0].end.row);
        const max_row = Math.max(ranges[0].start.row, ranges[0].end.row);
        this.setFocusHighlightRange({
          start: { col: min_col, row: min_row },
          end: { col: max_col, row: max_row }
        });
      }
    } else if (args[1] === TABLE_EVENT_TYPE.SELECTED_CLEAR) {
      this.setFocusHighlightRange(undefined);
    }
  }

  setFocusHighlightRange(range?: CellAddress | CellRange, forceUpdate: boolean = false) {
    let cellRange: CellRange;
    if (range && 'start' in range && 'end' in range) {
      cellRange = range as CellRange;
    } else if (range) {
      cellRange = {
        start: range as CellAddress,
        end: range as CellAddress
      };
    }
    if (isSameRange(this.range, cellRange) && !forceUpdate) {
      return;
    }

    this.range = cellRange;
    if (!range) {
      // reset highlight
      this.deleteAllCellGroupShadow();
    } else {
      // update highlight
      this.updateCellGroupShadow();
    }

    this.table.scenegraph.updateNextFrame();
  }

  deleteAllCellGroupShadow() {
    if (!this.table.isPivotTable()) {
      this.updateCellGroupShadowInContainer(this.table.scenegraph.rowHeaderGroup);
      this.updateCellGroupShadowInContainer(this.table.scenegraph.leftBottomCornerGroup);
    }
    this.updateCellGroupShadowInContainer(this.table.scenegraph.bodyGroup);
    this.updateCellGroupShadowInContainer(this.table.scenegraph.rightFrozenGroup);
    this.updateCellGroupShadowInContainer(this.table.scenegraph.bottomFrozenGroup);
    this.updateCellGroupShadowInContainer(this.table.scenegraph.rightBottomCornerGroup);
  }

  updateCellGroupShadow() {
    if (!this.table.isPivotTable()) {
      this.updateCellGroupShadowInContainer(this.table.scenegraph.rowHeaderGroup, this.range);
      this.updateCellGroupShadowInContainer(this.table.scenegraph.leftBottomCornerGroup, this.range);
    }
    this.updateCellGroupShadowInContainer(this.table.scenegraph.bodyGroup, this.range);
    this.updateCellGroupShadowInContainer(this.table.scenegraph.rightFrozenGroup, this.range);
    this.updateCellGroupShadowInContainer(this.table.scenegraph.bottomFrozenGroup), this.range;
    this.updateCellGroupShadowInContainer(this.table.scenegraph.rightBottomCornerGroup, this.range);
  }
  updateCellGroupShadowInContainer(container: Group, range?: CellAddress | CellRange) {
    let cellRange: CellRange;
    if (range && 'start' in range && 'end' in range) {
      cellRange = range;
    } else if (range) {
      cellRange = {
        start: range as CellAddress,
        end: range as CellAddress
      };
    }
    container.forEachChildrenSkipChild((item: INode) => {
      const column = item as unknown as Group;
      if (column.role === 'column') {
        column.forEachChildrenSkipChild((item: INode) => {
          const cell = item as unknown as Group;
          if (cell.role !== 'cell') {
            return;
          }
          cell.attachShadow(cell.shadowRoot);
          const shadowGroup = cell.shadowRoot;
          if (!cellRange) {
            // no highlight
            shadowGroup.removeAllChild();
          } else if (cellInRange(cellRange, cell.col, cell.row)) {
            // inside highlight
            shadowGroup.removeAllChild();
          } else if (!shadowGroup.firstChild) {
            // outside highlight
            const shadowRect = createRect({
              x: 0,
              y: 0,
              width: cell.attribute.width,
              height: cell.attribute.height,
              fill: this.pluginOptions.fill,
              opacity: this.pluginOptions.opacity
            });
            shadowRect.name = 'shadow-rect';
            shadowGroup.appendChild(shadowRect);
          }
        });
      }
    });
  }
  update() {
    this.setFocusHighlightRange(this.range, true);
  }
}
