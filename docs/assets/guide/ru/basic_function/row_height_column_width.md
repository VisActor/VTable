# Row высота и column ширина

в the поле из данные analysis, таблицаs are a common way из displaying данные. Correctly setting the row высота и column ширина из the таблица is из great significance к improve the readability и aesthetics из the данные. This tutorial will фокус на the таблица row высота и column ширина calculation функция в Vтаблица, и learn how к correctly configure the row высота и column ширина к meet actual needs.

# Column ширина calculation mode

в Vтаблица, the calculation mode из таблица column ширина `ширинаMode` can be configured as `standard` (standard mode), `adaptive` (adaptive container ширина mode) или `автоширина` (автоmatic column ширина mode). [демонстрация пример](https://visactor.io/vтаблица/демонстрация/базовый-функциональность/ширина-mode-автоширина). (If `ширинаMode: 'автоширина'` is set, then каждый cell will participate в calculating the ширина. It can be imagined that this calculation process requires Производительность.)

- Standard mode (standard): The таблица uses the ширина specified по the `ширина` attribute as the column ширина. If не specified, the по умолчанию column ширина set по `defaultColширина` или `defaultHeaderColширина` is used.
- Adaptive container ширина mode (adaptive): в adaptive container ширина mode, the таблица uses the ширина из the container к allocate column ширинаs (the ratio из каждый column ширина is based на the ширина значение в standard mode). If you do не want the header к participate в the calculation, Вы можете set `ширинаAdaptiveMode` к `only-body`.[демонстрация пример](https://visactor.io/vтаблица/демонстрация/базовый-функциональность/ширина-mode-adaptive)
- автоmatic column ширина mode (автоширина): в автоmatic ширина mode, column ширина is автоmatically calculated based на the content в the column header и body cells, ignoring the set `ширина` attribute и `defaultColширина`.

# Row высота calculation mode

The calculation mode из таблица row высота `высотаMode` can also be configured as `standard` (standard mode), `adaptive` (adaptive container ширина mode) или `автовысота` (автоmatic row высота mode).

- Standard mode (standard): Use `defaultRowвысота` и `defaultHeaderRowвысота` as the row высота.
- Adaptive container высота mode (adaptive): Use the высота из the container к allocate the высота из каждый row, и allocate based на the calculated высота ratio из the content из каждый row. If you do не want the header к participate в the calculation, Вы можете set `высотаAdaptiveMode` к `only-body`. If you only want к use the по умолчанию высота к calculate the row высота, Вы можете set `автовысотаInAdaptiveMode` к false.
- автоmatic line высота mode (автовысота): автоmatically calculate line высота based на content, based на fontSize и lineвысота (текст line высота), и заполнение. The related configuration item `автоWrapText` автоmatically wraps lines, и can calculate the line высота based на the multi-line текст content after line wrapping.

# Row высота related configurations

##по умолчанию row высота

в a Vтаблица, Вы можете set a uniform по умолчанию row высота значение для the entire таблица. The по умолчанию row высота can be set through the `defaultRowвысота` configuration item. Следующий код пример shows how к set the по умолчанию row высота к 50:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  defaultRowвысота: 50
});
```

The по умолчанию row высота set internally по Vтаблица is 40.

## по умолчанию row высота из таблица header

в addition к setting the по умолчанию row высота, Vтаблица also supports setting the row высота из the таблица header. Set through the `defaultHeaderRowвысота` configuration item. This configuration item can be set к an массив, corresponding к the высота из the header rows в каждый level, или a numerical значение к uniformly set the высота из каждый row из the таблица.

It is defined as follows. If set к авто, the высота can be calculated based на the content из the header cell.

```javascript
  /**The по умолчанию row высота из the таблица header can be set row по row. If не, take defaultRowвысота */
  defaultHeaderRowвысота: (число | 'авто') | (число | 'авто')[];
