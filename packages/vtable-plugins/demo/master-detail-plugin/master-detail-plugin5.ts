// 该case测试的是数据过滤，数据聚合分析
// widthMode heightMode 为autoHeight,冻结行

import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

VTable.register.icon('filter', {
  name: 'filter',
  type: 'svg',
  width: 20,
  height: 20,
  marginRight: 6,
  positionType: VTable.TYPES.IconPosition.right,
  // interactive: true,
  svg: '<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588"></path></svg>'
});

VTable.register.icon('filtered', {
  name: 'filtered',
  type: 'svg',
  width: 20,
  height: 20,
  marginRight: 6,
  positionType: VTable.TYPES.IconPosition.right,
  // interactive: true,
  svg: '<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588" fill="#1296db"></path></svg>'
});

// 生成模拟的奥运数据
function generateOlympicData(count: number) {
  const countries = [
    'China',
    'United States',
    'Australia',
    'Germany',
    'Japan',
    'Great Britain',
    'France',
    'Italy',
    'Russia',
    'South Korea'
  ];
  const sports = [
    'Swimming',
    'Cycling',
    'Biathlon',
    'Short-Track Speed Skating',
    'Nordic Combined',
    'Athletics',
    'Gymnastics',
    'Boxing',
    'Wrestling',
    'Judo'
  ];
  const years = [2004, 2008, 2012, 2016, 2020];

  return Array.from({ length: count }).map((_, index) => {
    const baseItem = {
      athlete: `Athlete ${index + 1}`,
      age: 18 + (index % 20),
      country: countries[index % countries.length],
      year: years[index % years.length],
      sport: sports[index % sports.length],
      gold: Math.floor(Math.random() * 5),
      silver: Math.floor(Math.random() * 5),
      bronze: Math.floor(Math.random() * 5),
      total: 0
    };
    baseItem.total = baseItem.gold + baseItem.silver + baseItem.bronze;

    // 每5行数据添加子表数据
    if (index % 5 === 0) {
      (baseItem as unknown as { children: unknown[] }).children = [
        {
          athlete: `Sub ${baseItem.athlete} 1`,
          age: baseItem.age - 1,
          country: baseItem.country,
          year: baseItem.year,
          sport: `Sub ${baseItem.sport}`,
          gold: Math.floor(baseItem.gold / 2),
          silver: Math.floor(baseItem.silver / 2),
          bronze: Math.floor(baseItem.bronze / 2),
          total: Math.floor(baseItem.total / 2)
        },
        {
          athlete: `Sub ${baseItem.athlete} 2`,
          age: baseItem.age + 1,
          country: baseItem.country,
          year: baseItem.year,
          sport: `Sub ${baseItem.sport}`,
          gold: Math.ceil(baseItem.gold / 2),
          silver: Math.ceil(baseItem.silver / 2),
          bronze: Math.ceil(baseItem.bronze / 2),
          total: Math.ceil(baseItem.total / 2)
        }
      ];
    }

    return baseItem;
  });
}

