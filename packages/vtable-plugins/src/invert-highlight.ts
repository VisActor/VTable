import type { INode } from '@visactor/vtable/es/vrender';
import { createRect } from '@visactor/vtable/es/vrender';
import type { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
import { isSameRange } from '@visactor/vtable/es/tools/cell-range';
import type { CellRange } from '@visactor/vtable/es/ts-types';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';
import { cellInRange } from '@visactor/vtable/es/tools/helper';

export interface InvertHighlightPluginOptions {
  fill?: string;
  opacity?: number;
}

export class InvertHighlightPlugin {
  table: BaseTableAPI;
  range?: CellRange;
  _fill: string;
  _opacity: number;

  constructor(table: BaseTableAPI, options?: InvertHighlightPluginOptions) {
    this.table = table;

    this._fill = options?.fill ?? '#000';
    this._opacity = options?.opacity ?? 0.5;
  }

  setInvertHighlightRange(range?: CellRange) {
    if (isSameRange(this.range, range)) {
      return;
    }

    this.range = range;
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
  updateCellGroupShadowInContainer(container: Group, range?: CellRange) {
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
          if (!range) {
            // no highlight
            shadowGroup.removeAllChild();
          } else if (cellInRange(range, cell.col, cell.row)) {
            // inside highlight
            shadowGroup.removeAllChild();
          } else if (!shadowGroup.firstChild) {
            // outside highlight
            const shadowRect = createRect({
              x: 0,
              y: 0,
              width: cell.attribute.width,
              height: cell.attribute.height,
              fill: this._fill,
              opacity: this._opacity
            });
            shadowRect.name = 'shadow-rect';
            shadowGroup.appendChild(shadowRect);
          }
        });
      }
    });
  }
}
