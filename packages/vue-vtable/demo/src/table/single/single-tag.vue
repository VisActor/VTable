<template>
  <ListTable :options="option" :records="records" ref="tableRef">
    <ListColumn
      :field="'Tag Component'"
      :title="'Tag Component'"
      :width="230"
      :style="{ fontFamily: 'Arial', fontWeight: 500 }"
    >
      <template #customLayout="{ table, row, col, rect, record, height, width }">
        <Group
          :height="height"
          :width="width"
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-around"
        >
          <Tag
            v-for="tag in record?.tags"
            :key="tag"
            :text="tag"
            :textStyle="{ fontSize: 14, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }"
            :padding="[8, 10]"
            :panel="{ visible: true, fill: '#f4f4f2', cornerRadius: 5 }"
            :space="5"
            :boundsPadding="[0, 0, 0, 5]"
          />
        </Group>
      </template>
    </ListColumn>
  </ListTable>
</template>

<script setup>
import { ref } from 'vue';
import { ListTable, ListColumn } from '@visactor/vue-vtable';
import { Group, Text, Image, Radio, CheckBox, Tag } from '@visactor/vue-vtable';

const records = ref([
  {
    bloggerId: 1,
    bloggerName: 'Virtual Anchor Xiaohua',
    tags: ['game', 'anime', 'food']
  },
]);

const option = {
  select: {
    disableSelect: true,
  },
};
</script>