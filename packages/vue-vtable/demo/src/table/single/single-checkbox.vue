<template>
  <ListTable :options="option" :records="records" ref="tableRef">
    <ListColumn
      :field="'Checkbox Component'"
      :title="'Checkbox Component'"
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
          <CheckBox
            :text="{ text: 'like', fontSize: 16, fill: 'rgb(51, 101, 238)' }"
            :spaceBetweenTextAndIcon="2"
            :boundsPadding="[0, 10, 0, 0]"
            @checkbox_state_change="handleCheckBoxStateChange($event)"
          />
          <CheckBox
            :text="{ text: 'collect', fontSize: 15, fill: 'rgb(51, 101, 238)' }"
            :spaceBetweenTextAndIcon="2"
            @checkbox_state_change="handleCheckBoxStateChange($event)"
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

const handleCheckBoxStateChange = (e) => {
  console.log('handleCheckBoxStateChange', e);
};

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