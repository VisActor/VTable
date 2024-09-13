import { addDays, getDaysInMonth, isAfter } from 'date-fns';

export function getStartAndEndDate(today: Date, daltaDays: number) {
  const startDate = addDays(today, -daltaDays);
  const endDate = addDays(today, daltaDays);
  startDate.setDate(1);
  endDate.setDate(1);
  return { startDate, endDate };
}

export function getRecords(startDate: Date, endDate: Date) {
  const records: any[] = [];

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
  while (year !== endYear || month !== endMonth) {
    const monthStartDate = new Date(year, month, 1);
    const daysInMonth = getDaysInMonth(monthStartDate);
    let week = monthStartDate.getDay();
    let record;
    if (week === 0 || records.length === 0) {
      record = { year, month };
      records.push(record);
    } else {
      record = records[records.length - 1];
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (week === 7) {
        week = 0;
        record = { year, month };
        records.push(record);
      }
      setDate(record, week, day);
      week += 1;
    }

    month += 1;
    if (month === 13) {
      month = 0;
      year += 1;
    }
  }

  return records;
}

function setDate(record, day, date) {
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
