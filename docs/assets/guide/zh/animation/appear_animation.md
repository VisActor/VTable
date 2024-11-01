# 表格入场动画

VTable 提供入场动画功能，支持在表格初始化时展示渐入效果，支持配置动画的方向、时长、延迟等。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/appear-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## 入场动画配置项

option中`animationAppear`为入场动画的配置项，目前支持如下各项配置：

可以配置true开启默认动画，也可以配置动画的参数：
- `type` 入场动画的类型，目前支持 `all` 和 `one-by-one`两种，默认为 `one-by-one`
- `direction` 入场动画的方向，目前支持 `row` 和 `column`两种，默认为 `row`
- `duration` 单个动画的时长，单位为毫秒，`one-by-one` 时，为一次动画的时长，默认为 500
- `delay` 动画的延迟，单位为毫秒；`one-by-one` 时为两次动画直接的时间差，`all` 时为所有动画的延迟，默认为 0

具体使用参考[demo](../../demo/animation/appear-animation)