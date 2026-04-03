# React18 / React19 Demo 运行说明与依赖设计

## 背景

`@visactor/react-vtable` 的核心构建与发布依赖树以 React18 为主，但我们需要在同一个仓库内同时验证：

- React18（默认）运行是否正常
- React19（实验）运行是否正常
- 典型第三方组件（例如 Arco 的 Popover/Popconfirm/Comment）在 React19 下是否仍可用（历史上常因 `findDOMNode` 兼容性导致报错）

## 依赖设计

### 1. 默认依赖树（React18）

仓库默认依赖（用于开发/构建/发布）使用 React18：

- `react` / `react-dom`：React18
- `react-reconciler`：与 React 主版本强绑定，React18 对应 `react-reconciler@0.29.x`, React19 对应 `react-reconciler@0.31.x`

这是必要的，因为 `react-reconciler` 的内部实现与 React 主版本高度耦合，混用会出现运行时报错，最终导致 demo 白屏或渲染缺失。

### 2. React19 Demo 依赖树（.react19-deps）

为了在同仓库并行验证 React19，我们引入一个独立依赖树：

- 目录：`.react19-deps/`
- 内容：React19 相关依赖（`react`、`react-dom`、`react-reconciler` 等）
- 说明：该目录不是 Rush project，`rush update` 不会自动安装它的 `node_modules`；需要单独初始化一次

React19 Demo 在运行时通过 Vite alias 强制指向 `.react19-deps/node_modules`，从而避免与默认依赖树混用导致错误（典型报错：`A React Element from an older version of React was rendered`）。

### 3. Vite alias（React19 Demo 的关键）

React19 Demo 的 Vite 配置文件：

- [vite.config.react19.ts](file:///Users/bytedance/VisActor/VTable3/packages/react-vtable/demo/vite.config.react19.ts)

主要做两件事：

- `resolve.alias`：将 `react`、`react-dom`、`react-dom/client`、`react/jsx-runtime`、`react-reconciler` 等模块指向 `.react19-deps`
- esbuild prebundle 插件：确保依赖预构建阶段也走同一套映射

备注：alias 同时覆盖 `xxx(.js)?` 形式的导入路径，防止某些依赖显式带 `.js` 后缀绕过 alias，造成两份 React 并存。

### 4. Arco 组件的 React19 兼容性

历史问题：早期 UI 库（含 Arco 的部分版本）内部依赖 `react-dom.findDOMNode`，而 React19 不再提供该能力，导致 Popover/Popconfirm/Tooltip/Trigger 等组件在 React19 下报错并直接渲染失败。

本仓库将 `@arco-design/web-react` 升级并统一到 `2.66.12`，用于验证 React19 下是否已完成适配（避免 `findDOMNode is not a function`）。

## 如何运行 Demo

### 前置条件

- Node：建议使用仓库可用的 LTS（例如 `18.20.4`）
- 依赖安装：使用 Rush 管理依赖

在仓库根目录执行：

```bash
node common/scripts/install-run-rush.js update
```

初始化 React19 依赖（仅首次需要，或 `.react19-deps` 依赖变更后需要）：

```bash
cd .react19-deps
npm ci
```

也可以在 `packages/react-vtable` 下执行：

```bash
npm run setup:react19-deps
```

### 运行 React18 Demo（默认）

在 `packages/react-vtable` 目录执行：

```bash
npm run start
```

- 默认端口：`http://localhost:3100/`

### 运行 React19 Demo

在 `packages/react-vtable` 目录执行：

```bash
npm run start:react19
```

- 默认端口：`http://localhost:3101/`

### Demo 路由/选择方式

Demo 页通过 URL hash 选择示例：

- 例如：`http://localhost:3100/#pivotTable`
- 例如：`http://localhost:3101/#customLayoutDomSite1`

## 常见问题排查

## 调试方法

### 1. 用 onError 捕获“白屏/渲染中断”错误（推荐）

`@visactor/react-vtable` 组件支持 `onError` 回调。遇到页面空白、渲染缺失、custom-layout 不生效等问题时，优先在 demo 里挂上 `onError`，把内部渲染错误直接打到控制台，避免“静默失败”。

示例：

```tsx
<PivotTable
  option={option}
  onError={err => {
    console.error(err);
  }}
/>
```

备注：

- React19 下 `react-reconciler` 的容器创建会走 error callbacks；`react-vtable` 不会把错误写到任何全局变量，统一通过 `onError` 上抛（如果没传 `onError` 则不会产生额外副作用）。

### 2. 用 Chrome DevTools 调 Scenegraph（定位 canvas 渲染问题）

当现象是“画面不对/元素缺失/错位”，并且 DOM 结构正常时，需要直接看 VRender scenegraph（本质上就是 canvas 的显示列表）。

下面脚本建议在 Chrome DevTools Console 执行：

1) 获取最近创建的表格实例：

