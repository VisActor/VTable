import { ListTable } from '@visactor/vtable';
import type { DateRecord, DateRecordKeys } from './date-util';
import { defaultDayTitles, getRecords, getStartAndEndDate } from './date-util';
import { bindDebugTool } from '../../vtable/src/scenegraph/debug-tool';
import { add, differenceInDays, previousSunday } from 'date-fns';
import { getMonthCustomStyleRange } from './style';
import type { TYPES, ListTableConstructorOptions } from '@visactor/vtable';
import { createTableOption } from './table/table-option';
import type { ICustomEvent, ICustomEventOptions } from './custom/custom-handler';
import { CustomEventHandler } from './custom/custom-handler';

interface VTableCalendarConstructorOptions {
  startDate?: Date;
  endDate?: Date;
  currentDate?: Date;
  rangeDays?: number;

  dayTitles?: [string, string, string, string, string, string, string];

  tableOptions?: ListTableConstructorOptions;

  customEvents?: ICustomEvent[];
  customEventOptions?: ICustomEventOptions;
}

export class VTableCalendar {
  container: HTMLElement;
  options: VTableCalendarConstructorOptions;
  table: ListTable;
  startDate: Date;
  endDate: Date;
  currentDate: Date;
  rangeDays: number;
  tableStartDate: Date;
  records: DateRecord[];
  currentMonthCellRanges: { range: TYPES.CellRange }[];
  currentMonth: number;
  currentYear: number;

  titleClickHandler: () => void;

  maxCol: number;
  minCol: number = 0;
  customHandler: CustomEventHandler;

  constructor(container: HTMLElement, options?: VTableCalendarConstructorOptions) {
    this.container = container;
    this.options = options ?? {};
    const { startDate, endDate, currentDate, rangeDays } = this.options;

    this.currentDate = currentDate ?? new Date();
    this.rangeDays = rangeDays ?? 90;
    if (startDate && endDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    } else {
      const { startDate: computedStartDate, endDate: computedEndDate } = getStartAndEndDate(
        this.currentDate,
        this.rangeDays
      );
      this.startDate = startDate ?? computedStartDate;
      this.endDate = endDate ?? computedEndDate;
    }
    this.tableStartDate = this.startDate.getDay() === 0 ? this.startDate : previousSunday(this.startDate);

    this.customHandler = new CustomEventHandler(this, options?.customEventOptions);

    this._createTable();

    this._bindEvent();
  }

  _createTable() {
    const { dayTitles } = this.options;

    const records = getRecords(this.startDate, this.endDate);
    this.records = records;

    const week = (dayTitles ?? defaultDayTitles) as DateRecordKeys[];
    this.maxCol = week.length - 1;
    const option = createTableOption(week, this.currentDate, {
      tableOptions: this.options.tableOptions,
      containerWidth: this.container.clientWidth,
      containerHeight: this.container.clientHeight
    });
    option.records = records;
    option.container = this.container;
    (option as any)._calendar = this;

    const tableInstance = new ListTable(option);
    this.table = tableInstance;

    tableInstance.addEventListener('scroll', () => {
      const record: DateRecord = this.getYearAndMonth();
      if (!record.Sun) {
        // top
        this._updateMonthCustomStyle(this.startDate.getFullYear(), this.startDate.getMonth());
        return;
      }
      const firstDateInWeek = new Date(record.year, record.month, record.Sun);
      const lastDateInNextWeek = add(firstDateInWeek, {
        days: 13
      });
      this._updateMonthCustomStyle(lastDateInNextWeek.getFullYear(), lastDateInNextWeek.getMonth());
    });

    tableInstance.addEventListener('scroll_vertical_end', () => {
      this._updateMonthCustomStyle(this.endDate.getFullYear(), this.endDate.getMonth());
    });

    this.jumpToCurrentMonth();

    bindDebugTool(tableInstance.scenegraph.stage as any, {
      customGrapicKeys: ['col', 'row']
    });
  }

  getYearAndMonth() {
    const x = this.table.tableX + 10; // buffer
    const y = this.table.tableY + this.table.getFrozenRowsHeight() + 10; // buffer
    const topRow = this.table.getCellAtRelativePosition(x, y);
    const { row } = topRow;
    const record = this.table.getCellRawRecord(0, row);
    return record;
  }

  jumpToDate(date: Date, animation?: boolean | TYPES.ITableAnimationOption) {
    const dataIndex = Math.floor((differenceInDays(date, this.tableStartDate) + 1) / 7);
    this.table.scrollToCell(
      {
        col: 0,
        row: dataIndex + 1
      },
      animation
    );

    this._updateMonthCustomStyle(date.getFullYear(), date.getMonth());
  }

  jumpToCurrentMonth(animation?: boolean | TYPES.ITableAnimationOption) {
    // scroll to current month
    const topDate = new Date(this.currentDate.getTime());
    topDate.setDate(1);
    this.jumpToDate(topDate, animation);
  }

  _updateMonthCustomStyle(year: number, month: number) {
    if (this.currentMonth === month && this.currentYear === year) {
      return;
    }

    // clear current
    this.currentMonthCellRanges?.forEach(range => {
      this.table.arrangeCustomCellStyle(range, null);
    });

    this.currentMonth = month;
    this.currentYear = year;
    this.currentMonthCellRanges = getMonthCustomStyleRange(year, month, this.tableStartDate, this.records);
    this.currentMonthCellRanges.forEach(range => {
      this.table.arrangeCustomCellStyle(range, 'current-month');
    });
  }

  _bindEvent() {
    // click title jump to current month
    const titleComponent = this.table.internalProps.title.getComponentGraphic();
    titleComponent.setAttributes({
      cursor: 'pointer',
      // hack for cursor
      childrenPickable: false
    });
    this.titleClickHandler = (() => {
      this.jumpToCurrentMonth({
        duration: 500
      });
    }).bind(this);
    titleComponent.addEventListener('click', this.titleClickHandler);
  }

  _unbindEvent() {
    const titleComponent = this.table.internalProps.title.getComponentGraphic();
    titleComponent.removeEventListener('click', this.titleClickHandler);
  }

  release() {
    // unbind event
    this._unbindEvent();
  }

  getCellLocation(date: Date) {
    const dataIndex = Math.floor((differenceInDays(date, this.tableStartDate) + 1) / 7);
    const row = dataIndex + 1;
    const col = date.getDay();

    return {
      row,
      col
    };
  }

  getCellDate(col: number, row: number) {
    const startDate = add(this.tableStartDate, {
      days: (row - 1) * 7 + col
    });
    return startDate;
  }

  addCustomEvent(event: ICustomEvent) {
    this.customHandler.addEvent(event);
    this.table.scenegraph.updateNextFrame();
  }

  removeCustomEvent(id: string) {
    this.customHandler.removeEvents([id]);
    this.table.scenegraph.updateNextFrame();
  }

  updateCustomEvent(event: ICustomEvent) {
    this.customHandler.updateEvents([event]);
    this.table.scenegraph.updateNextFrame();
  }

  addCustomEvents(events: ICustomEvent[]) {
    this.customHandler.addEvents(events);
    this.table.scenegraph.updateNextFrame();
  }

  removeCustomEvents(ids: string[]) {
    this.customHandler.removeEvents(ids);
    this.table.scenegraph.updateNextFrame();
  }

  updateCustomEvents(events: ICustomEvent[]) {
    this.customHandler.updateEvents(events);
    this.table.scenegraph.updateNextFrame();
  }
}
