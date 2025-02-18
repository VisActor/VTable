import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { Scenegraph } from '../scenegraph/scenegraph';
import type { CellAddress } from '../ts-types';

export function diffCellAddress(
  col: number,
  row: number,
  oldCellIds: number[],
  newCellIds: number[],
  oldRowHeaderCellPositons: CellAddress[],
  layout: PivotHeaderLayoutMap
) {
  const columnHeaderStart = layout.columnHeaderLevelCount;
  // const oldCellIds = oldCellIdsArr.map(oldCellId => oldCellId[0]);
  // const newCellIds = newCellIdsArr.map(oldCellId => oldCellId[0]);
  const addCellPositionsRowDirection = [];
  const removeCellPositionsRowDirection = [];
  // const updateCellIds: Set<LayoutObjectId> = new Set();
  // diff two array elements
  for (let i = 0; i < oldCellIds.length; i++) {
    if (!newCellIds.includes(oldCellIds[i])) {
      // updateCellIds.add(layout.getParentCellId(oldRowHeaderCellPositons[i].col, oldRowHeaderCellPositons[i].row));
      removeCellPositionsRowDirection.push(oldRowHeaderCellPositons[i]);
    }
  }
  for (let i = 0; i < newCellIds.length; i++) {
    if (!oldCellIds.includes(newCellIds[i])) {
      const newCellAddr = { col, row: columnHeaderStart + i }; // layout.getHeaderCellAdressById(newCellIds[i]);
      // updateCellIds.add(layout.getParentCellId(newCellAddr.col, newCellAddr.row));
      addCellPositionsRowDirection.push(newCellAddr);
    }
  }
  let parentId = layout.getParentCellId(col, row);
  let parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
  const updateCellPositionsRowDirection = [];
  parentCellAddress && updateCellPositionsRowDirection.push(parentCellAddress);
  while (parentId) {
    parentId = layout.getParentCellId(parentCellAddress.col, parentCellAddress.row);
    if (parentId) {
      parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
      updateCellPositionsRowDirection.push(parentCellAddress);
    }
  }
  return {
    addCellPositionsRowDirection,
    removeCellPositionsRowDirection,
    updateCellPositionsRowDirection
  };
}

export function diffCellAddressForGridTree(
  col: number,
  row: number,
  oldCellIds: number[],
  newCellIds: number[],
  oldRowHeaderCellPositons: CellAddress[],

  layout: PivotHeaderLayoutMap
) {
  const columnHeaderStart = layout.columnHeaderLevelCount;
  // const oldCellIds = oldCellIdsArr.map(oldCellId => oldCellId[0]);
  // const newCellIds = newCellIdsArr.map(oldCellId => oldCellId[0]);
  const addCellPositionsRowDirection = [];
  const removeCellPositionsRowDirection = [];
  // const updateCellIds: Set<LayoutObjectId> = new Set();
  // diff two array elements
  for (let i = 0; i < oldCellIds.length; i++) {
    if (!newCellIds.includes(oldCellIds[i])) {
      // updateCellIds.add(layout.getParentCellId(oldRowHeaderCellPositons[i].col, oldRowHeaderCellPositons[i].row));
      removeCellPositionsRowDirection.push(oldRowHeaderCellPositons[i]);
    }
  }
  for (let i = 0; i < newCellIds.length; i++) {
    if (!oldCellIds.includes(newCellIds[i])) {
      const newCellAddr = { col, row: columnHeaderStart + i }; // layout.getHeaderCellAdressById(newCellIds[i]);
      // updateCellIds.add(layout.getParentCellId(newCellAddr.col, newCellAddr.row));
      addCellPositionsRowDirection.push(newCellAddr);
    }
  }
  let parentId = layout.getParentCellId(col, row);
  let parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
  const updateCellPositionsRowDirection = [];
  parentCellAddress && updateCellPositionsRowDirection.push(parentCellAddress);
  while (parentId) {
    parentId = layout.getParentCellId(parentCellAddress.col, parentCellAddress.row);
    if (parentId) {
      parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
      updateCellPositionsRowDirection.push(parentCellAddress);
    }
  }

  const addCellPositionsColumnDirection = [];
  // const updateCellPositionsColumnDirection = [];
  const removeCellPositionsColumnDirection = [];
  if (
    layout.rowHierarchyType === 'grid-tree' &&
    layout.cornerSetting.titleOnDimension === 'column' &&
    layout.rowHeaderLevelCount !== layout._cornerHeaderCellIds[0].length // 表头层级数发生了变化 需要整体做更新_cornerHeaderCellIds是旧值 rowHeaderLevelCount是新值
  ) {
    if (layout.rowHeaderLevelCount > layout._cornerHeaderCellIds[0].length) {
      for (let i = layout._cornerHeaderCellIds[0].length; i < layout.rowHeaderLevelCount; i++) {
        addCellPositionsColumnDirection.push({ col: i, row });
      }
    } else {
      for (let i = layout.rowHeaderLevelCount; i < layout._cornerHeaderCellIds[0].length; i++) {
        // if (layout.hideIndicatorName === false && layout.indicatorsAsCol === false) {
        //   removeCellPositionsColumnDirection.push({ col: i, row });
        //   updateCellPositionsColumnDirection.push({ col: i - 1, row });
        // } else {
        removeCellPositionsColumnDirection.push({ col: i, row });
        // }
      }
    }
  }

  return {
    addCellPositionsRowDirection,
    removeCellPositionsRowDirection,
    updateCellPositionsRowDirection,
    addCellPositionsColumnDirection,
    removeCellPositionsColumnDirection
    // updateCellPositionsColumnDirection
  };
}

