# Can the VTable table component copy the contents of selected cells?

## Question Description

How can VTable enable shortcut keys to copy the contents of selected cells? Such as copying to excel.

## Solution

VTable has a special shortcut key configuration item keyboardOptions, as follows:

```javascript
{
   ...
   keyboardOptions:
   {
      /** 开启快捷键全选 默认：false */
      selectAllOnCtrlA?: boolean |SelectAllOnCtrlAOption;
      /** 快捷键复制 默认不开启*/
      copySelected?: boolean; //这个copy快捷键是和浏览器的快捷键一致的
   }
}
```

## Results

[Online demo](https://codesandbox.io/s/vtable-copy-sdwjhd)

## Quote

- [Selection Interaction Tutorial](https://visactor.io/vtable/guide/interaction/select)
- [Related api](https://visactor.io/vtable/option/ListTable#keyboardOptions.copySelected)
- [github](https://github.com/VisActor/VTable)
