{{ target: common-gantt-date-header-custom-layout }}
日期表头自定义渲染，对应的类型为 IDateCustomLayout，具体配置项如下：
```
export type DateCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  title: string;
  startDate: Date;
  endDate: Date;
  days: number;
  ganttInstance: Gantt;
};
export type IDateCustomLayout = (args: DateCustomLayoutArgumentType) => IDateCustomLayoutObj;
export type IDateCustomLayoutObj = {
  rootContainer: VRender.Group;
  renderDefaultText?: boolean; // 默认false
};
```