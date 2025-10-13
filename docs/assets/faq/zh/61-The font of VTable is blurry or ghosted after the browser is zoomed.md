---
title: 39. VTable经过浏览器缩放后字体模糊或者重影</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---

## 问题标题

如何解决 VTable 经过浏览器缩放后字体模糊或者重影？</br>

## 问题描述

使用 VTable 表格组件，并且在浏览器中进行缩放比例，字体变成模糊，一般是因为自适应高度(flex-1)造成</br>

## 解决方案

VTable 提供`setPixelRatio`API，再结合外层包裹的 dom 的尺寸变化监听解决问题</br>
核心就是将包裹的高度设置为表格的高度（不携带小数点），并且是能被缩放比例整除的整数，这意味着在缩放的情况下需要缩小表格高度</br>

### 代码应用(Vue3 为例)

```
<div class="flex flex-1 overflow-hidden relative" ref="tableWrapperRef">
  <ListTable :style="tableHeight ? { height: `${tableHeight}px` } : {}" @onReady="onReady" ... />
</div>

<script setup>
const tableWrapperRef = shallowRef<HTMLDivElement>()
const tableInstance = shallowRef<any>()
const tableHeight = ref<number>(0)

const resizeObserver = new ResizeObserver(([entry]) => {
  if (window.devicePixelRatio < 1) {
    const height = entry.target.clientHeight
    const ratio = Math.round(window.devicePixelRatio * 100) / 100
    tableHeight.value = height - (height % 10)
    setTimeout(() => {
      tableInstance.value.setPixelRatio(window.devicePixelRatio > 0.7 ? ratio : 1)
    }, 400)
  }
})
const onReady = (instance) => {
  tableInstance.value = instance
  resizeObserver.observe(tableWrapperRef.value)
}

onBeforeUnmount(() => {
  resizeObserver.unobserve(tableWrapperRef.value)
})
</script>
```

### 效果展示

第一列为 dom 渲染，可作为效果参考</br>

<img src="/vtable/faq/61-1.gif" alt="Description" height="500">

## 相关文档

相关 api：https://visactor.io/vtable/api/Methods#setPixelRatio</br>
github：https://github.com/VisActor/VTable</br>
