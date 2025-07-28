{{ target: common-gantt-date-header-custom-layout }}
The custom rendering of the date header corresponds to the type IDateCustomLayout. The specific configuration items are as follows:
```
export type DateCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  /** The position of the current date in the date scale. For example, the fourth quarter in a quarterly date returns 4. */
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
  renderDefaultText?: boolean; // Default is false
};
```
