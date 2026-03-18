# HistoryPlugin（撤销/重做）

`HistoryPlugin` 为 `ListTable` 提供撤销/重做能力：它会把用户操作转换为可回放的事务（transaction），从而实现 undo/redo。

## 安装

```bash
npm install @visactor/vtable-plugins
```

## 基础用法（VTable）

```ts
import { ListTable } from '@visactor/vtable';
import { HistoryPlugin } from '@visactor/vtable-plugins';

const table = new ListTable(container, {
  records,
  columns,
  plugins: [
    new HistoryPlugin({
      maxHistory: 100,
      enableCompression: false
    })
  ]
});

const history = table.pluginManager.getPlugin('history-plugin') as HistoryPlugin;
history.undo();
history.redo();
```

## 快捷键

- Ctrl/Cmd + Z：撤销
- Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y：重做

## 配置项

```ts
export interface HistoryPluginOptions {
  id?: string;
  maxHistory?: number;
  enableCompression?: boolean;
  onTransactionPushed?: (args: { tx: HistoryTransaction; sheetKey?: string; table?: ListTable }) => void;
}
```

- `id`：插件 id（默认 `history-plugin`）
- `maxHistory`：最大历史条数
- `enableCompression`：是否把连续编辑合并到上一条事务
- `onTransactionPushed`：新事务入栈回调（用于和上层历史管理器联动）

## 在 VTable-Sheet 中使用

VTable-Sheet 内部会使用 `HistoryPlugin` 采集表格层操作，并汇总到工作簿级别历史栈。你可以：

- 通过 `VTablePluginModules` 覆盖 `HistoryPlugin` 配置
- 通过 `VTablePluginModules: [{ module: HistoryPlugin, disabled: true }]` 禁用内置历史采集

```ts
import { VTableSheet } from '@visactor/vtable-sheet';
import { HistoryPlugin } from '@visactor/vtable-plugins';

const sheet = new VTableSheet(container, {
  VTablePluginModules: [
    {
      module: HistoryPlugin,
      moduleOptions: {
        maxHistory: 200,
        enableCompression: false
      }
    }
  ],
  sheets: [/* ... */]
});
```
