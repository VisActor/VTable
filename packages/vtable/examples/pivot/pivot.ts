import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot2_data.json')
    .then(res => res.json())
    .then(data => {
      const option = {
        rows: ['province', 'city'],
        columns: ['category', 'sub_category'],
        indicators: ['sales', 'number'],
        enableDataAnalysis: true,
        indicatorTitle: '指标名称',
        indicatorsAsCol: true,
        dataConfig: {
          sortRules: [
            {
              sortField: 'province',
              sortByIndicator: 'sales',
              sortType: VTable.TYPES.SortType.DESC,
              query: ['家具', '沙发']
            }
          ],
          totals: {
            row: {
              subTotalsDimensions: ['province']
              // grandTotalLabel: '行总计'
              // subTotalLabel: '小计'
            }
          }
        },
        corner: { titleOnDimension: 'row' },
        records: [
          {
            sales: 1295,
            number: 4343,
            province: '浙江省',
            city: '杭州市',
            category: '家具',
            sub_category: '沙发'
          },
          {
            sales: 995,
            number: 5343,
            province: '浙江省',
            city: '南京市',
            category: '家具',
            sub_category: '沙发'
          },
          {
            sales: 2295,
            number: 5343,
            province: '浙江省',
            city: '杭州市',
            category: '家具',
            sub_category: '沙发2'
          },
          {
            sales: 1995,
            number: 6343,
            province: '浙江省',
            city: '南京市',
            category: '家具',
            sub_category: '沙发2'
          },
          {
            sales: 1045,
            number: 3343,
            province: '浙江省',
            city: '宁波市',
            category: '家具',
            sub_category: '沙发'
          },
          {
            sales: 792,
            number: 1432,
            province: '江苏省',
            city: '苏州市',
            category: '家具',
            sub_category: '沙发'
          },

          {
            sales: 800,
            number: 2445,
            province: '四川省',
            city: '乐山市',
            category: '家具',
            sub_category: '沙发'
          }
        ],
        widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
      };

      const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = tableInstance;
      tableInstance.updateSortRules([
        {
          sortField: 'province',
          sortByIndicator: 'sales',
          sortType: VTable.TYPES.SortType.ASC,
          query: ['家具', '沙发']
        },
        {
          sortField: 'sub_category',
          sortByIndicator: 'sales',
          sortType: VTable.TYPES.SortType.DESC,
          query: ['浙江省', '杭州市']
        }
      ]);
      // tableInstance.setRecords(data);
      tableInstance.on('mouseenter_cell', args => {
        const { col, row } = args;
        const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
        tableInstance.showTooltip(col, row, {
          content: '你好！',
          position: {
            x: rect.left,
            y: rect.bottom
          },
          referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
          className: 'defineTooltip',
          style: {
            bgColor: 'black',
            color: 'white',
            fontSize: 14,
            fontFamily: 'STKaiti',
            arrowMark: true
          }
        });
      });
      tableInstance.on('change_cell_value', arg => {
        console.log(arg);
      });
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
