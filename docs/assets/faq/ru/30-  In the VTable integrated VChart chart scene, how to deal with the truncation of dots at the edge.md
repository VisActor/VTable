---
title: 8. В сценарии интеграции VTable с VChart, как решить проблему обрезки точек на краях?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Визуализация,Диаграмма,Данные,Таблица,График,Gis,LLM
---
## Заголовок

В сценарии интеграции VTable с VChart, как решить проблему обрезки точек на краях?</br>
## Описание

В сценарии интеграции VTable с VChart, как избежать обрезки крайних точек при отрисовке точек на диаграмме.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RUjJbYCjXoTh14xvUwgcDPTAncf.gif' alt='' width='1280' height='372'>

## Решение

Настройте innerOffset на оси axes. После добавления как показано выше, между элементами диаграммы и краем таблицы будет определенное расстояние.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XtTLbGtHNoWltwxvjj5c0MOAn1g.gif' alt='' width='1280' height='312'>

## Пример кода

```

const option = {
  axes: [
          {
            orient: 'left',
            type: 'linear',
            innerOffset: {
              top: 4,
              bottom: 4,
            }
          },
          {
            orient: 'bottom',
            type: 'band',
            innerOffset: {
              left: 4,
              right: 4,
            }
          }
        ]
  ...
}

const tableInstance = new VTable.ListTable(container, option);</br>
```
## Результаты

Ссылка на онлайн-эффект: https://visactor.io/vtable/demo/table-type/pivot-chart-scatter</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HHa6b0VRgoHT47xrWZrcvaDlnxf.gif' alt='' width='1047' height='580'>

## Связанные документы

Связанное API：https://visactor.io/vtable/option/PivotTable#axes</br>
github：https://github.com/VisActor/VTable</br>



