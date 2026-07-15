import { Group } from '../../src/scenegraph/graphic/group';

describe('scenegraph Group', () => {
  test('addCellGroup clones ancestor cell groups before insertion', () => {
    const columnGroup = new Group({});
    const existingCell = new Group({});
    existingCell.role = 'cell';
    existingCell.row = 0;
    columnGroup.addCellGroup(existingCell);

    const ancestorCell = new Group({ width: 120, height: 24 });
    ancestorCell.role = 'cell';
    ancestorCell.col = 2;
    ancestorCell.row = 1;
    (columnGroup as any).parent = ancestorCell;

    const insertedCell = columnGroup.addCellGroup(ancestorCell);

    expect(insertedCell).not.toBe(ancestorCell);
    expect(insertedCell.parent).toBe(columnGroup);
    expect(insertedCell.role).toBe('cell');
    expect(insertedCell.col).toBe(2);
    expect(insertedCell.row).toBe(1);
    expect(columnGroup.lastChild).toBe(insertedCell);

    columnGroup.removeAllChild();
    (columnGroup as any).parent = null;
  });
});
