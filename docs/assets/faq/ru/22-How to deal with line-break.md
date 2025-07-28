# How to deal with line-break

## Problem Description

How to handle newline character `\n` in VTable?

## solution

Line breaks are not parsed by default in VTable and will be drawn as a space in canvas. You can enable newline parsing by configuring `enableLineBreak: true`. At this time, the newline characters in the string will be parsed into newlines, and the string will be parsed into multiple lines.

```
   const option = {
     //......
     enableLineBreak: true,
   }
```

## Related documents

- [Tutorial](https://www.visactor.io/vtable/option/ListTable#enableLineBreak)
- [github](https://github.com/VisActor/VTable)