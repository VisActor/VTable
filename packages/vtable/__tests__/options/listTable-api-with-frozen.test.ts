// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/marketsales.json';
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const columns = [
    {
      field: '订单 ID',
      caption: '订单 ID',
      sort: true,
      width: 'auto',
      description: '这是订单的描述信息',
      style: {
        fontFamily: 'Arial',
        fontSize: 14
      }
    },
    {
      field: '订单日期',
      caption: '订单日期'
    },
    {
      field: '发货日期',
      caption: '发货日期'
    },
    {
      field: '客户名称',
      caption: '客户名称',
      style: {
        padding: [10, 0, 10, 60]
      }
    },
    {
      field: '邮寄方式',
      caption: '邮寄方式'
    },
    {
      field: '省/自治区',
      caption: '省/自治区'
    },
    {
      field: '产品名称',
      caption: '产品名称'
    },
    {
      field: '类别',
      caption: '类别'
    },
    {
      field: '子类别',
      caption: '子类别'
    },
    {
      field: '销售额',
      caption: '销售额'
    },
    {
      field: '数量',
      caption: '数量'
    },
    {
      field: '折扣',
      caption: '折扣'
    },
    {
      field: '利润',
      caption: '利润'
    }
  ];
  const option = {
    columns,
    defaultColWidth: 150,
    frozenColCount: 2,
    rightFrozenColCount: 2,
    bottomFrozenRowCount: 2
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable cellIsInVisualView', () => {
    expect(listTable.cellIsInVisualView(3, 0)).toBe(true);
    expect(listTable.cellIsInVisualView(0, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(5, 3)).toBe(false);
    expect(listTable.cellIsInVisualView(4, 3)).toBe(false);
    expect(listTable.cellIsInVisualView(3, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 39)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 38)).toBe(true);

    expect(listTable.cellIsInVisualView(12, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(11, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(10, 3)).toBe(false);

    expect(listTable.cellIsInVisualView(3, 37)).toBe(false);
  });

  test('listTable scroll cellIsInVisualView', () => {
    listTable.scrollTop = 100;
    listTable.scrollLeft = 100;
    expect(listTable.cellIsInVisualView(3, 5)).toBe(true);
    expect(listTable.cellIsInVisualView(2, 5)).toBe(false);
    expect(listTable.cellIsInVisualView(5, 5)).toBe(false);
    expect(listTable.cellIsInVisualView(4, 5)).toBe(true);
    expect(listTable.cellIsInVisualView(12, 5)).toBe(true);

    expect(listTable.cellIsInVisualView(3, 19)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 20)).toBe(false);
    expect(listTable.cellIsInVisualView(2, 19)).toBe(false);

    expect(listTable.cellIsInVisualView(3, 39)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 38)).toBe(true);
  });

  test('listTable body visible row range should ignore frozen rows offset duplication', () => {
    const optionWithFrozenRows = {
      ...option,
      frozenRowCount: 5,
      rightFrozenColCount: 0,
      bottomFrozenRowCount: 0,
      container: createDiv(),
      records
    };
    optionWithFrozenRows.container.style.position = 'relative';
    optionWithFrozenRows.container.style.width = '1000px';
    optionWithFrozenRows.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithFrozenRows);
    frozenTable.scrollTop = 400;

    expect(frozenTable.getBodyVisibleRowRange()).toEqual({
      rowStart: 10,
      rowEnd: 28
    });
    expect(frozenTable.getBodyVisibleCellRange()).toMatchObject({
      rowStart: 10,
      rowEnd: 28
    });
  });

  test('listTable bottom frozen rows should stay connected after short body content', () => {
    const optionWithBottomFrozenRows = {
      ...option,
      frozenRowCount: 5,
      rightFrozenColCount: 0,
      bottomFrozenRowCount: 2,
      container: createDiv(),
      records: records.slice(0, 10)
    };
    optionWithBottomFrozenRows.container.style.position = 'relative';
    optionWithBottomFrozenRows.container.style.width = '1000px';
    optionWithBottomFrozenRows.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithBottomFrozenRows);
    const { scenegraph } = frozenTable;

    expect(scenegraph.bottomFrozenGroup.attribute.y).toBe(
      scenegraph.bodyGroup.attribute.y + scenegraph.bodyGroup.attribute.height
    );
    expect(scenegraph.rightBottomCornerGroup.attribute.visible).toBe(false);

    frozenTable.release();
  });

  test('listTable bottom right corner should stay connected after short content', () => {
    const shortColumns = columns.slice(0, 5).map(column => ({
      ...column,
      width: 100
    }));
    const optionWithBottomRightFrozen = {
      ...option,
      columns: shortColumns,
      defaultColWidth: 100,
      frozenColCount: 2,
      frozenRowCount: 5,
      rightFrozenColCount: 2,
      bottomFrozenRowCount: 2,
      containerFit: true,
      container: createDiv(),
      records: records.slice(0, 10)
    };
    optionWithBottomRightFrozen.container.style.position = 'relative';
    optionWithBottomRightFrozen.container.style.width = '1000px';
    optionWithBottomRightFrozen.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithBottomRightFrozen);
    const { scenegraph } = frozenTable;

    expect(scenegraph.rightFrozenGroup.attribute.x).toBe(
      scenegraph.bodyGroup.attribute.x + scenegraph.bodyGroup.attribute.width
    );
    expect(scenegraph.rightBottomCornerGroup.attribute.x).toBe(scenegraph.rightFrozenGroup.attribute.x);
    expect(scenegraph.rightBottomCornerGroup.attribute.y).toBe(
      scenegraph.bodyGroup.attribute.y + scenegraph.bodyGroup.attribute.height
    );

    frozenTable.release();
  });

  test('listTable should support decreasing rightFrozenColCount by setter with row series number', () => {
    const optionWithRightFrozen = {
      ...option,
      bottomFrozenRowCount: 0,
      rowSeriesNumber: {
        title: 'index',
        dragOrder: true,
        width: 'auto'
      },
      container: createDiv(),
      records
    };
    optionWithRightFrozen.container.style.position = 'relative';
    optionWithRightFrozen.container.style.width = '1000px';
    optionWithRightFrozen.container.style.height = '800px';

    const rightFrozenTable = new ListTable(optionWithRightFrozen);

    expect(() => {
      rightFrozenTable.rightFrozenColCount = 1;
    }).not.toThrow();
    expect(rightFrozenTable.rightFrozenColCount).toBe(1);
    expect(rightFrozenTable.scenegraph.rightBottomCornerGroup.attribute.visible).toBe(false);
  });
});
