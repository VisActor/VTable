# VTable Sheet 事件使用示例

## 📋 两种监听方式对比

VTable Sheet 提供了两种灵活的事件监听方式，满足不同的使用场景：

### 方式 1：直接转发 (推荐) - `onTableEvent()`

**特点：**
- ✅ 不需要手动中转每个事件
- ✅ 可以监听任何 VTable 事件（包括未来新增的）
- ✅ 事件数据是原始的 VTable 格式
- ✅ 代码更简洁，维护成本低

**适用场景：** 明确知道要监听哪个 sheet

```typescript
const worksheet = sheet.getActiveSheet();

// 监听单元格点击
worksheet.onTableEvent('click_cell', (event) => {
  console.log('点击了单元格', event.row, event.col);
});

// 监听单元格值改变
worksheet.onTableEvent('change_cell_value', (event) => {
  console.log('单元格值改变', event);
});
```

### 方式 2：类型安全包装 - `on(EventType)`

**特点：**
- ✅ 自动附带 `sheetKey`，知道是哪个 sheet 触发的
- ✅ TypeScript 类型安全，有枚举和自动补全
- ✅ 可以在 VTableSheet 层统一监听所有 sheet
- ✅ 事件数据经过包装，更符合电子表格场景

**适用场景：** 需要监听所有 sheet，或需要 TypeScript 类型支持

```typescript
import { TableEventType } from '@visactor/vtable-sheet';

// 在 VTableSheet 层统一监听所有 sheet
sheet.on(TableEventType.CLICK_CELL, (event) => {
  // event.sheetKey 告诉你是哪个 sheet
  console.log(`Sheet ${event.sheetKey} 的单元格 [${event.row}, ${event.col}] 被点击`);
});
```

## 🎯 使用场景示例

### 场景 1: 单个 Sheet 的交互监听

**使用 `onTableEvent()` - 更简单直接**

```typescript
import { VTableSheet } from '@visactor/vtable-sheet';

const sheet = new VTableSheet(container, options);
const worksheet = sheet.getActiveSheet();

if (worksheet) {
  // 监听单元格点击
  worksheet.onTableEvent('click_cell', (event) => {
    console.log(`点击了 [${event.row}, ${event.col}]`);
    
    // 可以直接调用 worksheet 的方法
    const value = worksheet.getCellValue(event.col, event.row);
    console.log('单元格值:', value);
  });

  // 监听双击
  worksheet.onTableEvent('dblclick_cell', (event) => {
    console.log('双击单元格', event);
  });

  // 监听右键菜单
  worksheet.onTableEvent('contextmenu_cell', (event) => {
    event.event?.preventDefault();
    showCustomMenu(event.row, event.col);
  });

  // 监听选择变化
  worksheet.onTableEvent('selected_changed', (event) => {
    console.log('选择范围:', event.ranges);
  });
}
```

### 场景 2: 所有 Sheet 的统一监听

**使用包装事件 - 带 sheetKey**

```typescript
import { TableEventType } from '@visactor/vtable-sheet';

// 统一监听所有 sheet 的编辑，自动保存
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  console.log(`Sheet ${event.sheetKey} 的单元格被编辑`);
  
  // 自动保存到服务器
  saveToServer({
    sheetKey: event.sheetKey,
    row: event.row,
    col: event.col,
    oldValue: event.oldValue,
    newValue: event.newValue
  });
});

// 统一监听所有 sheet 的行列操作
sheet.on(TableEventType.ADD_RECORD, (event) => {
  console.log(`Sheet ${event.sheetKey} 添加了 ${event.count} 行`);
});

sheet.on(TableEventType.DELETE_RECORD, (event) => {
  console.log(`Sheet ${event.sheetKey} 删除了 ${event.count} 行`);
});
```

### 场景 3: 切换 Sheet 时更新监听器

```typescript
// 监听 Sheet 切换
sheet.on(SpreadSheetEventType.SHEET_ACTIVATED, (event) => {
  console.log(`切换到 ${event.sheetTitle}`);
  
  // 获取新激活的 worksheet
  const worksheet = sheet.getActiveSheet();
  
  if (worksheet) {
    // 为新 sheet 设置监听器
    worksheet.onTableEvent('click_cell', (e) => {
      console.log(`当前 sheet: ${event.sheetTitle}, 点击了 [${e.row}, ${e.col}]`);
    });
  }
});
```

