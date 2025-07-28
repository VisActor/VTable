---
категория: примеры
группа: usвозраст
заголовок: Using Grammatical Tags
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-список-таблица.png
порядок: 1-1
ссылка: Developer_Ecology/vue
---

# Using Grammatical Tags

Utilize grammatical tags к compose a complete таблица configuration, generating the таблица as a subкомпонент.

- списокColumn: список column, consistent с the definition в option's columns [апи](../../option/списоктаблица-columns-текст#cellType)
- Can be combined с syntactic sugar к simplify код и improve readability

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
    <списоктаблица :options="таблицаOptions" >
      <списокColumn v-для="(column, index) в columns" :key="index" :поле="column.поле" :title="column.title" />
      <списокColumn поле="4" title="Email" maxширина="300"/>
      <списокColumn поле="5" title="Address" dragHeader="true"/>
      <списокColumn поле="6" title="Phone" dragHeader="true"/>
      <списокColumn поле="7" title="Status" dragHeader="true"/>
    </списоктаблица>
  `,
  данные() {
    возврат {
      columns: [
        { поле: '0', заголовок: 'имя' },
        { поле: '1', заголовок: 'возраст' },
        { поле: '2', заголовок: 'пол' },
        { поле: '3', заголовок: 'хобби' }
      ],
      таблицаOptions: {
        records: новый массив(1000).fill([
          'Zhang San',
          18,
          'Male',
          '🏀',
          '@пример',
          'xxx.xxx.xxx.xxx',
          '12345678901',
          'Normal'
        ])
      }
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
