{{ target: таблица-сводныйтаблица }}

# сводныйтаблица

сводный таблица, configure the corresponding тип сводныйтаблицаConstructorOptions, с specific options as follows:

{{ use: common-option-important(
    prefix = '#',
    таблицаType = 'сводныйтаблица'
) }}

## records(массив)

tabular данные.
Currently, it supports incoming flattened данные formats, taking the Продажи из large supermarkets в North America as an пример:

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

## данныеConfig(IданныеConfig)

данные analysis related configuration .

```
/**
 * данные processing configuration
 */
export интерфейс IданныеConfig {
  aggregationRules?: AggregationRules; //Aggregation значение calculation rules according к row и column dimensions;
  сортировкаRules?: сортировкаRules; //сортировка rules;
  filterRules?: FilterRules; //Filter rules;
  totals?: Totals; //Subtotal или total;
  /**
   * в present, mapping is не easy к use. It is не recommended к use it. It is recommended к use style первый.
   */
  mappingRules?: MappingRules;
  derivedполеRules?: DerivedполеRules;
  /**
   * Whether к update total и subtotal after editing.
   * @по умолчанию false
   */
  updateAggregationOnEditCell?: логический;
}
```

### aggregationRules(AggregationRules)

Find the aggregation method из indicators; the specific definition из AggregationRules is as follows:

```
export тип AggregationRules = AggregationRule<AggregationType>[];

export интерфейс AggregationRule<T extends AggregationType> {
  /** Different от поле, re-create the key значение для use по configuring indicators */
  indicatorKey: строка;
  // Вы можете collect the aggregate results из a single поле, или collect the aggregate results из multiple полеs
  поле: T extends AggregationType.RECORD ? строка[] | строка : строка;
  aggregationType: T;
  /**Formatting calculation results */
  formatFun?: (num: число) => строка;
  /** when aggregationType set AggregationType.пользовательский，please set this aggregationFun。*/
  aggregationFun?: T extends AggregationType.пользовательский ? (values: любой[], records: любой[]) => любой : undefined;
}
```

Among them, the AggregationType aggregation методы include Следующий 6 types, the most commonly used one is SUM. The RECORD тип is mainly used internally по perspectives.

```
export enum AggregationType {
  RECORD = 'RECORD',
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  AVG = 'AVG',
  COUNT = 'COUNT',
  никто = 'никто',
  пользовательский = 'пользовательский'
}
```

в addition к the several built-в aggregation методы mentioned above в Vтаблица, it also supports регистрацияing и defining aggregation методы. к use пользовательский aggregation types, you need к первый define a пользовательский aggregation class, inherit the built-в Aggregator class, регистрация it в Vтаблица, и then implement the aggregation logic в the пользовательский aggregation class. для details, please refer к the [демонстрация](../демонстрация/данные-analysis/сводный-analysis-пользовательскийAggregator)

### сортировкаRules(сортировкаRules)

сортировкаing rule configuration, specifically defined as follows:

```
export тип сортировкаRules = сортировкаRule[];
export тип сортировкаRule = сортировкаTypeRule | сортировкаByRule | сортировкаByIndicatorRule | сортировкаFuncRule;
```

The сортировкаing rules support four методы:

1. сортировкаTypeRule: сортировкаs по поле, such as сортировкаing по year в ascending порядок: `{"сортировкаполе": "Year", "сортировкаType": "ASC"}`. ASC DESC сортировкаs в ascending или descending order according к the natural order из pinyin или numbers, и NORMAL сортировкаs according к the order в records.

```
//1. Specify the сортировка тип
export интерфейс сортировкаTypeRule {
  /**сортировкаing dimension */
  сортировкаполе: строка;
  /**Ascending или descending order ASC или DESC NORMAL*/
  сортировкаType?: сортировкаType;
}
```

2. сортировкаByRule: сортировкаs по specifying the order из dimension members, such as сортировкаing по Регион dimension values: `{"сортировкаполе": "Регион", "сортировкаBy": ["华南","华中","华北","中南","西南"]}`. ASC DESC сортировкаs в ascending или descending order according к the order specified по сортировкаBy, и NORMAL сортировкаs according к the order в records.

```
//2. сортировка по specifying the order из dimension members
export интерфейс сортировкаByRule {
  /**сортировкаing dimension */
  сортировкаполе: строка;
  /**сортировка по specifying a specific order */
  сортировкаBy?: строка[];
  /**Ascending или descending order ASC или DESC NORMAL*/
  сортировкаType?: сортировкаType;
}
```

3. сортировкаByIndicatorRule: сортировкаs по indicator values, such as сортировкаing по the Продажи amount из the office Категория в descending order к сортировка the Регион dimension values: `{сортировкаполе:'Регион', сортировкаByIndicator: "Продажи", сортировкаType: "DESC", query:['办公用品']}`. ASC DESC сортировкаs в ascending или descending order according к the indicator значение specified по сортировкаBy, и NORMAL сортировкаs according к the order в records.