### 场景 4: 监听所有 VTable 支持的事件

**优势：不需要等待 VTable-Sheet 手动中转，任何 VTable 事件都可以监听**

```typescript
const worksheet = sheet.getActiveSheet();

// 监听滚动事件
worksheet.onTableEvent('scroll', (event) => {
  console.log('滚动了', event.scrollTop, event.scrollLeft);
});

// 监听渲染完成
worksheet.onTableEvent('after_render', () => {
  console.log('表格渲染完成');
});

// 监听列宽调整
worksheet.onTableEvent('resize_column', (event) => {
  console.log(`列 ${event.col} 正在调整大小`);
});

worksheet.onTableEvent('resize_column_end', (event) => {
  console.log(`列 ${event.col} 调整完成，新宽度: ${event.width}`);
});

// 监听行高调整
worksheet.onTableEvent('resize_row_end', (event) => {
  console.log(`行 ${event.row} 调整完成，新高度: ${event.height}`);
});

// 监听填充柄拖拽
worksheet.onTableEvent('drag_fill_handle_end', (event) => {
  console.log('填充柄拖拽完成', event);
});

// 监听排序
worksheet.onTableEvent('after_sort', (event) => {
  console.log('排序完成', event);
});

// 监听筛选
worksheet.onTableEvent('filter_menu_show', (event) => {
  console.log('筛选菜单显示', event);
});

// 监听复制粘贴
worksheet.onTableEvent('copy_data', (event) => {
  console.log('复制了数据', event);
});

worksheet.onTableEvent('pasted_data', (event) => {
  console.log('粘贴了数据', event);
});

// 监听键盘事件
worksheet.onTableEvent('keydown', (event) => {
  console.log('按下了键盘', event.key);
});

// 监听鼠标悬停
worksheet.onTableEvent('mouseenter_cell', (event) => {
  console.log('鼠标进入单元格', event.row, event.col);
});

worksheet.onTableEvent('mouseleave_cell', (event) => {
  console.log('鼠标离开单元格', event.row, event.col);
});
```

### 场景 5: 协同编辑

```typescript
import { TableEventType } from '@visactor/vtable-sheet';

// 本地编辑 → 广播给其他用户
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  websocket.send({
    type: 'cell_edit',
    sheetKey: event.sheetKey,
    row: event.row,
    col: event.col,
    value: event.newValue,
    userId: currentUserId
  });
});

// 接收其他用户的编辑
websocket.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  
  if (data.userId !== currentUserId) {
    // 找到对应的 sheet
    const targetSheet = Array.from(sheet.workSheetInstances.values())
      .find(ws => ws.getKey() === data.sheetKey);
    
    if (targetSheet) {
      targetSheet.setCellValue(data.col, data.row, data.value);
    }
  }
};

// 监听 Sheet 结构变化
sheet.on(SpreadSheetEventType.SHEET_ADDED, (event) => {
  websocket.send({
    type: 'sheet_added',
    sheetKey: event.sheetKey,
    sheetTitle: event.sheetTitle
  });
});

sheet.on(SpreadSheetEventType.SHEET_REMOVED, (event) => {
  websocket.send({
    type: 'sheet_removed',
    sheetKey: event.sheetKey
  });
});
```

### 场景 6: 自定义右键菜单

```typescript
const worksheet = sheet.getActiveSheet();

worksheet.onTableEvent('contextmenu_cell', (event) => {
  // 阻止默认菜单
  event.event?.preventDefault();
  
  // 显示自定义菜单
  showContextMenu({
    x: event.event.clientX,
    y: event.event.clientY,
    items: [
      {
        label: '复制',
        onClick: () => {
          const value = worksheet.getCellValue(event.col, event.row);
          navigator.clipboard.writeText(value);
        }
      },
      {
        label: '粘贴',
        onClick: () => {
          navigator.clipboard.readText().then(text => {
            worksheet.setCellValue(event.col, event.row, text);
          });
        }
      },
      {
        label: '插入行',
        onClick: () => {
          worksheet.tableInstance.addRecord({}, event.row);
        }
      },
      {
        label: '删除行',
        onClick: () => {
          worksheet.tableInstance.deleteRecords([event.row]);
        }
      }
    ]
  });
});
```

