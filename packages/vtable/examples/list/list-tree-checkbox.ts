/* eslint-disable max-len */
import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];

export function createTable() {
  let tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          field: 'Order ID',
          title: 'Order ID',
          width: 'auto',
          sort: true
        },
        {
          field: 'Customer ID',
          title: 'Customer ID',
          width: 'auto'
          // cellType: 'checkbox'
        },
        {
          field: 'Product Name',
          title: 'Product Name',
          width: 'auto'
        },
        {
          field: 'Category',
          title: 'Category',
          width: 'auto'
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

      const option: VTable.ListTableConstructorOptions = {
        records: data.slice(0, 100),
        columns,
        widthMode: 'standard',
        groupBy: ['Category', 'Sub-Category', 'Region'],

        // theme: VTable.themes.DEFAULT.extends({
        //   groupTitleStyle: {
        //     fontWeight: 'bold',
        //     // bgColor: '#3370ff'
        //     bgColor: args => {
        //       const { col, row, table } = args;
        //       const index = table.getGroupTitleLevel(col, row);
        //       if (col > 0 && index !== undefined) {
        //         return titleColorPool[index % titleColorPool.length];
        //       }
        //     }
        //   }
        // }),
        enableTreeStickCell: true,
        rowSeriesNumber: {
          // dragOrder: true,
          // title: '序号',
          width: 'auto',
          headerStyle: {
            color: 'black',
            bgColor: 'pink'
          },
          format: () => {
            return '';
          },
          style: {
            color: 'red'
          },
          cellType: 'checkbox',
          enableTreeCheckbox: true
        }
      };
      tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
    })
    .catch(e => {
      console.error(e);
    });
}
