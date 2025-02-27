<!--
 * @Author: lym
 * @Date: 2025-02-24 10:51:41
 * @LastEditors: lym
 * @LastEditTime: 2025-02-27 17:03:22
 * @Description: 自定义dom组件-插槽式
-->
<template>
  <vue-list-table ref="tableRef" :options="tableOptions">
    <ListColumn
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :title="column.title"
      :width="column.width"
    >
      <template v-if="column.field === 'gender'" #headerCustomLayout="{ width, height, col }">
        <Group :width="width" :height="height" :vue="{}">
          <div class="align-justify">
            性别
            <a-popover title="表头筛选" trigger="click" position="bl">
              <IconMoreVertical />
              <template #content>
                <div class="align-justify">
                  <a-select
                    v-model="filterValue"
                    allow-clear
                    :style="{ width: '120px' }"
                    @change="filterData('gender', $event)"
                  >
                    <a-option>男</a-option>
                    <a-option>女</a-option>
                  </a-select>
                  <span @click="setFrozenColCount(col)">
                    <IconLock v-if="lock" size="20" /> <IconUnlock v-else size="20" />
                  </span>
                </div>
              </template>
            </a-popover>
          </div>
        </Group>
      </template>
      <template v-if="column.field === 'gender'" #customLayout="{ width, height, record }">
        <Group :width="width" :height="height" display="flex" align-items="center" :vue="{}">
          <IconWoman v-if="record.gender === '女'" />
          <IconMan v-else />
        </Group>
      </template>
    </ListColumn>
    <ListColumn field="comment" title="评论" min-width="360">
      <template #customLayout="{ width, height }">
        <Group :width="width" :height="height" :vue="{}">
          <a-comment author="Socrates" content="Comment body content." datetime="1 hour">
            <template #actions>
              <span key="heart" class="action">
                <span><IconHeart /></span>
                {{ 83 }}
              </span>
              <span key="star" class="action">
                <span> <IconStar /> </span>
                {{ 3 }}
              </span>
              <span key="reply" class="action"> <IconMessage /> Reply </span>
            </template>
            <template #avatar>
              <a-avatar>
                <img
                  alt="avatar"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                />
              </a-avatar>
            </template>
          </a-comment>
        </Group>
      </template>
    </ListColumn>
  </vue-list-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ListColumn, Group } from '../../../../../src/components/index';
import {
  IconMan,
  IconWoman,
  IconMoreVertical,
  IconHeart,
  IconMessage,
  IconStar,
  IconLock,
  IconUnlock
} from '@arco-design/web-vue/es/icon';
import * as VTable from '../../../../../../vtable/src/index';
import { generateMockData } from '../../utils';

const { columns, records } = generateMockData(1000);

/** 表格配置 */
const tableOptions = ref({
  theme: VTable.themes.default.DEFAULT.extends({
    scrollStyle: { barToSide: true, visible: 'always' }
  }),
  defaultHeaderRowHeight: 40,
  defaultRowHeight: 90,
  records,
  customConfig: {
    createReactContainer: true
  }
});

/** 筛选值 */
const filterValue = ref();
/** 是否锁定列 */
const lock = ref(false);

const tableRef = ref();

/**
 * @description: 数据筛选
 * @param {*} field
 * @param {*} value
 * @return {*}
 */
const filterData = (field: string, value: any) => {
  const { vTableInstance: instance } = tableRef.value;
  if (!value) {
    // tableOptions.value.records = records;
    instance.setRecords(records);
    return;
  }
  // tableOptions.value.records = records.filter(item => item[field] === value);
  instance.setRecords(records.filter(item => item[field] === value));
};
/**
 * @description: 冻结列
 * @param {*} count
 * @return {*}
 */
const setFrozenColCount = (count: number = 0) => {
  const { vTableInstance: instance } = tableRef.value;
  // instance.setFrozenColCount();
  instance.frozenColCount = !lock.value ? count + 1 : 0;
  lock.value = !lock.value;
};
</script>

<style scoped>
.align-justify {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
</style>