### 场景 7: 性能监控

```typescript
const worksheet = sheet.getActiveSheet();

// 监听渲染性能
worksheet.onTableEvent('before_render', () => {
  console.time('render');
});

worksheet.onTableEvent('after_render', () => {
  console.timeEnd('render');
});

// 监听大量数据操作
worksheet.onTableEvent('add_record', (event) => {
  if (event.recordCount > 100) {
    console.warn(`一次添加了 ${event.recordCount} 行，可能影响性能`);
  }
});

// 监听滚动性能
let scrollCount = 0;
worksheet.onTableEvent('scroll', () => {
  scrollCount++;
  if (scrollCount % 10 === 0) {
    console.log(`已滚动 ${scrollCount} 次`);
  }
});
```

### 场景 8: 数据验证

```typescript
const worksheet = sheet.getActiveSheet();

worksheet.onTableEvent('change_cell_value', (event) => {
  const newValue = event.changedValue;
  
  // 验证邮箱格式
  if (event.col === 2) { // 假设第 2 列是邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newValue)) {
      alert('请输入有效的邮箱地址');
      // 恢复旧值
      worksheet.setCellValue(event.col, event.row, event.rawValue);
    }
  }
  
  // 验证数字范围
  if (event.col === 3) { // 假设第 3 列是年龄
    const age = parseInt(newValue);
    if (isNaN(age) || age < 0 || age > 150) {
      alert('年龄必须是 0-150 之间的数字');
      worksheet.setCellValue(event.col, event.row, event.rawValue);
    }
  }
});
```

### 场景 9: 取消监听

```typescript
const worksheet = sheet.getActiveSheet();

// 保存处理函数的引用
const handleCellClick = (event) => {
  console.log('点击单元格', event);
};

// 注册监听器
worksheet.onTableEvent('click_cell', handleCellClick);

// 稍后取消监听
setTimeout(() => {
  worksheet.offTableEvent('click_cell', handleCellClick);
  console.log('已取消单元格点击监听');
}, 10000);

// 或者在组件卸载时取消
function cleanup() {
  worksheet.offTableEvent('click_cell', handleCellClick);
  worksheet.offTableEvent('change_cell_value', handleCellValueChange);
}
```

### 场景 10: 混合使用两种方式

```typescript
import { TableEventType, SpreadSheetEventType } from '@visactor/vtable-sheet';

// 在 VTableSheet 层监听所有 sheet 的重要操作（带 sheetKey）
sheet.on(TableEventType.CHANGE_CELL_VALUE, (event) => {
  console.log(`[Global] Sheet ${event.sheetKey} 单元格编辑`);
  autoSave(event);
});

// 在 WorkSheet 层监听当前 sheet 的细节操作（不带 sheetKey）
const worksheet = sheet.getActiveSheet();

worksheet.onTableEvent('mouseenter_cell', (event) => {
  // 显示悬停提示
  showTooltip(event.row, event.col);
});

worksheet.onTableEvent('mouseleave_cell', () => {
  hideTooltip();
});

// 监听 Sheet 管理事件
sheet.on(SpreadSheetEventType.SHEET_ACTIVATED, (event) => {
  console.log(`切换到 ${event.sheetTitle}`);
  
  // 重新设置新 sheet 的监听器
  const newWorksheet = sheet.getActiveSheet();
  if (newWorksheet) {
    newWorksheet.onTableEvent('click_cell', (e) => {
      console.log(`新 sheet 的单元格被点击: [${e.row}, ${e.col}]`);
    });
  }
});
```

## 📚 VTable 事件类型参考

以下是 VTable 支持的常用事件类型（可以通过 `onTableEvent` 监听）：

### 单元格交互
- `click_cell` - 单元格点击
- `dblclick_cell` - 单元格双击
- `mousedown_cell` - 单元格鼠标按下
- `mouseup_cell` - 单元格鼠标松开
- `mouseenter_cell` - 鼠标进入单元格
- `mouseleave_cell` - 鼠标离开单元格
- `mousemove_cell` - 鼠标在单元格上移动
- `contextmenu_cell` - 单元格右键菜单

