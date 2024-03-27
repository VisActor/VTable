{{ target: custom-layout }}

ICustomLayoutObj 类型定义如下

```
export type ICustomLayoutObj = {
  rootContainer: Container | any;
  /**
   * 是否还需要默认渲染内容 只有配置true才绘制 默认 不绘制
   */
  renderDefault?: boolean;
  /**
   * 是否还启用style中的padding
   */
  enableCellPadding?: boolean;
};
```

详细配置说明如下：

${prefix} rootContainer (Container)

根容器。

需要由用户实例化`VTable.CustomLayout.Group`类来充当容器。容器可调用 add 接口来加入自定义子元素。该容器中可加入的子元素类型有：`Text`|`Image`|`Icon`|`Rect`|`Circle`|`Line`|`Arc`|`Group`。

[自定义布局的使用可参考示例](../demo/custom-render/custom-cell-layout)

具体可参考教程：[自定义渲染自动布局](../guide/custom_define/custom_layout)

Container 类的构造函数的参数是 containerOptions，具体配置项为：

${prefix} renderDefault (boolean) = false

是否需要默认渲染内容，只有配置为 true 才绘制，默认值为 false。
