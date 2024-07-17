import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

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

      const option = {
        records: data.slice(0, 100),
        columns,
        widthMode: 'standard',
        groupBy: ['Category', 'Sub-Category'],
        // hierarchyExpandLevel: Infinity,
        theme: VTable.themes.DEFAULT.extends({
          groupTitleStyle: {
            fontWeight: 'bold',
            // bgColor: '#3370ff'
            bgColor: args => {
              const { col, row, table } = args;
              const index = table.getGroupTitleLevel(col, row);
              if (index !== undefined) {
                return titleColorPool[index % titleColorPool.length];
              }
            }
          }
        })
      };
      tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

      let index = 100;
      let updateing = false;
      const addRecords = () => {
        tableInstance.addRecords(data.slice(index, index + 100));
        index += 100;
      };
      const showLoading = () => {
        const container = document.createElement('div');
        container.id = 'loading';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.background = 'rgba(0, 0, 0, 0.5)';
        container.innerHTML = 'loading...';
        container.style.fontSize = '40px';
        container.style.color = 'white';
        container.style.fontWeight = 'bold';
        container.style.textAlign = 'center';
        container.style.lineHeight = '100vh';
        document.body.appendChild(container);
      };
      const hideLoading = () => {
        const container = document.getElementById('loading');
        if (container) {
          document.body.removeChild(container);
        }
      };

      tableInstance.on('scroll_vertical_end', () => {
        if (updateing) {
          return;
        }
        updateing = true;
        showLoading();
        setTimeout(() => {
          addRecords();
          hideLoading();
          updateing = false;
        }, 1000);
      });
    })
    .catch(e => {
      console.error(e);
    });
}
