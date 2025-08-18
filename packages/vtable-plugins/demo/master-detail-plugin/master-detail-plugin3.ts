/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';
let tableInstance: VTable.ListTable | undefined;

VTable.register.icon('filter', {
  name: 'filter',
  type: 'svg',
  width: 20,
  height: 20,
  marginRight: 6,
  positionType: VTable.TYPES.IconPosition.right,
  svg: '<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588"></path></svg>'
});

VTable.register.icon('filtered', {
  name: 'filtered',
  type: 'svg',
  width: 20,
  height: 20,
  marginRight: 6,
  positionType: VTable.TYPES.IconPosition.right,
  svg: '<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588" fill="#1296db"></path></svg>'
});

function createTableWithData(data: any[]) {
  const columns = [
    {
      field: 'athlete',
      title: 'athlete',
      width: 120,
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.NONE,
        formatFun(value: any) {
          return 'Total:';
        }
      }
    },
    {
      field: 'age',
      title: 'age',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.AVG,
        formatFun(value: any) {
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
        aggregationFun(values: any, records: any) {
          const goldMedalCountByCountry: Record<string, number> = records.reduce((acc: any, data: any) => {
            const country = data.country;
            const gold = Number(data.gold) || 0;
            acc[country] = (acc[country] || 0) + gold;
            return acc;
          }, {});
          let maxGoldMedals = 0;
          let countryWithMaxGoldMedals = '';
          for (const country in goldMedalCountByCountry) {
            if (goldMedalCountByCountry[country] > maxGoldMedals) {
              maxGoldMedals = goldMedalCountByCountry[country];
              countryWithMaxGoldMedals = country;
            }
          }
          return {
            country: countryWithMaxGoldMedals,
            gold: maxGoldMedals
          };
        },
        formatFun(value: any) {
          return `Top country in gold medals: ${value.country},\nwith ${value.gold} gold medals`;
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
        formatFun(value: any) {
          return Math.round(value) + '(Sum)';
        }
      }
    },
    {
      field: 'silver',
      title: 'silver',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value: any) {
          return Math.round(value) + '(Sum)';
        }
      }
    },
    {
      field: 'bronze',
      title: 'bronze',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value: any) {
          return Math.round(value) + '(Sum)';
        }
      }
    },
    {
      field: 'total',
      title: 'total',
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.SUM,
        formatFun(value: any) {
          return Math.round(value) + '(Sum)';
        }
      }
    }
  ];
  const option = {
    columns,
    records: data,
    bottomFrozenRowCount: 1,
    theme: VTable.themes.ARCO.extends({
      bottomFrozenStyle: {
        fontFamily: 'PingFang SC',
        fontWeight: 500
      }
    })
  } as any;
  // ensure container exists
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    console.error(`Container #${CONTAINER_ID} not found`);
    return;
  }
  // add a master-detail plugin with subtable configuration so the demo shows proper child tables
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'demo-master-detail-plugin' as any,
    detailGridOptions: ({ data, bodyRowIndex }: any) => {
      // only show subtable when the master row has children
      if (data && Array.isArray(data.children) && data.children.length > 0) {
        return {
          columns: [
            { field: 'project', title: '项目名称', width: 180 },
            { field: 'role', title: '项目角色', width: 120 },
            { field: 'startDate', title: '开始日期', width: 100 },
            { field: 'endDate', title: '结束日期', width: 100 },
            { field: 'progress', title: '项目进度', width: 100, fieldFormat: (v: any) => `${v}%` }
          ],
          theme: VTable.themes.BRIGHT,
          style: {
            margin: 10,
            height: 220
          }
        } as any;
      }
      return null;
    }
  });
  (option as any).plugins = [(option as any).plugins || [], masterDetailPlugin];
  tableInstance = new VTable.ListTable(container as HTMLElement, option as any);
  (window as any).tableInstance = tableInstance;

  // debug: print aggregate values and whether bottom row is treated as aggregation
  try {
    const lm: any = (tableInstance as any).internalProps.layoutMap;
    const bottomRowIndex = lm ? lm.rowCount - 1 : -1;
    console.debug('VTable aggregation debug: layoutMap', { hasAggregation: lm?._hasAggregation, hasAggregationOnBottomCount: lm?._hasAggregationOnBottomCount, rowCount: lm?.rowCount });
    for (let i = 0; i < columns.length; i++) {
      const field = (columns as any)[i].field;
      let colIndex = -1;
      try {
        const cols = (tableInstance as any).internalProps.layoutMap.getColumnByField(field);
        if (Array.isArray(cols) && cols.length > 0) {
          colIndex = cols[0].col;
        }
      } catch (e) {
        // ignore
      }
      const isAgg = colIndex >= 0 && bottomRowIndex >= 0 ? tableInstance.isAggregation(colIndex, bottomRowIndex) : false;
      console.debug(`agg debug: field=${field}, col=${colIndex}, bottomRow=${bottomRowIndex}, isAggregation=${isAgg}`, tableInstance.getAggregateValuesByField(field));
    }
  } catch (err) {
    console.error('VTable aggregation debug error', err);
  }

  const filterListValues: Record<string, string[]> = {
    country: ['all', 'China', 'United States', 'Australia'],
    year: ['all', '2004', '2008', '2012', '2016', '2020'],
    sport: ['all', 'Swimming', 'Cycling', 'Biathlon', 'Short-Track Speed Skating', 'Nordic Combined']
  };
  let filterListSelectedValues = '';
  let lastFilterField: string | undefined;
  tableInstance.on('icon_click', args => {
    const { col, row, name } = args as any;
    if (name === 'filter') {
      // ensure field is string for indexing into filterListValues
      const field = String(tableInstance!.getHeaderField(col, row));
      if ((window as any)._select && lastFilterField === field) {
        removeFilterElement();
        lastFilterField = undefined;
      } else if (!(window as any)._select || lastFilterField !== field) {
        const rect = tableInstance!.getCellRelativeRect(col, row);
        createFilterElement(filterListValues[field] || [], filterListSelectedValues, field, rect);
        lastFilterField = field;
      }
    }
  });

  const filterContainer = tableInstance.getElement();
  let select: HTMLSelectElement | null = null;
  function createFilterElement(values: string[], curValue: string, field: string, positonRect: any) {
    select = document.createElement('select');
    select.setAttribute('type', 'text');
    select.style.position = 'absolute';
    select.style.padding = '4px';
    select.style.width = '100%';
    select.style.boxSizing = 'border-box';

    let opsStr = '';
    values.forEach(item => {
      if (item === curValue) {
        opsStr += `<option value="${item}" selected>${item}</option>`;
      } else {
        opsStr += `<option value="${item}" >${item}</option>`;
      }
    });
    select.innerHTML = opsStr;

    filterContainer.appendChild(select);

    select.style.top = positonRect.top + positonRect.height + 'px';
    select.style.left = positonRect.left + 'px';
    select.style.width = positonRect.width + 'px';
    select.style.height = positonRect.height + 'px';
    select.addEventListener('change', () => {
      filterListSelectedValues = select!.value;
      if (tableInstance) {
        tableInstance.updateFilterRules([
          {
            filterKey: field,
            filteredValues: [select!.value]
          }
        ] as any);
      }
      removeFilterElement();
    });
    (window as any)._select = select;
  }
  function removeFilterElement() {
    if (!select) {
      return;
    }
    filterContainer.removeChild(select);
    select.removeEventListener('change', () => {
      // noop
    });
    (window as any)._select = null;
    select = null;
  }
}

