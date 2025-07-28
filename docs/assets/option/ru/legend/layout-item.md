{{ target: common-макет-item }}

<!-- IмакетItemSpec -->

#${prefix} макетType(строка) = ${defaultмакетType}

The макет тип из the текущий module, if configured as `absolute`, the текущий element will be laid out absolutely с the upper лево corner из the график as the origin.

Currently supported макет types are as follows:

- `'Регион'`: the drawing area из the график, generally only the Регион module is из this тип
- `'Регион-relative'`: modules related к the Регион позиция, such as axes, данныеzoom, etc.
- `'normal'`: Normal placeholder elements, such as легендаs, titles, etc.
- `'absolute'`: Absolute макет elements, such as Подсказка, markline, etc.

#${prefix} макетLevel(число) = ${defaultмакетLevel}

макет order level, the higher the level, the higher the макет priority, such as a scene с both a title и a легенда в the верх, it is expected that the title will be placed в the верх первый, и then the легенда will be placed.

{{ if: !${noOrient} }}
#${prefix} orient(строка)

Module макет location. необязательный location:

- 'лево'
- 'верх'
- 'право'
- 'низ'

{{ /if }}

#${prefix} заполнение(IмакетNumber|массив|объект) = 0

The макет spacing configuration из the module (four directions из up, down, лево, и право) supports non-объект configuration, массив configuration и объект configuration.

в the case из non-объект configuration, the configuration значение will be applied к the four directions из up, down, лево, и право в the same time, и the свойства are as follows:

{{ use: common-макет-число }}

When configuring an массив, каждый item в the массив supports IмакетNumber , using an пример:

```ts
заполнение: [5]; // верх право низ лево заполнение are 5px
заполнение: ['10%']; // The верх и низ заполнение is 10% из the высота из the график view area, и the лево и право заполнение is 10% из the ширина из the график view area
заполнение: [5, 10]; // The верх и низ заполнение is 5px, и the лево и право заполнение is 10px
заполнение: [
  5, // верх заполнение is 5px
  '10%', // лево и право заполнение is 10% из the ширина из the график view area
  10 // низ заполнение is 10px
];
заполнение: [
  5, // The верх заполнение is 5px,
  '10%', // право заполнение is 10% из the ширина из the график view area,
  '5%', // низ заполнение is 5% из the высота из the график view area
  (rect: IмакетRect) => rect.высота * 0.1 + 10 // The лево заполнение is 0.1 + 10 из the высота из the график view area
];
```

The свойства из the объект configuration are as follows:

{{ use: common-макет-заполнение(
  prefix = '#' + ${prefix}
) }}

пример usвозраст:

```ts
заполнение: 10, // верх право низ лево заполнение is 10px
заполнение: '10%' // The верх, право, низ, и лево paddings are 10% из the ширина и высота из the relative **график view area**
заполнение: {
  верх: 10, // верх заполнение 10px
  лево: ({ ширина }) => ширина * 0.1, // лево заполнение is 0.1 из макет ширина
  право: '10%' // право заполнение is 0.1 из макет ширина
}
```

#${prefix} ширина(IмакетNumber)

The макет ширина configuration для the module.

{{ use: common-макет-число }}

#${prefix} minширина(IмакетNumber)

The minimum макет ширина configuration для modules. This configuration has no effect when ширина is configured.

{{ use: common-макет-число }}

#${prefix} maxширина(IмакетNumber)

The maximum макет ширина configuration для modules. This configuration has no effect when ширина is configured.

{{ use: common-макет-число }}

#${prefix} высота(IмакетNumber)

The макет из the modules is highly configurable.

{{ use: common-макет-число }}

#${prefix} minвысота(IмакетNumber)

The minimum макет ширина configuration для modules. This configuration has no effect when высота is configured.

{{ use: common-макет-число }}

#${prefix} maxвысота(IмакетNumber)

The maximum макет ширина configuration для modules. This configuration has no effect when высота is configured.

{{ use: common-макет-число }}

#${prefix} offsetX(IмакетNumber)

The offset из the module's макет позиция в the X direction.

{{ use: common-макет-число }}

#${prefix} offsetY(IмакетNumber)

The offset из the module's макет позиция в the Y direction.

{{ use: common-макет-число }}

#${prefix} zIndex(число) = ${defaultмакетZIndex}

The display level из the modules. When two modules overlap, the one с the higher level will be displayed на верх.

#${prefix} clip(логический)

Whether the module clips drawing content outside the макет area.

#${prefix} лево(IмакетNumber)

The distance от the лево side из the diagram в the absolute макет из the module. Note **Only takes effect when макетType === 'absolute' **.

{{ use: common-макет-число }}

#${prefix} право(IмакетNumber)

The distance от the право side из the diagram в the absolute макет из the module. Note **Only takes effect when макетType === 'absolute' **.

{{ use: common-макет-число }}

#${prefix} верх(IмакетNumber)

The distance от the верх из the график в the absolute макет из the module. Note **Only takes effect when макетType === 'absolute' **.

{{ use: common-макет-число }}

#${prefix} низ(IмакетNumber)

The distance от the низ из the график в the absolute макет из the module. Note **Only takes effect when макетType === 'absolute' **.

{{ use: common-макет-число }}

#${prefix} центр(логический)

с module absolute макет, the element will be placed в the середина из the diagram. Note **Only takes effect when макетType === 'absolute', и the заполнение property will be ignored**.
