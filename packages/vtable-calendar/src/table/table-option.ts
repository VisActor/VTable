import type { ListTableConstructorOptions, TYPES } from '@visactor/vtable';
import { themes } from '@visactor/vtable';
import type { DateRecord, DateRecordKeys } from '../date-util';
import { defaultDayTitles, getMonthString, getWeekdayString } from '../date-util';
import { calendarCustomLayout } from '../custom/custom-layout';
import { merge } from '@visactor/vutils';
import { addDays, isSameDay } from 'date-fns';

export function createTableOption(
  week: DateRecordKeys[],
  currentDate: Date,
  config: { tableOptions?: ListTableConstructorOptions; containerWidth: number; containerHeight: number }
) {
  const columns = week.map((item: DateRecordKeys, index: number) => {
    return {
      field: defaultDayTitles[index],
      title: item,
      // width: columnWidth ?? 140,
      fieldFormat: (record: DateRecord) => {
        if (isSameDay(addDays(new Date(record.year, record.month, record.Sun), index), currentDate)) {
          return `${record[item]}\nToday`;
        } else if (record[item] === 1) {
          const monthIndex = item === 'Sun' ? record.month : record.month + 1;
          const mouthStr = getMonthString(monthIndex);
          return `${record[item]}\n${mouthStr}`;
        }
        return record[item];
      },
      customLayout: config.tableOptions?.customLayout ?? calendarCustomLayout
    };
  });

  const rowHeight = Math.floor(
    (config.containerHeight -
      ((config.tableOptions?.title?.textStyle?.fontSize ?? 20) +
        (config.tableOptions?.title?.subtextStyle?.fontSize ?? 16) +
        1) -
      ((config.tableOptions?.defaultHeaderRowHeight as number) ?? 40)) /
      5
  ); // height - title - header
  const option: TYPES.ListTableConstructorOptions = {
    ...(config.tableOptions ?? {}),

    columns,
    defaultRowHeight: rowHeight ?? 120,
    defaultHeaderRowHeight: config.tableOptions?.defaultHeaderRowHeight ?? 40,
    widthMode: 'adaptive',
    columnResizeMode: 'none',
    theme: themes.DEFAULT.extends(
      merge(
        {
          headerStyle: {
            textAlign: 'center'
          },
          bodyStyle: {
            bgColor: args => {
              const { col, row, dataValue, table } = args;
              const record = table.getCellRawRecord(col, row);
              const date = dataValue;
              const month = record.Sun > dataValue ? record.month + 1 : record.month;
              const year = record.month === 11 && record.Sun > dataValue ? record.year + 1 : record.year;
              if (
                // year === currentDate.getFullYear() &&
                // month === currentDate.getMonth() &&
                // date === currentDate.getDate()
                isSameDay(addDays(new Date(record.year, record.month, record.Sun), col), currentDate)
              ) {
                return '#f0f0f0';
              }
              return '#fff';
            },
            textAlign: 'right',
            textBaseline: 'top',
            color: '#999'
          }
        },
        config.tableOptions?.theme
      )
    ),
    title: {
      ...(config.tableOptions?.title ?? {}),

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
