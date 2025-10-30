{{ target: таблица-списоктаблица }}

# списоктаблица

A базовый таблица, configures the corresponding списоктаблицаConstructorOptions тип, specific configuration items are as follows:

{{ use: common-option-important(
    prefix = '#',
    таблицаType = 'списоктаблица'
) }}

## records(массив)

tabular данные.
Currently supported данные formats, taking human information as an пример:

```
[
  {"имя": "Zhang San","возраст": 20,"sex": "male","phone": "123456789","address": "Haidian District, Beijing"},
  {"имя": "Li Si","возраст": 30,"sex": "female","phone": "23456789","address": "Haidian District, Beijing"},
  {"имя": "Wang Wu","возраст": 40,"sex": "male","phone": "3456789","address": "Haidian District, Beijing"}
]

{{ use: column-define( prefix = '#',) }}


## transpose(логический) = false

Whether к transpose, по умолчанию is false

## showHeader(логический) = true

Whether к display the таблица header.


## pagination(IPagination)

Pagination configuration.

The базовый таблица и Vтаблица данные analysis сводный таблица support paging, but the сводный combination график does не support paging.

The specific types из IPagination are as follows:

### totalCount (число)

The total число из данные items.

не обязательный! This поле Vтаблица в the сводный таблица will be автоmatically supplemented к help users obtain the total число из данные items

### perPвозрастCount (число)

Display the число из данные items per pвозраст.

Note! The perPвозрастCount в the сводный таблица will be автоmatically corrected к an integer multiple из the число из indicators.

### currentPвозраст (число)
текущий pвозраст число.

## multipleсортировка (логический)
Enables сортировкаing по multiple columns.

## сортировкаState(сортировкаState | сортировкаState[])

сортировкаing state. сортировкаState is defined as follows:

```

сортировкаState {
/** сортировкаing criterion поле \*/
поле: строка;
/** сортировкаing rule \*/
порядок: 'desc' | 'asc' | 'normal';
}

```


{{ use: common-option-secondary(
    prefix = '#',
    таблицаType = 'списоктаблица'
) }}
```

## hierarchyIndent(число)

When displayed as a tree structure, the indentation значение из каждый layer из content.

## hierarchyExpandLevel(число)

When displayed as a tree structure, the число из levels is expanded по по умолчанию. The по умолчанию значение is 1, which only displays the root node. If configured к `Infinity`, все nodes will be expanded.

## hierarchyTextStartAlignment(логический) = false

Whether nodes в the same level are aligned по текст, such as nodes без collapsed expansion иконкаs и nodes с иконкаs. по умолчанию is false

## headerHierarchyType('grid-tree')

Defines the hierarchy display mode для headers. When set к 'grid-tree', it enables tree-style развернуть/свернуть функциональность в the header structure.

## headerExpandLevel(число)

Sets the initial expansion level из headers. Defaults к 1.

## aggregation(Aggregation|пользовательскийAggregation|массив|функция)

данные aggregation summary analysis configuration, global configuration, каждый column will have aggregation logic, it can also be configured в the column (columns) definition, the configuration в the column has a higher priority.

```
aggregation?:
    | Aggregation
    | пользовательскийAggregation
    | (Aggregation | пользовательскийAggregation)[]
    | ((args: {
        col: число;
        поле: строка;
      }) => Aggregation | пользовательскийAggregation | (Aggregation | пользовательскийAggregation)[] | null);
```

Among them:

```
тип Aggregation = {
  aggregationType: AggregationType;
  showOnTop?: логический;
  formatFun?: (значение: число, col: число, row: число, таблица: Baseтаблицаапи) => строка | число;
};

тип пользовательскийAggregation = {
  aggregationType: AggregationType.пользовательский;
  aggregationFun: (values: любой[], records: любой[]) => любой;
  showOnTop?: логический;
  formatFun?: (значение: число, col: число, row: число, таблица: Baseтаблицаапи) => строка | число;
};
```

## showAggregationWhenEmpty(логический)

Display aggregation result when данные is empty.

## groupBy(строка|строка[])

включить the group display функция к display the hierarchical structure из the group полеs в the данные. The значение is the group поле имя, which can be configured as one поле или an массив из multiple полеs.

## enableTreeStickCell(логический) = false

включить the group title sticking функция.

## groupTitleполеFormat(функция)

пользовательскийize the group title.

## groupTitleпользовательскиймакет(пользовательскиймакет)

пользовательскийize the group title макет.

## пользовательскийComputeRowвысота(функция)

код Vтаблица internally calculates the row высота. Users can пользовательскийize the method для calculating row высота.If число is returned, it is the line высота, if авто is returned, it is the автоmatic line высота, и undefined is the по умолчанию line высота.

```
пользовательскийComputeRowвысота?: (computeArgs: { row: число; таблица: списоктаблицаапи }) => число|'авто'|undefined;
```

## таблицаSizeAntiJitter(логический) = false

If the таблица jitter occurs, check whether the ширина и высота из the upper dom container are caused по decimal numbers. If it is не guaranteed к be an integer, set this configuration item к true
