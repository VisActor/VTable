# line wrapping

Line wrapping is especially meaningful для long content или cell content that contains transitions, which can effectively improve the overall макет и readability из the таблица. для пример, when there is a column containing long content such as a work introduction, comments, или user feedback, the readability из the таблица may be reduced. Therefore, the автоmatic line wrapping функция came into being.

следующий, we'll learn about the configuration из line wrapping и how к use it.

## Related configuration

в Vтаблица, the setting из line wrapping is relatively simple. If каждый column requires line wrapping, Вы можете use the global configuration item`автоWrapText`If you don't want к specify wrapping globally, Вы можете set it по column. The specific configuration items are в`columns.style.автоWrapText`.

- `автоWrapText: логический`: Whether the global configuration allows line wrapping, the по умолчанию значение is`false`If set к`true`, the cells в the текущий column are wrapped according к their contents.

Other related configuration items that will affect the функция change are:

- `columns.style.lineClamp: число | строка`: Set the maximum число из rows в a cell, support numbers или`'авто'`значение. If set к`'авто'`, the число из rows is автоmatically calculated based на the cell content length.

следующий, we'll демонстрацияnstrate how к use the line wrap feature с a practical пример.

## пример

### пример 1: базовый use из line wrapping

в this пример, we'll показать how к set a line wrap feature для columns that contain longer текст content.

```javascript liveдемонстрация template=vтаблица
// 设置表格列配置
const records = [
  {
    имя: 'pigeon',
    introduction: 'The pigeon is a common urban bird с gray plumвозраст и a short, stout beak'
  },
  {
    имя: 'Swallow',
    introduction: 'Swallow is a kind из bird that is good в flying, usually perches near houses и buildings.'
  },
  {
    имя: 'Magpie',
    introduction:
      'The magpie is a common small bird mainly found в Asia. They are small в размер с a black head и throat, gray back и white belly. Magpies are social animals и often live в woods Breeding nests в China или в urban parks, feeding на insects, fruit и seeds. They are also highly intelligent и social, и are considered an intelligent, playful bird.'
  },
  {
    имя: 'Peacock',
    introduction:
      'The peacock is a large, beautiful bird с brilliant blue-green plumвозраст и a long tail. Native к South Asia, it feeds на insects, fruit, и seeds.'
  },
  {
    имя: 'Peacock',
    introduction:
      'The flamingo is a beautiful pink bird с long legs и neck, good в swimming, и is a common bird в tropical areas.'
  },
  {
    имя: 'ostrich',
    introduction:
      'The ostrich is a large bird that cannot fly и runs fast. It is one из the largest birds в the world'
  },
  {
    имя: 'Mandarin Duck',
    introduction:
      'Mandarin duck is a kind из two-winged bird. The head из the male bird is blue и the head из the female bird is brown. It usually perches и mates в pairs. It is one из the symbols в Chinese culture.'
  }
];

const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    cellType: 'link',
    templateссылка: 'https://www.google.com.hk/search?q={имя}',
    linkJump: true,
    ширина: 100
  },
  {
    поле: 'introduction',
    заголовок: 'introduction',
    cellType: 'текст',
    ширина: 200,
    style: {
      автоWrapText: true
    }
  },
  {
    поле: 'introduction',
    заголовок: 'introduction',
    cellType: 'текст',
    ширина: 200
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  defaultRowвысота: 120
};
const таблицаInstance = новый Vтаблица.списоктаблица(option);
```

As shown above,`introduction`The текст content из the column is автоmatically wrapped according к the column, improving таблица readability.

### пример 2: Setting a line wrap для the maximum число из lines

в this пример, we will set a maximum число из rows limit, и when the cell content exceeds the maximum число из rows, it will be displayed с an ellipsis.

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    имя: 'pigeon',
    introduction: 'The pigeon is a common urban bird с gray plumвозраст и a short, stout beak'
  },
  {
    имя: 'Swallow',
    introduction: 'Swallow is a kind из bird that is good в flying, usually perches near houses и buildings.'
  },
  {
    имя: 'Magpie',
    introduction:
      'The magpie is a common small bird mainly found в Asia. They are small в размер с a black head и throat, gray back и white belly. Magpies are social animals и often live в woods Breeding nests в China или в urban parks, feeding на insects, fruit и seeds. They are also highly intelligent и social, и are considered an intelligent, playful bird.'
  },
  {
    имя: 'Peacock',
    introduction:
      'The peacock is a large, beautiful bird с brilliant blue-green plumвозраст и a long tail. Native к South Asia, it feeds на insects, fruit, и seeds.'
  },
  {
    имя: 'Peacock',
    introduction:
      'The flamingo is a beautiful pink bird с long legs и neck, good в swimming, и is a common bird в tropical areas.'
  },
  {
    имя: 'ostrich',
    introduction:
      'The ostrich is a large bird that cannot fly и runs fast. It is one из the largest birds в the world'
  },
  {
    имя: 'Mandarin Duck',
    introduction:
      'Mandarin duck is a kind из two-winged bird. The head из the male bird is blue и the head из the female bird is brown. It usually perches и mates в pairs. It is one из the symbols в Chinese culture.'
  }
];

const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    cellType: 'link',
    templateссылка: 'https://www.google.com.hk/search?q={имя}',
    linkJump: true,
    ширина: 100
  },
  {
    поле: 'introduction',
    заголовок: 'introduction',
    cellType: 'текст',
    ширина: 200,
    style: {
      автоWrapText: true,
      lineClamp: 2
    }
  },
  {
    поле: 'introduction',
    заголовок: 'introduction',
    cellType: 'текст',
    ширина: 200,
    style: {
      автоWrapText: true,
      lineClamp: 3
    }
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  defaultRowвысота: 120
};
const таблицаInstance = новый Vтаблица.списоктаблица(option);
```

As shown above, the первый`introduction`Column sets the maximum число из rows к 2 rows, the second`introduction`The maximum число из rows is set к 3 rows. текст content beyond the maximum row will be displayed с an ellipsis. This can effectively avoid таблица макет problems caused по too long cell content, и maintain the consistency из таблица row высотаs.

So far, we have introduced the meaning из the line wrapping функция в Vтаблица в detail, related configurations и usвозраст примеры. по using the line wrapping функция correctly, Вы можете better optimize the таблица макет и improve the effect из данные lake visualization. It не only improves the efficiency из данные analytics, but also brings users a more comforтаблица reading experience.
