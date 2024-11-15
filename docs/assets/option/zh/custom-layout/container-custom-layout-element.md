{{ target: container-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix} width (number)

容器的宽度。

${prefix} height (number)

容器的高度。

${prefix} direction ('row' | 'column') = 'row'

容器主要布局方向，可以是 'row'（水平）或 'column'（垂直），默认为 'row'。

${prefix} justifyContent ('start' | 'end' | 'center') = 'start'

沿主轴线方向上的对齐方式，可以是 'start'（起始）、'end'（结束）或 'center'（居中），默认为 'start'。

${prefix} alignItems ('start' | 'end' | 'center') = 'start'

沿交叉轴线方向上的对齐方式，可以是 'start'（起始）、'end'（结束）或 'center'（居中），默认为 'start'。

${prefix} alignContent ('start' | 'end' | 'center')

当容器中包含多个轴线时，沿交叉轴线方向上的对齐方式，可以是 'start'（起始）、'end'（结束）或 'center'（居中），默认为 undefined。

${prefix} showBounds (boolean) = false

是否显示容器边界框，默认为 false。