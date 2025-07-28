---
категория: примеры
группа: Style
заголовок: Style
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/style.png
порядок: 5-1
ссылка: тема_and_style/style
опция: списоктаблица-columns-текст#style.bgColor
---

# style

в this пример, the styles из the header и body are configured по configuring headerStyle и style, respectively. все сводныйтаблица columns с the same Dimension Категория are set к the same фон цвет, и Количество, Продажи и Прибыль в Metirc are set к different шрифт colors.

## Ключевые Конфигурации

\-`headerStyle` Configure the header style из a Dimension

\-`style` Configure the style из a Dimension или Metirc body part

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rowTree: [
        {
          dimensionKey: 'Город',
          значение: 'Aberdeen'
        },
        {
          dimensionKey: 'Город',
          значение: 'Abilene'
        },
        {
          dimensionKey: 'Город',
          значение: 'Akron'
        },
        {
          dimensionKey: 'Город',
          значение: 'Albuquerque'
        },
        {
          dimensionKey: 'Город',
          значение: 'Alexandria'
        },
        {
          dimensionKey: 'Город',
          значение: 'Allen'
        },
        {
          dimensionKey: 'Город',
          значение: 'Allentown'
        },
        {
          dimensionKey: 'Город',
          значение: 'Altoona'
        },
        {
          dimensionKey: 'Город',
          значение: 'Amarillo'
        },
        {
          dimensionKey: 'Город',
          значение: 'Anaheim'
        },
        {
          dimensionKey: 'Город',
          значение: 'Andover'
        },
        {
          dimensionKey: 'Город',
          значение: 'Ann Arbor'
        },
        {
          dimensionKey: 'Город',
          значение: 'Antioch'
        },
        {
          dimensionKey: 'Город',
          значение: 'Apopka'
        },
        {
          dimensionKey: 'Город',
          значение: 'Apple Valley'
        },
        {
          dimensionKey: 'Город',
          значение: 'Appleton'
        },
        {
          dimensionKey: 'Город',
          значение: 'Arlington'
        },
        {
          dimensionKey: 'Город',
          значение: 'Arlington высотаs'
        },
        {
          dimensionKey: 'Город',
          значение: 'Arvada'
        },
        {
          dimensionKey: 'Город',
          значение: 'Asheville'
        },
        {
          dimensionKey: 'Город',
          значение: 'Athens'
        },
        {
          dimensionKey: 'Город',
          значение: 'Atlanta'
        },
        {
          dimensionKey: 'Город',
          значение: 'Atlantic Город'
        },
        {
          dimensionKey: 'Город',
          значение: 'Auburn'
        },
        {
          dimensionKey: 'Город',
          значение: 'Aurora'
        },
        {
          dimensionKey: 'Город',
          значение: 'Austin'
        },
        {
          dimensionKey: 'Город',
          значение: 'Avondale'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bakersполе'
        },
        {
          dimensionKey: 'Город',
          значение: 'Baltimore'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bangor'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bartlett'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bayonne'
        },
        {
          dimensionKey: 'Город',
          значение: 'Baytown'
        },
        {
          dimensionKey: 'Город',
          значение: 'Beaumont'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bedford'
        },
        {
          dimensionKey: 'Город',
          значение: 'Belleville'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bellevue'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bellingham'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bethlehem'
        },
        {
          dimensionKey: 'Город',
          значение: 'Beverly'
        },
        {
          dimensionKey: 'Город',
          значение: 'Billings'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bloomington'
        },
        {
          dimensionKey: 'Город',
          значение: 'Boca Raton'
        },
        {
          dimensionKey: 'Город',
          значение: 'Boise'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bolingbroхорошо'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bossier Город'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bowling Green'
        },
        {
          dimensionKey: 'Город',
          значение: 'Boynton Beach'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bozeman'
        },
        {
          dimensionKey: 'Город',
          значение: 'Brentwood'
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Категория',
          значение: 'Office Supplies',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          значение: 'Technology',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          значение: 'Furniture',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Город',
          заголовок: 'Город',
          headerStyle: {
            textStick: true,
            bgColor: '#356b9c',
            цвет: '#00ffff'
          },
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true,
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true,
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          ширина: 'авто'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Количество',
          заголовок: 'Количество',
          ширина: 'авто',
          showсортировка: false,
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            },
            fontWeight: 'bold',
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          headerStyle: {
            цвет: 'black',
            fontWeight: 'normal',
            textStick: true,
            fontWeight: 'bold',
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          format: значение => {
            возврат '$' + число(значение).toFixed(2);
          }
        },
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'blue';
            },
            fontWeight: 'normal',
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          headerStyle: {
            textStick: true,
            цвет: 'blue',
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          format: значение => {
            if (значение) возврат '$' + число(значение).toFixed(2);
            else возврат '--';
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'white';
            },
            fontWeight: 'normal',
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (arg.данныеValue < 0) возврат 'purple';
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          headerStyle: {
            цвет: 'white',
            textStick: true,
            bgColor: arg => {
              const cellHeaderPaths = arg.таблица.getCellHeaderPaths(arg.col, arg.row);
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Office Supplies') {
                возврат '#bd422a';
              }
              if (cellHeaderPaths.colHeaderPaths[0].значение === 'Technology') {
                возврат '#ff9900';
              }
              возврат 'gray';
            }
          },
          format: значение => {
            возврат '$' + число(значение).toFixed(2);
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true,
          bgColor: '#356b9c',
          цвет: '#00ffff'
        }
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
