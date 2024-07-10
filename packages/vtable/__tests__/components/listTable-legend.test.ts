// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/North_American_Superstore_data.json';
import * as VTable from '../../src/index';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-legend init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const categorys = ['Office Supplies', 'Technology', 'Furniture'];
  const colorToCategory = ['rgba(255, 127, 14,1)', 'rgba(227, 119, 194, 1)', 'rgba(44, 160, 44, 1)'];
  const colorToCategoryUnactive = ['rgba(255, 127, 14, .2)', 'rgba(227, 119, 194, .2)', 'rgba(44, 160, 44, .2)'];

  const columns = [
    {
      field: 'Order ID',
      title: 'Order ID',
      width: 'auto'
    },
    {
      field: 'Customer ID',
      title: 'Customer ID',
      width: 'auto'
    },
    {
      field: 'Product Name',
      title: 'Product Name',
      width: '200'
    },
    {
      field: 'Category',
      title: 'Category',
      width: 'auto',
      style: {
        // bgColor(args) {
        //   const index = categorys.indexOf(args.value);
        //   return colorToCategory[index];
        // }
      }
    },
    {
      field: 'Sub-Category',
      title: 'Sub-Category',
      width: 'auto'
    },
    {
      field: 'Region',
      title: 'Region',
      width: 'auto'
    },
    {
      field: 'City',
      title: 'City',
      width: 'auto'
    },
    {
      field: 'Order Date',
      title: 'Order Date',
      width: 'auto'
    },
    {
      field: 'Quantity',
      title: 'Quantity',
      width: 'auto'
    },
    {
      field: 'Sales',
      title: 'Sales',
      width: 'auto'
    },
    {
      field: 'Profit',
      title: 'Profit',
      width: 'auto'
    }
  ];

  const option = {
    records,
    columns,
    widthMode: 'standard',
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    theme: VTable.themes.DEFAULT.extends({
      bodyStyle: {
        bgColor(args) {
          const { row, col } = args;
          const record = args.table.getRecordByCell(col, row);
          return colorToCategory[categorys.indexOf(record.Category)];
        }
      }
    }),
    legends: {
      data: [
        {
          label: 'Office Supplies',
          shape: {
            fill: '#ff7f0e',
            symbolType: 'circle'
          }
        },
        {
          label: 'Technology',
          shape: {
            fill: '#e377c2',
            symbolType: 'square'
          }
        },
        {
          label: 'Furniture',
          shape: {
            fill: '#2ca02c',
            symbolType: 'circle'
          }
        }
      ],
      orient: 'top',
      position: 'start',
      maxRow: 1,
      padding: 10
    }
  };
  const listTable = new VTable.ListTable(containerDom, option);

  test('listTable-legend getCellStyle', () => {
    expect(listTable.getCellStyle(0, 2).bgColor).toBe('rgba(255, 127, 14,1)');
  });
  test('listTable-legend updateTheme', () => {
    const hightArr = ['Technology', 'Furniture'];
    listTable.updateTheme(
      VTable.themes.DEFAULT.extends({
        bodyStyle: {
          color(args) {
            const { row, col } = args;
            const record = listTable.getRecordByCell(col, row);
            if (hightArr.indexOf(record.Category) >= 0) {
              return 'black';
            }
            return '#e5dada';
          },
          bgColor(args) {
            const { row, col } = args;
            const record = listTable.getRecordByCell(col, row);
            if (hightArr.indexOf(record.Category) >= 0) {
              return colorToCategory[categorys.indexOf(record.Category)];
            }
            return colorToCategoryUnactive[categorys.indexOf(record.Category)];
          }
        }
      })
    );
    expect(listTable.getCellStyle(0, 2).bgColor).toBe('rgba(255, 127, 14, .2)');
    listTable.release();
  });
});
