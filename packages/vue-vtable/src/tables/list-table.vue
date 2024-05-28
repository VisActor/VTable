<template>
  <div ref="vTableContainer" style="width: 100%; height: 400px" />
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { ListTable } from '@visactor/vtable'; // 确保已正确引入 VTable

export default defineComponent({
  name: 'ListTable',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const vTableContainer = ref(null);
    const vTableInstance = ref(null); // 创建一个引用来存储 VTable 实例

    onMounted(() => {
      // 确保容器 DOM 存在
      if (vTableContainer.value) {
        // 创建 VTable 实例并存储
        vTableInstance.value = new ListTable(vTableContainer.value, props.options);
      }
      // 假设您需要在组件销毁时销毁 VTable 实例，您可以存储这个实例
      // 并在 onBeforeUnmount 中调用它的销毁方法
    });
    return {
      vTableContainer
    };
  }
});
</script>

<style>
/* 在这里添加您的样式 */
</style>
