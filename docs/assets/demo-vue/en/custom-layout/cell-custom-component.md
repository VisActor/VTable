---
category: examples
group: custom-layout
title: Custom Cell Component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-custom-basic.png
order: 1-1
link: Developer_Ecology/vue
---

# Custom Cell Component

Similar to customLayout, you can use Vue components for custom layouts. For more details, refer to [Custom Component](../guide/Developer_Ecology/react-custom-component).

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
      <vue-list-table :options="option" :records="records" ref="tableRef">
         <!-- Order Number Column -->
         <ListColumn :field="'bloggerId'" :title="'Order Number'" />

         <!-- Anchor Nickname Column with Custom Layout -->
         <ListColumn :field="'bloggerName'" :title="'Anchor Nickname'" :width="330" :style="{ fontFamily: 'Arial', fontWeight: 500 }">
            <template #customLayout="{ table, row, col, rect, record, height, width }">
               <Group :height="height" :width="width" display="flex" flexDirection="row" flexWrap="nowrap">
                  <!-- Avatar Group -->
                  <Group :height="height" :width="60" display="flex" flexDirection="column" alignItems="center" justifyContent="space-around" :fill="'red'" :opacity="0.1">
                     <Image id="icon0" :width="50" :height="50" :image="record.bloggerAvatar" :cornerRadius="25" />
                  </Group>
                  <!-- Blogger Info Group -->
                  <Group :height="height" :width="width - 60" display="flex" flexDirection="column" flexWrap="nowrap">
                     <Group :height="height / 2" :width="width" display="flex" flexWrap="wrap" :alignItems="'center'" :fill="'orange'" :opacity="0.1">
                        <Text ref="textRef" :text="record.bloggerName" :fontSize="13" fontFamily="sans-serif" fill="black" :boundsPadding="[0, 0, 0, 10]" />
                        <Image id="location" image="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg" :width="15" :height="15" :boundsPadding="[0, 0, 0, 10]" cursor="pointer" @mouseEnter="handleMouseEnter($event)" @click="handleMouseClick($event)" @mouseLeave="handleMouseLeave($event)" />
                        <Text :text="record.city" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
                     </Group>
                     <!-- Tags Group -->
                     <Group :height="height / 2" :width="width" display="flex" alignItems="center" :fill="'yellow'" :opacity="0.1">
                        <Tag v-for="tag in record?.tags" :key="tag" :text="tag" :textStyle="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }" :panel="{ visible: true, fill: '#f4f4f2', cornerRadius: 5 }" :space="5" :boundsPadding="[0, 0, 0, 5]" />
                     </Group>
                  </Group>
               </Group>
            </template>
         </ListColumn>

         <!-- Other Columns -->
         <ListColumn :field="'fansCount'" :title="'Fans Count'" :fieldFormat="rec => rec.fansCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
         <ListColumn :field="'worksCount'" :title="'Works Count'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
         <ListColumn :field="'viewCount'" :title="'View Count'" :fieldFormat="rec => rec.viewCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
         <ListColumn :field="'viewCount'" :title="'View Count'" :fieldFormat="rec => rec.viewCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
      </vue-list-table>
   `,
  data() {
    return {
      tableRef: ref(null),
      records: ref([
        {
          bloggerId: 1,
          bloggerName: 'Virtual Anchor Xiaohua',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
          introduction:
            'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation and food. I hope to share happy moments with you through live broadcast.',
          fansCount: 400,
          worksCount: 10,
          viewCount: 5,
          city: 'Dream City',
          tags: ['game', 'anime', 'food']
        },
        {
          bloggerId: 2,
          bloggerName: 'Virtual Anchor Little Wolf',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
          introduction:
            'Hello everyone, I am the virtual anchor Little Wolf. I like music, travel and photography, and I hope to explore the beauty of the world with you through live broadcast.',
          fansCount: 800,
          worksCount: 20,
          viewCount: 15,
          city: 'City of Music',
          tags: ['music', 'travel', 'photography']
        },
        {
          bloggerId: 3,
          bloggerName: 'Virtual Anchor Bunny',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
          introduction:
            'Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts and beauty makeup. I hope to share creativity and fashion with you through live broadcast.',
          fansCount: 600,
          worksCount: 15,
          viewCount: 10,
          city: 'City of Art',
          tags: ['painting', 'handmade', 'beauty makeup']
        },
        {
          bloggerId: 4,
          bloggerName: 'Virtual Anchor Kitten',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
          introduction:
            'Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness and cooking. I hope to live a healthy and happy life with everyone through the live broadcast.',
          fansCount: 1000,
          worksCount: 30,
          viewCount: 20,
          city: 'Health City',
          tags: ['dance', 'fitness', 'cooking']
        },
        {
          bloggerId: 5,
          bloggerName: 'Virtual Anchor Bear',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
          introduction:
            'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading and philosophy, I hope to explore the meaning of life with you through live broadcast.',
          fansCount: 1200,
          worksCount: 25,
          viewCount: 18,
          city: 'City of Wisdom',
          tags: ['movie', 'literature']
        },
        {
          bloggerId: 6,
          bloggerName: 'Virtual Anchor Bird',
          bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg',
          introduction:
            'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting and variety shows. I hope to be happy with everyone through the live broadcast.',
          fansCount: 900,
          worksCount: 12,
          viewCount: 8,
          city: 'Happy City',
          tags: ['music', 'performance', 'variety']
        }
      ]),
      option: {
        defaultRowHeight: 80,
        select: {
          disableSelect: true
        }
      }
    };
  },
  methods: {
    handleMouseEnter(e) {
      e.currentTarget.attribute.background = { fill: '#ccc', cornerRadius: 5, expandX: 1, expandY: 1 };
      e.currentTarget.stage.renderNextFrame();
    },
    handleMouseLeave(e) {
      e.currentTarget.attribute.background = null;
      e.currentTarget.stage.renderNextFrame();
    },
    handleMouseClick(e) {
      console.log('Mouse click:', e);
    }
  },
  mounted() {
    VTable.register.icon('location', {
      type: 'svg',
      name: 'location',
      positionType: VTable.TYPES.IconPosition.left,
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg'
    });
    VTable.register.icon('favorite', {
      type: 'svg',
      name: 'favorite',
      positionType: VTable.TYPES.IconPosition.left,
      width: 20,
      height: 20,
      cursor: 'pointer',
      tooltip: {
        placement: VTable.TYPES.Placement.top,
        title: 'Follow',
        style: {
          font: '10px Arial',
          bgColor: 'white',
          color: '#333',
          arrowMark: true
        }
      },
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/favorite.svg'
    });
    VTable.register.icon('message', {
      type: 'svg',
      name: 'message',
      positionType: VTable.TYPES.IconPosition.left,
      width: 20,
      height: 20,
      marginLeft: 10,
      cursor: 'pointer',
      tooltip: {
        placement: VTable.TYPES.Placement.top,
        title: 'Send Message',
        style: {
          font: '10px Arial',
          bgColor: 'white',
          color: '#333',
          arrowMark: true
        }
      },
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/message.svg'
    });
  }
});

app.component('vue-list-table', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);
app.component('Group', VueVTable.Group);
app.component('Text', VueVTable.Text);
app.component('Image', VueVTable.Image);
app.component('Tag', VueVTable.Tag);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
