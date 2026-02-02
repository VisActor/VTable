# Edit Capability Control

In `VTableSheet`, the editing capability is enabled by default. However, in some scenarios (such as preview mode or permission control), you may need to disable editing globally or for specific sheets.

VTableSheet provides flexible configuration options to control the editing capability and keyboard shortcuts at both the global and sheet levels.

## Configuration Options

### editable

- **Type**: `boolean`
- **Default**: `true` (if not configured globally or on the sheet)
- **Description**: Controls whether the table is editable.
  - When set to `false`, the table enters **Read-Only Mode**:
    - Double-click editing is disabled.
    - Editors are not registered.
    - Modification shortcuts (Cut, Paste, etc.) are disabled.
    - Context menu items related to modification (Insert/Delete rows, Merge cells, etc.) are hidden or disabled.
    - The Delete/Backspace key will not clear cell content (unless configured otherwise).
  - **Priority**: The configuration on a specific sheet (`ISheetDefine.editable`) takes precedence over the global configuration (`IVTableSheetOptions.editable`).



## Usage Examples

### 1. Global Read-Only Mode

You can set the entire workbook to read-only by configuring `editable: false` in the initialization options.

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';

const sheet = new VTableSheet(container, {
  editable: false, // Global read-only
  sheets: [
    {
      sheetKey: 'sheet1',
      data: data1
    },
    {
      sheetKey: 'sheet2',
      data: data2
    }
  ]
});
```

### 2. Mixed Mode (Global Read-Only with Specific Editable Sheets)

You can set the global default to read-only, and enable editing for specific sheets.

```typescript
const sheet = new VTableSheet(container, {
  editable: false, // Default read-only
  sheets: [
    {
      sheetKey: 'read_only_sheet',
      sheetTitle: 'Read Only',
      data: data1
      // Inherits global editable: false
    },
    {
      sheetKey: 'editable_sheet',
      sheetTitle: 'Editable',
      data: data2,
      editable: true // Override global setting
    }
  ]
});
```
