// @ts-nocheck
import { ListTable } from '../../src';

global.__VERSION__ = 'none';

describe('ListTable null container', () => {
  test('throws a clear error when the container argument is null', () => {
    expect(() => new ListTable(null, { columns: [] })).toThrow("vtable's container is undefined");
  });
});
