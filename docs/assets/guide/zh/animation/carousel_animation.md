# 表格轮播动画

VTable 提供轮播动画插件，可以实现表格的轮播滚动动画效果。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/carousel-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## 轮播动画配置项

- `CarouselAnimationPlugin`  轮播动画插件，可以配置以下参数：
  - `rowCount` 一次动画滚动的行数
  - `colCount` 一次动画滚动的列数
  - `animationDuration` 一次滚动动画的时间
  - `animationDelay` 动画间隔时间
  - `animationEasing` 动画缓动函数
  - `replaceScrollAction` 是否替换滚动行为，如果为 true ，每次滚动操作会移动对于的行数/列数

```js
const carouselAnimationPlugin = new CarouselAnimationPlugin(tableInstance, {
  rowCount: 2,
  replaceScrollAction: true
});

carouselAnimationPlugin.play();
```

具体使用参考[demo](../../demo/animation/carousel-animation)

## 轮播动画API

### play

开始轮播动画。
```
carouselAnimationPlugin.play()
```

### pause

暂停轮播动画。
```
carouselAnimationPlugin.pause()
```

### reset

重置轮播动画。
```
carouselAnimationPlugin.reset()
```
