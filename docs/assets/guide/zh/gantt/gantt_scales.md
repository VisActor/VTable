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
## 内部事件粒度处理

配置多层时间粒度后，vtable-gantt会默认将时间粒度从最小到最大依次显示。日期表头中最底层一级是最小的时间粒度，且一定是完整的。

这个完整的意思：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/scale-minDate.jpeg)
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/scale-minDate2.jpeg)



