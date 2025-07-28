{{ target: таблица-сводныйграфик }}

#сводныйграфик

сводный таблица, configure the corresponding тип сводныйграфикConstructorOptions, the specific configuration items are as follows:

{{ use: common-option-important(
    prefix = '#',
    таблицаType = 'сводныйграфик'
) }}

## records(массив)

tabular данные.
The currently supported данные formats are, taking the Продажи из large supermarkets в North America as an пример:

```
[
  {
    "Категория": "Technology",
    "Продажи": "650.5600051879883",
    "Город": "Amarillo"
  },
  {
    "Категория": "Technology",
    "Прибыль": "94.46999931335449",
    "Город": "Amarillo"
  },
  {
    "Категория": "Furniture",
    "Количество": "14",
    "Город": "Amarillo"
  },
  {
    "Категория": "Furniture",
    "Продажи": "3048.5829124450684",
    "Город": "Amarillo"
  },
  {
    "Категория": "Furniture",
    "Прибыль": "-507.70899391174316",
    "Город": "Amarillo"
  },
  {
    "Категория": "Office Supplies",
    "Количество": "60",
    "Город": "Anaheim"
  }
]
```

## columnTree(массив)

список header tree, тип:`(IDimensionHeaderNode|IIndicatorHeaderNode)[]`. Among them, IDimensionHeaderNode refers к the dimension значение node из the dimension non-indicator, и IIndicatorHeaderNode refers к the indicator имя node.

** The specific configuration items из IDimensionHeaderNode are as follows:**

```
export интерфейс IDimensionHeaderNode {
  /**
   * The unique identifier из the dimension, corresponding к the поле имя из the данныеset
   */
  dimensionKey: строка | число;
  /** dimension member значение */
  значение: строка;
  /** Subdimension tree structure under dimension members. */
  children?: (IDimensionHeaderNode|IIndicatorHeaderNode)[] ;
  /** The collapsed state is used с the tree structure display. Note: only valid в rowTree */
  hierarchyState?: HierarchyState;
  /** Merge display из this dimension значение across cells, по умолчанию is 1. If the maximum число из header levels is 5, then the последний level will merge as many cells as there are levels лево. */
  levelSpan?: число;
}
```

** IIndicatorHeaderNode specific configuration items are as follows:**

```
export интерфейс IIndicatorHeaderNode {
  /**
   * The key значение из the indicator corresponds к the поле имя из the данные set
   */
  indicatorKey: строка | число;
  /**
   * Indicator имяs such as: "Продажи", "для пример", correspond к the значение displayed в the cell. Вы можете leave it blank, if you don’t fill it в, take the значение от the corresponding configuration из the indicators и display it
   */
  значение?: строка;
  /** Merge display из this dimension значение across cells, по умолчанию is 1. If the maximum число из header levels is 5, then the последний level will merge as many cells as there are levels лево. */
  levelSpan?: число;
}
```

##rowTree(массив)

Row header tree, same structure as columnTree.

{{ use: columns-dimension-define( prefix = '#',) }}

{{ use: rows-dimension-define( prefix = '#',) }}

## indicators(массив)

The specific configuration из каждый indicator в the perspective combination график, such as style, format, title, etc., is different от the сводный таблица. The indicator тип here only supports the configuration из the график тип.

{{ use: график-indicator-тип(
    prefix = '#') }}

## indicatorsAsCol(логический) = true

The indicator is displayed на the column, по умолчанию is true. If configured к false, it will be displayed в rows и the indicator will be displayed в rows.

## indicatorTitle(строка)

indicator header для displaying the значение к the corner header

## corner(объект)

The configuration и style пользовательскийization из the corner таблица header.
{{ use: сводный-corner-define( prefix = '###',) }}

## hideIndicatorимя(логический) = false

Whether к скрыть the indicator имя

## showRowHeader(логический) = true

Whether к display row headers.

## showColumnHeader(логический) = true

Whether к показать column headers.

##rowHeaderTitle(объект)

Add a line к the верх из the row header к display the dimension имя, which can be пользовательскийized или display the combination имя из title

{{ use: сводный-header-title( prefix = '###',) }}

## columnHeaderTitle(объект)

Add a line к the верх из the column header к display the dimension имя, which can be пользовательскийized или display the combination имя из title

{{ use: сводный-header-title( prefix = '###',) }}

## renderграфикAsync(логический)

Whether к включить asynchronous rendering из графикs

## renderграфикAsyncBatchCount(число)

Turn на asynchronous rendering из графикs. The число из progressively rendered графикs в каждый batch is recommended к be 5-10. The details can be adjusted depending на the overall effect. по умолчанию значение is 5.

{{ use: common-option-secondary(
      prefix = '#',
      таблицаType = 'сводныйграфик'
  ) }}
