---
категория: примеры
группа: usвозраст
заголовок: Using Full Option
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-по умолчанию.png
порядок: 1-1
ссылка: Developer_Ecology/vue
---

# Using Full Option

Вы можете directly use the full option из Vтаблица по passing the option as a prop к the таблица компонент.

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
    <списоктаблица :options="таблицаOptions"/>
  `,
  данные() {
    возврат {
      таблицаOptions: {
        columns: [
          { поле: '0', заголовок: 'имя' },
          { поле: '1', заголовок: 'возраст' },
          { поле: '2', заголовок: 'пол' },
          { поле: '3', заголовок: 'хобби' }
        ],
        records: новый массив(1000).fill(['John', 18, 'male', '🏀'])
      }
    };
  }
});

app.компонент('списоктаблица', VueVтаблица.списоктаблица);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
