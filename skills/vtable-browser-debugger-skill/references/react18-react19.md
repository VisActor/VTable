# React18 / React19 差异排查（聚焦 custom-layout / reconciler / DOM overlay）

## 适用范围

当出现以下现象时使用本指南：
- React18 demo 正常，React19 demo 异常（尤其是 custom-layout 单元格空白/不更新/偏移）
- 报错包含：`A React Element from an older version of React was rendered`
- 报错包含：`Cannot read properties of undefined (reading 'ReactCurrentOwner')`
- 报错包含：`Uncaught TypeError: type is not a function` 且栈里有 `decodeReactDom`
- 报错包含：`findDOMNode is not a function`（第三方组件兼容问题）
- React19 页面无明显报错，但 scenegraph/DOM overlay 看起来“像没渲染”

本指南目标是快速把问题归因到以下几类之一：
- 两份 React/ReactDOM 混用（最常见）
- react-reconciler/HostConfig 参数签名变化导致 commit/update 写坏属性
- DOM overlay（react attribute）容器/尺寸/定位问题
- 第三方组件（Popover/Trigger 等）对 React19 API 依赖问题

## 快速决策树（先选分支，再执行脚本）

- 看到 `older version of React element` / 同页出现多个 React renderer：跳到 “1) 是否存在两份 React”
- 看到 `ReactCurrentOwner` 相关报错：跳到 “2.1) react-reconciler 与 React 主版本是否匹配”
- 看到 `decodeReactDom` + `type is not a function`：跳到 “2.2) customLayout 走了 decodeReactDom，rootContainer 类型不符合预期”
- custom-layout 单元格空白且无明显报错：跳到 “3) Fiber 污染”
- custom-layout / DOM demo 直接报 `resolveEventTimeStamp is not a function` / `trackSchedulerEvent is not a function`：跳到 “3.3) HostConfig 缺失 React19 必需回调”
- scenegraph 节点存在但 DOM overlay 不显示/位置不对：跳到 “4) DOM overlay”
- 报 `findDOMNode is not a function`：跳到 “5) 第三方组件兼容性”

## 0) 预设：先确保你已经拿到 table

先用 [snippets.md](file:///Users/bytedance/VisActor/VTable3/.trae/skills/vtable-browser-debugger-skill/references/snippets.md) 的 “查找 VTable 实例” 拿到 `table`。

后续脚本都默认：
- `const table = globalThis.tableInstance || globalThis.__vtable__?.last`

## 1) 快速判断：是否存在“两份 React”

两份 React 的典型症状：
- React19 demo 里混入了默认依赖树的 React18（或相反）
- 报错 `older version of React element`，或者 custom-layout 完全不更新但不报错

### 1.1 看 DevTools hook 里的 renderer 列表

```js
() => {
  const hook = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook?.renderers) return { ok: false, reason: 'no devtools hook' };
  const out = [];
  for (const [id, r] of hook.renderers) {
    out.push({
      id,
      rendererPackageName: r.rendererPackageName,
      version: r.version,
      bundleType: r.bundleType
    });
  }
  return { ok: true, renderers: out };
}
```

判断要点：
- 同一页面如果出现“多个 React renderer”（尤其版本差异明显），优先怀疑两份 React

### 1.2 看 react-vtable renderer 是否真的挂了 root

```js
() => {
  const hook = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook?.renderers) return { ok: false, reason: 'no devtools hook' };
  let rendererId = null;
  for (const [id, r] of hook.renderers) {
    if (r.rendererPackageName === 'react-vtable') rendererId = id;
  }
  if (!rendererId) return { ok: false, reason: 'no react-vtable renderer' };
  const roots = hook.getFiberRoots(rendererId);
  return { ok: true, rendererId, rootCount: roots?.size ?? 0 };
}
```

判定建议：
- `rootCount === 0`：custom-layout 没有真正 commit，优先怀疑 reconciler 或依赖树问题

## 2) 获取错误线索：优先用 onError / demo error

如果 demo/业务挂了 `onError`，通常会把错误写到 `globalThis.__react_vtable_last_error__` 或直接 console.error。

```js
() => {
  const g = globalThis;
  return {
    lastOnError: g.__react_vtable_last_error__ || null,
    demoErrorText: g.document?.getElementById('__demo_error__')?.textContent?.trim() || null
  };
}
```

## 2.1) react-reconciler 与 React 主版本是否匹配（React19 常见崩溃点）

现象：
- `Cannot read properties of undefined (reading 'ReactCurrentOwner')`
- 报错发生在 `react-reconciler.*.js` 内部（尤其是 `$$$reconciler` / `reconciler.js`）

常见原因：
- 业务用 React19，但依赖树里被锁到了 React18 对应的 `react-reconciler@0.29.x`（或别的旧版本）
- 或 `react-vtable` 自身的依赖/构建配置在 React19 场景下没有切到对应版本（demo 里通常用 alias/.react19-deps 解决）

排查要点：
- 优先确认“是否两份 React”（见 1)）
- 再确认 custom-layout 使用的 reconciler 来自哪个包/版本（看 lockfile、node_modules、bundle 产物）

