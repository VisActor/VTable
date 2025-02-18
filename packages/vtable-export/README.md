<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable-Export</h1>
</div>

<div align="center">

VTable is not just a high-performance multidimensional data analysis table, but also a grid artist that creates art between rows and columns.React-VTable is a React wrapper of VTable.

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/react-vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/react-vvtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vtable-export)

```bash
// npm
npm install @visactor/vtable-export

// yarn
yarn add @visactor/vtable-export
```

## Quick Start

```jsx
import * as VTable from '@visactor/vtable';
import { downloadCsv, exportVTableToCsv, downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';

const option = {
  header: [
    {
      field: '0',
      caption: 'name'
    },
    {
      field: '1',
      caption: 'age'
    },
    {
      field: '2',
      caption: 'gender'
    },
    {
      field: '3',
      caption: 'hobby'
    }
  ],
  records: new Array(1000).fill(['John', 18, 'male', '🏀'])
};

const tableInstance = new VTable.ListTable(option);

// download csv file
await downloadCsv(exportVTableToCsv(tableInstance), 'export-csv');

// download excel file
await downloadExcel(await exportVTableToExcel(tableInstance), 'export-excel');
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
