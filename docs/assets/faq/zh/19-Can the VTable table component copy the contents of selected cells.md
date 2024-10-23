# VTable 表格组件是否可以对选中单元格内容进行复制？

## 问题描述

VTable 怎么可以开启快捷键复制所选单元格内容？如复制到 excel 中。

## 解决方案

VTable 有专门的快捷键配置项 keyboardOptions，具体如下：

```javascript
{
   ...
   keyboardOptions:
   {
      /** 开启快捷键全选 默认：false */
      selectAllOnCtrlA?: boolean | SelectAllOnCtrlAOption;
      /** 快捷键复制 默认不开启*/
      copySelected?: boolean; //这个copy快捷键是和浏览器的快捷键一致的
   }
}
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-copy-sdwjhd)

## 相关文档

- [选择交互教程](https://visactor.io/vtable/guide/interaction/select)
- [相关 api](https://visactor.io/vtable/option/ListTable#keyboardOptions.copySelected)
- [github](https://github.com/VisActor/VTable)
