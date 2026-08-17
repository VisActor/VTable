{{ target: audio-dimension-type }}

#${prefix} ${dimensionHeaderType}.audio(string)

指定列类型为`'audio'`, headerType 可缺省默认为'text'

##${prefix} headerType(string) = 'audio'

指定列类型为`'audio'`，headerType 可缺省默认为`'text'`。audio 共享 `clickToPreview` 等媒体预览配置；`keepAspectRatio`、`imageAutoSizing` 等 image 专属配置不适用于 audio。

{{ use: base-dimension-type(
    prefix = '##'+${prefix}
) }}

##${prefix} clickToPreview(boolean) = true

是否开启点击预览
