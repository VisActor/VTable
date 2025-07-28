---
категория: примеры
группа: компонент
заголовок: Подсказка пользовательский content
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/Подсказка-пользовательский-content.png
ссылка: компонентs/Подсказка
---

# Подсказка

по списокening`mouseenter_cell`событие, move the mouse into the cell к prompt the Dimension и Metirc information из the cell. по списокening`mouseleave_cell`событие, the mouse leaves the cell к make the prompt box disappear.

## Ключевые Конфигурации

- `mouseenter_cell` событие
- `mouseleave_cell` событие
- `mouseleave_таблица` событие

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const container = document.getElementById(CONTAINER_ID);
const всплывающее окно = document.createElement('div');
объект.assign(всплывающее окно.style, {
  позиция: 'fixed',
  ширина: '300px',
  backgroundColor: '#f1f1f1',
  bпорядок: '1px solid #ccc',
  заполнение: '20px',
  textAlign: 'лево'
});
функция showПодсказка(infoсписок, x, y) {
  всплывающее окно.innerHTML = '';
  всплывающее окно.id = 'всплывающее окно';
  всплывающее окно.style.лево = x + 'px';
  всплывающее окно.style.верх = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = '数据信息';
  heading.style.отступ = '0px';
  всплывающее окно.appendChild(heading);
  для (let i = 0; i < infoсписок.length; i++) {
    const информация = infoсписок[i];
    const info1 = document.createElement('p');
    info1.textContent = информация;
    всплывающее окно.appendChild(info1);
  }
  // 将弹出框添加到文档主体中
  document.body.appendChild(всплывающее окно);
}

функция hideПодсказка() {
  if (document.body.contains(всплывающее окно)) {
    document.body.removeChild(всплывающее окно);
  }
}
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный2_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rowTree: [
        {
          dimensionKey: 'Категория',
          значение: 'Furniture',
          hierarchyState: 'развернуть',
          children: [
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Boхорошоcases',
              hierarchyState: 'свернуть'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Chairs',
              hierarchyState: 'свернуть'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Furnishings'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'таблицаs'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          значение: 'Office Supplies',
          children: [
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Appliances'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Art'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Binders'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Envelopes'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Fasteners'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Labels'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Paper'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Storвозраст'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Supplies'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          значение: 'Technology',
          children: [
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Accessories'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Copiers'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Machines'
            },
            {
              dimensionKey: 'Sub-Категория',
              значение: 'Phones'
            }
          ]
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Регион',
          значение: 'West',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          значение: 'South',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          значение: 'Central',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Регион',
          значение: 'East',
          children: [
            {
              значение: 'Продажи',
              indicatorKey: 'Продажи'
            },
            {
              значение: 'Прибыль',
              indicatorKey: 'Прибыль'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Catogery',
          ширина: 'авто'
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Регион',
          заголовок: 'Регион',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: значение => {
            if (значение) {
              возврат '$' + число(значение).toFixed(2);
            }
            возврат '';
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) {
                возврат 'black';
              }
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: значение => {
            if (значение) {
              возврат '$' + число(значение).toFixed(2);
            }
            возврат '';
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) {
                возврат 'black';
              }
              возврат 'red';
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
      ширинаMode: 'standard',
      rowHierarchyIndent: 20,
      rowExpandLevel: 1,
      rowHierarchyTextStartAlignment: true,
      dragпорядок: {
        dragHeaderMode: 'все'
      }
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = таблицаInstance;
    таблицаInstance.на('mouseenter_cell', args => {
      const { cellRange, col, row } = args;
      debugger;
      const значение = таблицаInstance.getCellValue(col, row);
      const cellHeaderPaths = таблицаInstance.getCellHeaderPaths(col, row);
      const infoсписок = [];
      cellHeaderPaths.rowHeaderPaths?.forEach(headerDimension => {
        infoсписок.push(
          headerDimension.indicatorKey
            ? headerDimension.indicatorKey + ': ' + значение
            : headerDimension.dimensionKey + ': ' + headerDimension.значение
        );
      });
      cellHeaderPaths.colHeaderPaths?.forEach(headerDimension => {
        infoсписок.push(
          headerDimension.indicatorKey
            ? headerDimension.indicatorKey + ': ' + значение
            : headerDimension.dimensionKey + ': ' + headerDimension.значение
        );
      });
      const container = document.getElementById(CONTAINER_ID);
      const containerRect = container.getBoundingClientRect();

      if (!таблицаInstance.isHeader(col, row)) {
        showПодсказка(infoсписок, cellRange?.лево + containerRect.лево, cellRange?.низ + containerRect.верх);
      } else {
        hideПодсказка();
      }
    });
    таблицаInstance.на('mouseleave_cell', args => {
      const { cellRange, col, row } = args;
      hideПодсказка();
    });
    таблицаInstance.на('mouseleave_таблица', args => {
      const { cellRange, col, row } = args;
      hideПодсказка();
    });
  });
```
