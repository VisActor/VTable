// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('listTable scrollToRow api', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  test.each(['row', 'col'])('keeps fractional %s target when scrolling with animation', axis => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '400px';
    container.style.height = '240px';

    const table = new ListTable({
      container,
      columns: Array.from({ length: 8 }, (_, index) => ({ field: `name${index}`, title: 'Name', width: 120 })),
      records: Array.from({ length: 20 }, (_, index) => ({ name: `row-${index}` })),
      defaultRowHeight: 40
    });

    const scrollTo = jest.spyOn(table.animationManager, 'scrollTo').mockImplementation(() => undefined);
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout').mockImplementation(() => 0 as any);

    if (axis === 'row') {
      table.scrollToRow(1.5, { duration: 100, easing: 'linear' });
    } else {
      table.scrollToCol(1.5, { duration: 100, easing: 'linear' });
    }

    expect(scrollTo).toHaveBeenCalledWith({ [axis]: 1.5 }, { duration: 100, easing: 'linear' });
    expect(setTimeoutSpy).not.toHaveBeenCalled();

    table.release();
  });

  test('renders once after animated column correction', () => {
    const table = Object.create(Object.getPrototypeOf(ListTable.prototype));
    table._scrollToColCorrectTimer = null;
    table.isReleased = false;
    table.clearColCorrectTimer = jest.fn();
    table.animationManager = { scrollTo: jest.fn() };
    const callbacks = [];
    jest.spyOn(globalThis, 'setTimeout').mockImplementation(callback => {
      callbacks.push(callback);
      return callbacks.length as any;
    });
    const render = jest.fn();
    const scrollToCell = jest.fn(() => render());
    table.render = render;
    table.scrollToCell = scrollToCell;

    table.scrollToCol(2, { duration: 100 });
    callbacks[0]();

    expect(scrollToCell).toHaveBeenCalledWith({ col: 2 });
    expect(render).toHaveBeenCalledTimes(1);
  });

  test('cancels column correction on replacement and release, and ignores a late callback', () => {
    const container = createDiv();
    container.style.width = '400px';
    container.style.height = '240px';
    const table = new ListTable({
      container,
      columns: Array.from({ length: 8 }, (_, index) => ({ field: `name${index}`, title: 'Name', width: 120 })),
      records: [{ name0: 'first' }]
    });
    jest.spyOn(table.animationManager, 'scrollTo').mockImplementation(() => undefined);
    const callbacks = [];
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout').mockImplementation(callback => {
      callbacks.push(callback);
      return callbacks.length as any;
    });
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');

    table.scrollToCol(2, { duration: 100 });
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    const firstHandle = table._scrollToColCorrectTimer;
    table.scrollToCol(3, { duration: 100 });
    expect(clearTimeoutSpy).toHaveBeenCalledWith(firstHandle);
    const releaseHandle = table._scrollToColCorrectTimer;
    table.release();
    expect(clearTimeoutSpy).toHaveBeenCalledWith(releaseHandle);
    expect(table._scrollToColCorrectTimer).toBeNull();

    const scrollToCell = jest.spyOn(table, 'scrollToCell');
    const render = jest.spyOn(table, 'render');
    callbacks[1]();
    expect(scrollToCell).not.toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });
});
