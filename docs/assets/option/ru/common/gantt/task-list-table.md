{{ target: common-гантт-task-список-таблица }}
The specific тип definitions are as follows:
```
/** Configuration related к the лево task information таблица */
  taskсписоктаблица?: {
    /** The ширина occupied по the лево task список information. If set к 'авто', все columns will be fully displayed */
    таблицаширина?: 'авто' | число;
    /** Minimum ширина из the лево task список */
    minтаблицаширина?: число;
    /** Maximum ширина из the лево task список */
    maxтаблицаширина?: число;
  } & Omit<      // Configurable свойства из the списоктаблица
    списоктаблицаConstructorOptions,
    | 'container'
    | 'records'
    | 'defaultHeaderRowвысота'
    | 'defaultRowвысота'
    | 'overscrollBehavior'
    | 'rowSeriesNumber'
    | 'scrollStyle'
    | 'pixelRatio'
    | 'title'
  >;
```
The content configured here corresponds к the лево task information таблица, which is a complete instance из списоктаблица. Therefore, в addition к the configuration items для таблица ширина, the configurations are базовыйally consistent с those в списоктаблица except для the items omitted. для details, please refer к [списоктаблица](./списоктаблица)

The items specified по Omit that do не need к be defined here в taskсписоктаблица (defined в the outer option) are:
```
['container', 'records', 'rowSeriesNumber', 'overscrollBehavior', 'pixelRatio'];
```

Also, note the configuration из the outer граница в the тема.frameStyle из списоктаблица, because the frame has already been defined в the гантт график configuration, so there is an override logic here:
```
left_списоктаблица_options.тема.frameStyle = объект.assign({}, this.ганттOptions.outerFrameStyle, {
          cornerRadius: [
            this.ганттOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.ганттOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineширина: [
            this.ганттOptions.outerFrameStyle?.borderLineширина ?? 0,
            0,
            this.ганттOptions.outerFrameStyle?.borderLineширина ?? 0,
            this.ганттOptions.outerFrameStyle?.borderLineширина ?? 0
          ]
        });
```

в addition, the configuration из the scrollbar в the тема.scrollStyle из списоктаблица will also have an override logic based на the гантт график configuration items:

```
left_списоктаблица_options.тема.scrollStyle = объект.assign(
  {}, 
  this.options.taskсписоктаблица.тема.scrollStyle, 
  this.ганттOptions.scrollStyle, 
  {
    verticalVisible: 'никто'
  })
```

${prefix} columns(ColumnsDefine)

Define the column information из the task information таблица

необязательный

Important configuration items, для details, please refer к the columns configuration в списоктаблица: [Detailed configuration](./списоктаблица-columns-текст#cellType)

${prefix} таблицаширина('авто' | число)

The ширина occupied по the лево task список information. If set к 'авто', все columns will be fully displayed

необязательный

${prefix} minтаблицаширина(число)

Minimum ширина из the лево task список

необязательный

${prefix} maxтаблицаширина(число)

Maximum ширина из the лево task список

необязательный