```
//3. сортировка по indicator values
export интерфейс сортировкаByIndicatorRule {
  /**сортировкаing dimension */
  сортировкаполе: строка;
  /**Ascending или descending order ASC или DESC NORMAL*/
  сортировкаType?: сортировкаType;
  /**сортировка по a specific indicator значение */
  сортировкаByIndicator?: строка;
  /**If сортировкаing по indicator values, another dimension member значение (row или column) needs к be specified. для пример, сортировкаing по office supplies ['办公用品', '纸张'] */
  query?: строка[];
}
```

4. сортировкаFuncRule: Supports пользовательский сортировкаing rules through functions, such as сортировкаing по calculated indicator values: `{"сортировкаполе": "Регион", сортировкаFunc: (a, b) => a.Продажи - b.Продажи}`. ASC DESC NORMAL все follow the сортировкаing logic в сортировкаFunc.

```
//4. пользовательский сортировкаing функция
export интерфейс сортировкаFuncRule {
  /**сортировкаing dimension */
  сортировкаполе: строка;
  /**пользовательский сортировкаing функция */
  сортировкаFunc?: (a: любой, b: любой) => число;
  /**Ascending или descending order ASC или DESC NORMAL*/
  сортировкаType?: сортировкаType;
}
```

### filterRules(FilterRules)

данные filtering rules, specific тип definition:

```
export тип FilterRules = FilterRule[];
```

Multiple filtering rules can be set, и данные will be retained only if каждый filtering rule is met.

```
//#Регион filter rules
export интерфейс FilterRule {
  filterKey?: строка;
  filteredValues?: unknown[];
  filterFunc?: (row: Record<строка, любой>) => логический;
}
```

### totals(Totals)

Set up totals, subtotals, и grand totals.

```
export интерфейс Totals {
  row?: Total & {
    showGrandTotalsOnTop?: логический;
    showSubTotalsOnTop?: логический;
  };
  column?: Total & {
    showGrandTotalsOnLeft?: логический;
    showSubTotalsOnLeft?: логический;
  };
}
```

Row или column методы set summary rules respectively:

```
export интерфейс Total {
  // Whether к display the total
  showGrandTotals: логический;
  // Whether к display subtotals
  showSubTotals: логический;
  // Subtotal summary dimension definition
  subTotalsDimensions?: строка[];
  //по умолчанию 'total'
  grandTotalLabel?: строка;
  //по умолчанию 'Subtotal'
  subTotalLabel?: строка;
}
```

### derivedполеRules(DerivedполеRules)

Add a derived поле. The vтаблица will generate a новый поле based на the rules defined по the derived поле и add the новый поле к the данные. The новый поле can be used as a dimension item или an indicator item.

```
export тип DerivedполеRules = DerivedполеRule[];
```

The specific функция is к generate новый полеs для source данные, which is пользовательскийized по the user. This функция mainly adds a новый поле к каждый piece из данные. This поле can be used в other данные rules, such as сортировка или as indicators или columns. из a certain dimension.

```
export интерфейс DerivedполеRule {
  полеимя?: строка;
  derivedFunc?: (record: Record<строка, любой>) => любой;
}
```

### calculatedполеRules (CalculatedполеRules)

Calculated полеs are similar к the calculated полеs в Excel сводный таблицаs. новый indicator values can be calculated through calculated полеs, и they are все recalculated based на the summary results. Note: Different от derived полеs.

```
export тип CalculateddполеRules = CalculateddполеRule[];
```

```
export интерфейс CalculatedполеRule {
  /** Unique identifier, which can be used as the key из a новый indicator и used к configure indicators к be displayed в a сводный таблица. */
  key: строка;
  /** The indicator that the calculated поле depends на, which can be the corresponding indicator поле в records или не the поле в данные records
  * If the dependent indicator is не в records, it needs к be explicitly configured в aggregationRules, specifying the aggregation rule и indicatorKey к be used в dependIndicatorKeys. */
  dependIndicatorKeys: строка[];
  /** The calculation функция из the calculated поле. The dependent indicator значение is passed в as a параметр, и the возврат значение is used as the значение из the calculated поле. */
  calculateFun?: (dependполеsValue: любой) => любой;
}
```
### updateAggregationOnEditCell (логический)

Whether к update total и subtotal after editing cell значение. по умолчанию значение is false.

для details, please refer к the [демонстрация](../демонстрация/данные-analysis/сводный-analysis-updateTotalданные)

## columnTree(массив)

Column header tree, тип: `(IDimensionHeaderNode|IIndicatorHeaderNode)[]`. Among them, IDimensionHeaderNode refers к the dimension значение node из non-indicator dimensions, и IIndicatorHeaderNode refers к the indicator имя node.

** Specific configuration из IDimensionHeaderNode is as follows: **

```
export интерфейс IDimensionHeaderNode {
  /**
   * Unique identifier из the dimension, corresponding к the поле имя в the данныеset
   */
  dimensionKey: строка | число;
  /** Dimension member значение */
  значение: строка;
  /** The tree structure из the sub-dimensions under the member. true is generally used к display the fold и развернуть Кнопкаs и к perform lazy загрузка к obtain данные.  */
  children?: (IDimensionHeaderNode|IIndicatorHeaderNode)[] | true;
  /** свернуть status Used с tree structure display. Note: only valid в rowTree */
  hierarchyState?: HierarchyState;
  /** Whether it is a virtual node. If configured к true, this dimension поле will be ignored when analyzing based на records данные */
  virtual?: логический;
  /** Merge display из this dimension значение across cells, по умолчанию is 1. If the maximum число из header levels is 5, then the последний level will merge as many cells as there are levels лево. */
  levelSpan?: число;
}
```

