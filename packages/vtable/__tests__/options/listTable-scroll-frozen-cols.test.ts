// @ts-nocheck
import { ListTable } from '../../src';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('listTable scroll frozen columns', () => {
  test('keeps body next to frozen viewport when horizontal layout tries to shift right', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '1055px';
    containerDom.style.height = '520px';

    const columns = [
      ['orderDate', '订单日期', 91],
      ['customerName', '客户名称', 76],
      ['shipDate', '发货日期', 91],
      ['deliveryDate', '交付日期', 91],
      ['productDate', '产品日期', 91],
      ['category', '类别', 76],
      ['subCategory', '子类别', 76],
      ['region', '区域', 76],
      ['customerId', '客户编号', 110],
      ['birthDate', '出生日期', 100],
      ['renewDate', '续费日期', 100],
      ['rate', '折扣', 76],
      ['ratio', '占比', 76]
    ].map(([field, title, width]) => ({
      field,
      title,
      width
    }));
    const records = Array.from({ length: 20 }, (_, index) => ({
      orderDate: `2016-01-${index + 1}`,
      customerName: `客户${index + 1}`,
      shipDate: `2016-02-${index + 1}`,
      deliveryDate: `2017-05-${index + 1}`,
      productDate: `2016-03-${index + 1}`,
      category: '家具',
      subCategory: '桌子',
      region: '中南',
      customerId: `customer-${index + 1}`,
      birthDate: '1975-07-10',
      renewDate: '2026-02-28',
      rate: `${(index % 5) / 10}`,
      ratio: `${(index % 4) / 4}`
    }));

    const listTable = new ListTable(containerDom, {
      columns,
      records,
      frozenColCount: 4,
      maxFrozenWidth: 100,
      unfreezeAllOnExceedsMaxWidth: false,
      scrollFrozenCols: true
    });

    expect(listTable.getFrozenColsWidth()).toBe(100);
    expect(listTable.getFrozenColsContentWidth()).toBeGreaterThan(100);

    listTable.scenegraph.updateTableSize();
    expect(listTable.scenegraph.cornerHeaderGroup.attribute.width).toBe(100);
    expect(listTable.scenegraph.rowHeaderGroup.attribute.width).toBe(100);

    listTable.scenegraph.setBodyAndColHeaderX(172);
    expect(listTable.scenegraph.bodyGroup.attribute.x).toBe(100);
    expect(listTable.scenegraph.colHeaderGroup.attribute.x).toBe(100);

    listTable.scenegraph.component.updateScrollBar();
    expect(listTable.scenegraph.component.hScrollBar.attribute.visible).toBe(false);
    expect(listTable.scenegraph.component.hScrollBar.attribute.width).toBe(0);
    expect(listTable.scenegraph.component.frozenHScrollBar.attribute.width).toBe(100);
    expect(listTable.scenegraph.component.frozenHScrollBar.attribute.range[1]).toBeLessThan(1);

    listTable.scenegraph.component.showHorizontalScrollBar('all');
    expect(listTable.scenegraph.component.hScrollBar.attribute.visible).toBe(false);
    expect(listTable.scenegraph.component.frozenHScrollBar.attribute.visible).toBe(true);

    listTable.setScrollLeft(100);
    expect(listTable.scrollLeft).toBe(0);

    listTable.release();
  });
});