### 选择事件
- `selected_cell` - 单元格被选中
- `selected_changed` - 选择范围改变
- `selected_clear` - 清除选择
- `drag_select_end` - 拖拽选择结束

### 编辑事件
- `change_cell_value` - 单元格值改变
- `copy_data` - 复制数据
- `pasted_data` - 粘贴数据

### 调整大小
- `resize_column` - 列宽调整中
- `resize_column_end` - 列宽调整结束
- `resize_row` - 行高调整中
- `resize_row_end` - 行高调整结束

### 数据操作
- `add_record` - 添加行
- `delete_record` - 删除行
- `update_record` - 更新行
- `add_column` - 添加列
- `delete_column` - 删除列

### 表头移动
- `change_header_position_start` - 表头移动开始
- `changing_header_position` - 表头移动中
- `change_header_position` - 表头移动结束

### 填充柄
- `mousedown_fill_handle` - 鼠标按下填充柄
- `drag_fill_handle_end` - 拖拽填充柄结束
- `dblclick_fill_handle` - 双击填充柄

### 排序和筛选
- `sort_click` - 排序点击
- `after_sort` - 排序完成
- `filter_menu_show` - 筛选菜单显示
- `filter_menu_hide` - 筛选菜单隐藏

### 滚动
- `scroll` - 滚动
- `scroll_horizontal_end` - 横向滚动到底
- `scroll_vertical_end` - 纵向滚动到底

### 键盘
- `before_keydown` - 键盘按下前
- `keydown` - 键盘按下

### 生命周期
- `before_init` - 初始化前
- `initialized` - 初始化完成
- `after_render` - 渲染完成
- `updated` - 更新完成

## 💡 最佳实践

### 1. 选择合适的监听方式

```typescript
// ✅ 推荐：监听单个 sheet 的详细交互
const worksheet = sheet.getActiveSheet();
worksheet.onTableEvent('click_cell', handler);

// ✅ 推荐：监听所有 sheet 的重要操作
sheet.on(TableEventType.CHANGE_CELL_VALUE, handler);

// ❌ 不推荐：在所有 sheet 上监听细节交互（性能差）
sheet.getAllSheets().forEach(sheetDefine => {
  const ws = sheet.workSheetInstances.get(sheetDefine.sheetKey);
  ws?.onTableEvent('mouseenter_cell', handler); // 太多监听器
});
```

### 2. 记得清理监听器

```typescript
// ✅ 保存引用，便于清理
const handleClick = (event) => { ... };
worksheet.onTableEvent('click_cell', handleClick);

// 在组件卸载时清理
onUnmount(() => {
  worksheet.offTableEvent('click_cell', handleClick);
});
```

### 3. 避免在事件处理中执行耗时操作

```typescript
// ❌ 不推荐
worksheet.onTableEvent('change_cell_value', (event) => {
  // 同步的大量计算
  heavyCalculation(event.changedValue);
});

// ✅ 推荐
import { debounce } from 'lodash';

const debouncedSave = debounce((data) => {
  saveToServer(data);
}, 500);

worksheet.onTableEvent('change_cell_value', (event) => {
  debouncedSave(event);
});
```

### 4. 利用 TypeScript 类型

```typescript
// ✅ 使用类型安全的包装事件
import { TableEventType, type TableCellClickEvent } from '@visactor/vtable-sheet';

sheet.on(TableEventType.CLICK_CELL, (event: TableCellClickEvent) => {
  // event 有完整的类型提示
  console.log(event.sheetKey, event.row, event.col);
});
```

## 🎉 总结

- **`onTableEvent()`** - 灵活、简单、直接转发 VTable 事件，适合监听单个 sheet
- **包装事件** - 类型安全、带 sheetKey、适合监听所有 sheet
- **两者可以混合使用**，根据场景选择最合适的方式

选择建议：
- 📌 大部分情况用 `onTableEvent()` 就够了
- 📌 需要监听所有 sheet 时用包装事件
- 📌 需要 TypeScript 类型支持时用包装事件


