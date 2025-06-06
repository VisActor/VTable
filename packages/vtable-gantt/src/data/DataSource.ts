import type { Gantt } from '../Gantt';
import { createDateAtMidnight, getEndDateByTimeUnit, getStartDateByTimeUnit } from '../tools/util';
import { TasksShowMode, TaskType } from '../ts-types/gantt-engine';
import { isValid } from '@visactor/vutils';

export class DataSource {
  records: any[];
  _gantt: Gantt;
  constructor(_gantt: Gantt) {
    this._gantt = _gantt;
    this.records = _gantt.records;
    this.processRecords();
  }
  processRecords() {
    const needMinDate = !this._gantt.options.minDate;
    const needMaxDate = !this._gantt.options.maxDate;

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
        if (needMinDate && record[this._gantt.parsedOptions.startDateField]) {
          const recordMinDate = createDateAtMidnight(record[this._gantt.parsedOptions.startDateField]);
          minDate = Math.min(minDate, recordMinDate.getTime());
        }
        if (needMaxDate && record[this._gantt.parsedOptions.endDateField]) {
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

      const { unit: minTimeUnit, startOfWeek, step } = this._gantt.parsedOptions.reverseSortedTimelineScales[0];
      if (needMinDate) {
        this._gantt.parsedOptions.minDate = getStartDateByTimeUnit(new Date(minDate), minTimeUnit, startOfWeek);
        this._gantt.parsedOptions._minDateTime = this._gantt.parsedOptions.minDate.getTime();
      }

      // 提供了最大值，没有提供最小值，因为最大值依赖最小值，所以应该重新计算
      if (needMinDate && !needMaxDate) {
        this._gantt.parsedOptions.maxDate = getEndDateByTimeUnit(
          this._gantt.parsedOptions.minDate,
          new Date(this._gantt.options.maxDate),
          minTimeUnit,
          step
        );
        this._gantt.parsedOptions._maxDateTime = this._gantt.parsedOptions.maxDate.getTime();
      }

      if (needMaxDate) {
        this._gantt.parsedOptions.maxDate = getEndDateByTimeUnit(
          this._gantt.parsedOptions.minDate,
          new Date(maxDate),
          minTimeUnit,
          step
        );
        this._gantt.parsedOptions._maxDateTime = this._gantt.parsedOptions.maxDate.getTime();
      }
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
    } else if (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
      // For Project_Sub_Tasks_Inline mode, we handle reordering based on whether tasks are projects
      if (
        isValid(source_sub_task_index) &&
        isValid(target_sub_task_index) &&
        isValid(source_index) &&
        isValid(target_index)
      ) {
        // Check if source and target are projects
        const sourceIsProject = this.records[source_index].type === TaskType.PROJECT;
        const targetIsProject = this.records[target_index].type === TaskType.PROJECT;

        // Moving subtask from a project to another project or normal task
        const sub_task_record = this.records[source_index].children[source_sub_task_index];
        this.records[source_index].children.splice(source_sub_task_index, 1);

        if (!this.records[target_index].children) {
          this.records[target_index].children = [];
        }

        this.records[target_index].children.splice(target_sub_task_index, 0, sub_task_record);

        // If target is a project, sort children by date
        if (targetIsProject) {
          this.records[target_index]?.children?.sort((a: any, b: any) => {
            return (
              createDateAtMidnight(a[this._gantt.parsedOptions.startDateField]).getTime() -
              createDateAtMidnight(b[this._gantt.parsedOptions.startDateField]).getTime()
            );
          });
        }
      }
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
