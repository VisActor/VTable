{{ target: indicators-define }}

#${prefix} indicators(Array)

透视表中各个指标的具体配置，如样式，format，caption 等，每种指标需要分别设置配置项，配置项根据 columnType 不同有略微差别，columnType 可支持：`'text' | 'link' | 'image' | 'video' | 'progressbar' | 'sparkline'`， 每种 columnType 的配置项具体如下：

{{ use: text-indicator-type(
    prefix = ${prefix}) }}

{{ use: link-indicator-type(
    prefix = ${prefix}) }}

{{ use: image-indicator-type(
    prefix = ${prefix}) }}

{{ use: vedio-indicator-type(
    prefix = ${prefix}) }}

{{ use: progressbar-indicator-type(
    prefix = ${prefix}) }}

{{ use: sparkline-indicator-type(
    prefix = ${prefix}) }}

{{ use: chart-indicator-type(
    prefix = ${prefix}) }}
