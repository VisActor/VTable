# 用表格组件怎么实现一个热力图？

## 问题描述

我想用表格实现一个简单的热力图，即单元格背景色的深浅由单元格的数值来决定，请问有什么比较简单的实现方式？
![image](/vtable/faq/17-0.png)

## 解决方案

VTable 可以灵活的设置每个单元格的背景色和 border 颜色，支持函数自定义方式实现。
官网热图例子：https://visactor.io/vtable/demo/business/color-level

## 代码示例

```javascript
  indicators: [
          {
            indicatorKey: '220922103859011',
            width: 200,
            showSort: false,
            format(rec){
              return Math.round(rec['220922103859011']);
            },
            style: {
              color: "white",
              bgColor: (args) => {
                return getColor(100000,2000000,args.dataValue)
              },
            },
          },
        ],
```

## 结果展示

[在线效果参考]()

![result](/vtable/faq/17-1.png)

## 相关文档

- [单元格背景色教程](https://visactor.io/vtable/guide/theme_and_style/style)
- [相关 api](https://visactor.io/vtable/option/PivotTable-indicators-text#style.bgColor)
- [github](https://github.com/VisActor/VTable)
