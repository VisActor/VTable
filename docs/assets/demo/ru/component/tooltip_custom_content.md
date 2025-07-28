---
категория: примеры
группа: Component
заголовок: подсказка custom content
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/подсказка-custom-content.png
ссылка: компонентs/подсказка
---

# Tooltip

By listening`mouseenter_cell`Event, move the mouse into the cell to prompt the Dimension and Metirc information of the cell. By listening`mouseleave_cell`Event, the mouse leaves the cell to make the prompt box disappear.

## Ключевые Конфигурации

- `mouseenter_cell` событие
- `mouseleave_cell` событие
- `mouseleave_table` событие

## Code Demo

```javascript livedemo template=vtable
const container = document.getElementById(CONTAINER_ID);
const popup = document.createElement('div');
Object.assign(popup.style, {
  position: 'fixed',
  width: '300px',
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  padding: '20px',
  textAlign: 'left'
});
function showTooltip(infoList, x, y) {
  popup.innerHTML = '';
  popup.id = 'popup';
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = '数据信息';
  heading.style.margin = '0px';
  popup.appendChild(heading);
  for (let i = 0; i < infoList.length; i++) {
    const info = infoList[i];
    const info1 = document.createElement('p');
    info1.textContent = info;
    popup.appendChild(info1);
  }
  // 将弹出框添加到文档主体中
  document.body.appendChild(popup);
}

function hideTooltip() {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup);
  }
}
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot2_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: 'Категория',
          value: 'Furniture',
          hierarchyState: 'expand',
          children: [
            {
              dimensionKey: 'Подкатегория',
              value: 'Bookcases',
              hierarchyState: 'collapse'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Chairs',
              hierarchyState: 'collapse'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Furnishings'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Tables'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Office Supplies',
          children: [
            {
              dimensionKey: 'Подкатегория',
              value: 'Appliances'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Art'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Binders'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Envelopes'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Fasteners'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Labels'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Paper'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Storage'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Supplies'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Technology',
          children: [
            {
              dimensionKey: 'Подкатегория',
              value: 'Accessories'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Copiers'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Machines'
            },
            {
              dimensionKey: 'Подкатегория',
              value: 'Phones'
            }
          ]
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Регион',
          value: 'West',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          value: 'South',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          value: 'Central',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          value: 'East',
          children: [
            {
              value: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              value: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Категория',
          title: 'Catogery',
          width: 'auto'
        },
        {
          dimensionKey: 'Подкатегория',
          title: 'Sub-Catogery',
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Регион',
          title: 'Регион',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Продажи',
          title: 'Продажи',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            if (value) {
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
          indicatorKey: 'Прибыль',
          title: 'Прибыль',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            if (value) {
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
      widthMode: 'standard',
      rowHierarchyIndent: 20,
      rowExpandLevel: 1,
      rowHierarchyTextStartAlignment: true,
      dragOrder: {
        dragHeaderMode: 'all'
      }
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
    tableInstance.on('mouseenter_cell', args => {
      const { cellRange, col, row } = args;
      debugger;
      const value = tableInstance.getCellValue(col, row);
      const cellHeaderPaths = tableInstance.getCellHeaderPaths(col, row);
      const infoList = [];
      cellHeaderPaths.rowHeaderPaths?.forEach(headerDimension => {
        infoList.push(
          headerDimension.indicatorKey
            ? headerDimension.indicatorKey + ': ' + value
            : headerDimension.dimensionKey + ': ' + headerDimension.value
        );
      });
      cellHeaderPaths.colHeaderPaths?.forEach(headerDimension => {
        infoList.push(
          headerDimension.indicatorKey
            ? headerDimension.indicatorKey + ': ' + value
            : headerDimension.dimensionKey + ': ' + headerDimension.value
        );
      });
      const container = document.getElementById(CONTAINER_ID);
      const containerRect = container.getBoundingClientRect();

      if (!tableInstance.isHeader(col, row)) {
        showTooltip(infoList, cellRange?.left + containerRect.left, cellRange?.bottom + containerRect.top);
      } else {
        hideTooltip();
      }
    });
    tableInstance.on('mouseleave_cell', args => {
      const { cellRange, col, row } = args;
      hideTooltip();
    });
    tableInstance.on('mouseleave_table', args => {
      const { cellRange, col, row } = args;
      hideTooltip();
    });
  });
```
