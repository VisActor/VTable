# 甘特图标记线

VTable-Gantt组件支持在甘特图上添加标记线，标记线可以用于表示真个项目的重要时间节点。

## 配置

markLine支持(boolean | IMarkLine | Array<IMarkLine>)类型，

- boolean: 是否显示标记线，默认为false。标记线配置为false时，不显示标记线。
- IMarkLine: 单个标记线配置
- Array<IMarkLine>: 多个标记线配置

IMarkLine 配置项如下：

```javascript
export interface IMarkLine {
  date: string;
  style?: IMarkLineStyle | ((args: IMarkLineStyleArgumentType) => IMarkLineStyle);
  /** 标记线显示在日期列下的位置 默认为'left' */
  position?: 'left' | 'right' | 'middle' | 'date';
  /** 自动将日期范围内包括该标记线 */
  scrollToMarkLine?: boolean;
  content?: string; // markLine中内容
  /** markLine中内容的样式 */
  contentStyle?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    backgroundColor?: string;
    cornerRadius?: string;
  }
}

export type IMarkLineStyle = Omit<ILineStyle, 'lineWidth'> & {
  lineWidth?: number | ((args: IMarkLineStyleArgumentType) => number);
};

export type IMarkLineStyleArgumentType = {
  date: Date;
  dateIndex: number;
  dateX: number;
  cellStartX: number;
  cellWidth: number;
  timelineColWidth: number;
  millisecondsPerPixel: number;
};
```

## 标记线样式

markLine的样式配置项示例如下：

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-01-01',
      style: {
        lineColor: 'red',
        lineWidth: 1,
      },
    },
    {
      date: '2024-01-02',
      style: {
        lineColor: 'blue',
        lineWidth: 2,
      },
    },
  ],
};
```

当标记线宽度需要跟随时间轴缩放变化时，可以将 `style.lineWidth` 配置为函数。函数会在标记线刷新时重新执行，参数中包含当前时间轴列宽、单元格宽度和毫秒/像素比例等信息：

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-07-17',
      content: '动态宽度',
      style: {
        lineWidth: ({ timelineColWidth }) => Math.max(1, Math.round(timelineColWidth / 20)),
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    }
  ]
};
```

也可以将整个 `style` 配置为函数：

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-07-17',
      style: ({ millisecondsPerPixel }) => ({
        lineWidth: millisecondsPerPixel > 86400000 ? 1 : 3,
        lineColor: 'red'
      })
    }
  ]
};
```

## 标记线位置

markLine的位置配置支持'left' | 'right' | 'middle' | 'date'四种类型，

- 'left': 标记线显示在日期列的左侧
- 'right': 标记线显示在日期列的右侧
- 'middle': 标记线显示在日期列的中间
- 'date': 标记线显示在日期时刻的位置

## 标记线内容及样式

markLine的内容配置支持string类型，

- string: 标记线内容

markLine的内容样式配置支持ITaskBarLabelTextStyle类型，

- ITaskBarLabelTextStyle: 标记线内容样式

示例：

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-01-01',
      content: '项目启动',
      contentStyle: {
        color: 'red',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  ],
};  
```

## 甘特图是否自动滚动到标记线位置

markLine的滚动配置支持boolean类型，

- boolean: 是否自动滚动到标记线

示例：

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-01-01',
      scrollToMarkLine: true,
    },
  ],
};
```
正常如果日期 '2024-01-01'在甘特图的显示范围之外，当配置`scrollToMarkLine: true`时，甘特图会自动滚动到标记线位置。
