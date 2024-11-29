import type { Gantt } from '../Gantt';
import { createDateAtMidnight } from '../tools/util';
import { TasksShowMode } from '../ts-types';
import { isValid } from '@visactor/vutils';
export class DataSource {
  records: any[];
  minDate: Date;
  maxDate: Date;
  _gantt: Gantt;
  constructor(_gantt: Gantt) {
    this._gantt = _gantt;
    this.records = _gantt.records;
    this.minDate = _gantt.parsedOptions.minDate;
    this.maxDate = _gantt.parsedOptions.maxDate;
    this.processRecords();
  }
  processRecords() {
    const needMinDate = !this.minDate;
    const needMaxDate = !this.maxDate;

    let minDate = Number.MAX_SAFE_INTEGER;
    let maxDate = Number.MIN_SAFE_INTEGER;
    if (
      (needMinDate ||
        needMaxDate ||
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) &&
      this.records.length
    ) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (needMinDate) {
          const recordMinDate = createDateAtMidnight(record[this._gantt.parsedOptions.startDateField]);
          minDate = Math.min(minDate, recordMinDate.getTime());
        }
        if (needMaxDate) {
          const recordMaxDate = createDateAtMidnight(record[this._gantt.parsedOptions.endDateField]);
          maxDate = Math.max(maxDate, recordMaxDate.getTime());
        }

        if (
          this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
          this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
        ) {
          // 将子任务按开始时间升序排列
          record.children &&
            record.children.sort((a: any, b: any) => {
              return (
                createDateAtMidnight(a[this._gantt.parsedOptions.startDateField]).getTime() -
                createDateAtMidnight(b[this._gantt.parsedOptions.startDateField]).getTime()
              );
            });
        }
      }

      needMinDate && (this.minDate = createDateAtMidnight(minDate));
      needMaxDate && (this.maxDate = createDateAtMidnight(maxDate));
      this._gantt.parsedOptions.minDate = this.minDate;
      this._gantt.parsedOptions.maxDate = this.maxDate;
      this._gantt.parsedOptions._minDateTime = this._gantt.parsedOptions.minDate.getTime();
      this._gantt.parsedOptions._maxDateTime = this._gantt.parsedOptions.maxDate.getTime();
    }
  }
  adjustOrder(
    source_index: number,
    source_sub_task_index: number,
    target_index: number,
    target_sub_task_index: number
  ) {
    if (
      (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) &&
      source_index === target_index
    ) {
      return;
    }
    if (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
      if (
        isValid(source_sub_task_index) &&
        isValid(target_sub_task_index) &&
        isValid(source_index) &&
        isValid(target_index)
      ) {
        const sub_task_record = this.records[source_index].children[source_sub_task_index];
        this.records[source_index].children.splice(source_sub_task_index, 1);
        if (!this.records[target_index].children) {
          this.records[target_index].children = [];
        }
        this.records[target_index].children.splice(target_sub_task_index, 0, sub_task_record);
      }
      this.records[target_index]?.children?.sort((a: any, b: any) => {
        return (
          createDateAtMidnight(a[this._gantt.parsedOptions.startDateField]).getTime() -
          createDateAtMidnight(b[this._gantt.parsedOptions.startDateField]).getTime()
        );
      });
    } else {
      if (
        isValid(source_sub_task_index) &&
        isValid(target_sub_task_index) &&
        isValid(source_index) &&
        isValid(target_index)
      ) {
        const sub_task_record = this.records[source_index].children[source_sub_task_index];
        this.records[source_index].children.splice(source_sub_task_index, 1);
        if (!this.records[target_index].children) {
          this.records[target_index].children = [];
        }
        this.records[target_index].children.splice(target_sub_task_index, 0, sub_task_record);
      }
    }
  }
  setRecords(records: any[]) {
    this.records = records;
    this.processRecords();
  }
}
