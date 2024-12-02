# line wrapping

Line wrapping is especially meaningful for long content or cell content that contains transitions, which can effectively improve the overall layout and readability of the table. For example, when there is a column containing long content such as a work introduction, comments, or user feedback, the readability of the table may be reduced. Therefore, the automatic line wrapping function came into being.

Next, we'll learn about the configuration of line wrapping and how to use it.

## Related configuration

In VTable, the setting of line wrapping is relatively simple. If each column requires line wrapping, you can use the global configuration item`autoWrapText`If you don't want to specify wrapping globally, you can set it by column. The specific configuration items are in`columns.style.autoWrapText`.

- `autoWrapText: boolean`: Whether the global configuration allows line wrapping, the default value is`false`If set to`true`, the cells in the current column are wrapped according to their contents.

Other related configuration items that will affect the function change are:

- `columns.style.lineClamp: number | string`: Set the maximum number of rows in a cell, support numbers or`'auto'`Value. If set to`'auto'`, the number of rows is automatically calculated based on the cell content length.

Next, we'll demonstrate how to use the line wrap feature with a practical example.

## example

### Example 1: Basic use of line wrapping

In this example, we'll show how to set a line wrap feature for columns that contain longer text content.

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
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  defaultRowHeight: 120
};
const tableInstance = new VTable.ListTable(option);
```

As shown above,`introduction`The text content of the column is automatically wrapped according to the column, improving table readability.

### Example 2: Setting a line wrap for the maximum number of lines

In this example, we will set a maximum number of rows limit, and when the cell content exceeds the maximum number of rows, it will be displayed with an ellipsis.

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
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  defaultRowHeight: 120
};
const tableInstance = new VTable.ListTable(option);
```

As shown above, the first`introduction`Column sets the maximum number of rows to 2 rows, the second`introduction`The maximum number of rows is set to 3 rows. Text content beyond the maximum row will be displayed with an ellipsis. This can effectively avoid table layout problems caused by too long cell content, and maintain the consistency of table row heights.

So far, we have introduced the meaning of the line wrapping function in VTable in detail, related configurations and usage examples. By using the line wrapping function correctly, you can better optimize the table layout and improve the effect of data lake visualization. It not only improves the efficiency of data analytics, but also brings users a more comfortable reading experience.
