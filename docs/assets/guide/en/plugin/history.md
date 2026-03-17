# History Plugin

`HistoryPlugin` provides undo/redo for `ListTable` by converting user operations into replayable transactions.

## Installation

```bash
npm install @visactor/vtable-plugins
```

## Basic Usage (VTable)

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

## Shortcuts

- Ctrl/Cmd + Z: undo
- Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: redo

## Options

```ts
export interface HistoryPluginOptions {
  id?: string;
  maxHistory?: number;
  enableCompression?: boolean;
  onTransactionPushed?: (args: { tx: HistoryTransaction; sheetKey?: string; table?: ListTable }) => void;
}
```

- `id`: plugin id (default: `history-plugin`)
- `maxHistory`: max undo stack size
- `enableCompression`: whether to merge continuous edits into the last transaction
- `onTransactionPushed`: callback when a new transaction is pushed (useful to integrate with an upper-level history manager)

## VTable-Sheet Integration

VTable-Sheet uses `HistoryPlugin` internally and aggregates table transactions into a workbook-level history stack. You can:

- Customize `HistoryPlugin` via `VTablePluginModules`
- Disable it via `VTablePluginModules: [{ module: HistoryPlugin, disabled: true }]`

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
