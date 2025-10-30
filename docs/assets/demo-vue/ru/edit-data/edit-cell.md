---
категория: примеры
группа: edit-cell
заголовок: Using Arco список Selector в пользовательский Editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-editor-базовый.png
ссылка: Developer_Ecology/vue
---

# Edit Cell

This пример демонстрацияnstrates the ediтаблица capabilities из the таблица. Нажать на a cell к enter edit mode. If you want к modify the trigger для entering edit mode, Вы можете set:

```
 /** Edit trigger: double-Нажать событие | Нажать событие | manually включить editing via апи | enter новый значение. по умолчанию is double-Нажать 'doubleНажать' */
  editCellTrigger?: 'doubleНажать' | 'Нажать' | 'апи' | 'keydown' | ('doubleНажать' | 'Нажать' | 'апи' | 'keydown')[];
```

в the текущий пример, there are four types из editors: ввод, date, список, и textArea. Вы можете achieve different effects по setting different editors.

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const input_editor = новый Vтаблица_editors.InputEditor();
const date_input_editor = новый Vтаблица_editors.DateInputEditor();
Vтаблица.регистрация.editor('ввод-editor', input_editor);
Vтаблица.регистрация.editor('date-ввод-editor', date_input_editor);

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
    'Playing musical instruments',
    'Gardening',
    'Painting',
    'Writing',
    'Swimming'
  ];

  const numHobbies = Math.floor(Math.random() * 3) + 1;
  const selectedHobbies = [];

  для (let i = 0; i < numHobbies; i++) {
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    selectedHobbies.push(hobbies[randomIndex]);
    hobbies.splice(randomIndex, 1);
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
  const areaкод = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
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
      address: `No.${i + 100} ${generateRandomString(10)} ${generateRandomString(5)}`,
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
      Город: 'beijing'
    };
  });
};

const records = generatePersons(10);
const columns = [
  { поле: 'id', заголовок: 'ID', ширина: 80, сортировка: true },
  {
    поле: 'full имя',
    заголовок: 'Full имя',
    columns: [
      { поле: 'имя', заголовок: 'первый имя\n(ввод editor)', ширина: 120, editor: 'ввод-editor' },
      { поле: 'lastимя', заголовок: 'последний имя\n(ввод editor)', ширина: 100, editor: 'ввод-editor' }
    ]
  },
  { поле: 'birthday', заголовок: 'birthday\n(date editor)', ширина: 120, editor: 'date-ввод-editor' },
  { поле: 'sex', заголовок: 'sex\n(список editor)', ширина: 100, editor: 'список-editor' },
  { поле: 'address', заголовок: 'address\n(textArea editor)', ширина: 300, editor: 'textArea-editor' },
  { поле: 'tel', заголовок: 'telephone', ширина: 150 },
  { поле: 'work', заголовок: 'job', ширина: 200 },
  { поле: 'Город', заголовок: 'Город', ширина: 150 }
];

const option = {
  enableLineBreak: true,
  автоWrapText: true,
  limitMaxавтоширина: 600,
  высотаMode: 'автовысота',
  editCellTrigger: 'Нажать',
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true,
    selectAllOnCtrlA: true
  }
};

const app = createApp({
  template: `
    <vue-список-таблица :options="option" :records="records">
      <списокColumn
        v-для="column в columns"
        :key="column.поле"
        :поле="column.поле"
        :title="column.title"
        :ширина="column.ширина"
        :columns="column.columns"
        :editor="column.editor"
      />
    </vue-список-таблица>
  `,
  данные() {
    возврат {
      records,
      columns,
      option
    };
  }
});

app.компонент('vue-список-таблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
