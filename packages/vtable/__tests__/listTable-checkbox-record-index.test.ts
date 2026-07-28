// @ts-nocheck
import { ListTable, TYPES } from '../src';
import { createDiv } from './dom';

global.__VERSION__ = 'none';

describe('ListTable checkbox record index api', () => {
  let table: ListTable;

  afterEach(() => {
    table?.release();
    document.body.innerHTML = '';
  });

  test('sets collapsed tree child checkbox state by record index path', () => {
    table = new ListTable({
      container: createDiv(),
      columns: [
        {
          field: 'task',
          title: 'Task',
          tree: true,
          cellType: 'checkbox',
          headerType: 'checkbox'
        }
      ],
      records: [
        {
          task: { text: 'parent', checked: true },
          hierarchyState: TYPES.HierarchyState.collapse,
          children: [{ task: { text: 'child', checked: true } }]
        }
      ],
      enableCheckboxCascade: false
    });

    table.setCellCheckboxStateByRecordIndex([0, 0], 'task', false);

    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
  });

  test('clears all checkbox states for a field', () => {
    table = new ListTable({
      container: createDiv(),
      columns: [
        {
          field: 'task',
          title: 'Task',
          tree: true,
          cellType: 'checkbox',
          headerType: 'checkbox'
        }
      ],
      records: [
        {
          task: { text: 'parent', checked: true },
          hierarchyState: TYPES.HierarchyState.collapse,
          children: [{ task: { text: 'child', checked: true } }]
        },
        { task: { text: 'sibling', checked: true } }
      ],
      enableCheckboxCascade: false
    });

    table.clearAllCheckboxState('task');

    expect(table.stateManager.checkedState.get('0').task).toBe(false);
    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
    expect(table.stateManager.checkedState.get('1').task).toBe(false);
    expect(table.stateManager.headerCheckedState.task).toBe(false);
  });
});
