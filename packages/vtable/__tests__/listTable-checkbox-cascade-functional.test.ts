// @ts-nocheck
import { ListTable } from '../src';
import { createDiv } from './dom';
global.__VERSION__ = 'none';

describe('listTable-checkbox-cascade-functional test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  const records = [
    {
      id: 1,
      name: 'Parent 1',
      children: [
        { id: 11, name: 'Child 1.1' },
        { id: 12, name: 'Child 1.2' }
      ]
    },
    {
      id: 2,
      name: 'Parent 2',
      children: [
        { id: 21, name: 'Child 2.1' },
        { id: 22, name: 'Child 2.2' }
      ]
    }
  ];

  const option = {
    columns: [
      {
        field: 'id',
        title: 'ID',
        width: 100
      },
      {
        field: 'name',
        title: 'Name',
        width: 200
      }
    ],
    records,
    enableCheckboxCascade: true,
    enableHeaderCheckboxCascade: true,
    rowSeriesNumber: {
      enableTreeCheckbox: true
    }
  };

  let table;

  beforeEach(() => {
    table = new ListTable(containerDom, option);
  });

  afterEach(() => {
    table.release();
  });

  test('should verify checkbox cascade state changes work correctly', () => {
    // Initially, checkbox cascade should be enabled
    expect(table.internalProps.enableCheckboxCascade).toBe(true);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(true);

    // Verify the state is properly set
    expect(table.options.enableCheckboxCascade).toBe(true);
    expect(table.options.enableHeaderCheckboxCascade).toBe(true);

    // Disable checkbox cascade
    table.updateOption({
      ...option,
      enableCheckboxCascade: false,
      enableHeaderCheckboxCascade: false
    });

    // Verify it's disabled
    expect(table.internalProps.enableCheckboxCascade).toBe(false);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(false);
    expect(table.options.enableCheckboxCascade).toBe(false);
    expect(table.options.enableHeaderCheckboxCascade).toBe(false);

    // Enable it again
    table.updateOption({
      ...option,
      enableCheckboxCascade: true,
      enableHeaderCheckboxCascade: true
    });

    // Verify it's enabled again
    expect(table.internalProps.enableCheckboxCascade).toBe(true);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(true);
    expect(table.options.enableCheckboxCascade).toBe(true);
    expect(table.options.enableHeaderCheckboxCascade).toBe(true);
  });

  test('should handle updateOption with only enableCheckboxCascade changed', () => {
    // Test updating only enableCheckboxCascade
    table.updateOption({
      ...table.options,
      enableCheckboxCascade: false
    });

    expect(table.internalProps.enableCheckboxCascade).toBe(false);

    // Test updating only enableHeaderCheckboxCascade
    table.updateOption({
      ...table.options,
      enableHeaderCheckboxCascade: false
    });

    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(false);
  });

  test('should handle multiple consecutive updates', () => {
    // Multiple updates in sequence
    table.updateOption({
      ...option,
      enableCheckboxCascade: false
    });
    expect(table.internalProps.enableCheckboxCascade).toBe(false);

    table.updateOption({
      ...option,
      enableCheckboxCascade: true
    });
    expect(table.internalProps.enableCheckboxCascade).toBe(true);

    table.updateOption({
      ...option,
      enableCheckboxCascade: false
    });
    expect(table.internalProps.enableCheckboxCascade).toBe(false);
  });
});
