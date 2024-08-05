<template>
  <div ref="columnRef">...</div>
</template>

<script setup lang="ts">
import { onMounted , ref} from 'vue';
import type { ColumnDefine } from '@visactor/vtable';
// import type { 
//   LinkColumnDefine, 
//   ImageColumnDefine, 
//   SparklineColumnDefine, 
//   ProgressbarColumnDefine, 
//   CheckboxColumnDefine, 
//   RadioColumnDefine, 
//   ChartColumnDefine, 
//   TextColumnDefine, 
//   CompositeColumnDefine 
// } from '@visactor/vtable';


// export type ColumnsDefine = 
//   | LinkColumnDefine
//   | ImageColumnDefine
//   | SparklineColumnDefine
//   | ProgressbarColumnDefine
//   // | CheckboxColumnDefine
//   // | RadioColumnDefine
//   | ChartColumnDefine
//   | TextColumnDefine;
//   // | CompositeColumnDefine;

interface ListColumnProps {
    field: string | number;
    title: string;
}

defineProps<ListColumnProps>();

const name = ref('list-column');
</script>  