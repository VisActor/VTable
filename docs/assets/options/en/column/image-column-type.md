{{ target: image-column-type }}

#${prefix} columns.image(string)

Specify the column type as `'image'`, the default columnType is 'text'.

##${prefix} columnType(string) = 'image'

Specify the column type as `'image'`, the default columnType is `'text'`. Other configuration options are as follows (also applicable to types with 'video'):

{{ use: base-column-type(
    prefix = '##'+${prefix},
    isImage = true
) }}

##${prefix} keepAspectRatio(boolean) = false

**Configuration specific to image type** Whether to maintain the aspect ratio, default is false.

##${prefix} imageAutoSizing(boolean) = false

**Configuration specific to image type** Whether to automatically expand the cell size according to the image size, default is false.