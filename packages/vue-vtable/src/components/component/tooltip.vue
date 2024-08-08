<template></template>

<script setup lang="ts">

export type TooltipProps = {
  renderMode?: 'html';
  isShowOverflowTextTooltip?: boolean;
  confine?: boolean;
};

defineProps<TooltipProps>();

</script>  