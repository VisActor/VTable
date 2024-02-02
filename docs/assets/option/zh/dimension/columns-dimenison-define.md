{{ target: columns-dimension-define }}

#${prefix} columns

列表头对应各级维度的样式及format配置，每中维度需要分别设置配置项，配置项根据headerType不同有略微差别，headerType可支持：`'text' | 'link' | 'image' | 'video'`， 每种headerType的配置项具体如下：


{{ use: text-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}

{{ use: link-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}

{{ use: image-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}

{{ use: video-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}
