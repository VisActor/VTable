{{ target: common-custom-render-object }}

ICustomRenderObj 的定义如下：

```
export type ICustomRenderObj = {
  /** 配置出来的类型集合 */
  elements: ICustomRenderElements;
  /** 期望单元格的高度 */
  expectedHeight: number;
  /** 期望单元格的宽度 */
  expectedWidth: number;
  /**
   * 是否还需要默认渲染内容 只有配置true才绘制 默认 不绘制
   */
  renderDefault?: boolean;
};
```

详细配置说明如下：

${prefix} elements (Array)

配置出来的类型集合。类型声明为:ICustomRenderElement[]。

ICustomRenderElement 的定义如下：

```
type ICustomRenderElement = TextElement | RectElement | CircleElement | IconElement | ImageElement | ArcElement | LineElement;
```

其中依据 type 属性，接下来分别介绍各种类型的具体配置信息。

${prefix} elements.text(string)

占位 TODO 第四级目录

{{ use: text-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.rect(string)

占位 TODO 第四级目录

{{ use: rect-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.circle(string)

占位 TODO 第四级目录

{{ use: circle-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.arc(string)

占位 TODO 第四级目录

{{ use: arc-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.image(string)

占位 TODO 第四级目录

{{ use: image-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.line(string)

占位 TODO 第四级目录

{{ use: line-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} elements.icon(string)

占位 TODO 第四级目录

{{ use: icon-custom-element(
  prefix = '#' + ${prefix},
) }}

${prefix} expectedHeight (number)

期望单元格的高度。

${prefix} expectedWidth (number)

期望单元格的宽度。

${prefix} renderDefault (boolean) = false

是否还需要默认渲染内容，只有配置为 true 才绘制，默认不绘制。
