{{ target: table-register }}

# register

Функции, которые могут быть глобально зарегистрированы в библиотеке таблиц: theme, icon и chartModule, что соответствует регистрации темы, иконки и диаграммы соответственно.

## theme(функция)

[Пример использования](../demo/theme/register):

- Код регистрации темы следующий:

```
VTable.register.theme('themeRegisterOne',{
      defaultStyle:{
        borderLineWidth:0,
      },
      ...
})
```

- Объяснение параметров функции register.theme:

```
функция theme(name: строка, theme?: ITableThemeDefine){}
```

Структуру ITableThemeDefine можно найти в [theme](../option/ListTable#theme)

- Использование:

После регистрации вы можете использовать зарегистрированное имя в опции для применения темы:

```
const tableInstance = новый VTable.PivotTable({
  ···
  theme:'themeRegisterOne'
  ···
});
```

## icon(функция)

Регистрируя иконки, вы можете отображать иконки в таблице или заменять встроенные функциональные иконки, такие как иконка закрепления pin freeze.

[Пример использования](../demo/custom-render/custom-icon):

- Код регистрации иконки следующий:

```
VTable.register.icon('order',{
      тип: 'svg',
      svg:
        'http://' + window.location.host + "/mock-data/order.svg",
      ширина: 22,
      высота: 22,
      name: 'order',
      positionType: VTable.TYPES.IconPosition.лево,
      marginRight: 0,
      навести: {
        ширина: 22,
        высота: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
```

- Объяснение параметров функции register.icon:

```
функция icon(name: строка, icon?: ColumnIconOption){}
```

- Использование:

1. После регистрации иконки отображать иконку в заголовке или содержимом ячейки тела:

```
const tableInstance = новый VTable.PivotTable({
  ···
  columns:[
    {
      field:'orderID',
      title:'orderID',
      headerIcon:'order',
      icon:'order'，
    }
  ]
  ···
});
```

- Определение ColumnIconOption:

```
тип ColumnIconOption = ImageIcon | SvgIcon;
```

###ImageIcon(объект)

зарегистрировать ресурс изображения.

{{ use: image-icon(  prefix = '####') }}

###SvgIcon(объект)

зарегистрировать ресурс svg.

{{ use: svg-icon(  prefix = '####') }}

###TextIcon(объект)

зарегистрировать текстовый ресурс.

{{ use: текст-icon(  prefix = '####') }}

## chartModule(функция)

[Пример использования](../demo/cell-тип/chart):

- Код регистрации chartModule следующий:

```
VTable.register.chartModule('chartspace', ChartSpace);
```

- Определение функции register.chartTyle:

```
функция chartModule(name: строка, chartModule?: любой){}
```

В этом случае chartModule является компонентом диаграммы. Например, [VChart](https://visactor.io/vchart).
