import type { StateManager } from '../state';
import type { CustomSelectionStyle, CellRange } from '../../ts-types';
import type { IRect, IRectGraphicAttribute } from '@src/vrender';
import { createRect } from '@src/vrender';
import { updateAllSelectComponent } from '../../scenegraph/select/update-select-border';
import type { Scenegraph } from '../../scenegraph/scenegraph';
import { updateCustomSelectBorder } from '../../scenegraph/select/update-custom-select-border';

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
  customSelectRanges.forEach((customRange: { range: CellRange; style: CustomSelectionStyle }) => {
    updateCustomSelectBorder(state.table.scenegraph, customRange.range, customRange.style);
  });
  state.select.customSelectRanges = customSelectRanges;
  updateAllSelectComponent(state.table.scenegraph);
  state.table.scenegraph.updateNextFrame();
}
