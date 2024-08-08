<template></template>

<script setup lang="ts">
import type { TYPES } from '@visactor/vtable';

export type MenuProps = {
  renderMode?: 'canvas' | 'html';
  defaultHeaderMenuItems?: TYPES.MenuListItem[];
  contextMenuItems?: TYPES.MenuListItem[] | ((field: string, row: number, col: number) => TYPES.MenuListItem[]);
  dropDownMenuHighlight?: TYPES.DropDownMenuHighlightInfo[];
}
defineProps<MenuProps>();

</script>  