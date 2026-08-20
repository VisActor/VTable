// @ts-nocheck
import { ListTable, TYPES } from '../src';
import { changeCheckboxOrder } from '../src/state/checkbox/checkbox';
import { changeRadioOrder } from '../src/state/radio/radio';
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
    const renderAsync = jest.spyOn(table, 'renderAsync').mockImplementation(() => Promise.resolve());

    table.setCellCheckboxStateByRecordIndex([0, 0], 'task', false);

    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
    expect(renderAsync).toHaveBeenCalledTimes(1);
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
    const renderAsync = jest.spyOn(table, 'renderAsync').mockImplementation(() => Promise.resolve());

    table.clearAllCheckboxState('task');

    expect(table.stateManager.checkedState.get('0').task).toBe(false);
    expect(table.stateManager.checkedState.get('0,0').task).toBe(false);
    expect(table.stateManager.checkedState.get('1').task).toBe(false);
    expect(table.stateManager.headerCheckedState.task).toBe(false);
    expect(renderAsync).toHaveBeenCalledTimes(1);
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
          children: [{ task: { text: 'child 1', checked: true } }, { task: { text: 'child 2', checked: true } }]
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

  test('moves checkbox state for a tree subtree by record path', () => {
    const checkedState = new Map([
      ['0', { task: 'source' }],
      ['0,0', { task: 'source-child' }],
      ['1', { task: 'sibling-1' }],
      ['1,0', { task: 'sibling-1-child' }],
      ['2', { task: 'sibling-2' }]
    ]);

    changeCheckboxOrder(0, 2, { checkedState });

    expect(checkedState.get('2').task).toBe('source');
    expect(checkedState.get('2,0').task).toBe('source-child');
    expect(checkedState.get('0').task).toBe('sibling-1');
    expect(checkedState.get('0,0').task).toBe('sibling-1-child');
    expect(checkedState.get('1').task).toBe('sibling-2');
    expect(checkedState.size).toBe(5);
  });

  test('moves nested checkbox state without matching sibling prefix numbers', () => {
    const checkedState = new Map([
      ['0,1', { task: 'source' }],
      ['0,1,0', { task: 'source-child' }],
      ['0,2', { task: 'sibling-2' }],
      ['0,10', { task: 'sibling-10' }],
      ['0,10,0', { task: 'sibling-10-child' }]
    ]);

    changeCheckboxOrder([0, 1], [0, 2], { checkedState });

    expect(checkedState.get('0,2').task).toBe('source');
    expect(checkedState.get('0,2,0').task).toBe('source-child');
    expect(checkedState.get('0,1').task).toBe('sibling-2');
    expect(checkedState.get('0,10').task).toBe('sibling-10');
    expect(checkedState.get('0,10,0').task).toBe('sibling-10-child');
    expect(checkedState.size).toBe(5);
  });

  test('keeps checkbox state unchanged for unsupported cross-parent row moves', () => {
    const checkedState = new Map([
      ['0,0', { task: 'source' }],
      ['1,0', { task: 'target-parent-child' }]
    ]);

    changeCheckboxOrder([0, 0], [1, 0], { checkedState });

    expect(checkedState.get('0,0').task).toBe('source');
    expect(checkedState.get('1,0').task).toBe('target-parent-child');
  });

  test('moves flat radio state by record path', () => {
    const radioState = {
      columnRadio: 0,
      cellRadio: {
        0: 0,
        1: 1,
        2: 2
      }
    };

    changeRadioOrder(0, 2, { radioState });

    expect(radioState.columnRadio).toBe(2);
    expect(radioState.cellRadio[2]).toBe(0);
    expect(radioState.cellRadio[0]).toBe(1);
    expect(radioState.cellRadio[1]).toBe(2);
  });

  test('moves nested radio state without matching sibling prefix numbers', () => {
    const radioState = {
      cellRadio: {
        '0,1': true,
        '0,1,0': 1,
        '0,2': true,
        '0,10': true
      }
    };

    changeRadioOrder([0, 1], [0, 2], { radioState });

    expect(radioState.cellRadio['0,2']).toBe(true);
    expect(radioState.cellRadio['0,2,0']).toBe(1);
    expect(radioState.cellRadio['0,1']).toBe(true);
    expect(radioState.cellRadio['0,10']).toBe(true);
  });

  test('moves serialized radio record path state', () => {
    const radioState = {
      columnRadio: '0,1'
    };

    changeRadioOrder([0, 1], [0, 2], { radioState });

    expect(radioState.columnRadio).toBe('0,2');
  });

  test('keeps radio state unchanged for unsupported cross-parent row moves', () => {
    const radioState = {
      cellRadio: {
        '0,0': 1,
        '1,0': 2
      }
    };

    changeRadioOrder([0, 0], [1, 0], { radioState });

    expect(radioState.cellRadio['0,0']).toBe(1);
    expect(radioState.cellRadio['1,0']).toBe(2);
  });

  test('StateManager moves radio state stored as an object', () => {
    table = new ListTable({
      container: createDiv(),
      columns: [
        {
          field: 'choice',
          title: 'Choice',
          cellType: 'radio',
          width: 120
        }
      ],
      records: [{ choice: true }, { choice: false }, { choice: false }]
    });
    table.stateManager.radioState = { choice: 0 };

    table.stateManager.changeRadioOrder(0, 2);

    expect(table.stateManager.radioState.choice).toBe(2);
  });
});
