<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>Vue-VTable</h1>
</div>

<div align="center">

VTable is not just a high-performance multidimensional data analysis table, but also a grid artist that creates art between rows and columns. Vue-VTable is the Vue wrapper of VTable.

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vue-vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/vue-vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vue-vtable)

```bash
// npm
npm install @visactor/vue-vtable

// yarn
yarn add @visactor/vue-vtable
```

## Quick Start

### unified tag

```html
<template>
  <vue-list-table :options="tableOptions"/>
</template>

<script>
export default {
  data() {
    const option = {
      header: [
        {
          field: '0',
          caption: '名称'
        },
        {
          field: '1',
          caption: '年龄'
        },
        {
          field: '2',
          caption: '性别'
        },
        {
          field: '3',
          caption: '爱好'
        }
      ],
      records: new Array(1000).fill(['Yelineee', 18, '男', '🏀'])
    };
    return {
      tableOptions: option
    };
  }
};
</script>

```
### gramatical tag

```html
<template>
  <vue-pivot-chart :options="tableOptions" ref="pivotChartRef" @onLegendItemClick="handleLegendItemClick" :height="800">
    
   <PivotRowDimension
      v-for="row in rows"
      :dimensionKey="row.dimensionKey"
      :title="row.title"
      :headerStyle="row.headerStyle"
      :objectHandler="row"
    />
    
    
    <PivotColumnDimension
      v-for="column in columns"
      :dimensionKey="column.dimensionKey"
      :title="column.title"
      :headerStyle="column.headerStyle"
      :objectHandler="column"
    />

    
    <PivotIndicator
      v-for="indicator in indicators"
      :indicatorKey="indicator.indicatorKey"
      :title="indicator.title"
      :cellType="indicator.cellType"
      :chartModule="indicator.chartModule"
      :chartSpec="indicator.chartSpec"
      :style="indicator.style"
    />

    <PivotCorner
      :titleOnDimension="corner.titleOnDimension"
      :headerStyle="corner.headerStyle"
    />

  </vue-pivot-chart>
</template>

```

##

[More demos and detailed tutorials](https://visactor.io/vtable)

# Related Links

- [Official website](https://visactor.io/vtable)

# Ecosystem

| Project                                                  | Description                   |
| -------------------------------------------------------- | ----------------------------- |
| [AI-generated Components](https://visactor.io/ai-vtable) | AI-generated table component. |

# Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) 和 [ Guide](./CONTRIBUTING.zh-CN.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# License

[MIT License](./LICENSE)
