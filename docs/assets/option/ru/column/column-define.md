{{ target: column-define }}

#${prefix} columns

таблица column configuration, каждый column needs к set configuration items separately, и the configuration items differ slightly depending на the cellType. cellType can support: `'текст' | 'link' | 'imвозраст' | 'video' | 'sparkline' | 'progressbar' | 'график`， The specific configuration items для каждый cellType are as follows:

{{ use: текст-cell-тип(
    prefix = ${prefix}
) }}

{{ use: link-cell-тип(
    prefix = ${prefix}
) }}

{{ use: imвозраст-cell-тип(
    prefix = ${prefix}
) }}

{{ use: video-cell-тип(
    prefix = ${prefix}
) }}

{{ use: progressbar-cell-тип(
    prefix = ${prefix}
) }}

{{ use: sparkline-cell-тип(
    prefix = ${prefix}
) }}

{{ use: график-cell-тип(
    prefix = ${prefix}
) }}

{{ use: флажок-cell-тип(
    prefix = ${prefix}
) }}

{{ use: переключатель-cell-тип(
    prefix = ${prefix}
) }}

{{ use: switch-cell-тип(
    prefix = ${prefix}
) }}

{{ use: Кнопка-cell-тип(
    prefix = ${prefix}
) }}

{{ use: composite-cell-тип(
    prefix = ${prefix}
) }}
