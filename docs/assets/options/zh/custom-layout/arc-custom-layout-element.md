{{ target: arc-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix}radius (number) 

**必填**

扇形半径。

${prefix}startDegree (number)

扇形起始角度，以角度为单位。

${prefix}endDegree (number)

扇形结束角度，以角度为单位。

${prefix}clockWise (boolean) = true

扇形方向，true 表示顺时针方向，false 表示逆时针方向，默认为 true。

${prefix}lineWidth (number)

边框宽度。

${prefix}fill (string)

填充颜色。

${prefix}stroke (string)

描边颜色。