修复建议（按优先级）：
- 组件库层面：为 React19 场景提供匹配的 reconciler（或通过 demo 脚本确保依赖落到 React19 对应版本）
- 应用层面：仅作为“快速验证/临时兜底”可用 `overrides`/`resolutions` 修正版本，但根因应回到组件库适配

**npm overrides 示例（用于快速验证）：**

```json
{
  "overrides": {
    "react-reconciler": "0.33.0"
  }
}
```

说明：
- 这类配置属于应用层“锁依赖”手段，适合验证“是否确实是 reconciler 版本不匹配”导致的崩溃
- 最终仍建议把修复沉到组件库（例如 demo 脚本确保 React19 依赖树一致），避免业务工程各自维护 overrides

## 2.2) customLayout 走了 decodeReactDom，rootContainer 类型不符合预期（`type is not a function`）

现象：
- 控制台报：`Uncaught TypeError: type is not a function`
- 堆栈包含：`decodeReactDom (custom.js:...)` / `dealWithCustom`
- 新加 demo（或业务）里“语义化标签/自定义组件”写法返回了 `rootContainer: <Something />`，页面空白

机制解释（关键）：
- VTable core 的 `customLayout` 支持返回“类 ReactElement 结构”，随后在 `decodeReactDom` 里执行 `const g = type({ attribute })`
- 这里要求 `dom.type` 必须是“可调用的构造函数”（如 `VGroup/VText/VTag/VImage` 这类函数），否则就会 `type is not a function`

排查/修复建议：
- 如果你在走 **VTable core 的 customLayout（非 react-custom-layout）**：
  - `rootContainer` 请使用 `@visactor/vtable` 导出的 `VGroup/VText/VTag/VImage/...`（它们的 `type` 是 function）
  - 不要把 `React.forwardRef` 的组件、或业务 React 组件当成 rootContainer 直接返回
- 如果你希望在单元格里渲染“真正的 React 组件 / DOM”：
  - 走 `react-custom-layout`（即在 `ListColumn` children 里写 `<CustomLayout role="custom-layout">...</CustomLayout>` / 或者用 `react attribute`）
  - 让 `@visactor/react-vtable` 的 reconciler 创建真正的 VRender 图元实例（避免 VTable core decodeReactDom 路径）

## 3) 关键判定：Fiber 污染（React19 custom-layout 空白的典型原因）

“Fiber 污染”指 VRender 图元的 `attribute` 被写入了 React Fiber 对象字段（例如 `tag/child/sibling/return/memoizedProps/lanes`），导致坐标/尺寸/visible 等属性被覆盖，最终视觉上看起来是“空白/偏移/不更新”。

这类问题通常来源于：React19 的 `react-reconciler` HostConfig 回调签名变化（最常见是 `commitUpdate` 参数顺序变化），而实现仍按 React18 签名处理。

### 3.1 扫描 scenegraph：找 attribute 上的 Fiber 字段

```js
() => {
  const table = globalThis.tableInstance || globalThis.__vtable__?.last || null;
  const root = table?.scenegraph?.bodyGroup;
  if (!root) return { ok: false, reason: 'no bodyGroup' };

  function listChildren(node) {
    if (!node) return [];
    if (node._firstChild) {
      const out = [];
      let c = node._firstChild;
      while (c) {
        out.push(c);
        c = c._next;
      }
      return out;
    }
    if (Array.isArray(node.children)) return node.children;
    return [];
  }

  const fiberKeys = new Set(['tag', 'child', 'sibling', 'return', 'memoizedProps', 'memoizedState', 'lanes', 'childLanes']);
  const hits = [];
  const q = [root];
  while (q.length && hits.length < 20) {
    const n = q.shift();
    if (!n) continue;
    const a = n.attribute;
    if (a && typeof a === 'object') {
      const keys = Object.keys(a);
      const bad = keys.filter(k => fiberKeys.has(k));
      if (bad.length) {
        hits.push({ type: n.type, role: n.role, name: n.name, col: n.col, row: n.row, badKeys: bad });
      }
    }
    for (const c of listChildren(n)) q.push(c);
  }
  return { ok: true, hitCount: hits.length, hits };
}
```

