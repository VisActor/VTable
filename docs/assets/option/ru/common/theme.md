{{ target: common-тема }}

таблица тема, which has built-в тема имяs по умолчанию, ARCO, BRIGHT, DARK, SIMPLIFY. The configuration can be made using built-в types или directly с строка имяs:

- `Vтаблица.темаs.по умолчанию`
- `Vтаблица.темаs.ARCO;`
- `Vтаблица.темаs.BRIGHT`
- `Vтаблица.темаs.DARK`
- `Vтаблица.темаs.SIMPLIFY`

или

- `'по умолчанию'`
- `'arco'`
- `'bright'`
- `'dark'`
- `'simplify'`

Вы можете also extend built-в темаs, для пример, change the шрифт based на the ARCO тема:

```
Vтаблица.темаs.ARCO.extend({
  fontSize: '14px',
  fontFamily: 'PingFangSC'
})
```

или Вы можете directly define a пользовательский тема:

```
{
  defaultStyle:{
    borderLineширина:0,
  },
  headerStyle:{
    frameStyle:{
      borderColor:'blue',
      borderLineширина:[0,0,1,0]
    }
  },
  rowHeaderStyle:{
    frameStyle:{
      borderColor:'blue',
      borderLineширина:[0,1,0,0]
    }
  },
  cornerHeaderStyle:{
    frameStyle:{
      borderColor:'blue',
      borderLineширина:[0,1,1,0]
    }
  }
}
```

#${prefix} underlayBackgroundColor(строка)
The цвет filled в the canvas outside the таблица drawing area

#${prefix} cellInnerBorder(логический)
Whether the cell draws an inner граница. If false, the граница из the граница cell закрыть к the граница will be скрытый.

#${prefix} bodyStyle(объект)

Body cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} headerStyle(объект)

список header cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} rowHeaderStyle(объект)

Row header cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerHeaderStyle(объект)

Corner header cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerLeftBottomCellStyle(объект)

Corner лево низ cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerRightBottomCellStyle(объект)

Corner право низ cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} bottomFrozenStyle(объект)

низ frozen area style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} rightFrozenStyle(объект)

право frozen area style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerRightTopCellStyle(объект)

Corner право верх cell style configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} groupTitleStyle(объект)

Group title style configuration в grouping display mode

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} defaultStyle(объект)

Common style, if the items в headerStyle, rowHeaderStyle, и defaultStyle are не configured, the items в this will be used для configuration

{{ use: common-тема-style(
  prefix = '#' + ${prefix},
) }}

{{ use: common-таблица-frame-style(
  prefix = ${prefix}
  ) }}

{{ use: common-column-изменение размера-style(
  prefix = ${prefix}
  ) }}

{{ use: common-перетаскивание-header-line-style(
  prefix = ${prefix}
  ) }}

{{ use: common-frozen-column-line-style (
  prefix = ${prefix}
  ) }}

{{ use: common-прокрутка-style (
  prefix = ${prefix}
  ) }}

{{ use: common-Подсказка-style (
  prefix = ${prefix}
  ) }}

{{ use: common-флажок-style (
  prefix = ${prefix}
  ) }}

{{ use: common-переключатель-style (
  prefix = ${prefix}
  ) }}

{{ use: common-switch-style (
  prefix = ${prefix}
  ) }}

{{ use: common-Кнопка-style (
  prefix = ${prefix}
  ) }}

#${prefix} selectionStyle(объект)

Selection box style

##${prefix} cellBgColor(строка)
Selection box фон цвет, requires transparency setting

##${prefix} cellBorderColor(строка)
Selection box граница цвет

##${prefix} cellBorderLineширина(число)
Selection box граница thickness

##${prefix} inlineRowBgColor(ColorPropertyDefine)
The highlight цвет из the entire row when selected
{{ use: common-цвет(
prefix = ${prefix}
) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
The highlight цвет из the entire column when selected
{{ use: common-цвет(
prefix = ${prefix}
) }}

##${prefix} selectionFillMode(логический)
Fill цвет rules для the selected area

- `overlay`: The fill цвет из the selected area will cover the фон цвет из the cell (usually a цвет значение с transparency)
- `replace`: The fill цвет из the selected area will replace the фон цвет из the cell
  {{ use: common-цвет(
    prefix = ${prefix}
    ) }}

##${prefix} functionalиконкаsStyle(объект)
Vтаблица internal functional Кнопка иконка цвет и размер configuration. If the иконка is не clear, it can be adjusted according к the actual situation. If the размер is не suiтаблица, it can be adjusted appropriately.

```
  functionalиконкаsStyle?: {
    сортировка_color?: строка;
    сортировка_color_opaГород?: строка;
    сортировка_color_2?: строка;
    сортировка_color_opaГород_2?: строка;
    сортировка_size?: число;
    сортировка_size_2?: число;
    frozen_color?: строка;
    frozen_color_opaГород?: строка;
    frozen_color_2?: строка;
    frozen_color_opaГород_2?: строка;
    frozen_size?: число;
    frozen_size_2?: число;
    collapse_color?: строка;
    collapse_color_opaГород?: строка;
    collapse_size?: число;
    collapse_size_2?: число;
    expand_color?: строка;
    expand_color_opaГород?: строка;
    expand_size?: число;
    expand_size_2?: число;
    dragReorder_color?: строка;
    dragReorder_color_opaГород?: строка;
    dragReorder_size?: число;
  };
```
