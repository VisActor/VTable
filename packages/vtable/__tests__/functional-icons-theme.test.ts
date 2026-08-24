// @ts-nocheck
import * as VTable from '../src';
import { createDiv, removeDom } from './dom';

global.__VERSION__ = 'none';

describe('functional icon theme updates', () => {
  let container: HTMLElement;
  let table: VTable.ListTable;

  const columns = [{ field: 'name', title: 'Name', sort: true, tree: true }];
  const records = [{ name: 'Parent', children: [{ name: 'Child' }] }];

  const createTable = () => {
    container = createDiv();
    container.style.width = '600px';
    container.style.height = '400px';
    table = new VTable.ListTable(container, {
      columns,
      records,
      rowSeriesNumber: { dragOrder: true },
      theme: {
        functionalIconsStyle: {
          sort_color: '#111111',
          collapse_color: '#222222',
          dragReorder_color: '#333333'
        }
      }
    });
  };

  afterEach(() => {
    table?.release();
    removeDom(container);
  });

  test('refreshes functional icons after updateOption', () => {
    createTable();

    table.updateOption({
      columns,
      records,
      rowSeriesNumber: { dragOrder: true },
      theme: {
        functionalIconsStyle: {
          sort_color: '#123456',
          collapse_color: '#234567',
          dragReorder_color: '#345678'
        }
      }
    });

    expect(table.internalProps.headerHelper.normalIcon.svg).toContain('#123456');
    expect(table.internalProps.bodyHelper.collapseIcon.svg).toContain('#234567');
    expect(table.internalProps.rowSeriesNumberHelper.dragReorderIconName.svg).toContain('#345678');
  });

  test('refreshes functional icons after updateTheme', () => {
    createTable();

    table.updateTheme({
      functionalIconsStyle: {
        sort_color: '#456789',
        collapse_color: '#56789a',
        dragReorder_color: '#6789ab'
      }
    });

    expect(table.internalProps.headerHelper.normalIcon.svg).toContain('#456789');
    expect(table.internalProps.bodyHelper.collapseIcon.svg).toContain('#56789a');
    expect(table.internalProps.rowSeriesNumberHelper.dragReorderIconName.svg).toContain('#6789ab');
  });

  test('refreshes functional icons after setting theme', () => {
    createTable();

    table.theme = {
      functionalIconsStyle: {
        sort_color: '#789abc',
        collapse_color: '#89abcd',
        dragReorder_color: '#9abcde'
      }
    };

    expect(table.internalProps.headerHelper.normalIcon.svg).toContain('#789abc');
    expect(table.internalProps.bodyHelper.collapseIcon.svg).toContain('#89abcd');
    expect(table.internalProps.rowSeriesNumberHelper.dragReorderIconName.svg).toContain('#9abcde');
  });
});