```

Следующий код пример shows how к set the первый-level header row высота к 30 и the second-level header row высота к 'авто':

```javascript
const таблица = новый Vтаблица.списоктаблица({
  defaultHeaderRowвысота: [30, 'авто']
});
```

## Row высота fills the container: автоFillвысота

The configuration item автоFillвысота is used к control whether к автоmatically fill the container высота. Different от the adaptive container effect из `adaptive` в высота mode `высотаMode`, автоFillвысота controls that only when the число из rows is small, the таблица can автоmatically fill the высота из the container, but when the число из rows exceeds the container, it will be determined based на the actual situation. прокрутка bars can appear в row высота.

```javascript
const таблица = новый Vтаблица.списоктаблица({
  автоFillвысота: true
});
```

## пользовательский calculated row высота

If you need к пользовательскийize the logic для calculating row высота, Вы можете configure the `пользовательскийComputeRowвысота` функция к proxy the logic для calculating row высота inside Vтаблица.

# Column ширина related configuration

## Column ширина ширина

Вы можете configure a specific ширина значение в the column свойства, или автоmatically calculate the column ширина as a percentвозраст или `авто`.

```
ширина?: число | строка;
```

базовый таблица configuration column ширина:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  columns: [
    {
      // ...Other configuration items
      ширина: 200
    }
  ]
});
```

сводный таблица column ширина configuration:

1. Set column ширина для associated indicators

```javascript
const таблица = новый Vтаблица.сводныйтаблица({
  indicators: [
    {
      // ...Other configuration items
      ширина: 200
    }
  ]
});
```

2. Set column ширина via dimension path

This is set via the `columnширинаConfig` configuration item, which can be set к an массив corresponding к the column ширинаs из каждый level из the dimension path.

```javascript
const таблица = новый Vтаблица.сводныйтаблица({
      columnширинаConfig: [
      {
        dimensions: [
          {
            dimensionKey: '地区',
            значение: '东北'
          },
          {
            dimensionKey: '邮寄方式',
            значение: '二级'
          },
          {
            indicatorKey: '2',
            значение: '利润'
          }
        ],
        ширина: 130
      },
      {
        dimensions: [
          {
            dimensionKey: '地区',
            значение: '东北22'
          },
          {
            indicatorKey: '1',
            значение: '销售额'
          }
        ],
        ширина: 160
      }
    ],
  ...
});
```

The effect is as follows:

<div style="ширина: 80%; текст-align: центр;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/columnширинаConfig.jpeg" />
</div>

## по умолчанию column ширина

в a Vтаблица, Вы можете set a uniform по умолчанию column ширина значение. The по умолчанию column ширина can be set through the `defaultColширина` configuration item. Следующий код пример shows how к set the column ширина к 100:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  defaultColширина: 100
});
```

## по умолчанию column ширина из row header

в addition к setting the по умолчанию column ширина, Vтаблица also supports setting the column ширина из the row header. Set through the `defaultHeaderColширина` configuration item, which can be set к one, corresponding к the ширина из the `row header` column в каждый level.

```javascript
  /**The по умолчанию column ширина из the таблица header can be set column по column. If не, take defaultColширина */
  defaultHeaderColширина: (число | 'авто') | (число | 'авто')[];
```

Следующий код пример shows how к set the column ширина из the первый-level row header к 50 и the column ширина из the second-level row header к 60:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  defaultHeaderColширина: [50, 60]
});
```

It should be noted that this configuration only works для row headers. If it is a column header, this configuration item will не be considered (the logic will be executed according к the ширина setting defined в the body part).

Specific примеры include:

- Transpose the базовый таблица, such as configuring defaultHeaderColширина: [50, 'авто'], which means that the ширина из the первый column из the header из the transposed таблица is 50, и the second column adapts к the ширина according к the cell content.
- для a сводный таблица, if defaultHeaderColширина: [50, 'авто'] is configured, it means that the ширина из the первый column из the row header из the сводный таблица is 50 (i.e., the первый-level dimension), и the second column (the second-level dimension) is adapted к the cell content. ширина.

## Column ширина limit configuration: maxширина+minширина

