{{ target: rows-dimension-define }}

#${prefix} rows

**结构同列表头树形结构columns配置**

行表头对应各级维度的样式及format配置，每中维度需要分别设置配置项，配置项根据headerType不同有略微差别，headerType可支持：`'text' | 'link' | 'image' | 'video'`， 每种headerType的配置项具体如下：


{{ use: text-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

{{ use: link-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

{{ use: image-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

{{ use: video-dimension-type(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

