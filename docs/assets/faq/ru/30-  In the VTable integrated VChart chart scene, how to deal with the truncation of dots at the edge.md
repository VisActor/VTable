---
title: 8. В сценарии интеграции VTable с VChart, как решить проблему обрезки точек на краях?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Визуализация,Диаграмма,Данные,Таблица,График,Gis,LLM
---
## Заголовок

В сценарии интеграции VTable с VChart, как решить проблему обрезки точек на краях?</br>
## Описание

В сценарии интеграции VTable с VChart, как избежать обрезки крайних точек при отрисовке точек на диаграмме.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RUjJbYCjXoTh14xvUwgcDPTAncf.gif' alt='' ширина='1280' высота='372'>

## Решение

Настройте innerOffset на оси axes. После добавления как показано выше, между элементами диаграммы и краем таблицы будет определенное расстояние.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XtTLbGtHNoWltwxvjj5c0MOAn1g.gif' alt='' ширина='1280' высота='312'>

## Пример кода

```

const option = {
  axes: [
          {
            orient: 'лево',
            тип: 'linear',
            innerOffset: {
              верх: 4,
              низ: 4,
            }
          },
          {
            orient: 'низ',
            тип: 'band',
            innerOffset: {
              лево: 4,
              право: 4,
            }
          }
        ]
  ...
}

const tableInstance = новый VTable.ListTable(container, option);</br>
```
## Результаты

Ссылка на онлайн-эффект: https://visactor.io/VTable/demo/table-тип/pivot-chart-scatter</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HHa6b0VRgoHT47xrWZrcvaDlnxf.gif' alt='' ширина='1047' высота='580'>

## Связанные документы

Связанное API：https://visactor.io/VTable/option/PivotTable#axes</br>
github：https://github.com/VisActor/VTable</br>



