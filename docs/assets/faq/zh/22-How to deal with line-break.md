# 怎么处理换行符

## 问题描述

如何在VTable中处理换行符`\n`？

## 解决方案

在 VTable 中默认不会解析换行符，在canvas中会被绘制为一个空格。可以通过配置`enableLineBreak: true`来开启换行符解析，此时字符串中换行符会被解析为换行，字符串会被解析为多行。

```
  const option = {
    // ......
    enableLineBreak: true,
  }
```

## 相关文档

- [教程](https://www.visactor.io/vtable/option/ListTable#enableLineBreak)
- [github](https://github.com/VisActor/VTable)
