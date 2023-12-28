{{ target: indicators-define }}

#${prefix} indicators(Array)

透视表中各个指标的具体配置，如样式，format，title 等，每种指标需要分别设置配置项，配置项根据 cellType 不同有略微差别，cellType 可支持：`'text' | 'link' | 'image' | 'video' | 'progressbar' | 'sparkline'`， 每种 cellType 的配置项具体如下：

{{ use: text-indicator-type(
    prefix = ${prefix}) }}

{{ use: link-indicator-type(
    prefix = ${prefix}) }}

{{ use: image-indicator-type(
    prefix = ${prefix}) }}

{{ use: video-indicator-type(
    prefix = ${prefix}) }}

{{ use: progressbar-indicator-type(
    prefix = ${prefix}) }}

{{ use: sparkline-indicator-type(
    prefix = ${prefix}) }}

{{ use: chart-indicator-type(
    prefix = ${prefix}) }}
