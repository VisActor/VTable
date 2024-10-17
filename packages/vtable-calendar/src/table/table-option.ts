import type { TYPES } from '@visactor/vtable';
import { ListTable, themes, CustomLayout } from '@visactor/vtable';
import type { DateRecord, DateRecordKeys } from '../date-util';
import { defaultDayTitles, getMonthString, getWeekdayString } from '../date-util';

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
      }
    };
  });

  const rowHeight = Math.floor((config.containerHeight - (config.style?.headerRowHeight ?? 40)) / 5);
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
