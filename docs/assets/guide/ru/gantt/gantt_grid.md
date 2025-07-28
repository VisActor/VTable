# гантт график Grid

The grid lines mainly refer к the grid lines из the лево information таблица из the гантт график, the date header и task bar из the право гантт график, и the overall outer frame line.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-structure.png)




## гантт Task список таблица Grid Lines

в the гантт график, the grid lines из the лево information таблица are rendered и organized по the Vтаблица компонент, which can be controlled through the `taskсписоктаблица` configuration item.

The specific configuration из the лево information таблица can refer к the configuration items из Vтаблица, please refer к the tutorial [тема](https://www.visactor.com/vтаблица/guide/тема_and_style/тема) или [style](https://www.visactor.com/vтаблица/guide/тема_and_style/style).

для пример, к remove the vertical split lines из the таблица, Вы можете configure the `тема`:
```
{
  "taskсписоктаблица": {
    "тема": {
      "bodyStyle": {
        "borderLineширина":[1,0]
      }
    }
  }
}

```
## Date таблица Grid Lines

The relevant configurations из the date таблица are в the `timelineHeader` configuration item, where the `verticalLine` configuration item can control the vertical split lines из the date таблица, и the `horizontalLine` configuration item can control the horizontal split lines из the date таблица.

```
{
  "timelineHeader": {
    "verticalLine": {
      "lineColor": "red",
      "lineширина": 1
    },
    "horizontalLine": {
      "lineColor": "red",
      "lineширина": 1
    }
  }
}
```

## гантт Task Bar Grid Lines

The grid lines из the гантт task bar can be controlled through the `grid` configuration item. The specific configuration is as follows:
```
export интерфейс IGrid {
  backgroundColor?: строка;
  /** Set different фон colors для different данные rows */
  horizontalBackgroundColor?: строка[] | ((args: GridHorizontalLineStyleArgumentType) => строка);
  /** Set different фон colors для different date columns */
  verticalBackgroundColor?: строка[] | ((args: GridVerticalLineStyleArgumentType) => строка);
  /** Weekend фон цвет */
  weekendBackgroundColor?: строка;
  /** Vertical interval line style */
  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  /** Horizontal interval line style */
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
  /** The date scale that the vertical line depends на. The по умолчанию is the smallest time granularity в the timelineHeader scales. */
  verticalLineDependenceOnTimeScale?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second';
}
```

It can be seen that the `grid` configuration item can control the grid lines из the task bar, including the фон цвет, horizontal split lines, vertical split lines, weekend фон цвет, и the specific date scale that the vertical line depends на.

The фон цвет и split lines can be configured as arrays к set different фон colors для different rows или columns. They can also be configured as functions к set different фон colors для different данные rows или date columns.

для пример:
```
{
  "grid": {
    "verticalBackgroundColor": ["#f00", "#0f0"],
    "horizontalBackgroundColor": ["#00f", "#0f0"],
    "verticalBackgroundColor": (args) => {
      возврат args.columnIndex % 2 === 0 ? "#f00" : "#0f0";
    }
  }
}
```



## гантт график Outer Frame Line

The outer frame line из the гантт график can be controlled through the `frame.outerFrameStyle` configuration item. The specific configuration is as follows:
```
{
  "frame": {
    "outerFrameStyle": {
      "lineColor": "red",
      "lineширина": 1
    }
  }
}
```

## гантт график Overall Split Line
The split line between the лево information таблица и the право task bar can be controlled through the `frame.verticalSplitLine` configuration item.

The split line between the header и the список body can be controlled through the `frame.horizontalSplitLine` configuration item.

для пример:
```
{
  "frame": {
    "verticalSplitLine": {
      "lineColor": "red",
      "lineширина": 1
    },
    "horizontalSplitLine": {
      "lineColor": "red",
      "lineширина": 1
    }
  }
}
```
