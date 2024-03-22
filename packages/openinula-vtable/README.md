<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>Openinula-VTable</h1>
</div>

<div align="center">

VTable is not just a high-performance multidimensional data analysis table, but also a grid artist that creates art between rows and columns.Openinula-VTable is a openinula wrapper of VTable.

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/openinula-vtable)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable.svg)](https://www.npmjs.com/package/@visactor/openinula-vtable)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/openinula-vtable)

```bash
// npm
npm install @visactor/openinula-vtable

// yarn
yarn add @visactor/openinula-vtable
```

## Quick Start

```jsx
import Inula from 'openinula';

const option = {
  header: [
    {
      field: "0",
      caption: "name",
    },
    {
      field: "1",
      caption: "age",
    },
    {
      field: "2",
      caption: "gender",
    },
    {
      field: "3",
      caption: "hobby",
    },
  ],
  records: new Array(1000).fill(["John", 18, "male", "🏀"]),
};

Inula.render(
  <ListTable option={option} height={'500px'}/>,
  (document.getElementById('root') as HTMLElement)
);
```

##

[More demos and detailed tutorials](https://visactor.io/vtable)

# Related Links

- [Official website](https://visactor.io/vtable)

# Ecosystem

| Project                                                     | Description                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [AI-generated Components](https://visactor.io/ai-vtable)    | AI-generated table component.                                                          |

# Contribution

If you would like to contribute, please read the [Code of Conduct ](./CODE_OF_CONDUCT.md) 和 [ Guide](./CONTRIBUTING.zh-CN.md) first。

Small streams converge to make great rivers and seas!

<a href="https://github.com/visactor/vtable/graphs/contributors"><img src="https://contrib.rocks/image?repo=visactor/vtable" /></a>

# License

[MIT License](./LICENSE)
