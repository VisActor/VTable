# 编辑控制

在 `VTableSheet` 中，编辑能力默认是开启的。然而，在某些场景下（如预览模式或权限控制），您可能需要全局禁用编辑或为特定工作表禁用编辑。

VTableSheet 提供了灵活的配置选项，可以在全局和sheet级别控制编辑能力和键盘快捷键。

## 配置选项

### editable

- **Type**: `boolean`
- **Default**: `true` (默认值)
- **Description**: 控制表格是否可编辑。
  - 当设置为 `false` 时，表格进入**只读模式**:
    - 双击编辑被禁用。
    - 修改快捷键 (剪切, 粘贴等) 被禁用。
    - 与修改相关的上下文菜单项 (插入/删除行, 合并单元格等) 被隐藏或禁用。
    - 删除/退格键不会清除单元格内容。
  - **Priority**: 工作表级配置 (`ISheetDefine.editable`) 优先于全局配置 (`IVTableSheetOptions.editable`)。


## 示例

可以通过在初始化选项中配置 `editable: false` 来将整个工作簿设置为只读。

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

可以通过设置全局默认值为只读，并启用特定工作表的编辑。

```typescript
const sheet = new VTableSheet(container, {
  editable: false, // 全局只读
  sheets: [
    {
      sheetKey: 'read_only_sheet',
      sheetTitle: 'Read Only',
      data: data1
      // 继承全局 editable: false
    },
    {
      sheetKey: 'editable_sheet',
      sheetTitle: 'Editable',
      data: data2,
      editable: true // 覆盖全局设置
    }
  ]
});
```

