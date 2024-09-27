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
          <Radio
            :text="{ text: 'normal', fontSize: 12 }"
            :checked="radio_state"
            :spaceBetweenTextAndIcon="2"
            :boundsPadding="[0, 10, 0, 0]"
            @radio_checked="handleRadioChecked($event, table)"
          />
          <Radio
            :text="{ text: 'special', fontSize: 12 }"
            :checked="radio_state"
            :spaceBetweenTextAndIcon="2"
            @radio_checked="handleRadioChecked($event, table)"
          />
        </Group>
      </template>
    </ListColumn>
  </ListTable>
</template>

<script setup>
import { ref } from 'vue';
import { ListTable, ListColumn } from '@visactor/vue-vtable';
import { Group, Radio } from '@visactor/vue-vtable';

const radio_state = ref(false);

const handleRadioChecked = (e, table) => {
  console.log('handleCheckBoxStateChange', e);
};

const records = ref([
  {
    bloggerId: 1,
    bloggerName: 'Virtual Anchor Xiaohua',
    tags: ['game', 'anime', 'food'],
  },
]);

const option = {
  select: {
    disableSelect: true,
  },
};
</script>