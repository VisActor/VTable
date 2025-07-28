---
категория: примеры
группа: пользовательский-макет
заголовок: пользовательский Cell компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-пользовательский-базовый.png
порядок: 1-1
ссылка: Developer_Ecology/vue
---

# пользовательский Cell компонент

Similar к пользовательскиймакет, Вы можете use Vue компонентs для пользовательский макетs. для more details, refer к [пользовательский компонент](../../guide/Developer_Ecology/react-пользовательский-компонент).

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
      <vue-список-таблица :options="option" :records="records" ref="таблицаRef">
         <!-- Order число Column -->
         <списокColumn :поле="'bloggerId'" :title="'Order число'" />

         <!-- Anchor Nickимя Column с пользовательский макет -->
         <списокColumn :поле="'bloggerимя'" :title="'Anchor Nickимя'" :ширина="330" :style="{ fontFamily: 'Arial', fontWeight: 500 }">
            <template #пользовательскиймакет="{ таблица, row, col, rect, record, высота, ширина }">
               <Group :высота="высота" :ширина="ширина" display="flex" flexDirection="row" flexWrap="nowrap">
                  <!-- Avatar Group -->
                  <Group :высота="высота" :ширина="60" display="flex" flexDirection="column" alignItems="центр" justifyContent="space-around" :fill="'red'" :opaГород="0.1">
                     <Imвозраст id="иконка0" :ширина="50" :высота="50" :imвозраст="record.bloggerAvatar" :cornerRadius="25" />
                  </Group>
                  <!-- Blogger информация Group -->
                  <Group :высота="высота" :ширина="ширина - 60" display="flex" flexDirection="column" flexWrap="nowrap">
                     <Group :высота="высота / 2" :ширина="ширина" display="flex" flexWrap="wrap" :alignItems="'центр'" :fill="'orange'" :opaГород="0.1">
                        <текст ref="textRef" :текст="record.bloggerимя" :fontSize="13" fontFamily="sans-serif" fill="black" :boundsPadding="[0, 0, 0, 10]" />
                        <Imвозраст id="location" imвозраст="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg" :ширина="15" :высота="15" :boundsPadding="[0, 0, 0, 10]" cursor="pointer" @mouseEnter="handleMouseEnter($событие)" @Нажать="handleMouseНажать($событие)" @mouseLeave="handleMouseLeave($событие)" />
                        <текст :текст="record.Город" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
                     </Group>
                     <!-- Tags Group -->
                     <Group :высота="высота / 2" :ширина="ширина" display="flex" alignItems="центр" :fill="'yellow'" :opaГород="0.1">
                        <Tag v-для="tag в record?.tags" :key="tag" :текст="tag" :textStyle="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }" :panel="{ видимый: true, fill: '#f4f4f2', cornerRadius: 5 }" :space="5" :boundsPadding="[0, 0, 0, 5]" />
                     </Group>
                  </Group>
               </Group>
            </template>
         </списокColumn>

         <!-- Other Columns -->
         <списокColumn :поле="'fansCount'" :title="'Fans Count'" :полеFormat="rec => rec.fansCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
         <списокColumn :поле="'worksCount'" :title="'Works Count'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
         <списокColumn :поле="'viewCount'" :title="'View Count'" :полеFormat="rec => rec.viewCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
         <списокColumn :поле="'viewCount'" :title="'View Count'" :полеFormat="rec => rec.viewCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
      </vue-список-таблица>
   `,
  данные() {
    возврат {
      таблицаRef: ref(null),
      records: ref([
        {
          bloggerId: 1,
          bloggerимя: 'Virtual Anchor Xiaohua',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg',
          introduction:
            'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation и food. I hope к share happy moments с you through live broadcast.',
          fansCount: 400,
          worksCount: 10,
          viewCount: 5,
          Город: 'Dream Город',
          tags: ['game', 'anime', 'food']
        },
        {
          bloggerId: 2,
          bloggerимя: 'Virtual Anchor Little Wolf',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg',
          introduction:
            'Hello everyone, I am the virtual anchor Little Wolf. I like music, travel и photography, и I hope к explore the beauty из the world с you through live broadcast.',
          fansCount: 800,
          worksCount: 20,
          viewCount: 15,
          Город: 'Город из Music',
          tags: ['music', 'travel', 'photography']
        },
        {
          bloggerId: 3,
          bloggerимя: 'Virtual Anchor Bunny',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg',
          introduction:
            'Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts и beauty makeup. I hope к share creativity и fashion с you through live broadcast.',
          fansCount: 600,
          worksCount: 15,
          viewCount: 10,
          Город: 'Город из Art',
          tags: ['painting', 'handmade', 'beauty makeup']
        },
        {
          bloggerId: 4,
          bloggerимя: 'Virtual Anchor Kitten',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg',
          introduction:
            'Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness и coхорошоing. I hope к live a healthy и happy life с everyone through the live broadcast.',
          fansCount: 1000,
          worksCount: 30,
          viewCount: 20,
          Город: 'Health Город',
          tags: ['dance', 'fitness', 'coхорошоing']
        },
        {
          bloggerId: 5,
          bloggerимя: 'Virtual Anchor Bear',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg',
          introduction:
            'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading и philosophy, I hope к explore the meaning из life с you through live broadcast.',
          fansCount: 1200,
          worksCount: 25,
          viewCount: 18,
          Город: 'Город из Wisdom',
          tags: ['movie', 'literature']
        },
        {
          bloggerId: 6,
          bloggerимя: 'Virtual Anchor Bird',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bird.jpeg',
          introduction:
            'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting и variety shows. I hope к be happy с everyone through the live broadcast.',
          fansCount: 900,
          worksCount: 12,
          viewCount: 8,
          Город: 'Happy Город',
          tags: ['music', 'Производительность', 'variety']
        }
      ]),
      опция: {
        defaultRowвысота: 80,
        выбрать: {
          disableSelect: true
        }
      }
    };
  },
  методы: {
    handleMouseEnter(e) {
      e.currentTarget.attribute.фон = { fill: '#ccc', cornerRadius: 5, expandX: 1, expandY: 1 };
      e.currentTarget.stвозраст.renderNextFrame();
    },
    handleMouseLeave(e) {
      e.currentTarget.attribute.фон = null;
      e.currentTarget.stвозраст.renderNextFrame();
    },
    handleMouseНажать(e) {
      console.log('Mouse Нажать:', e);
    }
  },
  mounted() {
    Vтаблица.регистрация.иконка('location', {
      тип: 'svg',
      имя: 'location',
      positionType: Vтаблица.TYPES.иконкаPosition.лево,
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/location.svg'
    });
    Vтаблица.регистрация.иконка('favorite', {
      тип: 'svg',
      имя: 'favorite',
      positionType: Vтаблица.TYPES.иконкаPosition.лево,
      ширина: 20,
      высота: 20,
      cursor: 'pointer',
      Подсказка: {
        placement: Vтаблица.TYPES.Placement.верх,
        заголовок: 'Follow',
        style: {
          шрифт: '10px Arial',
          bgColor: 'white',
          цвет: '#333',
          arrowMark: true
        }
      },
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/favorite.svg'
    });
    Vтаблица.регистрация.иконка('messвозраст', {
      тип: 'svg',
      имя: 'messвозраст',
      positionType: Vтаблица.TYPES.иконкаPosition.лево,
      ширина: 20,
      высота: 20,
      marginLeft: 10,
      cursor: 'pointer',
      Подсказка: {
        placement: Vтаблица.TYPES.Placement.верх,
        заголовок: 'Send Messвозраст',
        style: {
          шрифт: '10px Arial',
          bgColor: 'white',
          цвет: '#333',
          arrowMark: true
        }
      },
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/messвозраст.svg'
    });
  }
});

app.компонент('vue-список-таблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);
app.компонент('Group', VueVтаблица.Group);
app.компонент('текст', VueVтаблица.текст);
app.компонент('Imвозраст', VueVтаблица.Imвозраст);
app.компонент('Tag', VueVтаблица.Tag);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
