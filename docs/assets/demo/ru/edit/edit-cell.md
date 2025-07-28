---
категория: примеры
группа: edit
заголовок: edit cell
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/ввод-editor.gif
ссылка: edit/edit_cell
опция: списоктаблица-columns-текст#editor
---

# edit cell

This пример shows the editability из the таблица. Нажать a cell к enter the edit state. If you want к change the timing из entering the edit state, Вы можете set:

```
/** Edit triggering time: double Нажать событие | single Нажать событие | апи к manually начало editing | keydown событие. по умолчанию is double Нажать 'doubleНажать' */
editCellTrigger?: 'doubleНажать' | 'Нажать' | 'апи' | 'keydown' | ('doubleНажать' | 'Нажать' | 'апи' | 'keydown')[];
```

The текущий пример has four editors: ввод, date, список, и textArea. Different effects can be achieved по setting different editors.

для detailed introduction, please Нажать на the tutorial к learn!

## Ключевые Конфигурации

- `Vтаблица.регистрация.editor` регистрация editor
- `column.editor` editor config

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
// Need к introduce the plug-в packвозраст @visactor/vтаблица-editors when using it
// import * as Vтаблица_editors от '@visactor/vтаблица-editors';
//Normal usвозраст const input_editor = новый Vтаблица.editors.InputEditor();
//Vтаблица.editors is reимяd к Vтаблица_editors в the official website editor
const input_editor = новый Vтаблица_editors.InputEditor();
const date_input_editor = новый Vтаблица_editors.DateInputEditor();
const список_editor = новый Vтаблица_editors.списокEditor({ values: ['girl', 'boy'] });
const textArea_editor = новый Vтаблица_editors.TextAreaEditor({ readonly: false });
Vтаблица.регистрация.editor('ввод-editor', input_editor);
Vтаблица.регистрация.editor('date-ввод-editor', date_input_editor);
Vтаблица.регистрация.editor('список-editor', список_editor);
Vтаблица.регистрация.editor('textArea-editor', textArea_editor);

функция generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  для (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  возврат result;
}
функция generateRandomHobbies() {
  const hobbies = [
    'Reading boхорошоs',
    'Playing video games',
    'Watching movies',
    'Coхорошоing',
    'Hiking',
    'Traveling',
    'Photography',
    'Playing \n musical /n instruments',
    'Gardening',
    'Painting',
    'Writing',
    'Swimming'
  ];

  const numHobbies = Math.floor(Math.random() * 3) + 1; // 生成 1-3 之间的随机整数
  const selectedHobbies = [];

  для (let i = 0; i < numHobbies; i++) {
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    const хобби = hobbies[randomIndex];
    selectedHobbies.push(хобби);
    hobbies.splice(randomIndex, 1); // 确保每个爱好只选一次
  }

  возврат selectedHobbies.join(', ');
}
функция generateRandomBirthday() {
  const начало = новый Date('1970-01-01');
  const конец = новый Date('2000-12-31');
  const randomDate = новый Date(начало.getTime() + Math.random() * (конец.getTime() - начало.getTime()));
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();
  возврат `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}
функция generateRandomPhoneNumber() {
  const areaкод = [
    '130',
    '131',
    '132',
    '133',
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '150',
    '151',
    '152',
    '153',
    '155',
    '156',
    '157',
    '158',
    '159',
    '170',
    '176',
    '177',
    '178',
    '180',
    '181',
    '182',
    '183',
    '184',
    '185',
    '186',
    '187',
    '188',
    '189'
  ];
  const prefix = areaкод[Math.floor(Math.random() * areaкод.length)];
  const suffix = строка(Math.random()).substr(2, 8);
  возврат prefix + suffix;
}
const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => {
    const первый = generateRandomString(10);
    const последний = generateRandomString(4);
    возврат {
      id: i + 1,
      email1: `${первый}_${последний}@xxx.com`,
      имя: первый,
      lastимя: последний,
      hobbies: generateRandomHobbies(),
      birthday: generateRandomBirthday(),
      tel: generateRandomPhoneNumber(),
      address: `No.${i + 100} ${generateRandomString(10)} ${generateRandomString(5)}\n${generateRandomString(5)}`,
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
      Город: 'beijing'
    };
  });
};
const records = generatePersons(10);
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80,
    сортировка: true
  },
  // {
  //   поле: 'email1',
  //   заголовок: 'email',
  //   ширина: 'авто',
  //   сортировка: true,
  //   editor: 'ввод-editor'
  // },
  {
    поле: 'full имя',
    заголовок: 'Full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя\n(ввод editor)',
        ширина: 120,
        editor: 'ввод-editor'
      },
      {
        поле: 'lastимя',
        заголовок: 'последний имя\n(ввод editor)',
        ширина: 100,
        editor: 'ввод-editor'
      }
    ]
  },
  // {
  //   поле: 'hobbies',
  //   заголовок: 'hobbies',
  //   ширина: 100,
  //   editor: 'ввод-editor'
  // },
  {
    поле: 'birthday',
    заголовок: 'birthday\n(date editor)',
    ширина: 120,
    editor: 'date-ввод-editor'
  },
  {
    поле: 'sex',
    заголовок: 'sex\n(список editor)',
    ширина: 100,
    editor: 'список-editor'
  },
  {
    поле: 'address',
    заголовок: 'address\n(textArea editor)',
    ширина: 350,
    editor: 'textArea-editor'
  },
  {
    поле: 'tel',
    заголовок: 'telephone',
    ширина: 150
  },
  {
    поле: 'work',
    заголовок: 'job',
    ширина: 200
  },
  {
    поле: 'Город',
    заголовок: 'Город',
    ширина: 150
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  автоWrapText: true,
  limitMaxавтоширина: 600,
  высотаMode: 'автовысота',
  editCellTrigger: 'Нажать'
};
таблицаInstance = новый Vтаблица.списоктаблица(option);
window['таблицаInstance'] = таблицаInstance;
```
