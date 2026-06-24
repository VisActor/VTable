// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('listTable scrollToRow api', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  test('keeps fractional row target when scrolling with animation', () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '400px';
    container.style.height = '240px';

    const table = new ListTable({
      container,
      columns: [{ field: 'name', title: 'Name', width: 120 }],
      records: Array.from({ length: 20 }, (_, index) => ({ name: `row-${index}` })),
      defaultRowHeight: 40
    });

    const scrollTo = jest.spyOn(table.animationManager, 'scrollTo').mockImplementation(() => undefined);
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout').mockImplementation(() => 0 as any);

    table.scrollToRow(1.5, { duration: 100, easing: 'linear' });

    expect(scrollTo).toHaveBeenCalledWith({ row: 1.5 }, { duration: 100, easing: 'linear' });
    expect(setTimeoutSpy).not.toHaveBeenCalled();

    table.release();
  });
});
