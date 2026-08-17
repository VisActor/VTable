{{ target: audio-cell-type }}

#${prefix} columns.audio(string)

指定该列或该行单元格类型为`'audio'`，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'audio'

指定该列或该行单元格类型为`'audio'`，cellType 可缺省默认为`'text'`。audio 共享 `clickToPreview` 等媒体预览配置；`keepAspectRatio`、`imageAutoSizing` 等 image 专属配置不适用于 audio。

{{ use: base-cell-type(
    prefix = '##'+${prefix}
) }}

##${prefix} clickToPreview(boolean) = true

是否开启点击预览
