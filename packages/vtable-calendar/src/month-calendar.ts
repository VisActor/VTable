import type { TYPES } from '@visactor/vtable';
import { ListTable, themes, CustomLayout } from '@visactor/vtable';
import type { DateRecord, DateRecordKeys } from './date-util';
import { defaultDayTitles, getMonthString, getRecords, getStartAndEndDate, getWeekdayString } from './date-util';
import { bindDebugTool } from '../../vtable/src/scenegraph/debug-tool';
import { add, differenceInDays, lastDayOfMonth, previousSunday } from 'date-fns';
import { getMonthCustomStyleRange } from './style';
import type { CellRange, CustomRenderFunctionArg } from '@visactor/vtable/es/ts-types';

interface VTableCalendarConstructorOptions {
  startDate?: Date;
  endDate?: Date;
  currentDate?: Date;
  rangeDays?: number;

  columnWidth?: number;
  rowHeight?: number;
  headerRowHeight?: number;
  dayTitles?: [string, string, string, string, string, string, string];
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
  currentMonthCellRanges: { range: CellRange }[];
  currentMonth: number;
  currentYear: number;

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

    this.createTable();
  }

  createTable() {
    const { columnWidth, rowHeight, headerRowHeight, dayTitles } = this.options;

    const records = getRecords(this.startDate, this.endDate);
    this.records = records;

    // const columnWidth = 140;
    const week = (dayTitles ?? defaultDayTitles) as DateRecordKeys[];
    const columns = week.map((item: DateRecordKeys, index) => {
      return {
        field: defaultDayTitles[index],
        title: item,
        width: columnWidth ?? 140,
        fieldFormat: (record: DateRecord) => {
          if (
            record.year === this.currentDate.getFullYear() &&
            record.month === this.currentDate.getMonth() &&
            record[item] === this.currentDate.getDate()
          ) {
            return `${record[item]}\nToday`;
          } else if (record[item] === 1) {
            const monthIndex = item === 'Sun' ? record.month : record.month + 1;
            const mouthStr = getMonthString(monthIndex);
            return `${record[item]}\n${mouthStr}`;
          }
          return record[item];
        },
        customLayout: (args: CustomRenderFunctionArg) => {
          const { table, row, col, rect, value } = args;
          const record = table.getRecordByCell(col, row);
          const { height, width } = rect ?? table.getCellRect(col, row);

          const container = new CustomLayout.Group({
            x: 0,
            y: 0,
            height,
            width
          });

          // container.onBeforeAttributeUpdate = attr => {
          //   if (attr.y) {
          //     debugger;
          //   }
          // };

          if (value === 12) {
            const text = new CustomLayout.Text({
              x: 25,
              y: 50,
              text: 'Event A',
              fontSize: 15,
              fill: '#f99',
              textAlign: 'left',
              textBaseline: 'middle'
            });
            const circle = new CustomLayout.Circle({
              x: 15,
              y: 50,
              radius: 5,
              fill: '#f99'
            });
            container.add(text);
            container.add(circle);
          } else if (value === 21) {
            const text = new CustomLayout.Text({
              x: 20,
              y: 54 - 20,
              text: 'Event B',
              fontSize: 15,
              fill: '#fff',
              textAlign: 'left',
              textBaseline: 'middle'
            });
            const rect = new CustomLayout.Rect({
              x: 5,
              y: 45 - 20,
              width: 130,
              height: 20,
              fill: '#f99',
              cornerRadius: 5
            });
            container.add(rect);
            container.add(text);

            const text1 = new CustomLayout.Text({
              x: 20,
              y: 54 + 10,
              text: 'Event C',
              fontSize: 15,
              fill: '#fff',
              textAlign: 'left',
              textBaseline: 'middle'
            });
            const rect1 = new CustomLayout.Rect({
              x: 5,
              y: 45 + 10,
              width: 130,
              height: 20,
              fill: '#9f9',
              cornerRadius: 5
            });
            container.add(rect1);
            container.add(text1);
          }

          return {
            rootContainer: container,
            renderDefault: true
          };
        }
      };
    });
    const option: TYPES.ListTableConstructorOptions = {
      container: this.container,
      records,
      columns,
      defaultRowHeight: rowHeight ?? 120,
      defaultHeaderRowHeight: headerRowHeight ?? 40,
      theme: themes.DEFAULT.extends({
        headerStyle: {
          textAlign: 'center'
        },
        bodyStyle: {
          bgColor: args => {
            const { col, row, dataValue, table } = args;
            const record = table.getCellRawRecord(col, row);
            if (
              record.year === this.currentDate.getFullYear() &&
              record.month === this.currentDate.getMonth() &&
              dataValue === this.currentDate.getDate()
            ) {
              return '#f0f0f0';
            }
            return '#fff';
          },
          textAlign: 'right',
          textBaseline: 'top',
          color: '#999'
        }
      }),
      title: {
        orient: 'top',
        // text: 'Thu, Aug 22',
        text: `${getWeekdayString(this.currentDate.getDay())}, ${getMonthString(
          this.currentDate.getMonth()
        )} ${this.currentDate.getDate()}`,
        subtext: this.currentDate.getFullYear()
      },
      enableLineBreak: true,
      customCellStyle: [
        {
          id: 'current-month',
          style: {
            color: '#000'
          }
        }
      ]
    };
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

    // scroll to current month
    const topDate = new Date(this.currentDate.getTime());
    topDate.setDate(1);
    this.jumpToDate(topDate);

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

  jumpToDate(date: Date) {
    const dataIndex = Math.floor((differenceInDays(date, this.tableStartDate) + 1) / 7);
    this.table.scrollToCell({
      col: 0,
      row: dataIndex + 1
    });

    this._updateMonthCustomStyle(date.getFullYear(), date.getMonth());
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
}
