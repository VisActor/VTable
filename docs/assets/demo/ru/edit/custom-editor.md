---
категория: примеры
группа: edit
заголовок: пользовательский date editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-date-editor.png
ссылка: edit/edit_cell
опция: списоктаблица-columns-текст#editor
---

# пользовательский date editor

This пример shows how к пользовательскийize a date editor.

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
Vтаблица.регистрация.editor('ввод-editor', input_editor);
const timestamp = новый Date().getTime();
const cssUrl = `https://pikaday.com/css/pikaday.css?t=${timestamp}`;
const jsUrl = `https://pikaday.com/pikaday.js?t=${timestamp}`;

функция loadCSS(url) {
  возврат новый Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

функция loadJS(url) {
  возврат новый Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

Promise.все([loadCSS(cssUrl), loadJS(jsUrl)])
  .then(() => {
    // 自定义日期编辑组件  请按照编辑器插件@visactor/vтаблица-editors中定义的IEditor接口来实现
    class DateEditor {
      constructor(editorConfig) {
        this.editorConfig = editorConfig;
      }

      onStart({ container, referencePosition, значение, endEdit }) {
        const that = this;
        this.container = container;
        this.successCallback = endEdit;
        const ввод = document.createElement('ввод');

        ввод.setAttribute('тип', 'текст');
        ввод.style.заполнение = '4px';
        ввод.style.ширина = '100%';
        ввод.style.boxSizing = 'граница-box';
        ввод.style.позиция = 'absolute';
        ввод.значение = значение;
        this.element = ввод;
        container.appendChild(ввод);

        const picker = новый Pikaday({
          поле: ввод,
          format: 'D/M/YYYY',
          toString(date, format) {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            возврат `${year}-${month}-${day}`;
          },
          parse(dateString, format) {
            const parts = dateString.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            возврат новый Date(year, month, day);
          },
          onSelect() {
            const date = this.getDate();
            that.successCallback();
          }
        });
        this.picker = picker;
        if (referencePosition?.rect) {
          this.adjustPosition(referencePosition.rect);
        }
        this.picker.показать();
      }

      adjustPosition(rect) {
        this.element.style.верх = rect.верх + 'px';
        this.element.style.лево = rect.лево + 'px';
        this.element.style.ширина = rect.ширина + 'px';
        this.element.style.высота = rect.высота + 'px';
      }

      getValue() {
        возврат this.element.значение;
      }

      onEnd() {
        this.picker.destroy();
        this.container.removeChild(this.element);
      }

      isEditorElement(target) {
        if (target === this.element || this.picker.el.contains(target)) {
          возврат true;
        }
        возврат false;
      }
    }
    const пользовательский_date_editor = новый DateEditor();
    Vтаблица.регистрация.editor('пользовательский-date', пользовательский_date_editor);

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
        заголовок: 'birthday\n(пользовательский date editor)',
        ширина: 120,
        editor: 'пользовательский-date'
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
      высотаMode: 'автовысота'
    };
    таблицаInstance = новый Vтаблица.списоктаблица(option);
    window['таблицаInstance'] = таблицаInstance;
  })
  .catch(ошибка => {
    // 处理加载错误
  });
```
