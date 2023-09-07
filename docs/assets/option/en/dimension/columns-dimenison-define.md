{{ target: columns-dimension-define }}

#${prefix} columns

The style and format configuration corresponding to the header of each level of dimensions should be set separately for each dimension. The configuration items will vary slightly depending on the headerType. Supported headerType values are: `'text' | 'link' | 'image' | 'video'`. The specific configuration items for each headerType are as follows:


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