{{ target: column-define }}

#${prefix} columns

Table column configuration, each column needs to set configuration items separately, and the configuration items differ slightly depending on the cellType. cellType can support: `'text' | 'link' | 'image' | 'video' | 'sparkline' | 'progressbar' | 'chart`， The specific configuration items for each cellType are as follows:

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
