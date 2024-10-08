<template>
  <vue-list-table :options="option" :records="records" ref="tableRef">
    <!-- Order Number Column -->
    <ListColumn :field="'bloggerId'" :title="'order number'" />

    <!-- Anchor Nickname Column with Custom Layout -->
    <ListColumn :field="'bloggerName'" :title="'anchor nickname'" :width="330" :style="{ fontFamily: 'Arial', fontWeight: 500 }">
      <template #customLayout="{ table, row, col, rect, record, height, width }">
        <Group :height="height" :width="width" display="flex" flexDirection="row" flexWrap="nowrap">
          <!-- Avatar Group -->
          <Group :height="percentCalc(100)" :width="60" display="flex" flexDirection="column" alignItems="center" justifyContent="space-around">
            <Image id="icon0" :width="50" :height="50" :image="record.bloggerAvatar" :cornerRadius="25" />
          </Group>
          <!-- Blogger Info Group -->
          <Group :height="height" :width="percentCalc(100, -60)" display="flex" flexDirection="column" flexWrap="nowrap">
            <!-- Blogger Name and Location -->
            <Group :height="percentCalc(50)" :width="percentCalc(100)" display="flex" alignItems="flex-end">
              <Text ref="textRef" :text="record.bloggerName" :fontSize="13" fontFamily="sans-serif" fill="black" />
              <Image id="location" image="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg"
                :width="15" :height="15" :boundsPadding="[0, 0, 0, 10]" cursor="pointer"
                @mouseEnter="handleMoueEnter($event)" @click="handleMouseClick($event)" @mouseLeave="handleMoueLeave($event)" />
              <Text :text="record.city" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
            </Group>
            <!-- Tags Group -->
            <Group :height="percentCalc(50)" :width="percentCalc(100)" display="flex" alignItems="center">
              <Tag v-for="tag in record?.tags" :key="tag" :text="tag" :textStyle="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }" :panel="{ visible: true, fill: '#f4f4f2', cornerRadius: 5 }" :space="5" :boundsPadding="[0, 0, 0, 5]" />
            </Group>
          </Group>
        </Group>
      </template>
    </ListColumn>

    <!-- Fans Count Column -->
    <ListColumn :field="'fansCount'" :title="'fansCount'" :fieldFormat="rec => rec.fansCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />

    <!-- Works Count Column -->
    <ListColumn :field="'worksCount'" :title="'worksCount'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />

    <!-- View Count Columns -->
    <ListColumn :field="'viewCount'" :title="'viewCount'" :fieldFormat="rec => rec.fansCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />
    <ListColumn :field="'viewCount'" :title="'viewCount'" :fieldFormat="rec => rec.viewCount + 'w'" :style="{ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' }" />

    <!-- Operation Column with Icons -->
    <ListColumn :field="''" :title="'operation'" :width="100" :icon="['favorite', 'message']" />

    <!-- Options Column with Custom Layout -->
    <ListColumn :field="''" :title="'选项'" :width="200">
      <template #customLayout="{ table, record, height, width }">
        <Group :height="height" :width="width" display="flex" flexDirection="column" justifyContent="center">
          <!-- Checkbox Group -->
          <Group display="flex" flexDirection="row" flexWrap="nowrap" :boundsPadding="[5, 0, 5, 10]" justifyContent="center">
            <Text text="operate: " :fontSize="12" :boundsPadding="[0, 10, 0, 0]" />
            <CheckBox :text="{ text: 'like', fontSize: 12 }" :spaceBetweenTextAndIcon="2" :boundsPadding="[0, 10, 0, 0]" @checkbox_state_change="handleCheckBoxStateChange($event)" />
            <CheckBox :text="{ text: 'collect', fontSize: 12 }" :spaceBetweenTextAndIcon="2" @checkbox_state_change="handleCheckBoxStateChange($event)" />
          </Group>
          <!-- Radio Button Group -->
          <Group display="flex" flexDirection="row" flexWrap="nowrap" :boundsPadding="[5, 0, 5, 10]">
            <Text ref="textRef" :text="'type: '" :fontSize="12" :boundsPadding="[0, 10, 0, 0]" />
            <Radio :text="{ text: 'normal', fontSize: 12 }" :checked="radio_state" :spaceBetweenTextAndIcon="2" :boundsPadding="[0, 10, 0, 0]" @radio_checked="handleRadioChecked($event)" />
            <Radio :text="{ text: 'special', fontSize: 12 }" :checked="true" :spaceBetweenTextAndIcon="2" @radio_checked="handleRadioChecked($event)" />
          </Group>
        </Group>
      </template>
    </ListColumn>
  </vue-list-table>
</template>


<script setup>
import { ref , onMounted, nextTick } from 'vue';
import { ListColumn } from '../../../../../src/components/index';
import { Group , Text , Image , Radio , CheckBox , Tag } from '../../../../../src/components/index';
import * as VTable from '@visactor/vtable';

const radio_state = ref(false);
const percentCalc = VTable.CustomLayout.percentCalc;

function handleMoueEnter(e) {
  e.currentTarget.attribute.background  = {fill: '#ccc',cornerRadius: 5,expandX: 1,expandY: 1};
  e.currentTarget.stage.renderNextFrame();
}

function handleMoueLeave(e) {
  e.currentTarget.attribute.background = null;
  e.currentTarget.stage.renderNextFrame();
}

function handleMouseClick(e) {
  console.log('Mouse click:', e);
}

function handleCheckBoxStateChange(e) {
  console.log('Checkbox state changed:', e);
}

function handleRadioChecked(e) {
  console.log('Radio checkeds',e.currentTarget._next);
} 

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
    title: 'follow',
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
    title: 'send message',
    style: {
      font: '10px Arial',
      bgColor: 'white',
      color: '#333',
      arrowMark: true
    }
  },
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/message.svg'
});


const records = ref([
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
      bloggerName: 'Virtual anchor little wolf',
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
      bloggerName: 'Virtual anchor bunny',
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
      bloggerName: 'Virtual anchor kitten',
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
      bloggerName: 'Virtual anchor Bear',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
      introduction:
        'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading and philosophy, I hope to explore the meaning of life with you through live broadcast.',
      fansCount: 1200,
      worksCount: 25,
      viewCount: 18,
      city: 'City of Wisdom',
      tags: ['Movie', 'Literature']
    },
    {
      bloggerId: 6,
      bloggerName: 'Virtual anchor bird',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting and variety shows. I hope to be happy with everyone through the live broadcast.',
      fansCount: 900,
      worksCount: 12,
      viewCount: 8,
      city: 'Happy City',
      tags: ['music', 'performance', 'variety']
    }
  ]);

const option = {
  defaultRowHeight: 80,
  select: {
      disableSelect: true,
    },
};

</script>