** Specific configuration из IIndicatorHeaderNode is as follows: **

```
export интерфейс IIndicatorHeaderNode {
  /**
   * The key значение из the indicator corresponds к the поле имя в the данныеset
   */
  indicatorKey: строка | число;
  /**
   * Indicator имя, such as: "Продажи Amount", "пример", corresponding к the значение displayed в the cell. необязательный, if не filled в, the значение will be taken от the corresponding configuration в indicators
   */
  значение?: строка;
  /** Merge display из this dimension значение across cells, по умолчанию is 1. If the maximum число из header levels is 5, then the последний level will merge as many cells as there are levels лево. */
  levelSpan?: число;
  /** Whether к скрыть this indicator node */
  скрыть?: логический;
}
```

## rowTree(массив)

Row header tree, с a structure similar к columnTree.

{{ use: columns-dimension-define( prefix = '#',) }}

{{ use: rows-dimension-define( prefix = '#',) }}

{{ use: indicators-define( prefix = '#',) }}

## indicatorsAsCol(логический) = true

The indicator is displayed на the column, по умолчанию is true. If configured к false, it will be displayed в rows и the indicator will be displayed в rows.

## rowHierarchyType('grid' | 'tree' | 'grid-tree')

Hierarchy display style для dimensional structure, flat или tree.

[Flat пример](../демонстрация/таблица-тип/сводный-таблица) [Tree пример](../демонстрация/таблица-тип/сводный-analysis-таблица-tree) [Grid Tree пример](../демонстрация/таблица-тип/сводный-analysis-таблица-grid-tree)

{{ use: extension-rows-dimension-define( prefix = '#',) }}

## rowExpandLevel(число)

Initial expansion level. в addition к configuring the expansion level из the unified node here, Вы можете also set the expansion status из каждый node с the configuration item `hierarchyState`.

## rowHierarchyIndent(число)

If tree display is set, the indentation distance из content displayed в the child cell compared к its parent cell content.

## rowHierarchyTextStartAlignment(логический) = false

Whether nodes в the same level are aligned по текст, such as nodes без collapsed expansion иконкаs и nodes с иконкаs. по умолчанию is false

## columnHierarchyType('grid' |'grid-tree')

Hierarchical dimension structure display style в column headers, flat или tree structure.

## columnExpandLevel(число)

Initial expansion level для column headers, по умолчанию is 1.

## indicatorTitle(строка)

Indicator title used к display the значение в the corner header

## corner(объект)

Corner header configuration и пользовательский styles.
{{ use: сводный-corner-define( prefix = '###',) }}

## hideIndicatorимя(логический) = false

Whether к скрыть the indicator имя

## showRowHeader(логический) = true

Whether к display the row header.

## showColumnHeader(логический) = true

Whether к display the column header.

## rowHeaderTitle(объект)

Add a row в the row header к display the dimension имя, which can be пользовательскийized или display the title combined имя

{{ use: сводный-header-title( prefix = '###',) }}

## columnHeaderTitle(объект)

Add a row в the column header к display the dimension имя, which can be пользовательскийized или display the title combined имя

{{ use: сводный-header-title( prefix = '###',) }}

## сводныйсортировкаState(массив)

Set the сортировкаing state, only corresponding к the display effect из the Кнопка без данные сортировкаing logic

```
 {
    dimensions: IDimensionInfo[];
    порядок: 'desc' | 'asc' | 'normal';
  }[];
```

- dimensions Set the dimensions к be сортировкаed, which is an массив из IDimensionInfo тип.

{{ use: common-IDimensionInfo()}}

- order specifies the сортировкаing method, which can be 'desc' (descending), 'asc' (ascending) или 'normal' (unсортировкаed).

{{ use: common-option-secondary(
    prefix = '#',
    таблицаType = 'сводныйтаблица'
) }}

## supplementIndicatorNodes(логический) = true

Whether к add index nodes к the corresponding пользовательский таблица headers such as rowTree или columnTree. по умолчанию is true

## parseпользовательскийTreeToMatchRecords(логический) = true

If you have configured rowTree или columnTree и it is a non-regular tree structure, you need к turn на this configuration к match the corresponding данные record.

The regular tree structure refers к: the nodes на the same layer have the same dimension keys.

The non-regular tree structure is the tree where nodes на the same layer exist с different dimension values.

## columnширинаConfig(массив)

Set column ширина based на dimension information

```
{
  dimensions: IDimensionInfo[];
  ширина: число;
}[];
```

- dimensions The dimension information из каждый level из the dimension is an массив из IDimensionInfo тип. The vтаблица will locate the specific column according к this path.
  {{ use: common-IDimensionInfo()}}

-ширина specifies the column ширина.
