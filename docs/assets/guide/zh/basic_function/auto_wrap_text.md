# 自动换行

自动换行功能对于内容较长或包含换符的单元格内容特别有意义，可以有效地提高表格的整体布局和可读性。例如，当有一列包含作品简介、评论或用户反馈等长本内容时，可能会导致表的可读性降低。因此，自动换行功能应运而生。

接下来，我们将了解自动换行的配置及如何使用。

## 相关配置

在 VTable 中，自动换行的设置较为简单。如果每一列都需要自动换行可以使用全局配置项`autoWrapText`。如不想全局统一指定自动换行，可按列设置，具体配置项是在`columns.style.autoWrapText`。

- `autoWrapText: boolean`：全局配置是否允许自动换行，默认值为`false`。如果设置为`true`，则当前列的单元格会根据其内容自动换行。

其他相关会影响改功能的配置项还有：

- `columns.style.lineClamp: number | string`：设置单元格的最大行数，支持数字或者`'auto'`值。如果设置为`'auto'`，则根据单元格内容长度自动计算行数。

接下来，我们将通过实际示例演示如何使用自动换行功能。

## 示例

### 示例 1：基本的自动换行使用

在本示中，我们将展示如何对包含文本内容较长的列设置自动换行功能。

```javascript livedemo template=vtable
// 设置表格列配置
const records = [
  {
    name: 'pigeon',
    introduction: 'The pigeon is a common urban bird with gray plumage and a short, stout beak'
  },
  {
    name: 'Swallow',
    introduction: 'Swallow is a kind of bird that is good at flying, usually perches near houses and buildings.'
  },
  {
    name: 'Magpie',
    introduction:
      'The magpie is a common small bird mainly found in Asia. They are small in size with a black head and throat, gray back and white belly. Magpies are social animals and often live in woods Breeding nests in China or in urban parks, feeding on insects, fruit and seeds. They are also highly intelligent and social, and are considered an intelligent, playful bird.'
  },
  {
    name: 'Peacock',
    introduction:
      'The peacock is a large, beautiful bird with brilliant blue-green plumage and a long tail. Native to South Asia, it feeds on insects, fruit, and seeds.'
  },
  {
    name: 'Peacock',
    introduction:
      'The flamingo is a beautiful pink bird with long legs and neck, good at swimming, and is a common bird in tropical areas.'
  },
  {
    name: 'ostrich',
    introduction:
      'The ostrich is a large bird that cannot fly and runs fast. It is one of the largest birds in the world'
  },
  {
    name: 'Mandarin Duck',
    introduction:
      'Mandarin duck is a kind of two-winged bird. The head of the male bird is blue and the head of the female bird is brown. It usually perches and mates in pairs. It is one of the symbols in Chinese culture.'
  }
];

const columns = [
  {
    field: 'name',
    title: 'name',
    cellType: 'link',
    templateLink: 'https://www.google.com.hk/search?q={name}',
    linkJump: true,
    width: 100
  },
  {
    field: 'introduction',
    title: 'introduction',
    cellType: 'text',
    width: 200,
    style: {
      autoWrapText: true
    }
  },
  {
    field: 'introduction',
    title: 'introduction',
    cellType: 'text',
    width: 200
  }
];
const option = {
  records,
  columns,
  defaultRowHeight: 120
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

如上所示，`introduction`列的文本内容根据列自动换行，提高了表格可读性。

### 示例 2：设置最大行数的自动换行

在本示例中，我们将设置一个最大行数限制，当单元格内容超过最大行数时，将会以省略号显示。

```javascript livedemo template=vtable
const records = [
  {
    name: 'pigeon',
    introduction: 'The pigeon is a common urban bird with gray plumage and a short, stout beak'
  },
  {
    name: 'Swallow',
    introduction: 'Swallow is a kind of bird that is good at flying, usually perches near houses and buildings.'
  },
  {
    name: 'Magpie',
    introduction:
      'The magpie is a common small bird mainly found in Asia. They are small in size with a black head and throat, gray back and white belly. Magpies are social animals and often live in woods Breeding nests in China or in urban parks, feeding on insects, fruit and seeds. They are also highly intelligent and social, and are considered an intelligent, playful bird.'
  },
  {
    name: 'Peacock',
    introduction:
      'The peacock is a large, beautiful bird with brilliant blue-green plumage and a long tail. Native to South Asia, it feeds on insects, fruit, and seeds.'
  },
  {
    name: 'Peacock',
    introduction:
      'The flamingo is a beautiful pink bird with long legs and neck, good at swimming, and is a common bird in tropical areas.'
  },
  {
    name: 'ostrich',
    introduction:
      'The ostrich is a large bird that cannot fly and runs fast. It is one of the largest birds in the world'
  },
  {
    name: 'Mandarin Duck',
    introduction:
      'Mandarin duck is a kind of two-winged bird. The head of the male bird is blue and the head of the female bird is brown. It usually perches and mates in pairs. It is one of the symbols in Chinese culture.'
  }
];

const columns = [
  {
    field: 'name',
    title: 'name',
    cellType: 'link',
    templateLink: 'https://www.google.com.hk/search?q={name}',
    linkJump: true,
    width: 100
  },
  {
    field: 'introduction',
    title: 'introduction',
    cellType: 'text',
    width: 200,
    style: {
      autoWrapText: true,
      lineClamp: 2
    }
  },
  {
    field: 'introduction',
    title: 'introduction',
    cellType: 'text',
    width: 200,
    style: {
      autoWrapText: true,
      lineClamp: 3
    }
  }
];
const option = {
  records,
  columns,
  defaultRowHeight: 120
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

如上所示，第一个`introduction`列设置了最大行数为 2 行，第二个`introduction`设置了最大行数为 3 行。超出最大行的文本内容将以省略号显示。这可以有效地避免单元格内容过长导致的表格布局问题，并保持表格行高的一致性。

至此，我们详细介绍了 VTable 中自动换行功能意义、相关配置及使用示例。通过正确使用自换行功能，您可以更好地优化表格布局提高数据可视化的效果。不仅可提高数据分析效率，同时也为用户带来更舒适的阅读体验。