```js
window.__vtable__?.last || null
```

2) 多表/不确定时，从当前 canvas 上拿实例：

```js
(() => {
  const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  const canvas = el?.closest?.('canvas') || document.querySelector('canvas');
  return canvas ? canvas.__vtable__ || null : null;
})()
```

3) 拿到 `table` 后，重点看这些根节点分区（是否存在、children 数量是否为 0）：

```js
(() => {
  const table = window.__vtable__?.last;
  const sg = table?.scenegraph;
  if (!sg) return null;
  const pick = g => (g ? { type: g.type, name: g.name, role: g.role, childrenCount: g.childrenCount ?? g.children?.length ?? 0 } : null);
  return {
    id: table.id,
    stage: { width: sg.stage?.width, height: sg.stage?.height },
    groups: {
      tableGroup: pick(sg.tableGroup),
      colHeaderGroup: pick(sg.colHeaderGroup),
      cornerHeaderGroup: pick(sg.cornerHeaderGroup),
      rowHeaderGroup: pick(sg.rowHeaderGroup),
      bodyGroup: pick(sg.bodyGroup),
      rightFrozenGroup: pick(sg.rightFrozenGroup),
      bottomFrozenGroup: pick(sg.bottomFrozenGroup),
      componentGroup: pick(sg.componentGroup)
    }
  };
})()
```

更完整的“导出场景树/叠加 bounds 对比截图”等方法见仓库内的调试技能说明（可让AI利用该skill定位问题）：

- [vtable-debugger-skill](file:///Users/bytedance/VisActor/VTable3/.trae/skills/vtable-debugger-skill/SKILL.md)

### 1. 页面/截图空白（canvas 为 0 高度）

现象：标题正常，但表格区域全空白。

原因：某些 Table/Container 默认 `height: '100%'`，如果父容器未设置高度，`100%` 会计算为 0，canvas 渲染区域变成 0。

处理：Demo 根布局固定为 `height: 100vh` 并使用 flex 布局为 demo 分配剩余空间（见 demo 的 [App.tsx](file:///Users/bytedance/VisActor/VTable3/packages/react-vtable/demo/src/App.tsx)）。

### 2. React19 报 “older version of React element”

原因：同一页面内混入两份 React（默认依赖树 + `.react19-deps`）。

处理：

- 确认 React19 Demo 使用 [vite.config.react19.ts](file:///Users/bytedance/VisActor/VTable3/packages/react-vtable/demo/vite.config.react19.ts)
- alias 覆盖 `react/jsx-runtime(.js)?`、`react-dom/client(.js)?` 等路径

### 3. React19 下 Popover/Popconfirm 报 `findDOMNode is not a function`

原因：UI 库内部调用 `react-dom.findDOMNode`。

处理：

- 升级对应 UI 库版本（本仓库 Arco 已统一升级到 `2.66.12`）
- 或避免使用依赖 Trigger/findDOMNode 的组件
