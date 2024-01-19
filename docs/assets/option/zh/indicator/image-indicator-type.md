{{ target: image-indicator-type }}

#${prefix} indicators.image(string)

指定列类型为`'image'`，cellType可缺省默认为'text

##${prefix} cellType(string) = 'image'

指定列类型为`'image'`，cellType可缺省默认为`'text'`。其他配置项如下（同样适用于类型为'video'）：

{{ use: base-indicator-type(
    prefix = '##'+${prefix},
    isImage = true,
) }}

##${prefix} keepAspectRatio(boolean) = false

**image类型专属配置项**  是否保持横纵比，默认false 

##${prefix} imageAutoSizing(boolean) = false

**image类型专属配置项**  是否按图片尺寸自动撑开单元格尺寸，默认false 

##${prefix} clickToPreview(boolean) = true

**image 类型专属配置项** 是否开启点击预览