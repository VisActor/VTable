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

  test('listTable bottom left corner should be hidden without frozen columns', () => {
    const optionWithOnlyBottomFrozenRows = {
      ...option,
      frozenColCount: 0,
      rightFrozenColCount: 0,
      bottomFrozenRowCount: 2,
      container: createDiv(),
      records: records.slice(0, 10)
    };
    optionWithOnlyBottomFrozenRows.container.style.position = 'relative';
    optionWithOnlyBottomFrozenRows.container.style.width = '1000px';
    optionWithOnlyBottomFrozenRows.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithOnlyBottomFrozenRows);

    expect(frozenTable.scenegraph.leftBottomCornerGroup.attribute.visible).toBe(false);
    expect(frozenTable.scenegraph.leftBottomCornerGroup.attribute.width).toBe(0);
    expect(frozenTable.scenegraph.rightBottomCornerGroup.attribute.visible).toBe(false);

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

  test('listTable right frozen header should stay on the right side without records', () => {
    const optionWithRightFrozenHeader = {
      ...option,
      frozenColCount: 2,
      rightFrozenColCount: 2,
      bottomFrozenRowCount: 0,
      container: createDiv(),
      records: []
    };
    optionWithRightFrozenHeader.container.style.position = 'relative';
    optionWithRightFrozenHeader.container.style.width = '1000px';
    optionWithRightFrozenHeader.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithRightFrozenHeader);
    const { scenegraph } = frozenTable;
    const rightFrozenColsWidth = frozenTable.getRightFrozenColsWidth();

    expect(scenegraph.rightTopCornerGroup.attribute.visible).toBe(true);
    expect(scenegraph.rightFrozenGroup.attribute.x).toBe(scenegraph.tableGroup.attribute.width - rightFrozenColsWidth);
    expect(scenegraph.rightTopCornerGroup.attribute.x).toBe(scenegraph.rightFrozenGroup.attribute.x);

    frozenTable.release();
  });

  test('listTable bottom corner rows should stay below header when body is empty', () => {
    const twoColumns = columns.slice(0, 2).map(column => ({
      ...column,
      width: 150
    }));
    const optionWithOnlyCornerRows = {
      ...option,
      columns: twoColumns,
      frozenColCount: 1,
      rightFrozenColCount: 1,
      bottomFrozenRowCount: 1,
      container: createDiv(),
      records: records.slice(0, 1)
    };
    optionWithOnlyCornerRows.container.style.position = 'relative';
    optionWithOnlyCornerRows.container.style.width = '1000px';
    optionWithOnlyCornerRows.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithOnlyCornerRows);
    const { scenegraph } = frozenTable;
    const headerBottom = Math.max(
      scenegraph.cornerHeaderGroup.attribute.y + scenegraph.cornerHeaderGroup.attribute.height,
      scenegraph.rightTopCornerGroup.attribute.y + scenegraph.rightTopCornerGroup.attribute.height
    );

    expect(scenegraph.bodyGroup.attribute.height).toBe(0);
    expect(scenegraph.leftBottomCornerGroup.attribute.y).toBe(headerBottom);
    expect(scenegraph.rightBottomCornerGroup.attribute.y).toBe(headerBottom);

    frozenTable.release();
  });

  test('listTable bottom corner rows should stay below right frozen body when only right frozen column exists', () => {
    const optionWithOnlyRightFrozenColumn = {
      ...option,
      columns: columns.slice(0, 1),
      frozenColCount: 0,
      rightFrozenColCount: 1,
      bottomFrozenRowCount: 3,
      container: createDiv(),
      records: records.slice(0, 4)
    };
    optionWithOnlyRightFrozenColumn.container.style.position = 'relative';
    optionWithOnlyRightFrozenColumn.container.style.width = '1000px';
    optionWithOnlyRightFrozenColumn.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithOnlyRightFrozenColumn);
    const { scenegraph } = frozenTable;
    const rightFrozenBottom = scenegraph.rightFrozenGroup.attribute.y + scenegraph.rightFrozenGroup.attribute.height;

    expect(scenegraph.bodyGroup.attribute.height).toBe(0);
    expect(scenegraph.rightFrozenGroup.attribute.height).toBeGreaterThan(0);
    expect(scenegraph.rightBottomCornerGroup.attribute.y).toBe(rightFrozenBottom);

    frozenTable.release();
  });

  test('listTable frame border should match short content with frozen rows', () => {
    const optionWithShortFrozenRows = {
      ...option,
      columns: columns.slice(0, 5).map(column => ({
        ...column,
        width: 180
      })),
      frozenColCount: 0,
      rightFrozenColCount: 0,
      frozenRowCount: 3,
      bottomFrozenRowCount: 1,
      container: createDiv(),
      records: records.slice(0, 6),
      widthMode: 'standard',
      theme: {
        frameStyle: {
          borderLineWidth: [1, 1, 1, 1],
          borderColor: 'red'
        }
      }
    };
    optionWithShortFrozenRows.container.style.position = 'relative';
    optionWithShortFrozenRows.container.style.width = '900px';
    optionWithShortFrozenRows.container.style.height = '500px';

    const frozenTable = new ListTable(optionWithShortFrozenRows);
    const { scenegraph } = frozenTable;
    const contentBottom = scenegraph.bottomFrozenGroup.attribute.y + scenegraph.bottomFrozenGroup.attribute.height;

    expect(scenegraph.tableGroup.attribute.height).toBe(contentBottom);
    expect(scenegraph.tableGroup.border.attribute.height).toBe(contentBottom + 1);

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
    expect(rightFrozenTable.scenegraph.rightBottomCornerGroup.attribute.width).toBe(0);
  });

  test('listTable bottom corner groups should be reset after clearing bottom frozen rows', () => {
    const optionWithBottomFrozenRows = {
      ...option,
      frozenColCount: 2,
      rightFrozenColCount: 2,
      bottomFrozenRowCount: 2,
      container: createDiv(),
      records: records.slice(0, 10)
    };
    optionWithBottomFrozenRows.container.style.position = 'relative';
    optionWithBottomFrozenRows.container.style.width = '1000px';
    optionWithBottomFrozenRows.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithBottomFrozenRows);

    expect(frozenTable.scenegraph.leftBottomCornerGroup.attribute.visible).toBe(true);
    expect(frozenTable.scenegraph.rightBottomCornerGroup.attribute.visible).toBe(true);

    frozenTable.bottomFrozenRowCount = 0;

    expect(frozenTable.scenegraph.leftBottomCornerGroup.attribute.visible).toBe(false);
    expect(frozenTable.scenegraph.leftBottomCornerGroup.attribute.height).toBe(0);
    expect(frozenTable.scenegraph.rightBottomCornerGroup.attribute.visible).toBe(false);
    expect(frozenTable.scenegraph.rightBottomCornerGroup.attribute.width).toBe(0);
    expect(frozenTable.scenegraph.rightBottomCornerGroup.attribute.height).toBe(0);

    frozenTable.release();
  });

  test('listTable right top corner group should be reset after clearing frozen rows', () => {
    const optionWithRightFrozenRows = {
      ...option,
      frozenRowCount: 5,
      bottomFrozenRowCount: 0,
      rightFrozenColCount: 2,
      container: createDiv(),
      records
    };
    optionWithRightFrozenRows.container.style.position = 'relative';
    optionWithRightFrozenRows.container.style.width = '1000px';
    optionWithRightFrozenRows.container.style.height = '800px';

    const frozenTable = new ListTable(optionWithRightFrozenRows);

    expect(frozenTable.scenegraph.rightTopCornerGroup.attribute.visible).toBe(true);

    frozenTable.frozenRowCount = 0;

    expect(frozenTable.scenegraph.rightTopCornerGroup.attribute.visible).toBe(false);
    expect(frozenTable.scenegraph.rightTopCornerGroup.attribute.width).toBe(0);
    expect(frozenTable.scenegraph.rightTopCornerGroup.attribute.height).toBe(0);

    frozenTable.release();
  });
});
