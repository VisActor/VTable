# Title Introduction к the use из таблица coordinate axes
The axis компонент в the Vтаблица таблица library allows you к configure the axis в the cell в the perspective view. This tutorial will guide you на how к use this feature effectively.

## пример и configuration introduction
Here is an пример configuration:

```
axes: [
  {
    тип: 'band',
    видимый: true,
    orient: 'низ',
    domainLine: {
      видимый: true,
      style: {
        lineширина: 1,
        strхорошоe: '#989999'
      }
    },
    заголовок: {
      видимый: false,
      текст: 'Регион',
      style: {
        fontSize: 12,
        fill: '#363839',
        fontWeight: 'normal'
      }
    },
    label: {
      видимый: true,
      space: 4,
      style: {
        fontSize: 12,
        fill: '#6F6F6F',
        angle: 0,
        fontWeight: 'normal'
      }
    }
  },
  {
    тип: 'linear',
    orient: 'лево',
    видимый: true,
    domainLine: {
      видимый: true,
      style: {
        lineширина: 1,
        strхорошоe: 'rgba(255, 255, 255, 0)'
      }
    },
    заголовок: {
      видимый: true,
      текст: 'title',
      style: {
        fontSize: 12,
        fill: '#363839',
        fontWeight: 'normal'
      }
    },
    label: {
      видимый: true,
      space: 8,
      style: {
        fontSize: 12,
        maxLineширина: 174,
        fill: '#6F6F6F',
        angle: 0,
        fontWeight: 'normal'
      },
    },
  }
],
```
в the пример above, the lower horizontal discrete axis и the лево vertical continuous axis are configured separately. Now let's walk through the options доступный для пользовательскийization:

- тип: The тип из coordinate axis. Currently, it supports two types: `band` и `linear`, which correspond к discrete и continuous coordinate axes respectively.
- orient: The позиция из the coordinate axis, which can be set к `верх`, `низ`, `лево` или `право`, indicating that the axis cell is located в the верх, низ, лево или право из the perspective. в the пример, we set the discrete axis к `низ`, relative к the низ из the perspective, и the continuous axis к `лево`, relative к the лево side из the perspective.
- видимый: Whether the coordinate axis is displayed, supports two configurations из `true` и `false`.
- domainLine: the main axis из the coordinate axis, supports Следующий configurations:
  - видимый: Whether the main axis is displayed, supports two configurations из `true` и `false`.
  - style: the style из the main axis, Следующий configurations are supported:
    - lineширина: main axis line ширина.
    - strхорошоe: main axis line цвет.
- заголовок: The title из the axis, supports Следующий configurations:
  - видимый: Whether the title is displayed, supports two configurations из `true` и `false`.
  - текст: The текст content из the title.
  - style: The style из the title, supports Следующий configurations:
    - fontSize: текст размер.
    - fill: текст цвет.
    - fontWeight: текст thickness.
- laebl: axis label, supports Следующий configurations:
  - видимый: whether the label is displayed, supports `true` и `false` two configurations.
  - space: the distance between the label и the axis.
  - style: The style из the label, which supports Следующий configurations:
    - fontSize: текст размер.
    - maxLineширина: текст display maximum ширина
    - fill: текст цвет.
    - angle: текст selection angle
    - fontWeight: текст thickness.


Please note that the above пример only shows a subset из the axis компонент's configuration options! для more configuration, please go к [option description](https://visactor.io/vтаблица/option/сводныйграфик#axes)