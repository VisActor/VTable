{{ target: table-register }}

# register

表格库可全局注册的功能有 theme，icon，chartModule。分别对应主题，图标及图表的注册。

## theme(Function)

[使用示例](../demo/theme/register):

- 注册 theme 代码如下：

```
VTable.register.theme('themeRegisterOne',{
      defaultStyle:{
        borderLineWidth:0,
      },
      ...
})
```

- register.theme 函数的参数说明：

```
function theme(name: string, theme?: ITableThemeDefine){}
```

ITableThemeDefine 的结构可参考[theme](../option/ListTable#theme)

- 使用方式：

注册好之后 可以使用注册的名称配置到 option 中，使该 theme 生效：

```
const tableInstance = new VTable.PivotTable({
  ···
  theme:'themeRegisterOne'
  ···
});
```

## icon(Function)

通过注册 icon 可以在表格中显示图标，或者替换内置的功能图标如 pin 冻结图标。

[使用示例](../demo/custom-render/custom-icon)：

- 注册 icon 代码如下：

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

- register.icon 函数的参数说明：

```
function icon(name: string, icon?: ColumnIconOption){}
```

- 使用方式：

1. 注册号 icon 之后在表头或者 body 的单元格内容中展示图标：

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

- ColumnIconOption 定义：

```
type ColumnIconOption = ImageIcon | SvgIcon;
```

###ImageIcon(Object)

注册图片资源的 icon

{{ use: image-icon(  prefix = '####') }}

###SvgIcon(Object)

注册 svg 资源的 icon

{{ use: svg-icon(  prefix = '####') }}

###TextIcon(Object)

注册文本资源的 icon

{{ use: text-icon(  prefix = '####') }}

## chartModule(Function)

[使用示例](../demo/cell-type/chart)：

- 注册 chartModule 代码如下：

```
VTable.register.chartModule('chartspace', ChartSpace);
```

- register.chartTyle 函数的定义：

```
function chartModule(name: string, chartModule?: any){}
```

在这里 chartModule 是一个图表组件。例如[VChart](https://visactor.io/vchart)。
