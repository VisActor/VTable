// @ts-nocheck

global.__VERSION__ = 'none';

import { TABLE_EVENT_TYPE, VTable } from '../src';

describe('gantt list table event type export', () => {
  test('exports ListTable event types from package entry', () => {
    expect(TABLE_EVENT_TYPE).toBe(VTable.TABLE_EVENT_TYPE);
    expect(TABLE_EVENT_TYPE.CLICK_CELL).toBe('click_cell');
  });
});
