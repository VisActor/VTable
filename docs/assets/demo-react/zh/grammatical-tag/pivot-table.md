---
category: examples
group: grammatical-tag
title: 透视分析表
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table.png
order: 1-1
link: '../guide/Developer_Ecology/react'
---

# 透视分析表

PivotTable&PivotChart接受的props属性与option一致，语义化子组件如下：

- PivotColumnDimension: 列上的维度配置，同option中的columns的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: 行上的维度配置，同option中的rows的定义一致 [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: 指标配置，同option中的indicators的定义一致 [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: 列表头标题配置，同option中的columnHeaderTitle的定义一致 [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: 行头标题配置，同option中的rowHeaderTitle的定义一致 [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: 角头配置，同option中的corner的定义一致 [api](../../option/PivotTable#corner)

## 代码演示
```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then((res) => res.json())
    .then((data) => {
      const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
      root.render(
        <ReactVTable.PivotTable
          records={data}
        >
          <ReactVTable.PivotColumnHeaderTitle
            title={true}
            headerStyle={{
              textStick: true
            }}
          />
          <ReactVTable.PivotColumnDimension
            dimensionKey={'Category'}
            title={'Category'}
            width={'auto'}
          />
          <ReactVTable.PivotRowDimension
            dimensionKey={'City'}
            title={'City'}
            drillUp={true}
            width={'auto'}
            headerStyle={{
              textStick: true,
            }}
          />
          <ReactVTable.PivotIndicator
            indicatorKey={'Quantity'}
            title={'Quantity'}
            width={'auto'}
            headerStyle={{
              fontWeight: "normal",
            }}
            style={{
              padding:[16,28,16,28],
              color(args){
                if(args.dataValue>=0)
                return 'black';
                return 'red'
              }
            }}
          />
          <ReactVTable.PivotIndicator
            indicatorKey={'Sales'}
            title={'Sales'}
            width={'auto'}
            headerStyle={{
              fontWeight: "normal",
            }}
            style={{
              padding:[16,28,16,28],
              color(args){
                if(args.dataValue>=0)
                return 'black';
                return 'red'
              }
            }}
          />
          <ReactVTable.PivotIndicator
            indicatorKey={'Profit'}
            title={'Profit'}
            width={'auto'}
            headerStyle={{
              fontWeight: "normal",
            }}
            style={{
              padding:[16,28,16,28],
              color(args){
                if(args.dataValue>=0)
                return 'black';
                return 'red'
              }
            }}
          />
          <ReactVTable.PivotCorner
            titleOnDimension={'row'}
            headerStyle={{
              fontWeight: 'bold',
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