// Small local dataset for demo and aggregation examples
const demoData = [
  {
    athlete: 'Alice',
    age: 23,
    country: 'China',
    year: 2020,
    sport: 'Swimming',
    gold: 2,
    silver: 1,
    bronze: 0,
    total: 3,
        children: [
          {
            project: `项目A-${1}`,
            role: '负责人',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            progress: 85
          },
        ]
  },
  {
    athlete: 'Bob',
    age: 27,
    country: 'United States',
    year: 2016,
    sport: 'Cycling',
    gold: 1,
    silver: 2,
    bronze: 1,
    total: 4
  },
  {
    athlete: 'Chen',
    age: 22,
    country: 'China',
    year: 2012,
    sport: 'Diving',
    gold: 3,
    silver: 0,
    bronze: 1,
    total: 4
  },
  {
    athlete: 'Diana',
    age: 30,
    country: 'Australia',
    year: 2008,
    sport: 'Swimming',
    gold: 0,
    silver: 1,
    bronze: 2,
    total: 3,
            children: [
          {
            project: `项目A-${1}`,
            role: '负责人',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            progress: 85
          },
        ]
  },
  {
    athlete: 'Ethan',
    age: 25,
    country: 'United States',
    year: 2012,
    sport: 'Cycling',
    gold: 1,
    silver: 0,
    bronze: 0,
    total: 1,
            children: [
          {
            project: `项目A-${1}`,
            role: '负责人',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            progress: 85
          },
        ]
  }
];

createTableWithData(demoData);
