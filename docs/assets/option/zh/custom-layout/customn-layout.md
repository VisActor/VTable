{{ target: custom-layout }}

ICustomLayoutObj定义为：

${prefix} rootContainer (Container)

根容器。

Container是一个类，需要由用户实例化来充当容器。容器可调用add接口来加入自定义子元素。该容器中可加入的子元素类型有：`Text`|`Image`|`Icon`|`Rect`|`Circle`|`Line`|`Arc`|`Group`。[自定义布局的使用可参考示例](../demo/custom-render/custom-cell-layout)

Container类的构造函数的参数是containerOptions，具体配置项为：

{{ use: container-custom-layout-element(
    prefix =  '#'+${prefix},
) }}

${prefix} renderDefault (boolean) = false

是否需要默认渲染内容，只有配置为 true 才绘制，默认值为 false。