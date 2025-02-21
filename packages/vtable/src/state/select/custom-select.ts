import type { CustomSelectionStyle, StateManager } from '../state';
import type { CellRange } from '../../ts-types';
import type { IRect, IRectGraphicAttribute } from '@src/vrender';
import { createRect } from '@src/vrender';
import { updateAllSelectComponent } from '../../scenegraph/select/update-select-border';
import type { Scenegraph } from '../../scenegraph/scenegraph';

export function deletaCustomSelectRanges(state: StateManager) {
  const { customSelectedRangeComponents } = state.table.scenegraph;
  // delete graphic
  customSelectedRangeComponents.forEach((selectComp: { rect: IRect }, key: string) => {
    selectComp.rect.delete();
  });
  customSelectedRangeComponents.clear();
  state.select.customSelectRanges = [];
}

export function addCustomSelectRanges(
  customSelectRanges: {
    range: CellRange;
    style: CustomSelectionStyle;
  }[],
  state: StateManager
) {
  const { customSelectedRangeComponents } = state.table.scenegraph;
  customSelectRanges.forEach((customRange: { range: CellRange; style: CustomSelectionStyle }) => {
    const { range, style } = customRange;
    const rect = createRect({
      fill: style.cellBgColor ?? false,
      stroke: style.cellBorderColor ?? false,
      lineWidth: style.cellBorderLineWidth ?? 0,
      lineDash: style.cellBorderLineDash ?? [],
      pickable: false
    });
    customSelectedRangeComponents.set(`${range.start.col}-${range.start.row}-${range.end.col}-${range.end.row}`, {
      rect,
      role: 'body'
    });
  });
  state.select.customSelectRanges = customSelectRanges;
  updateAllSelectComponent(state.table.scenegraph);
  state.table.scenegraph.updateNextFrame();
}
