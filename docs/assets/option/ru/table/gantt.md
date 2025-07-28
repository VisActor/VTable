{{ target: гантт }}

# гантт

гантт график configuration, corresponding тип is ганттConstructorOptions, specific configuration items are as follows:

## records(массив)

данные collection.

необязательный

## taskсписоктаблица(объект)

Configuration related к the task список таблица на the лево.

необязательный

{{ use: common-гантт-task-список-таблица(prefix = '###') }}

## timelineHeader(объект)

Time scale configuration.

```
  {
    backgroundColor?: строка;
    colширина?: число;
    /** Vertical line style */
    verticalLine?: ILineStyle;
    /** Horizontal line style */
    horizontalLine?: ILineStyle;
    scales: ITimelineScale[];
  }
```

### backgroundColor(строка)

Time scale фон цвет.

### colширина(число)

Column ширина.

### verticalLine(ILineStyle)

Vertical line style.

{{ use: common-гантт-line-style }}

### horizontalLine(ILineStyle)

Horizontal line style.

{{ use: common-гантт-line-style }}

### scales(массив<ITimelineScale>)

Time scale configuration массив.

{{ use: common-гантт-timeline-scale( prefix = '####') }}

## taskBar(объект)

Set task bar style.

необязательный

{{ use: common-гантт-task-bar(prefix = '###')}}

## tasksShowMode(TasksShowMode)

Task bar display mode. It is configured using the enumeration тип `TasksShowMode`.

необязательный

- `TasksShowMode.Tasks_Separate`: каждый task node is displayed в a separate row, с the parent task occupying one row и child tasks occupying one row каждый. This is the по умолчанию display effect!
- `TasksShowMode.Sub_Tasks_Separate`: The parent task node is omitted и не displayed, и все child task nodes are displayed в separate rows.
- `TasksShowMode.Sub_Tasks_Inline`: The parent task node is omitted и не displayed, и все child task nodes are placed в the same row для display.
- `TasksShowMode.Sub_Tasks_Arrange`: The parent task node is omitted и не displayed, и все child tasks will maintain the данные order в the records и ensure that the nodes are displayed без overlapping.
- `TasksShowMode.Sub_Tasks_Compact`: The parent task node is omitted и не displayed, и все child tasks will be arranged according к the date attribute и ensure a compact display без overlapping nodes.

## taskKeyполе(строка)

The поле имя that uniquely identifies the данные entry, по умолчанию is 'id'

не обязательный

## dependency(объект)

Set dependency line relationship и style

не обязательный

{{ use: common-гантт-dependency-line(prefix = '###')}}

## grid(IGrid)

Grid style.

необязательный

{{ use: common-гантт-grid(prefix = '###') }}

## markLine(логический | IMarkLine | массив<IMarkLine>)

Mark line configuration. If set к true, today will be автоmatically marked.

необязательный

{{use: common-гантт-mark-line(prefix = '###')}}

## markLineCreateOptions(IMarkLineCreateOptions)

configuration из the mark line creation.

необязательный

{{use: common-гантт-create-mark-line(prefix = '###')}}

## frame(объект)

Configuration из the entire outer frame и horizontal и vertical dividing lines.

необязательный

{{ use: common-гантт-frame(prefix = '###') }}

## minDate(строка)

Specify the minimum date для the entire гантт график.

необязательный

## maxDate(строка)

Specify the maximum date для the entire гантт график. If не set, the по умолчанию rule is used.

необязательный

## headerRowвысота(число)

по умолчанию row высота для the верх header section. If you want к configure according к the header level, please configure it в timelineHeader.scale.

необязательный

## rowвысота(число)

по умолчанию row высота для данные.

необязательный

## rowSeriesNumber(IRowSeriesNumber)

Row число configuration.

необязательный

{{ use: row-series-число(
    prefix = '###',
) }}

## overscrollBehavior('авто' | 'никто') = 'авто'

прокрутка behavior configuration.

- 'авто': Consistent с browser прокрутка behavior, triggers the browser's по умолчанию behavior when the таблица scrolls к the верх/низ.
- 'никто': When the таблица scrolls к the верх/низ, it no longer triggers the parent container к прокрутка.

необязательный

## scrollStyle(IScrollStyle)

Scrollbar style.

необязательный

для specific reference, see the configuration в списоктаблица: [Specific configuration](./списоктаблица#тема.scrollStyle)

## pixelRatio(число)

Pixel ratio.

необязательный

## dateFormat(строка)

The date format из the новый schedule. The date данные will be added к the date поле значение в the данные record. The по умолчанию значение is 'yyyy-mm-dd'.

не обязательный

```
dateFormat?:
| 'yyyy-mm-dd'
| 'dd-mm-yyyy'
| 'mm/dd/yyyy'
| 'yyyy/mm/dd'
| 'dd/mm/yyyy'
| 'yyyy.mm.dd'
| 'dd.mm.yyyy'
| 'mm.dd.yyyy';
```

## underlayBackgroundColor(строка)

The fill цвет из the canvas outside the drawing range is '#fff' по по умолчанию, и it also matches the фон цвет из the таблица на the лево.

не обязательный

## событиеOptions(IсобытиеOptions)

Settings related к событие triggering, specific configuration items:

### prсобытиеDefaultContextменю(логический) = true

Prсобытие the по умолчанию behavior из the право mouse Кнопка

необязательный
