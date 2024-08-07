import type { Gantt } from '../Gantt';

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
    if (needMinDate || needMaxDate) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        needMinDate &&
          (minDate = Math.min(minDate, new Date(record[this._gantt.parsedOptions.startDateField]).getTime()));
        needMaxDate &&
          (maxDate = Math.max(maxDate, new Date(record[this._gantt.parsedOptions.endDateField]).getTime()));
      }

      needMinDate && (this.minDate = new Date(minDate));
      needMaxDate && (this.maxDate = new Date(maxDate));

      this._gantt.parsedOptions.minDate = this.minDate;
      this._gantt.parsedOptions.maxDate = this.maxDate;
      this._gantt.parsedOptions._minDateTime = this._gantt.parsedOptions.minDate.getTime();
      this._gantt.parsedOptions._maxDateTime = this._gantt.parsedOptions.maxDate.getTime();
    }
  }
}
