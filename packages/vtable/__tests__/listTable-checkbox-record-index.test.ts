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

  test('keeps header indeterminate when checkedState is sparse', () => {
    table = new ListTable({
      container: createDiv(),
      columns: [
        {
          field: 'task',
          title: 'Task',
          cellType: 'checkbox',
          headerType: 'checkbox'
        }
      ],
      records: [{ task: { text: 'checked', checked: true } }, { task: { text: 'unchecked' } }],
      enableCheckboxCascade: false
    });
    table.stateManager.checkedState.delete('1');

    table.setCellCheckboxStateByRecordIndex(0, 'task', true);

    expect(table.stateManager.headerCheckedState.task).toBe('indeterminate');
  });

  test('does not create false state for records that are already unchecked when clearing', () => {
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
        { task: { text: 'already unchecked', checked: false } }
      ],
      enableCheckboxCascade: false
    });
    table.stateManager.checkedState.delete('1');

    table.clearAllCheckboxState('task');

    expect(table.stateManager.checkedState.get('0').task).toBe(false);
    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
    expect(table.stateManager.checkedState.has('1')).toBe(false);
  });

  test('updates children and parent state when cascade is enabled', () => {
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
          children: [
            { task: { text: 'child 1', checked: true } },
            { task: { text: 'child 2', checked: true } }
          ]
        }
      ],
      enableCheckboxCascade: true
    });

    table.setCellCheckboxStateByRecordIndex([0, 0], 'task', false);

    expect(table.stateManager.checkedState.get('0').task).toBe('indeterminate');
    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
    expect(table.stateManager.checkedState.get('0,1').task).toBe(true);

    table.setCellCheckboxStateByRecordIndex(0, 'task', false);

    expect(table.stateManager.checkedState.get('0').task).toBe(false);
    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
    expect(table.stateManager.checkedState.get('0,1').task).toBe(false);
  });
});
