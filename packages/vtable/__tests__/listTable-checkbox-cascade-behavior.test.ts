// @ts-nocheck
import { ListTable } from '../src';
import { createDiv } from './dom';
global.__VERSION__ = 'none';

describe('listTable-checkbox-cascade-behavior test', () => {
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

  test('should actually toggle checkbox cascade behavior at runtime', () => {
    // Initially, checkbox cascade should be enabled
    expect(table.internalProps.enableCheckboxCascade).toBe(true);

    // Get initial checkbox state
    const initialCheckboxState = table.stateManager.headerCheckedState;

    // Update option to disable checkbox cascade
    table.updateOption({
      ...option,
      enableCheckboxCascade: false,
      enableHeaderCheckboxCascade: false
    });

    // Verify checkbox cascade is disabled in internal props
    expect(table.internalProps.enableCheckboxCascade).toBe(false);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(false);

    // Update option to enable checkbox cascade again
    table.updateOption({
      ...option,
      enableCheckboxCascade: true,
      enableHeaderCheckboxCascade: true
    });

    // Verify checkbox cascade is enabled again
    expect(table.internalProps.enableCheckboxCascade).toBe(true);
    expect(table.internalProps.enableHeaderCheckboxCascade).toBe(true);
  });

  test('should handle mixed updates with other options', () => {
    // Test with theme update
    table.updateOption({
      ...option,
      enableCheckboxCascade: false,
      theme: {
        underlayBackgroundColor: '#f0f0f0',
        headerStyle: {
          bgColor: '#e0e0e0'
        }
      }
    });

    expect(table.internalProps.enableCheckboxCascade).toBe(false);
    expect(table.theme.underlayBackgroundColor).toBe('#f0f0f0');

    // Test with width mode update
    table.updateOption({
      ...option,
      enableCheckboxCascade: true,
      widthMode: 'adaptive'
    });

    expect(table.internalProps.enableCheckboxCascade).toBe(true);
    expect(table.options.widthMode).toBe('adaptive');
  });
});
