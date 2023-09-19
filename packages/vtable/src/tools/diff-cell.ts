import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { CellAddress } from '../ts-types';

export function diffCellAddress(
  oldCellIds: number[],
  newCellIds: number[],
  oldRowHeaderCellPositons: CellAddress[],
  layout: PivotHeaderLayoutMap
) {
  // const oldCellIds = oldCellIdsArr.map(oldCellId => oldCellId[0]);
  // const newCellIds = newCellIdsArr.map(oldCellId => oldCellId[0]);
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

// find diff between two arrays
export function diffCellIndices(oldIndexedData: (number | number[])[], currentIndexedData: (number | number[])[]) {
  const add = [];
  const remove = [];
  // find removed indices
  for (let i = 0; i < oldIndexedData.length; i++) {
    let removed = true;
    for (let j = 0; j < currentIndexedData.length; j++) {
      if (checkIndex(oldIndexedData[i], currentIndexedData[j])) {
        removed = false;
        break;
      }
    }
    if (removed) {
      remove.push(i);
    }
  }

  // find added indices
  for (let i = 0; i < currentIndexedData.length; i++) {
    let added = true;
    for (let j = 0; j < oldIndexedData.length; j++) {
      if (checkIndex(oldIndexedData[j], currentIndexedData[i])) {
        added = false;
        break;
      }
    }
    if (added) {
      add.push(i);
    }
  }
  return { add, remove };
}

function checkIndex(oldIndex: number | number[], newIndex: number | number[]): boolean {
  if (typeof oldIndex !== typeof newIndex) {
    return false;
  }
  if (typeof oldIndex === 'number' && typeof newIndex === 'number' && oldIndex !== newIndex) {
    return false;
  }
  if ((oldIndex as number[]).length !== (newIndex as number[]).length) {
    return false;
  }
  for (let i = 0; i < (oldIndex as number[]).length; i++) {
    if (oldIndex[i] !== newIndex[i]) {
      return false;
    }
  }
  return true;
}