判定建议：
- `hitCount > 0`：基本可以确定是 reconciler/HostConfig 把 Fiber 写进 attribute
- 下一步不要再调 bounds 细节，直接回到 HostConfig（尤其 `commitUpdate`）确认参数签名适配

### 3.2 对比 cell vs custom-container bounds（快速判断偏移/尺寸异常）

```js
(col = 3, row = 1) => {
  const table = globalThis.tableInstance || globalThis.__vtable__?.last || null;
  const root = table?.scenegraph?.bodyGroup;
  if (!root) return { ok: false, reason: 'no bodyGroup' };

  function listChildren(node) {
    if (!node) return [];
    if (node._firstChild) {
      const out = [];
      let c = node._firstChild;
      while (c) {
        out.push(c);
        c = c._next;
      }
      return out;
    }
    if (Array.isArray(node.children)) return node.children;
    return [];
  }

  function b(node) {
    const bb = node?.globalAABBBounds || node?.AABBBounds;
    if (!bb) return null;
    return { x1: bb.x1, y1: bb.y1, x2: bb.x2, y2: bb.y2, w: bb.x2 - bb.x1, h: bb.y2 - bb.y1 };
  }

  const colGroup = listChildren(root).find(n => n.role === 'column' && n.col === col);
  const cell = colGroup ? listChildren(colGroup).find(n => n.role === 'cell' && n.row === row) : null;
  const custom = cell ? listChildren(cell).find(n => n.name === 'custom-container') : null;
  const customInner = custom ? listChildren(custom)[0] : null;
  return { ok: true, cellBounds: b(cell), customBounds: b(custom), customInnerBounds: b(customInner) };
}
```

典型异常：
- `customBounds` 明显大于 cell（例如 500x500），且 y/x 偏移很大

## 3.3) HostConfig 缺失 React19 必需回调（`resolveEventTimeStamp` / `trackSchedulerEvent`）

现象：
- DOM custom-layout demo 直接空白
- 控制台报：
  - `TypeError: resolveEventTimeStamp is not a function`
  - `TypeError: trackSchedulerEvent is not a function`
- 堆栈往往包含 `react-reconciler` 的 updateContainer/performWork 逻辑，或 `@visactor/react-vtable` 的 `reconcilerUpdateContainer`

原因：
- React19 对应的 `react-reconciler` 会从 HostConfig（即 `ReactReconciler(hostConfig)` 的参数对象）读取并调用：
  - `trackSchedulerEvent`
  - `resolveEventType`
  - `resolveEventTimeStamp`
  - `shouldAttemptEagerTransition`
- 旧的 HostConfig（按 React18 写的）没有提供这些字段，导致运行时直接 TypeError

修复建议：
- 组件库层面：在 `packages/react-vtable/src/table-components/custom/reconciler.ts` 的 HostConfig 补齐上述回调（给出安全默认实现）
- 如果你仍然遇到上述报错：说明你使用的 `@visactor/react-vtable` 版本尚未包含该修复（需要升级到包含 HostConfig 补丁的版本）

## 4) DOM overlay（react attribute）专项检查

当 scenegraph 里节点存在，但“DOM 内容不显示/位置不对”时优先检查：
- `react.container` 是否为 null/undefined，是否指向正确的 `table.bodyDomContainer` 或 `table.headerDomContainer`
- `react.width/react.height` 是否给了合理值（部分类型定义要求）
- overlay 容器是否被 CSS 覆盖（例如 `display:none`、`overflow:hidden`、z-index）

定位策略：
- 先看 `componentGroup` 是否有对应节点
- 再在 Elements 面板查看 overlay 容器内是否真的插入了 DOM

## 5) 第三方组件兼容性（findDOMNode）

当 React19 下第三方组件报 `findDOMNode is not a function`：
- 优先升级组件库版本（例如 Trigger/Popover/Tooltip 依赖 findDOMNode 的历史版本）
- 或在 demo/业务里替换为不依赖 findDOMNode 的实现

## 6) 结论与下一步

- 两份 React：先修 Vite alias / 依赖树，保证 React/ReactDOM/react-reconciler 同源
- Fiber 污染：优先修 reconciler HostConfig 的签名兼容（常见点：`commitUpdate`）
- DOM overlay：优先修 container/尺寸/定位，再回到 scenegraph 细查
