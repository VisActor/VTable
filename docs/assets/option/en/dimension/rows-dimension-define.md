{{ target: rows-dimension-define }}

#${prefix} rows

**The structure is the same as the list header tree structure columns configuration**

The row header corresponds to the style and format configuration of each level of dimension. Each type of dimension needs to be set separately. The configuration items have slight differences according to the headerType. The supported headerTypes are: `'text' | 'link' | 'image' | 'video'`. The specific configuration items for each headerType are as follows:


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