// @ts-nocheck
import { ListTable } from '../src';
import { createDiv, removeDom } from './dom';

global.__VERSION__ = 'none';

describe('fill handle hit area', () => {
  let container: HTMLElement;
  let table: ListTable;

  beforeEach(() => {
    container = createDiv();
    container.style.width = '400px';
    container.style.height = '300px';
    table = new ListTable(container, {
      columns: [
        { field: 'name', title: 'Name', width: 120 },
        { field: 'value', title: 'Value', width: 120 }
      ],
      records: [
        { name: 'A', value: 1 },
        { name: 'B', value: 2 }
      ],
      excelOptions: {
        fillHandle: true
      }
    });
    table.selectCell(0, 1);
  });

  afterEach(() => {
    table.release();
    removeDom(container);
  });

  function checkHit(offset: number) {
    const bounds = table.scenegraph.highPerformanceGetCell(0, 1).globalAABBBounds;
    return table.eventManager.checkCellFillhandle({
      abstractPos: {
        x: bounds.x2 + offset,
        y: bounds.y2 + offset
      },
      eventArgs: {}
    });
  }

  test('uses a 24px hit target without enlarging the visual handle', () => {
    expect(checkHit(11)).toBe(true);
    expect(checkHit(13)).toBe(false);

    const selectComponent = Array.from(table.scenegraph.selectedRangeComponents.values())[0];
    expect(selectComponent.fillhandle.attribute.width).toBe(6);
    expect(selectComponent.fillhandle.attribute.height).toBe(6);
  });
});
