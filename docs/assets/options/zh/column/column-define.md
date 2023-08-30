{{ target: column-define }}

#${prefix} columns

表格列配置，每一列需要分别设置配置项，配置项根据columnType不同有略微差别，columnType可支持：`'text' | 'link' | 'image' | 'video' | 'sparkline' | 'progressbar' | 'chart`， 每种columnType的配置项具体如下：


{{ use: text-column-type(
    prefix = ${prefix}
) }}

{{ use: link-column-type(
    prefix = ${prefix}
) }}

{{ use: image-column-type(
    prefix = ${prefix}
) }}

{{ use: vedio-column-type(
    prefix = ${prefix}
) }}

{{ use: progressbar-column-type(
    prefix = ${prefix}
) }}

{{ use: sparkline-column-type(
    prefix = ${prefix}
) }}

{{ use: chart-column-type(
    prefix = ${prefix}
) }}
