import type { TYPES } from '@visactor/vtable';
import { ListTable, themes, CustomLayout } from '@visactor/vtable';
import type { DateRecord, DateRecordKeys } from '../date-util';
import { defaultDayTitles, getMonthString, getWeekdayString } from '../date-util';
import type { CustomRenderFunctionArg } from '@visactor/vtable/es/ts-types';
import type { VTableCalendar } from '../month-calendar';

export function createTableOption(week: DateRecordKeys[], currentDate: Date, config: any) {
  const columns = week.map((item: DateRecordKeys, index: number) => {
    return {
      field: defaultDayTitles[index],
      title: item,
      // width: columnWidth ?? 140,
      fieldFormat: (record: DateRecord) => {
        if (
          record.year === currentDate.getFullYear() &&
          record.month === currentDate.getMonth() &&
          record[item] === currentDate.getDate()
        ) {
          return `${record[item]}\nToday`;
        } else if (record[item] === 1) {
          const monthIndex = item === 'Sun' ? record.month : record.month + 1;
          const mouthStr = getMonthString(monthIndex);
          return `${record[item]}\n${mouthStr}`;
        }
        return record[item];
      },
      customLayout: calendarCustomLayout
    };
  });

  const rowHeight = Math.floor((config.containerHeight - (20 + 16 + 1) - (config.style?.headerRowHeight ?? 40)) / 5); // height - title - header
  const option: TYPES.ListTableConstructorOptions = {
    // container: this.container,
    // records,
    columns,
    defaultRowHeight: rowHeight ?? 120,
    defaultHeaderRowHeight: config.style?.headerRowHeight ?? 40,
    widthMode: 'adaptive',
    columnResizeMode: 'none',
    theme: themes.DEFAULT.extends({
      headerStyle: {
        textAlign: 'center'
      },
      bodyStyle: {
        bgColor: args => {
          const { col, row, dataValue, table } = args;
          const record = table.getCellRawRecord(col, row);
          if (
            record.year === currentDate.getFullYear() &&
            record.month === currentDate.getMonth() &&
            dataValue === currentDate.getDate()
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
      text: `${getWeekdayString(currentDate.getDay())}, ${getMonthString(
        currentDate.getMonth()
      )} ${currentDate.getDate()}`,
      subtext: currentDate.getFullYear()
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

  return option;
}

function calendarCustomLayout(args: CustomRenderFunctionArg) {
  const { table, row, col, rect, value } = args;
  const calendar = (table as any).options._calendar as VTableCalendar;
  const record = table.getRecordByCell(col, row);
  const { height, width } = rect ?? table.getCellRect(col, row);

  const cellDate = calendar.getCellDate(col, row);
  const customEvents = calendar.customHandler.getCellCustomEvent(col, row);

  if (!customEvents) {
    return undefined;
  }

  const container = new CustomLayout.Group({
    x: 0,
    y: 30,
    height: height - 30,
    width,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap'
  });

  const { keys, values } = customEvents;
  const lastKey = keys[keys.length - 1];

  for (let i = 0; i <= lastKey; i++) {
    if (!values[i]) {
      // add empty rect for ocupy space
      const rect = new CustomLayout.Rect({
        width: width,
        height: 20,
        fill: false,
        stroke: false
      });
      container.add(rect);
    } else if (values[i].type === 'list') {
      const text = new CustomLayout.Text({
        text: values[i].text,
        fontSize: 15,
        fill: values[i].color,
        textAlign: 'left',
        textBaseline: 'middle'
      });
      container.add(text);
    } else {
      // bar
      const tag = new CustomLayout.Tag({
        text: values[i].text,
        textStyle: {
          fontSize: 15,
          fill: values[i].color
          // textAlign: 'left',
          // textBaseline: 'rop',
        },
        panel: {
          visible: true,
          fill: values[i].bgColor,
          cornerRadius: 4
        },
        width: 100
      });
      container.add(tag);
    }
  }

  return {
    rootContainer: container,
    renderDefault: true
  };
}
