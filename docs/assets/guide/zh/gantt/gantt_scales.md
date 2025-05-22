# 甘特图日期粒度

甘特图的日期粒度决定了时间轴的显示方式和任务条的布局。VTable提供了多种日期粒度选项，包括：

- 'day' 按天显示
- 'week' 按周显示
- 'month' 按月显示
- 'quarter' 按季度显示
- 'year' 按年显示
- 'hour' 按小时显示
- 'minute' 按分钟显示
- 'second' 按秒显示

## 配置

可以通过`timeLineHeader.scales`配置项来设置日期粒度。可以设置多层，每层可以设置不同的日期粒度。

```javascript
const ganttOptions = {
  timeLineHeader: {
    scales: [
      { type: 'day', label: '日' },
      { type: 'week', label: '周' },
      { type: 'month', label: '月' },
    ],
  },
};
```
## 内部时间粒度处理
### 时间粒度顺序
配置多层时间粒度后，vtable-gantt会默认将时间粒度从大到小依次显示。
如下示例中配置了多层scales：
```javascript
scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          color: 'red',
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          return `Day ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          color: 'blue'
        }
      },
      {
        unit: 'month',
        step: 1,
        format(date) {
          return `Month ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          color: 'green'
        }
      },
      {
        unit: 'quarter',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          return `Quarter ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          color: 'red',
        }
      },
      {
        unit: 'hour',
        step: 1,
        style: {
          fontSize: 16,
          color: 'green'
        }
      },
    ]
```
最终展示效果一定是粒度最小的在底部，粒度最大的在顶部。这个规则符合人类阅读习惯。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-scale-order.png)

### 时间粒度完整性
日期表头中最底层一级是最小的时间粒度，且一定是完整的。

这个完整的意思通过下面两个图来解释：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/scale-minDate.jpeg)

上面中我们将最小时间粒度设置为`day`，可以看到日期表头中最底层一级的最左边的日期是和option中`minDate`一致的，为‘2024-07-17’。

下面我们将最小时间粒度设置为`week`，可以看到日期表头中最底层一级的最左边的日期应该为2024-07-15，因为2024-07-15是2024-07-17所在周的开始日期。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/scale-minDate2.jpeg)

这个日期不是按照`minDate`来的，而是按照`startOfWeek`来的。目前VTable-Gantt的规则是：

- 如果最小时间粒度为`day`，则日期表头中最底层一级的最左边的日期是和option中`minDate`一致的。
- 如果最小时间粒度为`week`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在周的开始日期一致的。
- 如果最小时间粒度为`month`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在月的开始日期一致的。
- 如果最小时间粒度为`quarter`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在季度的开始日期一致的。
- 如果最小时间粒度为`year`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在年的开始日期一致的。
- 如果最小时间粒度为`hour`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在小时的开始日期一致的。
- 如果最小时间粒度为`minute`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在分钟的开始日期一致的。
- 如果最小时间粒度为`second`，则日期表头中最底层一级的最左边的日期是和option中`minDate`所在秒的开始日期一致的。

## 相关接口

- `updateScales`：更新时间粒度配置
- `updateDateRange`：更新日期范围

## 敬请期待

zoomIn和zoomOut功能，可以放大和缩小时间粒度。