<template>
  <vue-list-table :options="option" :records="records">
    <ListColumn v-for="column in columns" :key="column.field" :field="column.field" :title="column.title" :width="column.width" :columns="column.columns" :editor="column.editor"/>
  </vue-list-table>
</template>

<script setup lang="ts">
import { createApp, h } from 'vue'; 
import { ListColumn } from '../../../../../src/components/index';
import { register } from '../../../../../src/index';
import * as VTable from '../../../../../../vtable/src/index';
import * as VTable_editors from '../../../../../../vtable-editors/src/index';
import { Select as ASelect, Option as AOption } from '@arco-design/web-vue';
import { editor } from '@visactor/vtable/es/register';

class ArcoListEditor {
  root: any;
  element: HTMLElement | null;
  container: HTMLElement | null;
  currentValue: string | null;

  constructor() {
    this.root = null;
    this.element = null;
    this.container = null;
    this.currentValue = null;
  }

  onStart(editorContext: any) {
    const { container, referencePosition, value } = editorContext;
    this.container = container;
    this.createElement(value);
    if (value) this.setValue(value);
    if (referencePosition?.rect) this.adjustPosition(referencePosition.rect);
  }

  createElement(defaultValue: string) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.padding = '1px';
    div.style.boxSizing = 'border-box';
    this.container?.appendChild(div);

    const app = this.createVueApp(defaultValue);
    app.component('a-select', ASelect);
    app.component('a-option', AOption);
    app.mount(div);
    this.root = app;
    this.element = div;

  }

  createVueApp(defaultValue: string) {
  const self = this; 
  return createApp({
    data() {
      return {
        currentValue: defaultValue,
        options: ['Beijing', 'Shanghai', 'Guangzhou'],
      };
    },
    render() {
      return h('div', {}, [
        h(
          ASelect,
          {
            style: {height: '32px'},
            placeholder: 'Select city',
            modelValue: this.currentValue,
            'onUpdate:modelValue': (value: any) => {
              this.currentValue = value;
              self.setValue(value); 
            },
          },
          {
            default: () =>
              this.options.map((option: any) =>
                h(AOption, { key: option, value: option, class: 'arco-select-vtable'}, { default: () => option })
              ),
          }
        ),
      ]);
    },
  });
}



  getValue() {
    return this.currentValue;
  }

  setValue(value: string) {
    this.currentValue = value;
  }

  adjustPosition(rect: DOMRect) {
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

  isEditorElement(target: HTMLElement) {
    return this.element?.contains(target) || this.isClickPopUp(target);
  }

  isClickPopUp(target: HTMLElement) {
    while (target) {
      if (target.classList && target.classList.contains('arco-select-vtable')) {
        return true;
      }
      target = target.parentNode as HTMLElement;
    }
    return false;
  }
}

const input_editor = new VTable_editors.InputEditor();
const date_input_editor = new VTable_editors.DateInputEditor();
register.editor('input-editor', input_editor);
register.editor('date-input-editor', date_input_editor);
register.editor('arcoVue-editor', new ArcoListEditor());

function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const generatePersons = (count: number) => {
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
  },
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

</script>