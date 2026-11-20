import { ListTable, PivotTable, themes } from '../src';
import type { ListTableConstructorOptions } from '../src';
import { createDiv, removeDom } from './dom';

describe('frozen column shadow visibility', () => {
  const tables: (ListTable | PivotTable)[] = [];
  const containers: HTMLElement[] = [];
  const columns = Array.from({ length: 8 }, (_, i) => ({ field: `c${i}`, title: `Column ${i}`, width: 100 }));
  const records = Array.from({ length: 6 }, (_, i) => Object.fromEntries(columns.map(col => [col.field, i])));
  const overflow = themes.DEFAULT.extends({
    frozenColumnLine: {
      shadow: { width: 8, startColor: 'rgba(0,0,0,0.12)', endColor: 'transparent', visible: 'overflow' }
    }
  });

  function container() {
    const div = createDiv();
    div.style.width = '500px';
    div.style.height = '300px';
    containers.push(div);
    return div;
  }

  function createTable(options: Partial<ListTableConstructorOptions> = {}) {
    const table = new ListTable(container(), { columns, records, theme: overflow, ...options });
    tables.push(table);
    return table;
  }

  function expectShadows(table: ListTable | PivotTable, left: boolean, right: boolean) {
    const component = table.scenegraph.component;
    expect(component.frozenShadowLine.attribute.visible).toBe(left);
    expect(component.rightFrozenShadowLine.attribute.visible).toBe(right);
  }

  afterEach(() => {
    tables.forEach(table => table.release());
    tables.length = 0;
    containers.forEach(removeDom);
    containers.length = 0;
  });

  test('never shows shadows without frozen columns, including scrollbar show and hide', () => {
    const table = createTable();
    expectShadows(table, false, false);
    table.setScrollLeft(100);
    table.stateManager.showHorizontalScrollBar(false);
    expectShadows(table, false, false);
    table.scenegraph.component.hideFrozenColumnShadow();
    expectShadows(table, false, false);
  });

  test('updates both boundaries immediately for programmatic and scrollbar scrolling', () => {
    const table = createTable({ frozenColCount: 1, rightFrozenColCount: 1 });
    expectShadows(table, false, true);
    expect(table.scenegraph.component.rightFrozenShadowLine.attribute.height).toBeGreaterThan(0);
    table.setScrollLeft(100);
    expectShadows(table, true, true);
    // Hiding the scrolling UI must not hide a shadow while content is still covered.
    table.scenegraph.component.hideFrozenColumnShadow();
    expectShadows(table, true, true);
    table.stateManager.updateHorizontalScrollBar(1);
    expectShadows(table, true, false);
    table.stateManager.updateHorizontalScrollBar(0);
    expectShadows(table, false, true);
    table.setScrollLeft(100);
    table.setScrollLeft(0);
    expectShadows(table, false, true);
  });

  test.each([{ frozenColCount: 1 }, { rightFrozenColCount: 1 }, { frozenColCount: 1, rightFrozenColCount: 1 }])(
    'hides shadows when all body columns fit: %o',
    options => {
      const table = createTable({ ...options, columns: columns.slice(0, 3) });
      table.setScrollLeft(100);
      table.stateManager.showHorizontalScrollBar(false);
      expectShadows(table, false, false);
    }
  );

  test('recalculates visibility when frozen columns, viewport or theme change', async () => {
    const table = createTable();
    table.setScrollLeft(100);
    table.setFrozenColCount(1);
    expectShadows(table, true, false);
    table.setFrozenColCount(0);
    expectShadows(table, false, false);
    await table.updateOption({ columns, records, frozenColCount: 1, rightFrozenColCount: 1, theme: overflow });
    table.setScrollLeft(100);
    expectShadows(table, true, true);
    containers[0].style.width = '1000px';
    table.resize();
    expectShadows(table, false, false);
    containers[0].style.width = '500px';
    table.resize();
    expectShadows(table, false, true);
    table.updateTheme(themes.DEFAULT);
    expectShadows(table, true, true);
    table.updateTheme(overflow);
    expectShadows(table, false, true);
    await table.updateOption({ columns, records, theme: overflow });
    expectShadows(table, false, false);
  });

  test('does not change visibility when scrolling is cancelled', () => {
    const table = createTable({ frozenColCount: 1, rightFrozenColCount: 1 });
    table.on('can_scroll', () => false);
    table.setScrollLeft(100);
    table.stateManager.updateHorizontalScrollBar(1);
    expect(table.scrollLeft).toBe(0);
    expectShadows(table, false, true);
  });

  test('hides the right shadow at the fractional-width scroll limit', () => {
    const table = createTable({
      columns: columns.map(column => ({ ...column, width: 100.25 })),
      frozenColCount: 1,
      rightFrozenColCount: 1,
      customConfig: { _disableColumnAndRowSizeRound: true }
    });
    expectShadows(table, false, true);
    table.setScrollLeft(10000);
    expectShadows(table, true, false);
    table.setScrollLeft(0);
    expectShadows(table, false, true);
  });

  test('keeps the existing always and scrolling modes', () => {
    const table = createTable({ frozenColCount: 1, theme: themes.DEFAULT });
    expectShadows(table, true, false);
    table.setScrollLeft(100);
    table.setScrollLeft(0);
    expectShadows(table, true, false);
    table.updateTheme(
      themes.DEFAULT.extends({
        frozenColumnLine: {
          shadow: {
            width: 8,
            startColor: '#000',
            endColor: 'transparent',
            visible: 'scrolling'
          }
        }
      })
    );
    expectShadows(table, false, false);
    table.scenegraph.component.showFrozenColumnShadow();
    expectShadows(table, true, true);
    table.scenegraph.component.hideFrozenColumnShadow();
    expectShadows(table, false, false);
  });

  test('uses the body scroll range with independently scrollable frozen columns', () => {
    const table = createTable({
      frozenColCount: 4,
      maxFrozenWidth: 100,
      scrollFrozenCols: true,
      unfreezeAllOnExceedsMaxWidth: false
    });
    expect(table.getFrozenColsContentWidth()).toBeGreaterThan(table.getFrozenColsWidth());
    table.setScrollLeft(1000);
    expect(table.scrollLeft).toBeGreaterThan(0);
    expectShadows(table, true, false);
    table.setScrollLeft(0);
    table.stateManager.setFrozenColsScrollLeft(100);
    expectShadows(table, false, false);
  });

  test('positions both shadows for pivot tables with frozen columns on both sides', () => {
    const table = new PivotTable(container(), {
      rows: ['region'],
      columns: ['year'],
      indicators: ['sales'],
      records: Array.from({ length: 8 }, (_, i) => ({ region: 'A', year: `${2020 + i}`, sales: i })),
      defaultColWidth: 100,
      frozenColCount: 1,
      rightFrozenColCount: 1,
      theme: overflow
    });
    tables.push(table);
    expectShadows(table, false, true);
    expect(table.scenegraph.component.rightFrozenShadowLine.attribute.height).toBeGreaterThan(0);
    table.setScrollLeft(100);
    expectShadows(table, true, true);
    table.setScrollLeft(10000);
    expectShadows(table, true, false);
  });
});
