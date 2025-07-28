---
категория: примеры
группа: список-таблица-данные-analysis
заголовок: список таблица данные aggregation summary
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-таблица-aggregation.png
ссылка: данные_analysis/список_таблица_данныеAnalysis
опция: списоктаблица-columns-текст#aggregation(Aggregation%20%7C%20пользовательскийAggregation%20%7C%20Array)
---

# список таблица aggregation summary

базовый таблица aggregation calculation, каждый column can set the aggregation method, и supports summation, averвозраст, maximum и minimum, и пользовательский функция summary logic.

## Ключевые Конфигурации

- `списоктаблица`
- `columns.aggregation` Configure aggregation calculations

## код демонстрация

```javascript liveдемонстрация template=vтаблица
var таблицаInstance;
Vтаблица.регистрация.иконка('filter', {
  имя: 'filter',
  тип: 'svg',
  ширина: 20,
  высота: 20,
  marginRight: 6,
  positionType: Vтаблица.TYPES.иконкаPosition.право,
  // interactive: true,
  svg: '<svg t="1707378931406" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" ширина="200" высота="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588"></path></svg>'
});

Vтаблица.регистрация.иконка('filtered', {
  имя: 'filtered',
  тип: 'svg',
  ширина: 20,
  высота: 20,
  marginRight: 6,
  positionType: Vтаблица.TYPES.иконкаPosition.право,
  // interactive: true,
  svg: '<svg t="1707378931406" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" ширина="200" высота="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588" fill="#1296db"></path></svg>'
});
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/olympic-winners.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'athlete',
        заголовок: 'athlete',
        ширина: 120,
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.никто,
          formatFun(значение) {
            возврат 'Total:';
          }
        }
      },
      {
        поле: 'возраст',
        заголовок: 'возраст',
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.AVG,
          formatFun(значение) {
            возврат Math.round(значение) + '(Avg)';
          }
        }
      },
      {
        поле: 'country',
        заголовок: 'country',
        ширина: 240,
        headerиконка: 'filter',
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.пользовательский,
          aggregationFun(values, records) {
            // 使用 reduce() 方法统计金牌数
            const goldMedalCountByCountry = records.reduce((acc, данные) => {
              const country = данные.country;
              const gold = данные.gold;

              if (acc[country]) {
                acc[country] += gold;
              } else {
                acc[country] = gold;
              }
              возврат acc;
            }, {});

            // 找出金牌数最多的国家
            let maxGoldMedals = 0;
            let countryWithMaxGoldMedals = '';

            для (const country в goldMedalCountByCountry) {
              if (goldMedalCountByCountry[country] > maxGoldMedals) {
                maxGoldMedals = goldMedalCountByCountry[country];
                countryWithMaxGoldMedals = country;
              }
            }
            возврат {
              country: countryWithMaxGoldMedals,
              gold: maxGoldMedals
            };
          },
          formatFun(значение) {
            возврат `верх country в gold medals: ${значение.country},\nwith ${значение.gold} gold medals`;
          }
        }
      },
      { поле: 'year', заголовок: 'year', headerиконка: 'filter' },
      { поле: 'sport', заголовок: 'sport', headerиконка: 'filter' },
      {
        поле: 'gold',
        заголовок: 'gold',
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.SUM,
          formatFun(значение) {
            возврат Math.round(значение) + '(Sum)';
          }
        }
      },
      {
        поле: 'silver',
        заголовок: 'silver',
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.SUM,
          formatFun(значение) {
            возврат Math.round(значение) + '(Sum)';
          }
        }
      },
      {
        поле: 'bronze',
        заголовок: 'bronze',
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.SUM,
          formatFun(значение) {
            возврат Math.round(значение) + '(Sum)';
          }
        }
      },
      {
        поле: 'total',
        заголовок: 'total',
        aggregation: {
          aggregationType: Vтаблица.TYPES.AggregationType.SUM,
          formatFun(значение) {
            возврат Math.round(значение) + '(Sum)';
          }
        }
      }
    ];
    const option = {
      columns,
      records: данные,
      автоWrapText: true,
      высотаMode: 'автовысота',
      ширинаMode: 'автоширина',
      bottomFrozenRowCount: 1,
      тема: Vтаблица.темаs.ARCO.extends({
        bottomFrozenStyle: {
          fontFamily: 'PingFang SC',
          fontWeight: 500
        }
      })
    };
    const t0 = window.Производительность.now();
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = таблицаInstance;
    const filterсписокValues = {
      country: ['все', 'China', 'United States', 'Australia'],
      year: ['все', '2004', '2008', '2012', '2016', '2020'],
      sport: ['все', 'Swimming', 'Cycling', 'Biathlon', 'Short-Track Speed Skating', 'Nordic Combined']
    };
    let filterсписокSelectedValues = '';
    let lastFilterполе;
    таблицаInstance.на('иконка_Нажать', args => {
      const { col, row, имя } = args;
      if (имя === 'filter') {
        const поле = таблицаInstance.getHeaderполе(col, row);
        if (выбрать && lastFilterполе === поле) {
          removeFilterElement();
          lastFilterполе = null;
        } else if (!выбрать || lastFilterполе !== поле) {
          const rect = таблицаInstance.getCellRelativeRect(col, row);
          createFilterElement(filterсписокValues[поле], filterсписокSelectedValues, поле, rect);
          lastFilterполе = поле;
        }
      }
    });

    let filterContainer = таблицаInstance.getElement();
    let выбрать;
    функция createFilterElement(values, curValue, поле, positonRect) {
      // create выбрать tag
      выбрать = document.createElement('выбрать');
      выбрать.setAttribute('тип', 'текст');
      выбрать.style.позиция = 'absolute';
      выбрать.style.заполнение = '4px';
      выбрать.style.ширина = '100%';
      выбрать.style.boxSizing = 'граница-box';

      // create option tags
      let opsStr = '';
      values.forEach(item => {
        opsStr +=
          item === curValue
            ? `<option значение="${item}" selected>${item}</option>`
            : `<option значение="${item}" >${item}</option>`;
      });
      выбрать.innerHTML = opsStr;

      filterContainer.appendChild(выбрать);

      выбрать.style.верх = positonRect.верх + positonRect.высота + 'px';
      выбрать.style.лево = positonRect.лево + 'px';
      выбрать.style.ширина = positonRect.ширина + 'px';
      выбрать.style.высота = positonRect.высота + 'px';
      выбрать.addсобытиесписокener('change', () => {
        filterсписокSelectedValues = выбрать.значение;
        таблицаInstance.updateFilterRules([
          {
            filterKey: поле,
            filteredValues: выбрать.значение
          }
        ]);
        removeFilterElement();
      });
    }
    функция removeFilterElement() {
      filterContainer.removeChild(выбрать);
      выбрать.removeсобытиесписокener('change', () => {
        // this.successCallback();
      });
      выбрать = null;
    }
  });
```
