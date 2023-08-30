{{ target: column-define }}

#${prefix} columns

Table column configuration, each column needs to set configuration items separately, and the configuration items differ slightly depending on the columnType. columnType can support: `'text' | 'link' | 'image' | 'video' | 'sparkline' | 'progressbar' | 'chart`， The specific configuration items for each columnType are as follows:

{{ use: text-column-type(
    prefix = ${prefix}
) }}

{{ use: link-column-type(
    prefix = ${prefix}
) }}

{{ use: image-column-type(
    prefix = ${prefix}
) }}

{{ use: video-column-type(
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