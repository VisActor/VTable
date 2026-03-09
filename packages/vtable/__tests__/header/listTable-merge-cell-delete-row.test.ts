// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

describe('merge cell adjust on delete record', () => {
  test('deleteRecords updates scenegraph mergeStart/End after customMergeCell changes', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '800px';
    containerDom.style.height = '600px';

    const columns = [
      { field: 'a', title: 'A', width: 100 },
      { field: 'b', title: 'B', width: 100 },
      { field: 'c', title: 'C', width: 100 },
      { field: 'd', title: 'D', width: 100 },
      { field: 'e', title: 'E', width: 100 }
    ];

    const data = Array.from({ length: 10 }).map((_, i) => ({
      a: i,
      b: i + 10,
      c: i + 20,
      d: i + 30,
      e: i + 40
    }));

    const table = new ListTable({
      container: containerDom,
      columns,
      records: data
    });

    table.mergeCells(1, 2, 3, 5);
    const mergedCell = table.scenegraph.getCell(1, 2, true);
    expect(mergedCell.mergeStartRow).toBe(2);
    expect(mergedCell.mergeEndRow).toBe(5);

    table.deleteRecords([3]);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    expect(table.options.customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(table.options.customMergeCell[0].range.end).toEqual({ col: 3, row: 4 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartRow).toBe(2);
    expect(mergedCellAfter.mergeEndRow).toBe(4);

    table.release();
  });

  test('deleteColumns updates customMergeCell range after column deletion', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '800px';
    containerDom.style.height = '600px';

    const columns = [
      { field: 'a', title: 'A', width: 100 },
      { field: 'b', title: 'B', width: 100 },
      { field: 'c', title: 'C', width: 100 },
      { field: 'd', title: 'D', width: 100 },
      { field: 'e', title: 'E', width: 100 }
    ];

    const data = Array.from({ length: 10 }).map((_, i) => ({
      a: i,
      b: i + 10,
      c: i + 20,
      d: i + 30,
      e: i + 40
    }));

    const table = new ListTable({
      container: containerDom,
      columns,
      records: data
    });

    table.mergeCells(1, 2, 3, 5);
    const mergedCell = table.scenegraph.getCell(1, 2, true);
    expect(mergedCell.mergeStartCol).toBe(1);
    expect(mergedCell.mergeEndCol).toBe(3);

    table.deleteColumns([2]);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    expect(table.options.customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(table.options.customMergeCell[0].range.end).toEqual({ col: 2, row: 5 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartCol).toBe(1);
    expect(mergedCellAfter.mergeEndCol).toBe(2);

    table.release();
  });

  test('addRecord expands customMergeCell range when inserting within merged rows', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '800px';
    containerDom.style.height = '600px';

    const columns = [
      { field: 'a', title: 'A', width: 100 },
      { field: 'b', title: 'B', width: 100 },
      { field: 'c', title: 'C', width: 100 },
      { field: 'd', title: 'D', width: 100 },
      { field: 'e', title: 'E', width: 100 }
    ];

    const data = Array.from({ length: 10 }).map((_, i) => ({
      a: i,
      b: i + 10,
      c: i + 20,
      d: i + 30,
      e: i + 40
    }));

    const table = new ListTable({
      container: containerDom,
      columns,
      records: data
    });

    table.mergeCells(1, 2, 3, 5);
    table.addRecord({ a: 100, b: 200, c: 300, d: 400, e: 500 }, 2);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    expect(table.options.customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(table.options.customMergeCell[0].range.end).toEqual({ col: 3, row: 6 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartRow).toBe(2);
    expect(mergedCellAfter.mergeEndRow).toBe(6);

    table.release();
  });

  test('addColumns expands customMergeCell range when inserting within merged columns', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '800px';
    containerDom.style.height = '600px';

    const columns = [
      { field: 'a', title: 'A', width: 100 },
      { field: 'b', title: 'B', width: 100 },
      { field: 'c', title: 'C', width: 100 },
      { field: 'd', title: 'D', width: 100 },
      { field: 'e', title: 'E', width: 100 }
    ];

    const data = Array.from({ length: 10 }).map((_, i) => ({
      a: i,
      b: i + 10,
      c: i + 20,
      d: i + 30,
      e: i + 40
    }));

    const table = new ListTable({
      container: containerDom,
      columns,
      records: data
    });

    table.mergeCells(1, 2, 3, 5);
    table.addColumns([{ field: 'x', title: 'X', width: 100 }], 2, true);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    expect(table.options.customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(table.options.customMergeCell[0].range.end).toEqual({ col: 4, row: 5 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartCol).toBe(1);
    expect(mergedCellAfter.mergeEndCol).toBe(4);

    table.release();
  });

  test('deleteRecords removes customMergeCell and clears cell merge info when merged range fully deleted', done => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '800px';
    containerDom.style.height = '600px';

    const columns = [
      { field: 'a', title: 'A', width: 100 },
      { field: 'b', title: 'B', width: 100 },
      { field: 'c', title: 'C', width: 100 },
      { field: 'd', title: 'D', width: 100 },
      { field: 'e', title: 'E', width: 100 }
    ];

    const data = Array.from({ length: 10 }).map((_, i) => ({
      a: i,
      b: i + 10,
      c: i + 20,
      d: i + 30,
      e: i + 40
    }));

    const table = new ListTable({
      container: containerDom,
      columns,
      records: data
    });

    table.mergeCells(1, 2, 3, 5);
    table.deleteRecords([4, 3, 2, 1]);

    setTimeout(() => {
      expect(Array.isArray(table.options.customMergeCell)).toBe(true);
      expect(table.options.customMergeCell.length).toBe(0);
      const cell = table.scenegraph.getCell(1, 2);
      expect(cell.mergeStartCol).toBeUndefined();
      expect(cell.mergeEndCol).toBeUndefined();
      expect(cell.mergeStartRow).toBeUndefined();
      expect(cell.mergeEndRow).toBeUndefined();
      table.release();
      done();
    }, 0);
  });
});
