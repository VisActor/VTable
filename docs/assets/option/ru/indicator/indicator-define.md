{{ target: indicators-define }}

#${prefix} indicators

The specific configuration из каждый indicator в the сводный таблица, such as style, format, title, etc., needs к be separately set для каждый тип из indicator. The configuration items vary slightly according к the different `cellType`. `cellType` can support: `'текст' | 'link' | 'imвозраст' | 'video' | 'progressbar' | 'sparkline'`. The specific configuration items для каждый `cellType` are as follows:

{{ use: текст-indicator-тип(
    prefix = ${prefix}) }}

{{ use: link-indicator-тип(
    prefix = ${prefix}) }}

{{ use: imвозраст-indicator-тип(
    prefix = ${prefix}) }}

{{ use: video-indicator-тип(
    prefix = ${prefix}) }}

{{ use: progressbar-indicator-тип(
    prefix = ${prefix}) }}

{{ use: sparkline-indicator-тип(
    prefix = ${prefix}) }}

{{ use: график-indicator-тип(
    prefix = ${prefix}) }}