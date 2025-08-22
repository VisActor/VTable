---
категория: примеры
группа: компонент
заголовок: меню компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-меню.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица#меню
---

# меню компонент

Вы можете directly use the `меню` к configure the меню компонент, which is consistent с the option.меню configuration.

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
   <списоктаблица :options="таблицаOptions" @onDropdownменюНажать="handleDropdownменюНажать">
    
    <списокColumn v-для="(column, index) в columns" :key="index" :поле="column.поле" :title="column.title" />
    
    <меню менюType="html" :contextменюItems="['copy', 'paste', 'delete', '...']" />

   </списоктаблица>
  `,
  данные() {
    возврат {
      columns: [
        { поле: '0', заголовок: 'имя' },
        { поле: '1', заголовок: 'Address' },
        { поле: '2', заголовок: 'Phone' }
      ],
      таблицаOptions: {
        records: новый массив(1000).fill(['John Doe', 'xxx.xxx.xxx.xxx', '12345678901'])
      }
    };
  },
  методы: {
    handleDropdownменюНажать(args) {
      console.log('меню Нажать', args);
    }
  }
});

app.компонент('списоктаблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);
app.компонент('меню', VueVтаблица.меню);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
