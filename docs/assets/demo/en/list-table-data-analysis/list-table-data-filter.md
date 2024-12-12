---
category: examples
group: list-table-data-analysis
title: List table data filtering
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table-filter.gif
link: data_analysis/list_table_dataAnalysis
---

# List table data filtering

The basic table sets filtering through the interface updateFilterRules, supporting value filtering and function filtering.

## Key Configurations

- `ListTable`
- `updateFilterRules` sets or updates filtering data rules

## Code demo

```javascript livedemo template=vtable
var tableInstance;
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
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/olympic-winners.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
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
            // 使用 reduce() 方法统计金牌数
            const goldMedalCountByCountry = records.reduce((acc, data) => {
              const country = data.country;
              const gold = data.gold;

              if (acc[country]) {
                acc[country] += gold;
              } else {
                acc[country] = gold;
              }
              return acc;
            }, {});

            // 找出金牌数最多的国家
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
          formatFun(value) {
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
    const option = {
      columns,
      records: data,
      autoWrapText: true,
      heightMode: 'autoHeight',
      widthMode: 'autoWidth',
      bottomFrozenRowCount: 1,
      theme: VTable.themes.ARCO.extends({
        bottomFrozenStyle: {
          fontFamily: 'PingFang SC',
          fontWeight: 500
        }
      })
    };
    const t0 = window.performance.now();
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
    const filterListValues = {
      country: ['all', 'China', 'United States', 'Australia'],
      year: ['all', '2004', '2008', '2012', '2016', '2020'],
      sport: ['all', 'Swimming', 'Cycling', 'Biathlon', 'Short-Track Speed Skating', 'Nordic Combined']
    };
    let filterListSelectedValues = '';
    let lastFilterField;
    tableInstance.on('icon_click', args => {
      const { col, row, name } = args;
      if (name === 'filter') {
        const field = tableInstance.getHeaderField(col, row);
        if (select && lastFilterField === field) {
          removeFilterElement();
          lastFilterField = null;
        } else if (!select || lastFilterField !== field) {
          const rect = tableInstance.getCellRelativeRect(col, row);
          createFilterElement(filterListValues[field], filterListSelectedValues, field, rect);
          lastFilterField = field;
        }
      }
    });

    let filterContainer = tableInstance.getElement();
    let select;
    function createFilterElement(values, curValue, field, positonRect) {
      // create select tag
      select = document.createElement('select');
      select.setAttribute('type', 'text');
      select.style.position = 'absolute';
      select.style.padding = '4px';
      select.style.width = '100%';
      select.style.boxSizing = 'border-box';

      // create option tags
      let opsStr = '';
      values.forEach(item => {
        opsStr +=
          item === curValue
            ? `<option value="${item}" selected>${item}</option>`
            : `<option value="${item}" >${item}</option>`;
      });
      select.innerHTML = opsStr;

      filterContainer.appendChild(select);

      select.style.top = positonRect.top + positonRect.height + 'px';
      select.style.left = positonRect.left + 'px';
      select.style.width = positonRect.width + 'px';
      select.style.height = positonRect.height + 'px';
      select.addEventListener('change', () => {
        filterListSelectedValues = select.value;
        tableInstance.updateFilterRules([
          {
            filterKey: field,
            filteredValues: select.value
          }
        ]);
        removeFilterElement();
        // update header Icon
        columns.forEach(col => {
          if (col.field === field) {
            col.headerIcon = 'filtered';
          }
        });
        tableInstance.updateColumns(columns);
      });
    }
    function removeFilterElement() {
      filterContainer.removeChild(select);
      select.removeEventListener('change', () => {
        // this.successCallback();
      });
      select = null;
    }
  });
```
