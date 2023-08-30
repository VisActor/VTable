{{ target: image-column-type }}

#${prefix} columns.image(string)

指定列类型为`'image'`，columnType 缺省的话会被默认为'text'

##${prefix} columnType(string) = 'image'

指定列类型为`'image'`，columnType 可缺省默认为`'text'`。其他配置项如下（同样适用于类型为'vidio'）：

{{ use: base-column-type(
    prefix = '##'+${prefix},
    isImage = true
) }}

##${prefix} keepAspectRatio(boolean) = false

**image 类型专属配置项** 是否保持横纵比，默认 false

##${prefix} imageAutoSizing(boolean) = false

**image 类型专属配置项** 是否按图片尺寸自动撑开单元格尺寸，默认 false
