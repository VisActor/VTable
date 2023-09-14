{{ target: indicators-define }}

#${prefix} indicators

The specific configuration of each indicator in the pivot table, such as style, format, title, etc., needs to be separately set for each type of indicator. The configuration items vary slightly according to the different `cellType`. `cellType` can support: `'text' | 'link' | 'image' | 'video' | 'progressbar' | 'sparkline'`. The specific configuration items for each `cellType` are as follows:

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