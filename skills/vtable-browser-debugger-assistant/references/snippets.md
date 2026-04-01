# DevTools 脚本片段（复制到 evaluate_script 用）

## 0) MCP 连接不上 Chrome（先处理这个再跑脚本）

如果 MCP 报错：
- `Could not connect to Chrome ... Could not find DevToolsActivePort ...`
- `Network.enable timed out ...`

先解决"连不上 Chrome"再继续排查 scenegraph。

### 0.1 `DevToolsActivePort` 找不到（最常见）

现象：MCP 报 `Could not find DevToolsActivePort for chrome-beta at .../DevToolsActivePort`。

含义：Chrome 没有以 remote-debugging 模式启动，或 MCP 在找的 profile 目录里没有端口文件。

处理（macOS / Chrome Beta）：
- 关闭所有 Chrome / Chrome Beta
- 用"非默认 user-data-dir"启动（Chrome 会拒绝在默认 profile 上开 remote debugging）：

```bash
rm -rf /tmp/trae-chrome-beta-devtools
/Applications/Google\\ Chrome\\ Beta.app/Contents/MacOS/Google\\ Chrome\\ Beta \\
  --remote-debugging-port=0 \\
  --user-data-dir=/tmp/trae-chrome-beta-devtools \\
  --no-first-run \\
  --no-default-browser-check
```

- 如果 MCP 固定读取 `~/Library/Application Support/Google/Chrome Beta/DevToolsActivePort`，把端口文件软链过去：

```bash
mkdir -p "/Users/bytedance/Library/Application Support/Google/Chrome Beta"
ln -sf /tmp/trae-chrome-beta-devtools/DevToolsActivePort \\
  "/Users/bytedance/Library/Application Support/Google/Chrome Beta/DevToolsActivePort"
```

- 验证端口是否真的起来（端口号以 DevToolsActivePort 文件内容为准）：
  - `cat /tmp/trae-chrome-beta-devtools/DevToolsActivePort`
  - `curl -s http://127.0.0.1:<port>/json/version`
  - 确认 `chrome://inspect/#remote-debugging` 能打开且页面列表可见

### 0.2 `Network.enable timed out`

含义：MCP 已经连到 Chrome，但在启用 DevTools Network domain 时超时（常见原因：Chrome 进程卡死/扩展干扰/remote debugging 未干净启动）。

处理：
- 优先用上面的 `0.1` 方式（全新 user-data-dir）重启 Chrome（最有效）
- 确认 `chrome://inspect/#remote-debugging` 能打开且页面列表可见
- 如果仍超时，关闭可能拦截网络请求的扩展（抓包/代理/安全类扩展）后重试

## 1) 查找页面上的 VTable 实例

### 1.1 最快：取最近创建的表格

```js
() => window.__vtable__?.last || null
```

### 1.2 多表：按鼠标位置/屏幕中心找 canvas 绑定的表格

```js
() => {
  const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  const canvas = el?.closest?.('canvas') || document.querySelector('canvas');
  return canvas ? canvas.__vtable__ || null : null;
}
```

### 1.3 兜底：扫描 window（较慢）

```js
() => {
  const out = [];
  for (const k of Object.keys(window)) {
    const v = window[k];
    if (!v || typeof v !== 'object') continue;
    const sg = v.scenegraph;
    if (sg && sg.tableGroup && sg.stage) {
      out.push({
        key: k,
        id: v.id,
        canvas: !!v.canvas,
        stage: { width: sg.stage?.width, height: sg.stage?.height },
        hasTableGroup: !!sg.tableGroup
      });
    }
  }
  return out;
}
```

## 2) 快速查看各分区 group 的 childrenCount

