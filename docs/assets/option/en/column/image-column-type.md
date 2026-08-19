{{ target: image-cell-type }}

#${prefix} columns.image(string)

Specify the column type as `'image'`, the default cellType is 'text'.

##${prefix} cellType(string) = 'image'

Specify the column type as `'image'`, the default cellType is `'text'`. Other configuration options are as follows; media preview options such as `clickToPreview` are also applicable to 'video' and 'audio' types:

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isImage = true
) }}

##${prefix} keepAspectRatio(boolean) = false

**Configuration specific to image type** Whether to maintain the aspect ratio, default is false.

##${prefix} imageAutoSizing(boolean) = false

**Configuration specific to image type** Whether to automatically expand the cell size according to the image size, default is false.

##${prefix} clickToPreview(boolean) = true

Whether to enable click preview.