During the process из configuring column ширинаs, you may encounter scenarios where you need к limit the maximum или minimum column ширина из a certain column. Vтаблица provides `maxширина` и `maxширина` configuration items к limit the maximum и minimum column ширина из каждый column. Следующий код пример shows how к set the maximum column ширина из a column к 200 и the minimum column ширина к 50:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  columns: [
    {
      // ...Other configuration items
      maxширина: 200,
      minширина: 50
    }
  ]
});
```

## Column ширина limit configuration: limitMaxавтоширина

When using "авто-ширина mode" it may be necessary к limit the calculated maximum column ширина. по setting the `limitMaxавтоширина` configuration item, Вы можете avoid display abnormalities caused по a certain column ширина being too large. The `limitMaxавтоширина` configuration item supports setting a specific значение или логический тип. If set к true или the configuration is не set, 450 will be used к limit the maximum column ширина. для пример, set the limit к the maximum column ширина к 500:

```javascript
таблица = новый Vтаблица.списоктаблица({
  // ...Other configuration items
  limitMaxавтоширина: 500
});
```

## Column ширина limit configuration: limitMinширина

When dragging the column ширина, it is easy к перетаскивание the ширина к 0. This may cause certain interaction problems when dragging it back again, или the functional restrictions should не перетаскивание it into a скрытый column. в this case, Вы можете configure `limitMinширина`. Limit the minimum column ширина, для пример, limit the minimum draggable ширина к 20.

Note: If set к true, the column ширина will be limited к a minimum из 10px when dragging к change the column ширина. If set к false, there will be no limit. или set it directly к некоторые numeric значение. по умолчанию is 10px.

```javascript
таблица = новый Vтаблица.списоктаблица({
  // ...Other configuration items
  limitMinширина: 20
});
```

## Column ширина fills the container: автоFillширина

The configuration item автоFillширина is used к control whether к автоmatically fill the container ширина. Different от the adaptive container effect из `adaptive` в ширина mode `ширинаMode`, автоFillширина controls that only when the число из columns is small, the таблица can автоmatically fill the container ширина, but when the число из columns exceeds the container, it will be based на the actual situation. к set the column ширина, прокрутка bars will appear.

```javascript
const таблица = новый Vтаблица.списоктаблица({
  автоFillширина: true
});
```

## Calculate column ширина based на content и only calculate the header или body part: columnширинаComputeMode

When calculating the content ширина, limit the calculation к only the header content или the body cell content, или все из them can be calculated.

Configuration item definition:

```
  columnширинаComputeMode?: 'normal' | 'only-header' | 'only-body';
```

usвозраст

```javascript
const таблица = новый Vтаблица.списоктаблица({
  columns: [
    {
      // ...Other configuration items
      columnширинаComputeMode: 'only-header'
    }
  ]
});
```

This поле can also be configured globally

```javascript
const таблица = новый Vтаблица.списоктаблица({
  //Consider body cell content when calculating column ширина
  columnширинаComputeMode: 'only-header',
  ширинаMode: 'автоширина'
});
```

#Часто Задаваемые Вопросы

## Set adaptive content для specific columns к calculate column ширина

If you do не want к calculate the column ширина для каждый column, Вы можете use ширина в columns к define it без setting `ширинаMode: 'автоширина'`.

## Column ширина is adaptive according к the header content

If you only need к calculate the header content ширина, Вы можете use `columnширинаComputeMode: 'only-header'` к achieve it. However, it needs к be used с the setting `ширинаMode:'автоширина'`.

## Transpose таблица column ширина configuration problem

Please use defaultHeaderColширина к specify the ширина из каждый column в the header part, и use defaultColширина в the body part.

If ширина is declared в columns, we will traverse the maximum число значение из the ширина configured в columns as the column ширина из все columns. If there is no ширина configuration с a число значение, but one из the columns is configured с авто, все column ширинаs will be автоmatically calculated. в order к make the configuration clearer и more reasonable, we recommend using defaultColширина к specify the column ширина.

## таблица ширина и высота Configuration

Typically, you need к specify the container's ширина и высота к determine the overall ширина и высота из the таблица. If you don't specify the ширина и высота, и you want Vтаблица к автоmatically развернуть the container based на the content, Вы можете set canvasширина к 'авто' и canvasвысота к 'авто'. в the same time, use maxCanvasширина и maxCanvasвысота к limit the maximum ширина и высота.

## How к отмена double-Нажать автоmatic column ширина

по по умолчанию, double-Нажатьing the interval line between two columns will adjust the column ширина на the лево из the interval line к adapt к the content. If you don't want к double-Нажать к автоmatically adjust the column ширина, Вы можете set `списоктаблица.изменение размера.disableDblНажатьавтоResizeColширина` к true в the configuration.

So far, we have introduced the таблица row высота и column ширина calculation функция в Vтаблица, including row высота, column ширина configuration, и таблица ширина mode. по mastering these functions, Вы можете display и analyze данные в Vтаблица more conveniently к meet various practical needs.
