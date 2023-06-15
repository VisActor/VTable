import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { CellAddress } from '../ts-types';

export function diffCellId(
  oldCellIdsArr: number[][],
  newCellIdsArr: number[][],
  oldRowHeaderCellPositons: CellAddress[],
  layout: PivotHeaderLayoutMap
) {
  const oldCellIds = oldCellIdsArr.map(oldCellId => oldCellId[0]);
  const newCellIds = newCellIdsArr.map(oldCellId => oldCellId[0]);
  const addCellPositions = [];
  const removeCellPositions = [];
  // diff two array elements
  for (let i = 0; i < oldCellIds.length; i++) {
    if (!newCellIds.includes(oldCellIds[i])) {
      removeCellPositions.push(oldRowHeaderCellPositons[i]);
    }
  }
  for (let i = 0; i < newCellIds.length; i++) {
    if (!oldCellIds.includes(newCellIds[i])) {
      addCellPositions.push(layout.getHeaderCellAdress(newCellIds[i]));
    }
  }

  return {
    addCellPositions,
    removeCellPositions
  };
}
