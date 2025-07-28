---
категория: примеры
группа: пользовательский-макет
заголовок: Cell Rendering DOM компонентs
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-пользовательский-dom-компонент.jpeg
порядок: 1-2
ссылка: пользовательский_define/vue-dom-компонент
---

# Cell Rendering DOM компонентs

в `vue-vтаблица`, Вы можете directly render DOM компонентs within таблица cells, enabling seamless integration из complex Vue компонентs для highly пользовательскийizable таблица displays. Two approaches are supported: **slot-based** и **directly passing компонентs into the `column` configuration**. Both методы require wrapping компонентs с the `Group` компонент.

**🛠️ Core configuration steps: включить DOM компонент rendering**

к render DOM компонентs в `vue-vтаблица`, follow these key steps:

- **Pass the `vue` property к the `Group` компонент**: This allows the `Group` компонент к recognize и process Vue компонентs.
- **включить `пользовательскийConfig.createReactContainer`**: This configuration creates a таблица container к ensure Vue компонентs render correctly within the таблица.

**✨ Method 1: Slot-Based Rendering**

Slot-based rendering uses the `headerпользовательскиймакет` и `пользовательскиймакет` slots из the `списокColumn` компонент. пользовательский компонентs must be wrapped в the `Group` компонент.

- **`headerпользовательскиймакет`**: пользовательскийizes header cell rendering.
- **`пользовательскиймакет`**: пользовательскийizes body cell rendering.

**✨ Method 2: Direct Configuration-Based Rendering**

This method is similar к slot-based rendering but does не use slots. Instead, directly pass virtual nodes via the `element` property в the `column.headerпользовательскиймакет` или `column.пользовательскиймакет` configuration. The usвозраст aligns с [пользовательский компонентs](../../guide/пользовательский_define/пользовательский_макет).

**⚠️ Notes**

- **Enabling Interactions**: If пользовательский cells require mouse interactions, manually включить `pointer-событиеs`. See the пример below.

## код демонстрация

```javascript liveдемонстрация template=vтаблица-vue
// в this демонстрация, we показать how к render пользовательский Vue компонентs в the таблица. Specifically:
// - **пол Column**: Renders пол headers using the `ArкодsignVue.Tag` компонент.
// - **Comment Column**: Renders comments с the `ArкодsignVue.Comment` компонент, including action Кнопкаs для likes, favorites, и replies.

const app = createApp({
  template: `
   <vue-список-таблица :options="option" :records="records" ref="таблицаRef">
    <списокColumn поле="имя" title="имя" ширина="200" />
    <списокColumn поле="возраст" title="возраст" ширина="150" />
    <списокColumn поле="Город" title="Город" ширина="150" />
    <списокColumn поле="пол" title="пол" ширина="100">
      <template #headerпользовательскиймакет="{ ширина, высота }">
        <Group :ширина="ширина" :высота="высота" display="flex" align-items="центр" :vue="{}">
          <ATag цвет="green"> пол </ATag>
        </Group>
      </template>
    </списокColumn>
    <списокColumn поле="comment" title="Comment" ширина="300">
      <template #пользовательскиймакет="{ ширина, высота, record }">
        <Group :ширина="ширина" :высота="высота" display="flex" align-items="центр" :vue="{}">
          <AComment author="Socrates" :content="record['comment']" datetime="1 hour">
            <template #actions>
              <span key="heart" style="cursor: pointer; pointer-событиеs: авто">
                {{ 83 }}
              </span>
              <span key="star" style="cursor: pointer; pointer-событиеs: авто">
                {{ 3 }}
              </span>
              <span key="reply" style="cursor: pointer; pointer-событиеs: авто"> Reply </span>
            </template>
            <template #avatar>
              <AAvatar>
                <img
                  alt="avatar"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                />
              </AAvatar>
            </template>
          </AComment>
        </Group>
      </template>
    </списокColumn>
  </vue-список-таблица>
  `,
  данные() {
    возврат {
      таблицаRef: ref(null),
      опция: {
        records: [
          { пол: 'Male', имя: 'Zhang San', возраст: 20, Город: 'Beijing' },
          { пол: 'Female', имя: 'Li Si', возраст: 21, Город: 'Shanghai' },
          { пол: 'Male', имя: 'Wang Wu', возраст: 22, Город: 'Guangzhou' },
          { пол: 'Female', имя: 'Zhao Liu', возраст: 23, Город: 'Shenzhen' },
          { пол: 'Male', имя: 'Sun Qi', возраст: 24, Город: 'Chengdu' },
          { пол: 'Female', имя: 'Zhou Ba', возраст: 25, Город: 'Chongqing' },
          { пол: 'Male', имя: 'Wu Jiu', возраст: 26, Город: "Xi'an" }
        ],
        defaultHeaderRowвысота: 40,
        defaultRowвысота: 80,
        пользовательскийConfig: {
          createReactContainer: true
        }
      }
    };
  }
});

app.компонент('vue-список-таблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);
app.компонент('Group', VueVтаблица.Group);
app.компонент('ATag', ArкодsignVue.Tag);
app.компонент('AComment', ArкодsignVue.Comment);
app.компонент('AAvatar', ArкодsignVue.Avatar);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