export function diffCellAddressForGridTreeOnColumn(
  col: number,
  row: number,
  oldCellIds: number[],
  newCellIds: number[],
  oldRowHeaderCellPositons: CellAddress[],

  layout: PivotHeaderLayoutMap
) {
  const rowHeaderStart = layout.rowHeaderLevelCount;
  // const oldCellIds = oldCellIdsArr.map(oldCellId => oldCellId[0]);
  // const newCellIds = newCellIdsArr.map(oldCellId => oldCellId[0]);
  const addCellPositionsColumnDirection = [];
  const removeCellPositionsColumnDirection = [];
  // const updateCellIds: Set<LayoutObjectId> = new Set();
  // diff two array elements
  for (let i = 0; i < oldCellIds.length; i++) {
    if (!newCellIds.includes(oldCellIds[i])) {
      // updateCellIds.add(layout.getParentCellId(oldRowHeaderCellPositons[i].col, oldRowHeaderCellPositons[i].row));
      removeCellPositionsColumnDirection.push(oldRowHeaderCellPositons[i]);
    }
  }
  for (let i = 0; i < newCellIds.length; i++) {
    if (!oldCellIds.includes(newCellIds[i])) {
      const newCellAddr = { col: rowHeaderStart + i, row }; // layout.getHeaderCellAdressById(newCellIds[i]);
      // updateCellIds.add(layout.getParentCellId(newCellAddr.col, newCellAddr.row));
      addCellPositionsColumnDirection.push(newCellAddr);
    }
  }
  let parentId = layout.getParentCellId(col, row);
  let parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
  const updateCellPositionsColumnDirection = [];
  parentCellAddress && updateCellPositionsColumnDirection.push(parentCellAddress);
  while (parentCellAddress && parentId) {
    parentId = layout.getParentCellId(parentCellAddress.col, parentCellAddress.row);
    if (parentId) {
      parentCellAddress = layout.getRowHeaderCellAddressByCellId(parentId);
      updateCellPositionsColumnDirection.push(parentCellAddress);
    }
  }

  const addCellPositionsRowDirection = [];
  // const updateCellPositionsRowDirection = [];
  const removeCellPositionsRowDirection = [];
  if (
    layout.columnHierarchyType === 'grid-tree' &&
    layout.cornerSetting.titleOnDimension === 'row' &&
    layout.columnHeaderLevelCount !== layout._cornerHeaderCellIds.length // 表头层级数发生了变化 需要整体做更新_cornerHeaderCellIds是旧值 rowHeaderLevelCount是新值
  ) {
    if (layout.columnHeaderLevelCount > layout._cornerHeaderCellIds.length) {
      for (let i = layout._cornerHeaderCellIds.length; i < layout.columnHeaderLevelCount; i++) {
        addCellPositionsRowDirection.push({ col, row: i });
      }
    } else {
      for (let i = layout.columnHeaderLevelCount; i < layout._cornerHeaderCellIds.length; i++) {
        // if (layout.hideIndicatorName && layout.indicatorsAsCol) {
        //   removeCellPositionsRowDirection.push({ col, row: i });
        //   updateCellPositionsRowDirection.push({ col, row: i - 1 });
        // } else {
        removeCellPositionsRowDirection.push({ col, row: i });
        // }
      }
    }
  }
  return {
    addCellPositionsColumnDirection,
    removeCellPositionsColumnDirection,
    updateCellPositionsColumnDirection,
    addCellPositionsRowDirection,
    // updateCellPositionsRowDirection,
    removeCellPositionsRowDirection
  };
}

