---
category: examples
group: custom-layout
title: Vnode绑定elplus组件
cover:
order: 1-3
---

# 单元vnode绑定ElInput组件示例

单元格中通过Vnode绑定ElInput组件示例

## 代码演示

```javascript livedemo template=vtable-vue
<template>
  <vue-list-table :options="tableOptions" />
</template>

<script setup lang="ts">
import { ref, onMounted, h, createVNode, render, nextTick } from 'vue';
import { ElPopover, ElInput, ElTable, ElTableColumn } from 'element-plus';
import { VTable } from '@visactor/vue-vtable';

// 编辑值（单例共享，符合 VTable 编辑器机制）
const inputValue = ref('');

// 自定义编辑器：单价输入 + 历史价格悬浮弹窗
class PriceInputEditor {
  private container: HTMLElement | null = null;
  private editorConfig: Record<string, any>;
  private editorDom: HTMLElement | null = null;
  private endEdit: (() => void) | null = null;

  constructor(editorConfig: Record<string, any>) {
    this.editorConfig = editorConfig;
  }

  // 开始编辑
  async onStart({ container, referencePosition, value, endEdit }) {
    this.container = container;
    this.endEdit = endEdit;
    inputValue.value = value ?? '';

    // 历史价格列配置
    const historyColumns = [
      { prop: 'price', label: '历史单价', width: 80 },
      { prop: 'date', label: '更新时间', width: 130 }
    ];

    // 历史价格数据
    const historyData = [
      { price: 2.41, date: '2026-03-27' },
      { price: 5.67, date: '2026-03-28' }
    ];

    // 渲染编辑器：输入框 + Popover 悬浮表格
    const editorVNode = h(
      'div',
      {
        id: 'price-editor',
        style: {
          position: 'absolute',
          padding: '4px',
          width: '100%',
          boxSizing: 'border-box'
        }
      },
      h(
        ElPopover,
        { placement: 'right', trigger: 'hover', width: 200 },
        {
          // 输入框
          reference: () =>
            createVNode(ElInput, {
              modelValue: inputValue.value,
              'onUpdate:modelValue': val => (inputValue.value = val),
              type: 'number',
              min: 0,
              style: { width: '100%' }
            }),

          // 悬浮内容：历史价格表
          default: () =>
            h(ElTable, { width: '200px', data: historyData }, () => historyColumns.map(col => h(ElTableColumn, col)))
        }
      )
    );

    render(editorVNode, container);

    // 渲染完成后定位
    await nextTick();
    this.editorDom = document.getElementById('price-editor');
    if (referencePosition?.rect && this.editorDom) {
      this.adjustPosition(referencePosition.rect);
    }
  }

  // 自适应单元格位置
  adjustPosition(rect: DOMRect) {
    if (!this.editorDom) {
      return;
    }
    this.editorDom.style.top = `${rect.top}px`;
    this.editorDom.style.left = `${rect.left}px`;
    this.editorDom.style.width = `${rect.width}px`;
    this.editorDom.style.height = `${rect.height}px`;
  }

  // 获取最终值
  getValue() {
    return inputValue.value?.toString() || '';
  }

  // 销毁编辑器
  onEnd() {
    if (this.container) {
      render(null, this.container);
    }
    this.container = null;
    this.endEdit = null;
    this.editorDom = null;
  }

  // 判断点击是否在编辑器内
  isEditorElement(target: HTMLElement) {
    return this.editorDom?.contains(target);
  }
}

// 注册编辑器
const priceEditor = new PriceInputEditor({});
VTable.register.editor('price-editor', priceEditor);

// 表格配置
const tableOptions = ref({
  columns: [
    { field: 'Order ID', title: 'Order ID', width: 'auto' },
    { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
    { field: 'Product Name', title: 'Product Name', width: 'auto' },
    { field: 'Category', title: 'Category', width: 'auto' },
    { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
    { field: 'Region', title: 'Region', width: 'auto' },
    { field: 'City', title: 'City', width: 'auto' },
    { field: 'Order Date', title: 'Order Date', width: 'auto' },
    { field: 'Quantity', title: 'Quantity', width: 'auto' },
    { field: 'Sales', title: 'Price', width: 'auto', editor: 'price-editor' },
    { field: 'Profit', title: 'Profit', width: 'auto' }
  ],
  records: []
});

// 加载表格数据
const loadTableData = async () => {
  try {
    const res = await fetch(
      'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json'
    );
    const data = await res.json();
    tableOptions.value.records = data;
  } catch (err) {
    console.error('数据加载失败：', err);
  }
};

onMounted(async () => {
  await loadTableData();
});
</script>

```
