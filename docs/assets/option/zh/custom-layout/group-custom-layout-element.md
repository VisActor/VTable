{{ target: group-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

##${prefix} direction ('row' | 'column')

子源布局方向，可以是 'row'（水平）或 'column'（垂直）。

##${prefix} alignItems (AlignItems)

子元素在交叉轴线上的对齐方式。