```js
(tableKey) => {
  const table = window[tableKey];
  const sg = table?.scenegraph;
  if (!sg) return null;
  const pick = (g) => (g ? { type: g.type, name: g.name, role: g.role, childrenCount: g.childrenCount ?? g.children?.length ?? 0 } : null);
  return {
    id: table.id,
    groups: {
      tableGroup: pick(sg.tableGroup),
      colHeaderGroup: pick(sg.colHeaderGroup),
      rowHeaderGroup: pick(sg.rowHeaderGroup),
      cornerHeaderGroup: pick(sg.cornerHeaderGroup),
      bodyGroup: pick(sg.bodyGroup),
      rightFrozenGroup: pick(sg.rightFrozenGroup),
      bottomFrozenGroup: pick(sg.bottomFrozenGroup),
      componentGroup: pick(sg.componentGroup)
    }
  };
}
```

## 3) 在 bodyGroup 里按 col/row 找某个 cell group（启发式）

说明：VTable 的层级随布局而变，这里用"遍历 + role/col/row 匹配"的启发式找 cell。

```js
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
  if (typeof node.forEachChildren === 'function') {
    const out = [];
    node.forEachChildren((c) => {
      out.push(c);
      return false;
    });
    return out;
  }
  return [];
}

function walkFind(root, pred, max = 1) {
  const out = [];
  const q = [root];
  while (q.length && out.length < max) {
    const n = q.shift();
    if (!n) continue;
    if (pred(n)) out.push(n);
    const children = listChildren(n);
    for (const c of children) q.push(c);
  }
  return out;
}

(tableKey, col, row) => {
  const table = window[tableKey];
  const sg = table?.scenegraph;
  const root = sg?.bodyGroup;
  if (!root) return null;
  const nodes = walkFind(
    root,
    (n) => (n.role === 'cell' || n.name === 'cell') && n.col === col && n.row === row,
    5
  );
  return nodes.map((n) => ({ type: n.type, name: n.name, role: n.role, col: n.col, row: n.row, attribute: n.attribute }));
}
```

## 4) 导出任意 group 的树（深度可控）

```js
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
  if (typeof node.forEachChildren === 'function') {
    const out = [];
    node.forEachChildren((c) => {
      out.push(c);
      return false;
    });
    return out;
  }
  return [];
}

function pickBounds(node) {
  const b = node?.globalAABBBounds || node?.AABBBounds;
  if (!b) return null;
  return { x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2, w: b.x2 - b.x1, h: b.y2 - b.y1 };
}

function dumpNode(node, depth, maxDepth) {
  const attr = node?.attribute || {};
  const me = {
    type: node?.type,
    name: node?.name,
    role: node?.role,
    col: node?.col,
    row: node?.row,
    visible: attr.visible,
    bounds: pickBounds(node),
    attr: { x: attr.x, y: attr.y, width: attr.width, height: attr.height, fill: attr.fill, stroke: attr.stroke, lineWidth: attr.lineWidth, text: attr.text }
  };
  if (depth >= maxDepth) return me;
  const children = listChildren(node);
  if (children.length) me.children = children.map((c) => dumpNode(c, depth + 1, maxDepth));
  return me;
}

(tableKey, groupKey, maxDepth = 3) => {
  const table = window[tableKey];
  const sg = table?.scenegraph;
  const root = sg?.[groupKey];
  if (!root) return { ok: false };
  return { ok: true, id: table.id, groupKey, tree: dumpNode(root, 0, maxDepth) };
}
```

## 5) 叠加 bounds 到屏幕（用于截图对比）

```js
(tableKey, nodes) => {
  const table = window[tableKey];
  const sg = table?.scenegraph;
  const canvas = table?.canvas || sg?.stage?.canvas;
  if (!canvas) return { ok: false, reason: 'no canvas' };
  const rect = canvas.getBoundingClientRect();
  const stage = sg.stage;
  const scaleX = rect.width / stage.width;
  const scaleY = rect.height / stage.height;

  const id = '__vtable_debug_overlay__';
  document.getElementById(id)?.remove();
  const overlay = document.createElement('div');
  overlay.id = id;
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '2147483647';
  document.body.appendChild(overlay);

  const boxes = [];
  for (const node of nodes) {
    const b = node?.globalAABBBounds || node?.AABBBounds;
    if (!b) continue;
    const x = rect.left + b.x1 * scaleX;
    const y = rect.top + b.y1 * scaleY;
    const w = (b.x2 - b.x1) * scaleX;
    const h = (b.y2 - b.y1) * scaleY;
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.border = '1px solid #00ff66';
    el.style.boxSizing = 'border-box';
    overlay.appendChild(el);
    boxes.push({ x, y, w, h, type: node.type, name: node.name, role: node.role });
  }

  return { ok: true, count: boxes.length, boxes };
}
```

