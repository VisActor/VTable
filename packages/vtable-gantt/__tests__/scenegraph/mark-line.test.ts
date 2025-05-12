// @ts-nocheck

global.__VERSION__ = 'none';

import { computeCountToTimeScale, createDateAtMidnight } from '../../src/tools/util';

describe('mark-line position test', () => {
  test('mark-line position calculation for day unit', () => {
    const minDate = new Date('2024-01-01 00:00:00'); // 2024年1月1日0点
    const unit = 'day' as const;
    const step = 1;

    // 同一天内不同时间点测试
    const date1 = createDateAtMidnight('2024-01-01 6:00:00');
    const unitCount1 = computeCountToTimeScale(date1, minDate, unit, step);
    const cellIndex1 = Math.floor(unitCount1);
    expect(unitCount1 - cellIndex1).toBe(0.25);

    const date2 = createDateAtMidnight('2024-01-02 12:00:00');
    const unitCount2 = computeCountToTimeScale(date2, minDate, unit, step);
    const cellIndex2 = Math.floor(unitCount2);
    expect(unitCount2 - cellIndex2).toBe(0.5);

    const date3 = createDateAtMidnight('2024-01-05 18:00:00');
    const unitCount3 = computeCountToTimeScale(date3, minDate, unit, step);
    const cellIndex3 = Math.floor(unitCount3);
    expect(unitCount3 - cellIndex3).toBe(0.75);
  });

  test('mark-line position calculation for week unit', () => {
    const minDate = new Date('2024-01-01 00:00:00'); // 周一
    const unit = 'hour';
    const step = 1;

    const date1 = createDateAtMidnight('2024-01-01 08:30:00');
    const unitCount1 = computeCountToTimeScale(date1, minDate, unit, step);
    const cellIndex1 = Math.floor(unitCount1);
    expect(unitCount1 - cellIndex1).toBe(0.5);

    const date2 = createDateAtMidnight('2024-01-03 08:45:01');
    const unitCount2 = computeCountToTimeScale(date2, minDate, unit, step);
    const cellIndex2 = Math.floor(unitCount2);
    expect(unitCount2 - cellIndex2).toBeGreaterThan(0.75);
  });

  test('mark-line position calculation for month unit', () => {
    const minDate = new Date('2024-01-01 00:00:00');
    const unit = 'month' as const;
    const step = 1;

    // 测试月内不同日期
    const date1 = createDateAtMidnight('2024-01-01'); // 月初
    const unitCount1 = computeCountToTimeScale(date1, minDate, unit, step);
    const cellIndex1 = Math.floor(unitCount1);
    expect(unitCount1 - cellIndex1).toBe(0); // 月初应该是0

    const date2 = createDateAtMidnight('2024-01-15'); // 月中
    const unitCount2 = computeCountToTimeScale(date2, minDate, unit, step);
    const cellIndex2 = Math.floor(unitCount2);
    expect(unitCount2 - cellIndex2).toBeGreaterThan(0); // 月中应该>0
  });
});
