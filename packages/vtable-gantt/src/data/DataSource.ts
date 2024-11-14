import type { Gantt } from '../Gantt';
import { createDateAtMidnight } from '../tools/util';
import { ShowHierarchyMode } from '../ts-types';

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
      needMinDate ||
      needMaxDate ||
      this._gantt.parsedOptions.showHierarchyMode === ShowHierarchyMode.Sub_Tasks_Inline
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

        if (this._gantt.parsedOptions.showHierarchyMode === ShowHierarchyMode.Sub_Tasks_Inline) {
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
}
