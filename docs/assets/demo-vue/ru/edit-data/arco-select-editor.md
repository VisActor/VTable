---
category: examples
group: edit-cell
title: Using Arco Select in Custom Editor
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-editor-arco-select.png
link: Developer_Ecology/vue
---

# Using Arco Select in Custom Editor

Create a custom editor class `ArcoListEditor` and implement the `onStart` method to create an Arco Design `Select` component and mount it to the editor container. Complete the `isEditorElement` and `onEnd` methods.

References:

https://visactor.io/vtable/guide/edit/edit_cell

https://arco.design/vue/components/select

## Code Demonstration

```javascript livedemo template=vtable-vue
class ArcoListEditor {
  root = null;
  element = null;
  container = null;
  currentValue = null;

  onStart(editorContext) {
    const { container, referencePosition, value } = editorContext;
    this.container = container;
    this.createElement(value);
    if (value) this.setValue(value);
    if (referencePosition?.rect) this.adjustPosition(referencePosition.rect);
  }

  createElement(defaultValue) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.padding = '1px';
    div.style.boxSizing = 'border-box';
    this.container?.appendChild(div);

    const app = this.createVueApp(defaultValue);
    app.mount(div);
    this.root = app;
    this.element = div;
  }

  createVueApp(defaultValue) {
    const self = this;
    return createApp({
      data() {
        return {
          currentValue: defaultValue,
          options: ['Beijing', 'Shanghai', 'Guangzhou']
        };
      },
      render() {
        return h('div', {}, [
          h(
            ArcoDesignVue.Select,
            {
              style: { height: '32px' },
              placeholder: 'Select city',
              modelValue: this.currentValue,
              'onUpdate:modelValue': value => {
                this.currentValue = value;
                self.setValue(value);
              }
            },
            {
              default: () =>
                this.options.map(option =>
                  h(ArcoDesignVue.Option, { key: option, value: option, class: 'arco-select-vtable' }, { default: () => option })
                )
            }
          )
        ]);
      }
    });
  }

  getValue() {
    return this.currentValue;
  }

  setValue(value) {
    this.currentValue = value;
  }

  adjustPosition(rect) {
    if (this.element) {
      this.element.style.top = `${rect.top}px`;
      this.element.style.left = `${rect.left}px`;
      this.element.style.width = `${rect.width}px`;
      this.element.style.height = `${rect.height}px`;
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
    return this.element?.contains(target) || this.isClickPopUp(target);
  }

  isClickPopUp(target) {
    while (target) {
      if (target.classList && target.classList.contains('arco-select-vtable')) {
        return true;
      }
      target = target.parentNode;
    }
    return false;
  }
}

const input_editor = new VTable_editors.InputEditor();
const date_input_editor = new VTable_editors.DateInputEditor();
VTable.register.editor('input-editor', input_editor);
VTable.register.editor('date-input-editor', date_input_editor);
VTable.register.editor('arcoVue-editor', new ArcoListEditor());

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => {
    const first = generateRandomString(10);
    const last = generateRandomString(4);
    return {
      id: i + 1,
      email1: `${first}_${last}@xxx.com`,
      name: first,
      lastName: last,
      address: `No.${i + 100} ${generateRandomString(10)} ${generateRandomString(5)} ${generateRandomString(5)}`,
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
      city: 'beijing'
    };
  });
};

const records = generatePersons(10);
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80,
    sort: true
  },
  {
    field: 'full name',
    title: 'Full name',
    columns: [
      {
        field: 'name',
        title: 'First Name\n(input editor)',
        width: 140,
        editor: 'input-editor'
      },
      {
        field: 'lastName',
        title: 'Last Name\n(input editor)',
        width: 100,
        editor: 'input-editor'
      }
    ]
  },
  {
    field: 'address',
    title: 'location\n(arcoVue-editor)',
    width: 400,
    editor: 'arcoVue-editor'
  }
];

const option = {
  enableLineBreak: true,
  autoWrapText: true,
  limitMaxAutoWidth: 700,
  heightMode: 'autoHeight',
  editCellTrigger: 'click',
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true,
    selectAllOnCtrlA: true
  }
};

const app = createApp({
  template: `
    <ListTable :options="option" :records="records">
      <ListColumn
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :title="column.title"
        :width="column.width"
        :columns="column.columns"
        :editor="column.editor"
      />
    </ListTable>
  `,
  data() {
    return {
      records,
      columns,
      option
    };
  }
});

app.component('ListTable', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
