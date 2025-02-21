{{ target: column-define }}

#${prefix} columns

表格列配置，每一列需要分别设置配置项，配置项根据 cellType 不同有略微差别，cellType 可支持：`'text' | 'link' | 'image' | 'video' | 'sparkline' | 'progressbar' | 'chart`， 每种 cellType 的配置项具体如下：

{{ use: text-cell-type(
    prefix = ${prefix}
) }}

{{ use: link-cell-type(
    prefix = ${prefix}
) }}

{{ use: image-cell-type(
    prefix = ${prefix}
) }}

{{ use: video-cell-type(
    prefix = ${prefix}
) }}

{{ use: progressbar-cell-type(
    prefix = ${prefix}
) }}

{{ use: sparkline-cell-type(
    prefix = ${prefix}
) }}

{{ use: chart-cell-type(
    prefix = ${prefix}
) }}

{{ use: checkbox-cell-type(
    prefix = ${prefix}
) }}

{{ use: radio-cell-type(
    prefix = ${prefix}
) }}

{{ use: switch-cell-type(
    prefix = ${prefix}
) }}

{{ use: button-cell-type(
    prefix = ${prefix}
) }}

{{ use: composite-cell-type(
    prefix = ${prefix}
) }}
