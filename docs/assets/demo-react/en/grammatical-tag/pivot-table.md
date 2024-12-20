---
category: examples
group: grammatical-tag
title: pivot table
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table.png
order: 1-1
link: Developer_Ecology/react
---

# pivot table

The props attributes accepted by PivotTable&PivotChart are consistent with options. The semantic sub-components are as follows:

- PivotColumnDimension: The dimension configuration on the column is consistent with the definition of columns in option [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: The dimension configuration on the row is consistent with the definition of rows in option [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: indicator configuration, consistent with the definition of indicators in option [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: column header title configuration, consistent with the definition of columnHeaderTitle in option [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: row header title configuration, consistent with the definition of rowHeaderTitle in option [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: Corner configuration, consistent with the definition of corner in option [api](../../option/PivotTable#corner)

## code demo

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
    root.render(
      <ReactVTable.PivotTable records={data}>
        <ReactVTable.PivotColumnHeaderTitle
          title={true}
          headerStyle={{
            textStick: true
          }}
        />
        <ReactVTable.PivotColumnDimension dimensionKey={'Category'} title={'Category'} width={'auto'} />
        <ReactVTable.PivotRowDimension
          dimensionKey={'City'}
          title={'City'}
          drillUp={true}
          width={'auto'}
          headerStyle={{
            textStick: true
          }}
        />
        <ReactVTable.PivotIndicator
          indicatorKey={'Quantity'}
          title={'Quantity'}
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
        <ReactVTable.PivotIndicator
          indicatorKey={'Sales'}
          title={'Sales'}
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
        <ReactVTable.PivotIndicator
          indicatorKey={'Profit'}
          title={'Profit'}
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
        <ReactVTable.PivotCorner
          titleOnDimension={'row'}
          headerStyle={{
            fontWeight: 'bold'
          }}
        />
      </ReactVTable.PivotTable>
    );
  });

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
