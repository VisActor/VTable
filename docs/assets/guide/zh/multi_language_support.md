# 多语言支持

## 文字测量

为了提升表格的性能，VTable使用一种快速文字测量方案[@visactor/vutils TextMeasure](https://github.com/VisActor/VUtil/blob/main/packages/vutils/src/graphics/text/measure/textMeasure.ts)，这种文字测量方式对英文字母和全角等宽字符支持较好，但对于部分语言文字可能导致测量误差，渲染效果不正确。对于多语言支持的问题，有两种支持方案：

## 字母文字支持方案

VTable类提供了方法`setCustomAlphabetCharSet`，供用户将需要测量的字母配置到测量工具的字母表中，在创建表格实例前执行，可以让字母表中的文字被正确测量。以西里尔文为例：

```js
VTable.setCustomAlphabetCharSet('БВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯбвгдежзийклмнопрстуфхцчшщъыьэюя');
```

## 象形文字支持方案

对于没有字母表的文字，VTable提供了文字测量的降级方法`restoreMeasureText`，在创建表格实例前执行，可以从快速文字测量方案还原到canvas提供的`measureText`，这样会使文字测量的性能有部分下降，但是可以支持所有canvas可以测量的文字。

```js
VTable.restoreMeasureText();
```