export function createTable() {
  // 生成模拟数据，100条记录
  const processedData = generateOlympicData(100);

  const columns: VTable.ColumnsDefine = [
    {
      field: 'athlete',
      title: 'athlete',
      width: 120,
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.NONE,
        formatFun(value) {
          return 'Total:';
        }
      }
    },
    {
      field: 'age',
      title: 'age',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.AVG,
        formatFun(value) {
          return Math.round(value) + '(Avg)';
        }
      }
    },
    {
      field: 'country',
      title: 'country',
      width: 240,
      headerIcon: 'filter',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.CUSTOM,
        aggregationFun(values, records) {
          // 统计金牌数最多的国家
          const goldMedalCountByCountry = records.reduce(
            (acc: Record<string, number>, d: { country: string; gold: number }) => {
              const c = d.country;
              const g = Number(d.gold) || 0;
              acc[c] = (acc[c] || 0) + g;
              return acc;
            },
            {} as Record<string, number>
          );

          let max = 0;
          let best = '';
          Object.keys(goldMedalCountByCountry).forEach(c => {
            if (goldMedalCountByCountry[c] > max) {
              max = goldMedalCountByCountry[c];
              best = c;
            }
          });
          return { country: best, gold: max };
        },
        formatFun(value: number | { country: string; gold: number }) {
          if (typeof value === 'object' && value) {
            return `Top country in gold medals: ${value.country},\nwith ${value.gold} gold medals`;
          }
          return String(value);
        }
      }
    },
    { field: 'year', title: 'year', headerIcon: 'filter' },
    { field: 'sport', title: 'sport', headerIcon: 'filter' },
    {
      field: 'gold',
      title: 'gold',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value) {
          return Math.round(value) + '(Sum)';
        }
      }
    },
    {
      field: 'silver',
      title: 'silver',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value) {
          return Math.round(value) + '(Sum)';
        }
      }
    },
    {
      field: 'bronze',
      title: 'bronze',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value) {
          return Math.round(value) + '(Sum)';
        }
      }
    },
    {
      field: 'total',
      title: 'total',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value) {
          return Math.round(value) + '(Sum)';
        }
      }
    }
  ];

  // 创建主从表插件
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-olympic',
    detailTableOptions: {
      columns: [
        { field: 'athlete', title: 'Sub Athlete', width: 120 },
        { field: 'age', title: 'Sub Age', width: 80 },
        { field: 'sport', title: 'Sub Sport', width: 150 },
        { field: 'gold', title: 'Sub Gold', width: 80 },
        { field: 'silver', title: 'Sub Silver', width: 80 },
        { field: 'bronze', title: 'Sub Bronze', width: 80 },
        { field: 'total', title: 'Sub Total', width: 80 }
      ],
      theme: VTable.themes.ARCO
    }
  });

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: processedData,
    rowResizeMode: 'all',
    autoWrapText: true,
    heightMode: 'autoHeight',
    widthMode: 'autoWidth',
    frozenRowCount: 4,
    bottomFrozenRowCount: 2,
    theme: VTable.themes.ARCO,
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);
  // 展开一些行来演示效果
  setTimeout(() => {
    tableInstance.toggleHierarchyState(0, 1);
    tableInstance.toggleHierarchyState(0, 6);
  }, 100);

  const filterListValues: Record<string, string[]> = {
    country: ['all', 'China', 'United States', 'Australia'],
    year: ['all', '2004', '2008', '2012', '2016', '2020'],
    sport: ['all', 'Swimming', 'Cycling', 'Biathlon', 'Short-Track Speed Skating', 'Nordic Combined']
  };

  let filterListSelectedValues = '';
  let lastFilterField: string | number | null = null;
  const filterContainer = tableInstance.getElement();
  let select: HTMLSelectElement | null = null;

  tableInstance.on('icon_click', args => {
    const { col, row, name } = args;
    if (name === 'filter') {
      const field = tableInstance.getHeaderField(col, row);
      if (select && lastFilterField === field) {
        removeFilterElement();
        lastFilterField = null;
      } else if (!select || lastFilterField !== field) {
        const rect = tableInstance.getCellRelativeRect(col, row);
        createFilterElement(
          filterListValues[String(field)],
          filterListSelectedValues,
          String(field),
          rect as { top: number; left: number; width: number; height: number }
        );
        lastFilterField = field as string | number;
      }
    }
  });

  function createFilterElement(
    values: string[],
    curValue: string,
    field: string,
    positonRect: { top: number; left: number; width: number; height: number }
  ) {
    select = document.createElement('select');
    select.setAttribute('type', 'text');
    select.style.position = 'absolute';
    select.style.padding = '4px';
    select.style.width = '100%';
    select.style.boxSizing = 'border-box';

    let opsStr = '';
    values.forEach(item => {
      opsStr +=
        item === curValue
          ? `<option value="${item}" selected>${item}</option>`
          : `<option value="${item}">${item}</option>`;
    });
    select.innerHTML = opsStr;

    filterContainer.appendChild(select);

    select.style.top = positonRect.top + positonRect.height + 'px';
    select.style.left = positonRect.left + 'px';
    select.style.width = positonRect.width + 'px';
    select.style.height = positonRect.height + 'px';

    select.addEventListener('change', () => {
      if (!select) {
        return;
      }
      const currentValue = select.value;
      filterListSelectedValues = currentValue;
      tableInstance.updateFilterRules([
        {
          filterKey: field,
          filteredValues: currentValue === 'all' ? [] : [currentValue]
        }
      ]);
      removeFilterElement();
    });
  }

  function removeFilterElement() {
    if (select && filterContainer.contains(select)) {
      filterContainer.removeChild(select);
      select = null;
    }
  }
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;
  return tableInstance;
}