// find diff between two arrays
function diffCellIndices(oldIndexedData: (number | number[])[], currentIndexedData: (number | number[])[]) {
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

export function calculateArrayDiff(
  originalArray: (number | number[])[],
  targetArray: (number | number[])[],
  startIndex: number
) {
  const add = [];
  const remove = [];

  const originalMap = new Map();
  for (let i = 0; i < originalArray.length; i++) {
    const element = originalArray[i];
    const key = JSON.stringify(element);
    if (originalMap.has(key)) {
      originalMap.get(key).push(i);
    } else {
      originalMap.set(key, [i]);
    }
  }

  for (let i = 0; i < targetArray.length; i++) {
    const element = targetArray[i];
    const key = JSON.stringify(element);
    if (!originalMap.has(key)) {
      add.push(i + startIndex);
    } else {
      const indices = originalMap.get(key);
      indices.shift(); // Remove the first index
      if (indices.length === 0) {
        originalMap.delete(key);
      }
    }
  }

  for (let i = 0; i < originalArray.length; i++) {
    const element = originalArray[i];
    if (!targetArray.some(item => isEqual(item, element))) {
      remove.push(i + startIndex);
    }
  }

  return { add, remove };
}

function isEqual(arr1: any, arr2: any) {
  if (arr1 === arr2) {
    return true;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function callUpdateRowOnScenegraph(
  result: {
    addCellPositionsRowDirection?: CellAddress[];
    removeCellPositionsRowDirection?: CellAddress[];
    updateCellPositionsRowDirection?: CellAddress[];
    addCellPositionsColumnDirection?: CellAddress[];
    removeCellPositionsColumnDirection?: CellAddress[];
    updateCellPositionsColumnDirection?: CellAddress[];
  },
  recalculateColWidths: boolean,
  newFrozenRowCount: number,
  oldFrozenRowCount: number,
  scenegraph: Scenegraph
) {
  if (
    result.addCellPositionsRowDirection?.length ||
    result.removeCellPositionsRowDirection?.length ||
    result.updateCellPositionsRowDirection?.length
  ) {
    scenegraph.updateRow(
      result.removeCellPositionsRowDirection,
      result.addCellPositionsRowDirection.map(item => {
        item.row += newFrozenRowCount - oldFrozenRowCount;
        return item;
      }),
      result.updateCellPositionsRowDirection,
      recalculateColWidths
    );
  }
}

export function callUpdateColOnScenegraph(
  result: {
    addCellPositionsRowDirection?: CellAddress[];
    removeCellPositionsRowDirection?: CellAddress[];
    updateCellPositionsRowDirection?: CellAddress[];
    addCellPositionsColumnDirection?: CellAddress[];
    removeCellPositionsColumnDirection?: CellAddress[];
    updateCellPositionsColumnDirection?: CellAddress[];
  },
  newFrozenColCount: number,
  oldFrozenColCount: number,
  scenegraph: Scenegraph
) {
  if (
    result.addCellPositionsColumnDirection?.length ||
    result.removeCellPositionsColumnDirection?.length ||
    result.updateCellPositionsColumnDirection?.length
  ) {
    scenegraph.updateCol(
      result.removeCellPositionsColumnDirection,
      result.addCellPositionsColumnDirection.map(item => {
        item.col += newFrozenColCount - oldFrozenColCount;
        return item;
      }),
      result.updateCellPositionsColumnDirection
    );
  }
}
