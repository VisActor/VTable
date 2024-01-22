{{ target: image-cell-type }}

#${prefix} columns.image(string)

指定该列或该行单元格类型为`'image'`，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'image'

指定该列或该行单元格类型为`'image'`，cellType 可缺省默认为`'text'`。其他配置项如下（同样适用于类型为'video'）：

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isImage = true
) }}

##${prefix} keepAspectRatio(boolean) = false

**image 类型专属配置项** 是否保持横纵比，默认 false

##${prefix} imageAutoSizing(boolean) = false

**image 类型专属配置项** 是否按图片尺寸自动撑开单元格尺寸，默认 false

##${prefix} clickToPreview(boolean) = true

**image 类型专属配置项** 是否开启点击预览
