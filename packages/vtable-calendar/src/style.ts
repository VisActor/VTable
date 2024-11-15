import { differenceInDays, lastDayOfMonth } from 'date-fns';
import type { DateRecord } from './date-util';

export function getMonthCustomStyleRange(year: number, month: number, tableStartDate: Date, records: DateRecord[]) {
  const startDate = new Date(year, month, 1);
  const startDataIndex = Math.floor((differenceInDays(startDate, tableStartDate) + 1) / 7);
  const startRecord = records[startDataIndex];

  const endDate = lastDayOfMonth(startDate);
  const endDataIndex = Math.floor((differenceInDays(endDate, tableStartDate) + 1) / 7);
  const endRecord = records[endDataIndex];

  const customCellRanges = [
    {
      range: {
        start: {
          col: 0,
          row: startDataIndex + 1 + 1
        },
        end: {
          col: 6,
          row: endDataIndex
        }
      }
    }
  ];

  let startIndex;
  if (startRecord.Sun === 1) {
    startIndex = 0;
  } else if (startRecord.Mon === 1) {
    startIndex = 1;
  } else if (startRecord.Tue === 1) {
    startIndex = 2;
  } else if (startRecord.Wed === 1) {
    startIndex = 3;
  } else if (startRecord.Thu === 1) {
    startIndex = 4;
  } else if (startRecord.Fri === 1) {
    startIndex = 5;
  } else if (startRecord.Sat === 1) {
    startIndex = 6;
  }
  customCellRanges.push({
    range: {
      start: {
        col: startIndex,
        row: startDataIndex + 1
      },
      end: {
        col: 6,
        row: startDataIndex + 1
      }
    }
  });

  let endIndex;
  const monthEndDate = endDate.getDate();
  if (endRecord.Sun === monthEndDate) {
    endIndex = 0;
  } else if (endRecord.Mon === monthEndDate) {
    endIndex = 1;
  } else if (endRecord.Tue === monthEndDate) {
    endIndex = 2;
  } else if (endRecord.Wed === monthEndDate) {
    endIndex = 3;
  } else if (endRecord.Thu === monthEndDate) {
    endIndex = 4;
  } else if (endRecord.Fri === monthEndDate) {
    endIndex = 5;
  } else if (endRecord.Sat === monthEndDate) {
    endIndex = 6;
  }

  customCellRanges.push({
    range: {
      start: {
        col: 0,
        row: endDataIndex + 1
      },
      end: {
        col: endIndex,
        row: endDataIndex + 1
      }
    }
  });

  return customCellRanges;
}
