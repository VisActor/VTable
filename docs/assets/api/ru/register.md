{{ target: table-register }}

# register

Функции, которые могут быть глобально зарегистрированы в библиотеке таблиц: theme, icon и chartModule, что соответствует регистрации темы, иконки и диаграммы соответственно.

## theme(Function)

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
function theme(name: string, theme?: ITableThemeDefine){}
```

Структуру ITableThemeDefine можно найти в [theme](../option/ListTable#theme)

- Использование:

После регистрации вы можете использовать зарегистрированное имя в опции для применения темы:

```
const tableInstance = new VTable.PivotTable({
  ···
  theme:'themeRegisterOne'
  ···
});
```

## icon(Function)

Регистрируя иконки, вы можете отображать иконки в таблице или заменять встроенные функциональные иконки, такие как иконка закрепления pin freeze.

[Пример использования](../demo/custom-render/custom-icon):

- Код регистрации иконки следующий:

```
VTable.register.icon('order',{
      type: 'svg',
      svg:
        'http://' + window.location.host + "/mock-data/order.svg",
      width: 22,
      height: 22,
      name: 'order',
      positionType: VTable.TYPES.IconPosition.left,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
```

- Объяснение параметров функции register.icon:

```
function icon(name: string, icon?: ColumnIconOption){}
```

- Использование:

1. После регистрации иконки отображать иконку в заголовке или содержимом ячейки тела:

```
const tableInstance = new VTable.PivotTable({
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
type ColumnIconOption = ImageIcon | SvgIcon;
```

###ImageIcon(Object)

зарегистрировать ресурс изображения.

{{ use: image-icon(  prefix = '####') }}

###SvgIcon(Object)

зарегистрировать ресурс svg.

{{ use: svg-icon(  prefix = '####') }}

###TextIcon(Object)

зарегистрировать текстовый ресурс.

{{ use: text-icon(  prefix = '####') }}

## chartModule(Function)

[Пример использования](../demo/cell-type/chart):

- Код регистрации chartModule следующий:

```
VTable.register.chartModule('chartspace', ChartSpace);
```

- Определение функции register.chartTyle:

```
function chartModule(name: string, chartModule?: any){}
```

В этом случае chartModule является компонентом диаграммы. Например, [VChart](https://visactor.io/vchart).
