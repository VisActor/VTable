import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot2_data.json')
    .then(res => res.json())
    .then(data => {
      VTable.register.icon('book', {
        type: 'svg', //指定svg格式图标，其他还支持path，image，font
        svg: `<svg t="1669210190896" class="icon" viewBox="0 0 1427 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4793" width="200" height="200"><path d="M1351.064977 123.555737h-107.862689V92.969424l-36.660345-14.396103C1199.192582 75.698424 1024.753324 7.932987 872.167608 7.932987c-71.440118 0-128.592212 14.720339-170.786193 43.880012-42.193982-29.159673-99.302844-43.880012-170.764578-43.880012-152.585716 0-327.024974 67.765437-334.374335 70.640334l-36.638729 14.396103v30.586313H54.291745A43.318002 43.318002 0 0 0 10.973743 166.873739v797.81643c0 23.928657 19.389345 43.318002 43.318002 43.318001h1296.773232a43.318002 43.318002 0 0 0 43.318002-43.318001V166.873739a43.318002 43.318002 0 0 0-43.318002-43.318002z m-165.620024 8.776003v633.169114c-89.446053-30.629545-327.003358-100.03778-455.184871-25.203987V102.566825c36.141566-26.998096 87.025087-36.898118 141.907526-36.898118 143.420629 0 313.277345 66.663033 313.277345 66.663033zM1120.035635 804.971249H739.295474c74.293399-70.467408 258.243596-36.595497 380.740161 0zM530.616837 65.668707c54.860823 0 105.765959 9.921638 141.88591 36.898118v637.730042c-128.181512-74.790562-365.695585-5.425558-455.163254 25.203987V132.33174s169.856715-66.663033 313.277344-66.663033z m132.850518 739.302542H282.662347c122.453333-36.638729 306.489993-70.575487 380.805008 0z m644.27962 116.400918H97.609746V210.170125h61.994027v652.536844H1243.202288V210.170125h64.544687v711.202042z" p-id="4794"></path></svg>`,
        width: 20,
        height: 20,
        name: 'book',
        positionType: VTable.TYPES.IconPosition.inlineEnd,
        marginLeft: 2,
        marginRight: 0,
        visibleTime: 'always',
        hover: {
          width: 22,
          height: 22,
          bgColor: 'rgba(22,44,66,0.2)'
        },
        tooltip: {
          title: '书籍',
          placement: VTable.TYPES.Placement.left
        }
      });

      const option: VTable.PivotTableConstructorOptions = {
        container: document.getElementById(CONTAINER_ID),
        records: data,
        rowTree: [
          {
            dimensionKey: 'Category',
            value: 'Furniture',
            hierarchyState: 'expand',
            children: [
              {
                dimensionKey: 'Sub-Category',
                value: 'Bookcases',
                hierarchyState: 'collapse'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Chairs',
                hierarchyState: 'collapse'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Furnishings'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Tables'
              }
            ]
          },
          {
            dimensionKey: 'Category',
            value: 'Office Supplies',
            children: [
              {
                dimensionKey: 'Sub-Category',
                value: 'Appliances'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Art'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Binders'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Envelopes'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Fasteners'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Labels'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Paper'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Storage'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Supplies'
              }
            ]
          },
          {
            dimensionKey: 'Category',
            value: 'Technology',
            children: [
              {
                dimensionKey: 'Sub-Category',
                value: 'Accessories'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Copiers'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Machines'
              },
              {
                dimensionKey: 'Sub-Category',
                value: 'Phones'
              }
            ]
          }
        ],
        columnTree: [
          {
            dimensionKey: 'Region',
            value: 'West',
            children: [
              {
                value: 'Sales',
                indicatorKey: 'Sales'
              },
              {
                value: 'Profit',
                indicatorKey: 'Profit'
              }
            ]
          },
          {
            dimensionKey: 'Region',
            value: 'South',
            children: [
              {
                value: 'Sales',
                indicatorKey: 'Sales'
              },
              {
                value: 'Profit',
                indicatorKey: 'Profit'
              }
            ]
          },
          {
            dimensionKey: 'Region',
            value: 'Central',
            children: [
              {
                value: 'Sales',
                indicatorKey: 'Sales'
              },
              {
                value: 'Profit',
                indicatorKey: 'Profit'
              }
            ]
          },
          {
            dimensionKey: 'Region',
            value: 'East',
            children: [
              {
                value: 'Sales',
                indicatorKey: 'Sales'
              },
              {
                value: 'Profit',
                indicatorKey: 'Profit'
              }
            ]
          }
        ],
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Catogery', // Changed from dimensionTitle to title
            width: 'auto'
          },
          {
            dimensionKey: 'Sub-Category',
            title: 'Sub-Catogery', // Changed from dimensionTitle to title
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Region',
            title: 'Region', // Changed from dimensionTitle to title
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        indicators: [
          {
            indicatorKey: 'Sales',
            title: 'Sales', // Changed from caption to title
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: value => {
              if (value != null) {
                return '$' + Number(value).toFixed(2);
              }
              return '';
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) {
                  return 'black';
                }
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Profit',
            title: 'Profit', // Changed from caption to title
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: value => {
              if (value != null) {
                return '$' + Number(value).toFixed(2);
              }
              return '';
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) {
                  return 'black';
                }
                return 'red';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textStick: true
          }
        },
        rowHierarchyType: 'tree',
        widthMode: 'standard',
        rowHierarchyIndent: 20,
        rowExpandLevel: 1,
        dragOrder: {
          dragHeaderMode: 'all',
          validateDragOrderOnEnd(source, target) {
            if (source.row === 3) {
              return false;
            }
            return true;
          }
        },
        rowSeriesNumber: {
          enable: true,
          title: '行号',
          dragOrder: true, // dragOrder for rowSeriesNumber might need specific handling or might not be directly supported in PivotTable in the same way as ListTable.
          width: 'auto',
          icon: 'book',
          headerStyle: {
            color: 'black',
            bgColor: 'pink'
          },
          style: {
            color: 'red'
          }
        },
        theme: VTable.themes.BRIGHT // Added a default theme
      };

      const instance = new PivotTable(option);
      window.tableInstance = instance;
      bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

      // You might want to add event listeners or other logic here if needed
    })
    .catch(error => console.error('Error fetching or processing data:', error));
}

// To run this example, you would typically call createTable()
// For example, in your main.ts or an HTML file:
// document.addEventListener('DOMContentLoaded', createTable);
// Or if you have a button to trigger it:
// const button = document.createElement('button');
// button.innerText = 'Create Pivot Table';
// button.onclick = createTable;
// document.body.appendChild(button);
// Ensure you have a div with id="vTable" in your HTML: <div id="vTable"></div>
