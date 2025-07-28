---
категория: примеры
группа: usвозраст
заголовок: событие списокening
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-список-таблица.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица-columns-текст#cellType
---

# событие списокening

все событиеs supported по Vтаблица can be списокened к through Vue's props. для more details, refer к the [событие список](<[../апи/событие](https://www.visactor.io/vтаблица/guide/Developer_Ecology/react#%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)>).

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
    <списоктаблица :options="таблицаOptions" @onMouseEnterCell="handleMouseEnterCell">
      <списокColumn v-для="(column, index) в columns" :key="index" :поле="column.поле" :title="column.title" />
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
        records: новый массив(1000).fill(['John Doe', 18, 'Male', '🏀'])
      }
    };
  },
  методы: {
    handleMouseEnterCell(arg) {
      console.log('Mouse entered cell:', arg);
    }
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