## 6) 交互类问题调试脚本

用于排查选择、拖拽、滚动等交互相关的问题。

### 6.1 动态注入配置（用于复现问题）

```js
// 动态设置 disableSelect，禁止最后一行被选中
(table) => {
  table.options.select = {
    ...(table.options.select || {}),
    disableSelect: (col, row, t) => row === t.rowCount - 1
  };
  return { ok: true, rowCount: table.rowCount, disableSelectSet: true };
}
```

### 6.2 检查当前选区状态

```js
(table) => {
  const ranges = table.getSelectedCellRanges();
  return {
    ok: true,
    rangeCount: ranges.length,
    ranges: ranges.map(r => ({
      start: { col: r.start.col, row: r.start.row },
      end: { col: r.end.col, row: r.end.row }
    }))
  };
}
```

### 6.3 检查单元格合并信息

```js
(table, col, row) => {
  const range = table.getCellRange(col, row);
  return {
    ok: true,
    col,
    row,
    merged: range.start.col !== range.end.col || range.start.row !== range.end.row,
    range: {
      start: { col: range.start.col, row: range.start.row },
      end: { col: range.end.col, row: range.end.row }
    }
  };
}
```

### 6.4 模拟拖拽选区（用于自动化测试）

```js
async (table, startCol, startRow, endCol, endRow) => {
  const canvas = table.canvas || table.scenegraph?.stage?.canvas;
  const rect = canvas.getBoundingClientRect();
  
  // 获取单元格位置
  const startInfo = table.getCellInfo(startCol, startRow);
  const endInfo = table.getCellInfo(endCol, endRow);
  
  const startX = rect.left + (startInfo.cellRange.bounds.x1 + startInfo.cellRange.bounds.x2) / 2;
  const startY = rect.top + (startInfo.cellRange.bounds.y1 + startInfo.cellRange.bounds.y2) / 2;
  const endX = rect.left + (endInfo.cellRange.bounds.x1 + endInfo.cellRange.bounds.x2) / 2;
  const endY = rect.top + (endInfo.cellRange.bounds.y1 + endInfo.cellRange.bounds.y2) / 2;
  
  // 触发 pointer 事件
  const fire = (type, x, y, target = canvas) => {
    const ev = new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      buttons: type === 'pointerup' ? 0 : 1,
      button: 0
    });
    target.dispatchEvent(ev);
  };
  
  fire('pointerdown', startX, startY, canvas);
  await new Promise(r => setTimeout(r, 30));
  fire('pointermove', endX, endY, window);
  await new Promise(r => setTimeout(r, 30));
  fire('pointerup', endX, endY, window);
  
  return { ok: true, start: { col: startCol, row: startRow }, end: { col: endCol, row: endRow } };
}
```

### 6.5 检查 disableSelect 是否生效

```js
(table, col, row) => {
  const disableSelect = table.options.select?.disableSelect;
  const isDisabled = disableSelect ? disableSelect(col, row, table) : false;
  return {
    ok: true,
    col,
    row,
    isDisabled,
    hasDisableSelect: !!disableSelect
  };
}
```

## 7) React18/React19 差异排查

把 React 版本差异相关的经验集中到一个文件里维护，避免与本文件（通用 snippets）重复。

MANDATORY：阅读并执行 [react18-react19.md](react18-react19.md)。
