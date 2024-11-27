import type { Rect } from '@visactor/vtable/es/vrender';
import { createRect } from '@visactor/vtable/es/vrender';
import type { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
import { isSameRange } from '@visactor/vtable/es/tools/cell-range';
import type { CellRange } from '@visactor/vtable/es/ts-types';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';
import { cellInRange } from '@visactor/vtable/es/tools/helper';
import { isValid } from '@visactor/vutils';

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
    container.forEachChildrenSkipChild((column: Group) => {
      if (column.role === 'column') {
        column.forEachChildrenSkipChild((cell: Group) => {
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

export function onBeforeAttributeUpdateForInvertHighlight(val: Record<string, any>, attribute: any) {
  // @ts-ignore
  const graphic = this as any;
  if (graphic.shadowRoot && graphic.shadowRoot.childrenCount && (isValid(val.width) || isValid(val.height))) {
    const shadowRect = (graphic.shadowRoot as Group).findChildrenByName('shadow-rect')[0] as Rect;
    if (shadowRect) {
      shadowRect.setAttributes({
        width: val.width ?? shadowRect.attribute.width,
        height: val.height ?? shadowRect.attribute.height
      });
    }
  }
}
