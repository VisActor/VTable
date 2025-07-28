---
категория: примеры
группа: грамматический-тег
заголовок: сводная таблица
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table.png
порядок: 1-1
ссылка: Developer_Ecology/openinula
---

# сводная таблица

The props attributes accepted by PivotTable&PivotChart are consistent with опцияs. The semantic sub-компонентs are as follows:

- PivotColumnDimension: The dimension configuration on the column is consistent with the definition of columns in опция [api](../../опция/PivotTable-columns-text#headerType)
- PivotRowDimension: The dimension configuration on the row is consistent with the definition of rows in опция [api](../../опция/PivotTable-rows-text#headerType)
- PivotIndicator: indicator configuration, consistent with the definition of indicators in опция [api](../../опция/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: column header заголовок configuration, consistent with the definition of columnHeaderTitle in опция [api](../../опция/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: row header заголовок configuration, consistent with the definition of rowHeaderTitle in опция [api](../../опция/PivotTable#columnHeaderTitle)
- PivotCorner: Corner configuration, consistent with the definition of corner in опция [api](../../опция/PivotTable#corner)

## демонстрация кода

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';

fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const root = document.getElementById(CONTAINER_ID);
    Inula.render(
      <InulaVTable.PivotTable records={data}>
        <InulaVTable.PivotColumnHeaderTitle
          title={true}
          headerStyle={{
            textStick: true
          }}
        />
        <InulaVTable.PivotColumnDimension dimensionKey={'Категория'} title={'Категория'} width={'auto'} />
        <InulaVTable.PivotRowDimension
          dimensionKey={'Город'}
          title={'Город'}
          drillUp={true}
          width={'auto'}
          headerStyle={{
            textStick: true
          }}
        />
        <InulaVTable.PivotIndicator
          indicatorKey={'Количество'}
          title={'Количество'}
          width={'auto'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }}
        />
        <InulaVTable.PivotIndicator
          indicatorKey={'Продажи'}
          title={'Продажи'}
          width={'auto'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }}
        />
        <InulaVTable.PivotIndicator
          indicatorKey={'Прибыль'}
          title={'Прибыль'}
          width={'auto'}
          headerStyle={{
            fontWeight: 'normal'
          }}
          style={{
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }}
        />
        <InulaVTable.PivotCorner
          titleOnDimension={'row'}
          headerStyle={{
            fontWeight: 'bold'
          }}
        />
      </InulaVTable.PivotTable>,
      root
    );
  });

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
