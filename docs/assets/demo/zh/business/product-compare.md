---
category: examples
group: Business
title: 产品对比表
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-compare.png
order: 9-11
option: PivotTable#rowTree
---

# 产品对比表

扫地机器人怎么选 ❓︎ 多维度的产品配置参数对比，帮你做决定 ‼️

该示例通过配置 `PivotTable.rowTree` 自定义行表头树；通过 `indicators[x].style.bgColor`，将指标值不同的行背景色设置为红色，方便一眼看出不同

## 关键配置

- `PivotTable.rowTree` 自定义行表头树
- `indicators[x].style.bgColor` 配置某个指标内容的背景色

## 代码演示

```javascript livedemo template=vtable
const records = [
  {
    1: '交互功能族',
    3: '语音交互',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '基础语音',
    is_diff: true
  },
  {
    1: '交互功能族',
    3: '第三方音箱控制',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '视频通话',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '地毯检测',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '超声波 + 视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '悬崖防跌落',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '导航',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '凸起雷达+视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '机身高度',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '10.2 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '越障高度',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '2 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '避障能力',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '前向+侧向',
    is_diff: false
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '拖地闭环',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '视觉+光学传感器',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '扫地闭环',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '吸力',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '7000 Pa',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '地毯清洁',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '增压吸尘',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷控速',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷数量',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '单',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷抬升',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷机械臂',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷结构',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '普通边刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷控速',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷抬升',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷结构',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '单胶刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘方式',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '机身尘盒',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘容量',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '0.35 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '尘盒干燥',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '边角拖地',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '拖布外扩',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '机身水箱',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '自动补水',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '地板养护',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水拖地',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布结构',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '双圆盘旋转拖布',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布抬升',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖地力度调节',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布自动拆卸',
    4: '机器人',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '基站控制',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '自动上下水',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '选配',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '基站自清洁',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘能力',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '基站集尘袋',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘容量',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '2.7 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘烘干',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '清水箱容量',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '4 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '污水箱容量',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '3.5 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '电解水',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水洗拖布',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '智控热水',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '拖布烘干',
    4: '基站',
    brand: '某石',
    product: 'P10',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-0.png',
    release_time: '2023-08-29',
    first_price: 3999,
    product_feature: '标配',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '语音交互',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '语音大模型',
    is_diff: true
  },
  {
    1: '交互功能族',
    3: '第三方音箱控制',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '视频通话',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '地毯检测',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '超声波 + 视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '悬崖防跌落',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '导航',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '凸起雷达+视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '机身高度',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '10.3 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '越障高度',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '4 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '避障能力',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '前向+侧向',
    is_diff: false
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '拖地闭环',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '光学传感器',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '扫地闭环',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '吸力',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '18500 Pa',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '地毯清洁',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '增压吸尘',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷控速',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷数量',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '单',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷抬升',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷机械臂',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷结构',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '防缠绕边刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷控速',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷抬升',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷结构',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '气旋导流双毛胶对刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘方式',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '机身尘盒',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘容量',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '0.35 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '尘盒干燥',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '边角拖地',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '拖布外扩',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '机身水箱',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '自动补水',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '地板养护',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水拖地',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布结构',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '双圆盘旋转拖布',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布抬升',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖地力度调节',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布自动拆卸',
    4: '机器人',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '基站控制',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '自动上下水',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '选配',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '基站自清洁',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘能力',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '基站集尘袋',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘容量',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '2.5 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘烘干',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '清水箱容量',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '4 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '污水箱容量',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '3.5 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '电解水',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水洗拖布',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '智控热水',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '拖布烘干',
    4: '基站',
    brand: '某石',
    product: 'P20',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-1.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '标配',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '语音交互',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '语音大模型',
    is_diff: true
  },
  {
    1: '交互功能族',
    3: '第三方音箱控制',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '视频通话',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '地毯检测',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '超声波 + 视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '悬崖防跌落',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '导航',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '凸起雷达+视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '机身高度',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '10.38 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '越障高度',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '2.2 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '避障能力',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '前向+侧向',
    is_diff: false
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '拖地闭环',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '视觉+光学传感器',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '扫地闭环',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '吸力',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '11000 Pa',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '地毯清洁',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '增压吸尘',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷控速',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷数量',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '单',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷抬升',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷机械臂',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷结构',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '防缠绕边刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷控速',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷抬升',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷结构',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '剃刀式割毛滚刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘方式',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '机身尘盒',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘容量',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '0.3 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '尘盒干燥',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '边角拖地',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '拖布外扩 + 扭屁股',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '机身水箱',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '自动补水',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '地板养护',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水拖地',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布结构',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '双圆盘旋转拖布',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布抬升',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖地力度调节',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布自动拆卸',
    4: '机器人',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '基站控制',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '自动上下水',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '选配',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '基站自清洁',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘能力',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '基站集尘袋',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘容量',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '3.2 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘烘干',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '清水箱容量',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '4.5 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '污水箱容量',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '4 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '电解水',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水洗拖布',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '智控热水',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '拖布烘干',
    4: '基站',
    brand: '某觅',
    product: 'S30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-2.png',
    release_time: '2024-02-02',
    first_price: 4299,
    product_feature: '标配',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '语音交互',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '语音大模型',
    is_diff: true
  },
  {
    1: '交互功能族',
    3: '第三方音箱控制',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '视频通话',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '地毯检测',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '超声波 + 视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '悬崖防跌落',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '导航',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '凸起雷达+视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '机身高度',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '10.38 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '越障高度',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '2.2 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '避障能力',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '前向+侧向',
    is_diff: false
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '拖地闭环',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '视觉+光学传感器',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '扫地闭环',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '吸力',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '12000 Pa',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '地毯清洁',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '增压吸尘',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷控速',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷数量',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '单',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷抬升',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷机械臂',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷结构',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '防缠绕边刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷控速',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷抬升',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷结构',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '剃刀式割毛滚刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘方式',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '机身尘盒',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘容量',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '0.3 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '尘盒干燥',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '边角拖地',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '拖布外扩 + 扭屁股',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '机身水箱',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '自动补水',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '地板养护',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水拖地',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布结构',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '双圆盘旋转拖布',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布抬升',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖地力度调节',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布自动拆卸',
    4: '机器人',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '基站控制',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '自动上下水',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '选配',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '基站自清洁',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘能力',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '基站集尘袋',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘容量',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '3.2 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘烘干',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '清水箱容量',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '4.5 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '污水箱容量',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '4 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '电解水',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水洗拖布',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '智控热水',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '拖布烘干',
    4: '基站',
    brand: '某觅',
    product: 'S40',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-3.png',
    release_time: '2024-05-02',
    first_price: 4699,
    product_feature: '标配',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '语音交互',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '基础语音',
    is_diff: true
  },
  {
    1: '交互功能族',
    3: '第三方音箱控制',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '视频通话',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '地毯检测',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '超声波',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '悬崖防跌落',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '导航',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '凸起雷达+视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '机身高度',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '10.4 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '越障高度',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '2 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '避障能力',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '前向+侧向',
    is_diff: false
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '拖地闭环',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '光学传感器',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '扫地闭环',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '吸力',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '11000 Pa',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '地毯清洁',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '增压吸尘',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷控速',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷数量',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '单',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷抬升',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷机械臂',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷结构',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '普通边刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷控速',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷抬升',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷结构',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '毛胶滚刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘方式',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '机身尘盒',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘容量',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '0.3 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '尘盒干燥',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '边角拖地',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '拖布外扩',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '机身水箱',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '自动补水',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '地板养护',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水拖地',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布结构',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '双圆盘旋转拖布',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布抬升',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖地力度调节',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布自动拆卸',
    4: '机器人',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '基站控制',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '自动上下水',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '选配',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '基站自清洁',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘能力',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '基站集尘袋',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘容量',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '3.4 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘烘干',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '清水箱容量',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '4 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '污水箱容量',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '3.5 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '电解水',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水洗拖布',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '70℃',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '拖布烘干',
    4: '基站',
    brand: '某沃斯',
    product: 'T30',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-4.png',
    release_time: '2024-02-04',
    first_price: 3999,
    product_feature: '标配',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '语音交互',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '语音大模型',
    is_diff: true
  },
  {
    1: '交互功能族',
    3: '第三方音箱控制',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '视频通话',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '地毯检测',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '超声波 + 视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    3: '悬崖防跌落',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '导航',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '隐藏雷达+视觉',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '机身高度',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '8.1 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '越障高度',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '2 cm',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '障碍躲避',
    3: '避障能力',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '前向+侧向',
    is_diff: false
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '拖地闭环',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '视觉+光学传感器',
    is_diff: true
  },
  {
    1: '智能功能族',
    2: '脏污检测',
    3: '扫地闭环',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '视觉',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '吸力',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '15800 Pa',
    is_diff: true
  },
  {
    1: '扫地功能族',
    3: '地毯清洁',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '增压吸尘',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷控速',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷数量',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '单',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷抬升',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷机械臂',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '边刷',
    3: '边刷结构',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '普通边刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷控速',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷抬升',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '中滚刷',
    3: '中滚刷结构',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '毛胶滚刷',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘方式',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '机身尘盒',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '集尘容量',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '0.26 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '机器人集尘',
    3: '尘盒干燥',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '边角拖地',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '拖布外扩',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '机身水箱',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '自动补水',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '地板养护',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水拖地',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布结构',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '双圆盘旋转拖布',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布抬升',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: false
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖地力度调节',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '拖地功能族',
    2: '拖布',
    3: '拖布自动拆卸',
    4: '机器人',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '交互功能族',
    3: '基站控制',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '自动上下水',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '选配',
    is_diff: false
  },
  {
    1: '智能功能族',
    3: '基站自清洁',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '✅',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘能力',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '基站集尘袋',
    is_diff: false
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘容量',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '3.4 L',
    is_diff: true
  },
  {
    1: '扫地功能族',
    2: '基站集尘',
    3: '集尘烘干',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '清水箱容量',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '4 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '污水箱容量',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '3.5 L',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '电解水',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '❌',
    is_diff: false
  },
  {
    1: '拖地功能族',
    3: '热水洗拖布',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '70℃',
    is_diff: true
  },
  {
    1: '拖地功能族',
    3: '拖布烘干',
    4: '基站',
    brand: '某沃斯',
    product: 'T50',
    first_pic: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/product-5.png',
    release_time: '2024-08-26',
    first_price: 3999,
    product_feature: '标配',
    is_diff: false
  }
];

const option = {
  records,
  customComputeRowHeight: args => {
    if (args?.row === 2) {
      return 100;
    }
  },
  rowTree: [
    {
      value: '机器人',
      children: [
        {
          value: '交互功能族',
          children: [
            {
              value: '语音交互',
              dimensionKey: '3'
            },
            {
              value: '第三方音箱控制',
              dimensionKey: '3'
            },
            {
              value: '视频通话',
              dimensionKey: '3'
            }
          ],
          dimensionKey: '1'
        },
        {
          value: '智能功能族',
          children: [
            {
              value: '悬崖防跌落',
              dimensionKey: '3'
            },
            {
              value: '障碍躲避',
              children: [
                {
                  value: '机身高度',
                  dimensionKey: '3'
                },
                {
                  value: '越障高度',
                  dimensionKey: '3'
                }
              ],
              dimensionKey: '2'
            }
          ],
          dimensionKey: '1'
        },
        {
          value: '扫地功能族',
          children: [
            {
              value: '吸力',
              dimensionKey: '3'
            },
            {
              value: '地毯清洁',
              dimensionKey: '3'
            },
            {
              value: '边刷',
              children: [
                {
                  value: '边刷数量',
                  dimensionKey: '3'
                },
                {
                  value: '边刷机械臂',
                  dimensionKey: '3'
                },
                {
                  value: '边刷结构',
                  dimensionKey: '3'
                }
              ],
              dimensionKey: '2'
            },
            {
              value: '中滚刷',
              children: [
                {
                  value: '中滚刷控速',
                  dimensionKey: '3'
                },
                {
                  value: '中滚刷结构',
                  dimensionKey: '3'
                }
              ],
              dimensionKey: '2'
            },
            {
              value: '机器人集尘',
              children: [
                {
                  value: '集尘方式',
                  dimensionKey: '3'
                },
                {
                  value: '集尘容量',
                  dimensionKey: '3'
                }
              ],
              dimensionKey: '2'
            }
          ],
          dimensionKey: '1'
        },
        {
          value: '拖地功能族',
          children: [
            {
              value: '边角拖地',
              dimensionKey: '3'
            },
            {
              value: '热水拖地',
              dimensionKey: '3'
            },
            {
              value: '拖布',
              children: [
                {
                  value: '拖布结构',
                  dimensionKey: '3'
                },
                {
                  value: '拖布抬升',
                  dimensionKey: '3'
                }
              ],
              dimensionKey: '2'
            }
          ],
          dimensionKey: '1'
        }
      ],
      dimensionKey: '4'
    },
    {
      value: '基站',
      children: [
        {
          value: '交互功能族',
          children: [
            {
              value: '基站控制',
              dimensionKey: '3'
            }
          ],
          dimensionKey: '1'
        },
        {
          value: '智能功能族',
          children: [
            {
              value: '自动上下水',
              dimensionKey: '3'
            },
            {
              value: '基站自清洁',
              children: [],
              dimensionKey: '3'
            }
          ],
          dimensionKey: '1'
        },
        {
          value: '扫地功能族',
          children: [
            {
              value: '基站集尘',
              children: [
                {
                  value: '集尘能力',
                  dimensionKey: '3'
                },
                {
                  value: '集尘容量',
                  dimensionKey: '3'
                },
                {
                  value: '集尘烘干',
                  dimensionKey: '3'
                }
              ],
              dimensionKey: '2'
            }
          ],
          dimensionKey: '1'
        },
        {
          value: '拖地功能族',
          children: [
            {
              value: '清水箱容量',
              dimensionKey: '3'
            },
            {
              value: '污水箱容量',
              dimensionKey: '3'
            },
            {
              value: '热水洗拖布',
              dimensionKey: '3'
            },
            {
              value: '拖布烘干',
              dimensionKey: '3'
            }
          ],
          dimensionKey: '1'
        }
      ],
      dimensionKey: '4'
    }
  ],
  rows: [
    {
      dimensionKey: '4',
      title: '模块',
      headerStyle: {
        bgColor: '#fff'
      },
      width: 'auto'
    },
    {
      dimensionKey: '1',
      title: '分类',
      headerStyle: {
        bgColor: '#fff',
        fontWeight: 'normal'
      }
    },
    {
      dimensionKey: '2',
      title: '分组',
      headerStyle: {
        bgColor: '#fff',
        fontWeight: 'normal'
      }
    },
    {
      dimensionKey: '3',
      title: 'feature',
      headerStyle: {
        bgColor: '#fff',
        fontWeight: 'normal'
      }
    }
  ],
  columns: [
    {
      dimensionKey: 'brand',
      title: '品牌',
      headerStyle: {
        bgColor: '#fff',
        textAlign: 'center'
      }
    },
    {
      dimensionKey: 'product',
      title: '型号',
      headerStyle: {
        bgColor: '#fff',
        textAlign: 'center'
      }
    },
    {
      dimensionKey: 'first_pic',
      title: '图片',
      headerStyle: {
        bgColor: '#fff',
        textAlign: 'center'
      },
      keepAspectRatio: true,
      headerType: 'image'
    },
    {
      dimensionKey: 'release_time',
      title: '上市时间',
      headerStyle: {
        bgColor: '#fff',
        fontWeight: 'normal',
        textAlign: 'center'
      }
    },
    {
      dimensionKey: 'first_price',
      title: '价格',
      headerStyle: {
        bgColor: '#fff',
        fontWeight: 'normal',
        textAlign: 'center'
      }
    }
  ],
  indicators: [
    {
      cellType: 'text',
      indicatorKey: 'product_feature',
      title: 'product_feature',
      width: '150',
      showSort: false,
      style: {
        textAlign: 'center',
        bgColor: args => {
          const record = args.table.getCellRawRecord(args?.col, args?.row)?.[0];
          if (record?.is_diff) {
            return '#fbe9eb';
          }
          return '#fff';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'column',
    headerStyle: {
      bgColor: '#DFEBE8'
    }
  },
  dataConfig: {
    aggregationRules: [
      {
        field: 'product_feature',
        indicatorKey: 'product_feature',
        aggregationType: 'NONE'
      }
    ]
  },
  rowExpandLevel: 4,
  hideIndicatorName: true,
  rowHierarchyType: 'tree'
};

const container = document.getElementById(CONTAINER_ID);
container.style.height = '800px';
const tableInstance = new VTable.PivotTable(container, option);

window.tableInstance = tableInstance;
```
