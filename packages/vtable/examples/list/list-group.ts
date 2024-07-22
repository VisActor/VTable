import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { createGroup } from '@visactor/vrender-core';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';

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
        }),
        editor: 'input',
        sortState: {
          field: 'Order ID',
          order: 'asc'
        },
        groupTitleCustomLayout: args => {
          const { table, row, col, rect } = args;
          const record = table.getCellOriginRecord(col, row);
          const { height, width } = rect ?? table.getCellRect(col, row);
          const container = new VTable.CustomLayout.Group({
            height,
            width,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            cursor: 'pointer',
            alignItems: 'center'
          });
          container.addEventListener('click', e => {
            // 折叠后单元格的行列值会变化，需要动态获取
            const { col, row } = e.target.parent;
            table.toggleHierarchyState(col, row);
          });
          const icon = new VTable.CustomLayout.Image({
            id: 'icon0',
            width: 40,
            height: 40,
            image: bloggerAvatar,
            cornerRadius: 20,
            boundsPadding: [0, 20, 0, 20 + table.getGroupTitleLevel(col, row) * 20]
          });
          container.add(icon);
          const bloggerName = new VTable.CustomLayout.Text({
            text: record.vtableMergeName,
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: 'black'
          });
          container.add(bloggerName);
          return {
            rootContainer: container,
            renderDefault: false
          };
        }
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

      tableInstance.on('scroll', () => {
        updateGroupTitle(tableInstance);
      });
    })
    .catch(e => {
      console.error(e);
    });
}

function updateGroupTitle(tableInstance: VTable.ListTable) {
  const titleRows = getGroupTitleInfo(tableInstance);
  const colHeaderGroup = tableInstance.scenegraph.colHeaderGroup;
  const shadowGroup = colHeaderGroup.shadowRoot;
  shadowGroup.setAttributes({
    // shadowRootIdx: 1,
    // width: 500,
    // height: 500,
    // fill: 'red'
  });
  shadowGroup.removeAllChild();

  for (let col = 0; col < tableInstance.colCount; col++) {
    const colGroup = createGroup({
      x: tableInstance.getColsWidth(0, col - 1),
      y: tableInstance.getFrozenRowsHeight()
    });
    shadowGroup.add(colGroup);
    for (let i = 0; i < titleRows.length; i++) {
      const row = titleRows[i];
      const cell = tableInstance.scenegraph.getCell(col, row);
      if (cell.role === 'cell') {
        // const newCell = cell.clone();
        const newCell = cloneGraphic(cell);
        newCell.setAttributes({
          y: i * 40
        });
        colGroup.add(newCell);
      }
    }
  }
}

let titleRows;
function getGroupTitleInfo(tableInstance: VTable.ListTable) {
  const row = tableInstance.scenegraph.proxy.screenTopRow + (titleRows?.length ?? 0) + 1;
  const recordIndex = tableInstance.getRecordIndexByCell(0, row); // [0, 0, 6]/0

  titleRows = getTitleRowsByRecordIndex(tableInstance, recordIndex, row);
  console.log('titleRows', titleRows);
  return titleRows;
}

function getTitleRowsByRecordIndex(tableInstance: VTable.ListTable, recordIndex: number | number[], row: number) {
  const titleRecords = [];
  if (!Array.isArray(recordIndex)) {
    recordIndex = [recordIndex];
  }

  for (let i = 0; i < recordIndex.length; i++) {
    const index = recordIndex.slice(0, i + 1);
    const record = tableInstance.dataSource.getRawRecord(index);
    titleRecords.push(record);
  }

  const titleRows = [];
  let titleIndex = recordIndex.slice(0, recordIndex.length - 1);
  const currentIndexedData = tableInstance.dataSource.currentIndexedData;
  const startIndex = row - tableInstance.columnHeaderLevelCount;

  for (let i = startIndex; i >= 0; i--) {
    const currentIndex = currentIndexedData[i];
    if (Array.isArray(currentIndex) && titleIndex.length === currentIndex.length) {
      let isMatch = true;
      for (let j = 0; j < currentIndex.length; j++) {
        if (currentIndex[j] !== titleIndex[j]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        titleRows.push(i + tableInstance.columnHeaderLevelCount);
        titleIndex = titleIndex.slice(0, titleIndex.length - 1);
      }
    } else if (currentIndex === recordIndex[0]) {
      titleRows.push(i + tableInstance.columnHeaderLevelCount);
      break;
    }
  }

  return titleRows.reverse();
  // return titleRecords;
}

function cloneGraphic(graphic: VTable.Graphic) {
  const newGraphic = graphic.clone();
  if (graphic.type === 'group') {
    const newGroup = newGraphic as VTable.Group;
    graphic.forEachChildren(child => {
      const newChild = cloneGraphic(child);
      newGroup.add(newChild);
    });
  }
  return newGraphic;
}
