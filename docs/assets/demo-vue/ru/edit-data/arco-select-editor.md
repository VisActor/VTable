---
категория: примеры
группа: edit-cell
заголовок: Using Arco выбрать в пользовательский Editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-editor-arco-выбрать.png
ссылка: Developer_Ecology/vue
---

# Using Arco выбрать в пользовательский Editor

Create a пользовательский editor class `ArcoсписокEditor` и implement the `onStart` method к create an Arco Design `выбрать` компонент и mount it к the editor container. Complete the `isEditorElement` и `onEnd` методы.

References:

https://visactor.io/vтаблица/guide/edit/edit_cell

https://arco.design/vue/компонентs/выбрать

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
class ArcoсписокEditor {
  root = null;
  element = null;
  container = null;
  currentValue = null;

  onStart(editorContext) {
    const { container, referencePosition, значение } = editorContext;
    this.container = container;
    this.createElement(значение);
    if (значение) this.setValue(значение);
    if (referencePosition?.rect) this.adjustPosition(referencePosition.rect);
  }

  createElement(defaultValue) {
    const div = document.createElement('div');
    div.style.позиция = 'absolute';
    div.style.ширина = '100%';
    div.style.заполнение = '1px';
    div.style.boxSizing = 'граница-box';
    this.container?.appendChild(div);

    const app = this.createVueApp(defaultValue);
    app.mount(div);
    this.root = app;
    this.element = div;
  }

  createVueApp(defaultValue) {
    const self = this;
    возврат createApp({
      данные() {
        возврат {
          currentValue: defaultValue,
          options: ['Beijing', 'Shanghai', 'Guangzhou']
        };
      },
      render() {
        возврат h('div', {}, [
          h(
            ArкодsignVue.выбрать,
            {
              style: { высота: '32px' },
              placeholder: 'выбрать Город',
              modelValue: this.currentValue,
              'onUpdate:modelValue': значение => {
                this.currentValue = значение;
                self.setValue(значение);
              }
            },
            {
              по умолчанию: () =>
                this.options.map(option =>
                  h(ArкодsignVue.Option, { key: option, значение: option, class: 'arco-выбрать-vтаблица' }, { по умолчанию: () => option })
                )
            }
          )
        ]);
      }
    });
  }

  getValue() {
    возврат this.currentValue;
  }

  setValue(значение) {
    this.currentValue = значение;
  }

  adjustPosition(rect) {
    if (this.element) {
      this.element.style.верх = `${rect.верх}px`;
      this.element.style.лево = `${rect.лево}px`;
      this.element.style.ширина = `${rect.ширина}px`;
      this.element.style.высота = `${rect.высота}px`;
    }
  }

  onEnd() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.element && this.container) {
      this.container.removeChild(this.element);
      this.element = null;
    }
  }

  isEditorElement(target) {
    возврат this.element?.contains(target) || this.isНажатьPopUp(target);
  }

  isНажатьPopUp(target) {
    while (target) {
      if (target.classсписок && target.classсписок.contains('arco-выбрать-vтаблица')) {
        возврат true;
      }
      target = target.parentNode;
    }
    возврат false;
  }
}

const input_editor = новый Vтаблица_editors.InputEditor();
const date_input_editor = новый Vтаблица_editors.DateInputEditor();
Vтаблица.регистрация.editor('ввод-editor', input_editor);
Vтаблица.регистрация.editor('date-ввод-editor', date_input_editor);
Vтаблица.регистрация.editor('arcoVue-editor', новый ArcoсписокEditor());

функция generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  для (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  возврат result;
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
      address: `No.${i + 100} ${generateRandomString(10)} ${generateRandomString(5)} ${generateRandomString(5)}`,
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
  {
    поле: 'full имя',
    заголовок: 'Full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя\n(ввод editor)',
        ширина: 140,
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
  {
    поле: 'address',
    заголовок: 'location\n(arcoVue-editor)',
    ширина: 400,
    editor: 'arcoVue-editor'
  }
];

const option = {
  enableLineBreak: true,
  автоWrapText: true,
  limitMaxавтоширина: 700,
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
    <списоктаблица :options="option" :records="records">
      <списокColumn
        v-для="column в columns"
        :key="column.поле"
        :поле="column.поле"
        :title="column.title"
        :ширина="column.ширина"
        :columns="column.columns"
        :editor="column.editor"
      />
    </списоктаблица>
  `,
  данные() {
    возврат {
      records,
      columns,
      option
    };
  }
});

app.компонент('списоктаблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
