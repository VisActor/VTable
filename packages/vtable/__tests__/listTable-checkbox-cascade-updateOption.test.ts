// @ts-nocheck
import { ListTable } from '../src';
import { createDiv } from './dom';
global.__VERSION__ = 'none';

describe('listTable-checkbox-cascade-updateOption test', () => {
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

  test('should toggle enableCheckboxCascade at runtime', () => {
    // Initially, checkbox cascade should be enabled
    expect(table.internalProps.enableCheckboxCascade).toBe(true);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(true);

    // Update option to disable checkbox cascade
    table.updateOption({
      ...option,
      enableCheckboxCascade: false,
      enableHeaderCheckboxCascade: false
    });

    // Checkbox cascade should now be disabled
    expect(table.internalProps.enableCheckboxCascade).toBe(false);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(false);

    // Update option to enable checkbox cascade again
    table.updateOption({
      ...option,
      enableCheckboxCascade: true,
      enableHeaderCheckboxCascade: true
    });

    // Checkbox cascade should now be enabled again
    expect(table.internalProps.enableCheckboxCascade).toBe(true);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(true);
  });

  test('should handle other options changes along with checkbox cascade', () => {
    // Update option with theme change and checkbox cascade disabled
    table.updateOption({
      ...option,
      enableCheckboxCascade: false,
      theme: {
        underlayBackgroundColor: '#f0f0f0'
      }
    });

    // Checkbox cascade should be disabled
    expect(table.internalProps.enableCheckboxCascade).toBe(false);

    // Theme should be applied
    expect(table.theme.underlayBackgroundColor).toBe('#f0f0f0');
  });
});
