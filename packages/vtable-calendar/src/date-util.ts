import { addDays, getDaysInMonth, isAfter, lastDayOfMonth } from 'date-fns';

export function getStartAndEndDate(today: Date, daltaDays: number) {
  const startDate = addDays(today, -daltaDays);
  startDate.setDate(1);
  const endDate = lastDayOfMonth(addDays(today, daltaDays));
  return { startDate, endDate };
}

// export const defaultDayTitles = ['year', 'month', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const defaultDayTitles = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export type DateRecordKeys = 'year' | 'month' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type DateRecord = Record<DateRecordKeys, number>;

export function getRecords(startDate: Date, endDate: Date) {
  const records: DateRecord[] = [];

  if (isAfter(startDate, endDate)) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  let year = startYear;
  let month = startMonth;
  while (year !== endYear || month <= endMonth) {
    const monthStartDate = new Date(year, month, 1);
    const daysInMonth = getDaysInMonth(monthStartDate);
    let week = monthStartDate.getDay();
    let record: DateRecord;
    if (records.length === 0) {
      if (week === 0) {
        record = { year, month } as DateRecord;
        records.push(record);
      } else if (month === 0) {
        record = { year: year - 1, month: 11 } as DateRecord;
        records.push(record);
      } else {
        record = { year, month: month - 1 } as DateRecord;
        records.push(record);
      }
    } else if (week === 0) {
      record = { year, month } as DateRecord;
      records.push(record);
    } else {
      record = records[records.length - 1];
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (week === 7) {
        week = 0;
        record = { year, month } as DateRecord;
        records.push(record);
      }
      setDate(record, week, day);
      week += 1;
    }

    month += 1;
    if (month === 12) {
      month = 0;
      year += 1;
    }
  }

  return records;
}

function setDate(record: DateRecord, day: number, date: number) {
  switch (day) {
    case 0:
      record.Sun = date;
      break;
    case 1:
      record.Mon = date;
      break;
    case 2:
      record.Tue = date;
      break;
    case 3:
      record.Wed = date;
      break;
    case 4:
      record.Thu = date;
      break;
    case 5:
      record.Fri = date;
      break;
    case 6:
      record.Sat = date;
      break;
  }
}

const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function getMonthString(monthIndex: number) {
  return monthStrings[monthIndex % monthStrings.length];
}

const weekdayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function getWeekdayString(weekdayIndex: number) {
  return weekdayStrings[weekdayIndex % weekdayStrings.length];
}
