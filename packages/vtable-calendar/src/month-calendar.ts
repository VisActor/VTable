import type { TYPES } from '@visactor/vtable';
import { ListTable, themes, CustomLayout } from '@visactor/vtable';
import { getRecords, getStartAndEndDate } from './date-util';
import { bindDebugTool } from '../../vtable/src/scenegraph/debug-tool';

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

const defaultDayTitles = ['year', 'month', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export class VTableCalendar {
  container: HTMLElement;
  options: VTableCalendarConstructorOptions;
  table: ListTable;
  startDate: Date;
  endDate: Date;
  currentDate: Date;
  rangeDays: number;

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

    this.createTable();
  }

  createTable() {
    const { columnWidth, rowHeight, headerRowHeight, dayTitles } = this.options;

    const records = getRecords(this.startDate, this.endDate);

    // const columnWidth = 140;
    const week = dayTitles ?? defaultDayTitles;
    const columns = week.map((item, index) => {
      return {
        field: defaultDayTitles[index],
        title: item,
        width: columnWidth ?? 140,
        customLayout: args => {
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
            const { col, row } = args;
            if (col === 4 && row === 2) {
              return '#f0f0f0';
            }
            return '#fff';
          },
          textAlign: 'right',
          textBaseline: 'top',
          color: args => {
            const { col, row } = args;
            if (col >= 3 && row === 5) {
              return '#999';
            }
            return '#000';
          }
        }
      }),
      title: {
        orient: 'top',
        text: 'Thu, Aug 22nd',
        subtext: '2024'
      }
    };
    const tableInstance = new ListTable(option);
    window.tableInstance = tableInstance;
    this.table = tableInstance;

    bindDebugTool(tableInstance.scenegraph.stage as any, {
      customGrapicKeys: ['col', 'row']
    });
  }

  getYearAndMonth() {
    const topRow = this.table.getCellAtRelativePosition(10, this.table.getFrozenRowsHeight() + 180);
    const { row } = topRow;
    const record = this.table.getCellRawRecord(0, row);
    return record;
  }
}
