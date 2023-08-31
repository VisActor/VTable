{{ target: table-register }}

# register

The features that can be globally registered in the table library are theme, icon, and chartModule, which correspond to theme, icon, and chart registration respectively.

## theme(Function)

[Usage example](url):

- Register theme code as follows:

```
VTable.register.theme('themeRegisterOne',{
      defaultStyle:{
        borderLineWidth:0,
      },
      ...
})
```

- Explanation of register.theme function parameters:

```
function theme(name: string, theme?: ITableThemeDefine){}
```

The structure of ITableThemeDefine can be found in [theme](/zh/option.html#ListTable.theme)

- Usage:

After registration, you can use the registered name in the option to apply the theme:

```
const tableInstance = new VTable.PivotTable({
  ···
  theme:'themeRegisterOne'
  ···
});
```

## icon(Function)

By registering icons, you can display icons in the table or replace built-in function icons such as pin freeze icon.

[Usage example](url):

- Register icon code as follows:

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

- Explanation of register.icon function parameters:

```
function icon(name: string, icon?: ColumnIconOption){}
```

- Usage:

1. After registering the icon, display the icon in the header or body cell content:

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

2. After registering the icon, you can use it in customLayout. Refer to the [example](TODO).

- ColumnIconOption definition:

```
type ColumnIconOption = ImageIcon | SvgIcon;
```

###ImageIcon(Object)
{{ use: image-icon(  prefix = '####') }}

###SvgIcon(Object)
{{ use: svg-icon(  prefix = '####') }}

## chartModule(Function)

[Usage example](url):

- Register chartModule code as follows:

```
VTable.register.chartModule('chartspace', ChartSpace);
```

- register.chartTyle function definition:

```
function chartModule(name: string, chartModule?: any){}
```

In this case, chartModule is a chart component. For example, [VChart](TODO).
