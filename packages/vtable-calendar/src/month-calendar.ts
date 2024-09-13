import type { TYPES } from '@visactor/vtable';
import { ListTable, themes, CustomLayout } from '@visactor/vtable';
import { getRecords, getStartAndEndDate } from './date-util';

export class VTableCalendar {
  constructor(container: any) {
    const { startDate, endDate } = getStartAndEndDate(new Date(), 90);
    const records = getRecords(startDate, endDate);

    const columnWidth = 140;
    const week = ['year', 'month', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const columns = week.map((item, index) => {
      return {
        field: item,
        title: item,
        width: columnWidth,
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
      container,
      records,
      columns,
      defaultRowHeight: 120,
      defaultHeaderRowHeight: 40,
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
  }
}
