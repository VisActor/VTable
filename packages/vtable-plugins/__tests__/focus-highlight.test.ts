import * as VTable from '@visactor/vtable';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';
import type { CellRange, CellAddress } from '@visactor/vtable/es/ts-types';
import { FocusHighlightPlugin } from '../src/focus-highlight';

describe('FocusHighlightPlugin', () => {
  it('should instantiate with default options', () => {
    const plugin = new FocusHighlightPlugin();
    expect(plugin.name).toBe('Focus Highlight');
    expect(plugin.pluginOptions.fill).toBe('#000');
    expect(plugin.pluginOptions.opacity).toBe(0.5);
    expect(plugin.pluginOptions.highlightRange).toBeUndefined();
  });

  it('should merge custom options', () => {
    const plugin = new FocusHighlightPlugin({ fill: '#f00', opacity: 0.8, highlightRange: { col: 1, row: 2 } });
    expect(plugin.pluginOptions.fill).toBe('#f00');
    expect(plugin.pluginOptions.opacity).toBe(0.8);
    expect(plugin.pluginOptions.highlightRange).toEqual({ col: 1, row: 2 });
  });

  it('should set table and call setFocusHighlightRange on INITIALIZED if highlightRange provided', () => {
    const initialRange = { col: 2, row: 3 };
    const plugin = new FocusHighlightPlugin({ highlightRange: initialRange });
    const mockTable = { stateManager: { select: {} }, scenegraph: { updateNextFrame: jest.fn() } } as any;
    const setFocusHighlightRangeSpy = jest.spyOn(plugin, 'setFocusHighlightRange').mockImplementation(jest.fn());
    plugin.run(null, VTable.TABLE_EVENT_TYPE.INITIALIZED, mockTable);
    expect(plugin.table).toBe(mockTable);
    expect(setFocusHighlightRangeSpy).toHaveBeenCalledWith(initialRange);
  });

  it('should not call setFocusHighlightRange on INITIALIZED if no highlightRange', () => {
    const plugin = new FocusHighlightPlugin();
    const mockTable = { stateManager: { select: {} }, scenegraph: { updateNextFrame: jest.fn() } } as any;
    const setFocusHighlightRangeSpy = jest.spyOn(plugin, 'setFocusHighlightRange').mockImplementation(jest.fn());
    plugin.run(null, VTable.TABLE_EVENT_TYPE.INITIALIZED, mockTable);
    expect(setFocusHighlightRangeSpy).not.toHaveBeenCalled();
  });

  it('should call setFocusHighlightRange(undefined) on SELECTED_CLEAR', () => {
    const plugin = new FocusHighlightPlugin();
    plugin.table = { stateManager: { select: {} }, scenegraph: { updateNextFrame: jest.fn() } } as any;
    const setFocusHighlightRangeSpy = jest.spyOn(plugin, 'setFocusHighlightRange').mockImplementation(jest.fn());
    plugin.run(null, VTable.TABLE_EVENT_TYPE.SELECTED_CLEAR);
    expect(setFocusHighlightRangeSpy).toHaveBeenCalledWith(undefined);
  });

  it('should call setFocusHighlightRange(undefined) on SELECTED_CELL if header is selected', () => {
    const plugin = new FocusHighlightPlugin();
    const mockTable = {
      isHeader: jest.fn().mockReturnValue(true),
      stateManager: { select: { cellPos: { col: 0, row: 0 } } },
      scenegraph: { updateNextFrame: jest.fn() }
    } as any;
    plugin.table = mockTable;
    const setFocusHighlightRangeSpy = jest.spyOn(plugin, 'setFocusHighlightRange').mockImplementation(jest.fn());
    plugin.run(null, VTable.TABLE_EVENT_TYPE.SELECTED_CELL);
    expect(mockTable.isHeader).toHaveBeenCalledWith(0, 0);
    expect(setFocusHighlightRangeSpy).toHaveBeenCalledWith(undefined);
  });

  it('should call setFocusHighlightRange with row range on SELECTED_CELL if body cell is selected', () => {
    const plugin = new FocusHighlightPlugin();
    const mockTable = {
      isHeader: jest.fn().mockReturnValue(false),
      colCount: 10,
      stateManager: { select: { cellPos: { col: 2, row: 5 }, ranges: [{ start: { col: 2, row: 5 }, end: { col: 2, row: 7 } }] } },
      scenegraph: { updateNextFrame: jest.fn() }
    } as any;
    plugin.table = mockTable;
    const setFocusHighlightRangeSpy = jest.spyOn(plugin, 'setFocusHighlightRange').mockImplementation(jest.fn());
    plugin.run(null, VTable.TABLE_EVENT_TYPE.SELECTED_CELL);
    expect(mockTable.isHeader).toHaveBeenCalledWith(2, 5);
    expect(setFocusHighlightRangeSpy).toHaveBeenCalledWith({
      start: { col: 0, row: 5 },
      end: { col: 9, row: 7 }
    });
  });

  describe('setFocusHighlightRange', () => {
    let plugin: FocusHighlightPlugin;
    let updateCellGroupShadowSpy: jest.SpyInstance;
    let deleteAllCellGroupShadowSpy: jest.SpyInstance;
    let updateNextFrameSpy: jest.Mock;
    beforeEach(() => {
      plugin = new FocusHighlightPlugin();
      plugin.table = {
        scenegraph: { updateNextFrame: jest.fn() },
        isPivotTable: jest.fn().mockReturnValue(false)
      } as any;
      updateCellGroupShadowSpy = jest.spyOn(plugin, 'updateCellGroupShadow').mockImplementation(jest.fn());
      deleteAllCellGroupShadowSpy = jest.spyOn(plugin, 'deleteAllCellGroupShadow').mockImplementation(jest.fn());
      updateNextFrameSpy = plugin.table.scenegraph.updateNextFrame as jest.Mock;
    });
    
  it('should call setFocusHighlightRange with forceUpdate in update()', () => {
    const plugin = new FocusHighlightPlugin();
    const spy = jest.spyOn(plugin, 'setFocusHighlightRange').mockImplementation(jest.fn());
    const range = { start: { col: 1, row: 1 }, end: { col: 2, row: 2 } };
    plugin.range = range;
    plugin.update();
    expect(spy).toHaveBeenCalledWith(range, true);
  });
});