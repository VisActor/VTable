---
категория: примеры
группа: компонент
заголовок: Подсказка компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-Подсказка.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица#Подсказка
---

# Подсказка компонент

Вы можете directly use the `Подсказка` configuration меню компонент, which is consistent с `option.Подсказка`.

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
   <списоктаблица :options="таблицаOptions" >
    
    <списокColumn v-для="(column, index) в columns" :key="index" :поле="column.поле" :title="column.title" />
    
    <Подсказка :isShowOverflowTextПодсказка="true" />   

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
  }
});

app.компонент('списоктаблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);
app.компонент('Подсказка', VueVтаблица.Подсказка);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
