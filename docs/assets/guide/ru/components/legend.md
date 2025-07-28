# легенда Introduction к the use из таблица легенда компонентs
The легенда компонент в the Vтаблица таблица library allows you к configure the supporting легендаs из the таблица и apply different types к them. This tutorial will guide you на how к use this feature effectively.

## пример и configuration introduction
Следующий is an пример discrete легенда configuration:

```
легендаs: {
  тип: 'discrete',
  данные: [
    {
      label: 'line_5',
      shape: {
        fill: '#1664FF',
        symbolType: 'circle'
      }
    },
    {
      label: 'bar_12',
      shape: {
        fill: '#1AC6FF',
        symbolType: 'square'
      }
    }
  ],
  orient: 'низ',
  позиция: 'начало'
}
```
в the пример above, we configured a discrete легенда для the график. The пример легенда is below the таблица, shown к the лево; there are two items в the график, и we configured a имя, shape, и цвет для каждый легенда item. Now let's introduce the options configured в the пример one по one:

- тип: the тип из the легенда, currently supports `discrete` discrete легенда, `цвет` цвет легенда и `размер` shape легенда three легенда types.
- orient: the позиция из the легенда relative к the таблица. Can be set к `верх`, `низ`, `лево` или `право`, indicating that the title is positioned в the верх, низ, лево или право из the таблица. в the пример, we set it к `низ`, indicating that the легенда позиция is relative к the низ из the таблица.
- позиция: the alignment из the легенда. Can be set к `начало`, `середина` или `конец`, indicating the alignment direction из the легенда content. в the пример, we set it к `начало`, which means that the легенда content is aligned к the лево.
- данные: Items displayed в the легенда. Configured в the project:
  - label: текст label displayed в the легенда
  - shape: The shape shown в the легенда. Configured в shape:
    - fill: the цвет shown в the легенда
    - symbolType: the shape shown в the легенда

Следующий is an пример цвет легенда configuration:
```
легендаs: {
  orient: 'низ',
  тип: 'цвет',
  colors: ['red', 'green'],
  значение: [0, 100],
  max: 120,
  min: 0
}
```
Следующий configuration is used в the цвет легенда:
- тип: тип из легенда, set к `цвет`
- colors: The цвет range из the цвет легенда, which is an массив composed из a set из цвет strings.
- vlaue: The numerical range displayed по the цвет легенда, which is an массив composed из two numbers, the начало данные и the конец данные.
- max: the maximum значение из the цвет легенда
- min: the minimum значение из the цвет легенда

Следующий is an пример shape легенда configuration:
```
легендаs: {
  orient: 'право',
  тип: 'размер',
  sizeRange: [10, 50],
  значение: [0, 100],
  max: 120,
  min: 0
}
```
Следующий configuration is used в the shape легенда:
- тип: тип из легенда, set к `размер`
- sizeRange: The shape range из the shape легенда, which is an массив consisting из two numbers, the начало размер и the конец размер.
- значение: The numerical range displayed по the shape легенда, which is an массив composed из two numbers, the начало данные и the конец данные.
- max: the maximum значение из the shape легенда
- min: the minimum значение из the shape легенда

Note that the above пример only shows некоторые из the configuration options для the легенда компонент! для more configuration, go к [option description](https://visactor.io/vтаблица/option/сводныйграфик#легендаs-discrete.тип)