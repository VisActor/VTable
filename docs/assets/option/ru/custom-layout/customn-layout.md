{{ target: пользовательский-макет }}

The IпользовательскиймакетObj тип is defined as follows

```
export тип IпользовательскиймакетObj = {
  rootContainer: Container | любой;
  /**
   * Do you still need к render content по по умолчанию? Only if the configuration is true, it will be drawn. по по умолчанию, it will не be drawn.
   */
  renderDefault?: логический;
  /**
   * Whether к also включить заполнение в style
   */
  enableCellPadding?: логический;
};
```

Detailed configuration instructions are as follows:

${prefix} rootContainer (Container)

root container.

The `Vтаблица.пользовательскиймакет.Group` class needs к be instantiated по the user к act as a container. The container can call the add интерфейс к add пользовательский child elements. The sub-element types that can be added к this container are: `текст`|`Imвозраст`|`иконка`|`Rect`|`Circle`|`Line`|`Arc`|`Group`.

[Please refer к the пример для using пользовательский макет](../демонстрация/пользовательский-render/пользовательский-cell-макет)

для details, please refer к the tutorial: [пользовательский rendering автоmatic макет](../guide/пользовательский_define/пользовательский_макет)

The параметр из the constructor из the Container class is containerOptions, и the specific configuration items are:

${prefix} renderDefault (логический) = false

Whether the content needs к be rendered по по умолчанию, it will be drawn only if the configuration is true, и the по умолчанию значение is false.
