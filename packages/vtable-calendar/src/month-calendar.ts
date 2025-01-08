import { ListTable, EventTarget } from '@visactor/vtable';
import type { DateRecord, DateRecordKeys } from './date-util';
import { defaultDayTitles, getRecords, getStartAndEndDate } from './date-util';
import { bindDebugTool } from '../../vtable/src/scenegraph/debug-tool';
import { add, differenceInDays, previousSunday, startOfDay } from 'date-fns';
import { getMonthCustomStyleRange } from './style';
import type { TYPES, ListTableConstructorOptions } from '@visactor/vtable';
import { createTableOption } from './table/table-option';
import type { ICustomEvent, ICustomEventOptions, IEventData } from './custom/custom-handler';
import { CustomEventHandler } from './custom/custom-handler';
import type {
  CalendarEventHandlersEventArgumentMap,
  CalendarEventHandlersReturnMap,
  CalendarEventListener
} from './event/type';
import { CALENDAR_EVENT_TYPE } from './event/type';
import type { EventListenerId } from '@visactor/vtable/es/ts-types';
import { isArray } from '@visactor/vutils';

export interface CalendarConstructorOptions {
  startDate?: Date;
  endDate?: Date;
  currentDate?: Date;
  rangeDays?: number;

  dayTitles?: [string, string, string, string, string, string, string];

  tableOptions?: ListTableConstructorOptions;

  customEvents?: ICustomEvent[];
  customEventOptions?: ICustomEventOptions;
}

export class Calendar extends EventTarget {
  container: HTMLElement;
  options: CalendarConstructorOptions;
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

  constructor(container: HTMLElement, options?: CalendarConstructorOptions) {
    super();
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

    if (this.options.customEvents) {
      this.addCustomEvents(this.options.customEvents);
    }
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
      if (!record) {
        return;
      }
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

    // bindDebugTool(tableInstance.scenegraph.stage as any, {
    //   customGrapicKeys: ['col', 'row']
    // });
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
    date = startOfDay(date);
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

  // @ts-ignore
  fireListeners<TYPE extends keyof CalendarEventHandlersEventArgumentMap>(
    type: TYPE,
    event: CalendarEventHandlersEventArgumentMap[TYPE]
  ): CalendarEventHandlersReturnMap[TYPE][] {
    // 调用父类的方法
    return super.fireListeners(type as any, event as any);
  }

  // @ts-ignore
  on<TYPE extends keyof CalendarEventHandlersEventArgumentMap>(
    type: TYPE,
    listener: CalendarEventListener<TYPE>
  ): EventListenerId {
    // 调用父类的方法
    return super.on(type as any, listener as any);
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

    this.table.on('click_cell', e => {
      const { target } = e;
      if ((target as any)._role === 'calendar-custom-event') {
        this.fireListeners(CALENDAR_EVENT_TYPE.CALENDAR_CUSTOM_EVENT_CLICK, {
          tableEvent: e,
          date: this.getCellDate(e.col, e.row),
          customEvent: (target as any)._customEvent
        });
      } else if (!this.table.isHeader(e.col, e.row)) {
        this.fireListeners(CALENDAR_EVENT_TYPE.CALENDAR_DATE_CLICK, {
          tableEvent: e,
          date: this.getCellDate(e.col, e.row)
        });
      }
    });

    this.table.on('selected_cell', e => {
      if (!this.table.isHeader(e.col, e.row)) {
        this.fireListeners(CALENDAR_EVENT_TYPE.SELECTED_DATE, {
          tableEvent: e,
          date: this.getCellDate(e.col, e.row)
        });
      }
    });

    this.table.on('selected_clear', () => {
      this.fireListeners(CALENDAR_EVENT_TYPE.SELECTED_DATE_CLEAR, undefined);
    });

    this.table.on('drag_select_end', e => {
      const { cells } = e;
      const dates: Date[] = [];
      cells.map(row => {
        row.map(cell => {
          if (!this.table.isHeader(cell.col, cell.row)) {
            dates.push(this.getCellDate(cell.col, cell.row));
          }
        });
      });
      this.fireListeners(CALENDAR_EVENT_TYPE.DRAG_SELECT_DATE_END, {
        tableEvent: e,
        dates
      });
    });
  }

  release() {
    this.table.release();
  }

  getCellLocation(date: Date) {
    date = startOfDay(date);
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

  get selectedDate(): { date: Date; col: number; row: number }[] {
    const cells = this.table.getSelectedCellInfos();
    if (!isArray(cells) || cells.length === 0) {
      return [];
    }
    const dates: { date: Date; col: number; row: number }[] = [];
    cells.map(row => {
      row.map(cell => {
        if (!this.table.isHeader(cell.col, cell.row)) {
          dates.push({
            date: this.getCellDate(cell.col, cell.row),
            col: cell.col,
            row: cell.row
          });
        }
      });
    });

    return dates;
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

  getCellCustomEventByDate(date: Date) {
    const location = this.getCellLocation(date);
    return this.getCellCustomEventByLocation(location.col, location.row);
  }

  getCellCustomEventByLocation(col: number, row: number) {
    const cellEvent = this.customHandler.getCellCustomEvent(col, row);
    const events: IEventData[] = [];
    cellEvent?.keys.forEach(key => {
      events.push(cellEvent.values[key]);
    });
    return events;
  }
}
