# 修复：添加 clearAllListeners() 调用

## 🐛 问题

`TableEventRelay` 类有一个 `clearAllListeners()` 方法用于清除所有事件监听器，但**没有被调用**，导致：

1. ❌ 内存泄漏 - 事件监听器未被清理
2. ❌ 资源浪费 - VTableSheet 销毁后，事件监听器仍然存在
3. ❌ 潜在的错误 - 可能触发已销毁实例的回调

## 🔍 问题分析

### TableEventRelay.clearAllListeners()

```typescript
// packages/vtable-sheet/src/core/table-event-relay.ts
/**
 * 清除所有事件监听器
 */
clearAllListeners(): void {
  // 从所有 sheet 解绑
  this.vtableSheet.workSheetInstances.forEach((worksheet, sheetKey) => {
    if (worksheet.tableInstance) {
      this.unbindSheetEvents(sheetKey, worksheet.tableInstance);
    }
  });

  this._tableEventMap = {};
}
```

这个方法做了两件重要的事：
1. 从所有 `WorkSheet` 的 `tableInstance` 解绑事件监听器
2. 清空 `_tableEventMap`（用户注册的监听器列表）

### VTableSheet.release() - 之前没有调用

```typescript
// ❌ 改动前
release(): void {
  // 释放事件管理器
  this.eventManager.release();
  this.formulaManager.release();
  this.formulaUIManager.release();
  // 移除点击外部监听器
  this.sheetTabEventHandler.removeClickOutsideListener();
  // 销毁所有sheet实例
  this.workSheetInstances.forEach(instance => {
    instance.release();
  });
  // 清空容器
  if (this.rootElement && this.rootElement.parentNode) {
    this.rootElement.parentNode.removeChild(this.rootElement);
  }

  if (this.formulaAutocomplete) {
    this.formulaAutocomplete.release();
  }
  if (this.formulaManager.cellHighlightManager) {
    this.formulaManager.cellHighlightManager.release();
  }
}
```

**问题：** 没有调用 `this.tableEventRelay.clearAllListeners()`

## ⚠️ 后果

### 1. 内存泄漏

```typescript
// 用户注册了事件监听器
sheet.onTableEvent('click_cell', handler);

// 销毁实例
sheet.release();

// ❌ 问题：handler 仍然被 tableInstance 引用
// tableInstance → wrappedCallback → handler
// _tableEventMap 也还保留着 handler
```

### 2. 事件监听器仍然绑定

```typescript
// 销毁后
sheet.release();

// ❌ 如果 tableInstance 还没有被销毁，事件仍然会触发
// 这可能导致访问已销毁对象的错误
```

### 3. 清理不完整

```typescript
release() {
  this.eventManager.release();        // ✅ 清理
  this.formulaManager.release();      // ✅ 清理
  this.formulaUIManager.release();    // ✅ 清理
  // ❌ tableEventRelay 没有清理！
}
```

## ✅ 解决方案

在 `VTableSheet.release()` 方法的**最开始**调用 `clearAllListeners()`：

```typescript
// ✅ 改动后
release(): void {
  // 清除所有 Table 事件监听器
  this.tableEventRelay.clearAllListeners();

  // 释放事件管理器
  this.eventManager.release();
  this.formulaManager.release();
  this.formulaUIManager.release();
  // 移除点击外部监听器
  this.sheetTabEventHandler.removeClickOutsideListener();
  // 销毁所有sheet实例
  this.workSheetInstances.forEach(instance => {
    instance.release();
  });
  // 清空容器
  if (this.rootElement && this.rootElement.parentNode) {
    this.rootElement.parentNode.removeChild(this.rootElement);
  }

  if (this.formulaAutocomplete) {
    this.formulaAutocomplete.release();
  }
  if (this.formulaManager.cellHighlightManager) {
    this.formulaManager.cellHighlightManager.release();
  }
}
```

### 为什么放在最开始？

1. **先清理事件监听器**，避免在销毁过程中触发事件
2. **在 WorkSheet 销毁前解绑**，确保 `tableInstance` 还存在时完成清理
3. **防止销毁过程中的事件干扰**

## 🔄 完整的清理流程

```
VTableSheet.release()
  └─> 1. tableEventRelay.clearAllListeners()
        └─> 遍历所有 WorkSheet
            └─> unbindSheetEvents(sheetKey, tableInstance)
                └─> tableInstance.off(eventType, wrappedCallback)
        └─> 清空 _tableEventMap
  
  └─> 2. eventManager.release()
        └─> 移除 DOM 事件监听器
  
  └─> 3. formulaManager.release()
        └─> 清理公式引擎
  
  └─> 4. formulaUIManager.release()
        └─> 清理公式 UI
  
  └─> 5. sheetTabEventHandler.removeClickOutsideListener()
        └─> 移除外部点击监听器
  
  └─> 6. workSheetInstances.forEach(instance => instance.release())
        └─> 销毁所有 WorkSheet 实例
  
  └─> 7. 移除 DOM 元素
  
  └─> 8. formulaAutocomplete.release()
  
  └─> 9. cellHighlightManager.release()
```

## 📝 代码改动

### 文件：`packages/vtable-sheet/src/components/vtable-sheet.ts`

```diff
  release(): void {
+   // 清除所有 Table 事件监听器
+   this.tableEventRelay.clearAllListeners();
+
    // 释放事件管理器
    this.eventManager.release();
    ...
  }
```

## 🎯 修复后的效果

### 正确清理资源

```typescript
const sheet = new VTableSheet(container, options);

// 注册事件监听器
sheet.onTableEvent('click_cell', handler1);
sheet.onTableEvent('change_cell_value', handler2);

// 销毁实例
sheet.release();

// ✅ 所有事件监听器都被清理
// ✅ _tableEventMap 被清空
// ✅ 不再有内存泄漏
```

### 防止错误

```typescript
const sheet = new VTableSheet(container, options);

sheet.onTableEvent('click_cell', (event) => {
  console.log('点击', event);
  // 可能访问 sheet 的其他方法
  sheet.getActiveSheet(); // 如果 sheet 已销毁，这会出错
});

// 销毁实例
sheet.release();

// ✅ clearAllListeners() 确保事件监听器被移除
// ✅ 不会再触发已销毁实例的回调
```

## 📊 对比

| 操作 | 改动前 | 改动后 |
|------|--------|--------|
| 清理 Table 事件监听器 | ❌ 没有 | ✅ `clearAllListeners()` |
| 清理 DOM 事件监听器 | ✅ `eventManager.release()` | ✅ 保持 |
| 清理公式相关 | ✅ `formulaManager.release()` | ✅ 保持 |
| 清理 UI 组件 | ✅ `formulaUIManager.release()` | ✅ 保持 |
| 销毁 WorkSheet 实例 | ✅ `instance.release()` | ✅ 保持 |
| 移除 DOM 元素 | ✅ `removeChild()` | ✅ 保持 |
| **内存泄漏风险** | ⚠️ 有风险 | ✅ 已修复 |

## ✅ 总结

通过在 `VTableSheet.release()` 中添加 `this.tableEventRelay.clearAllListeners()`：

1. ✅ **完整清理** - 所有事件监听器都被正确移除
2. ✅ **防止内存泄漏** - 不再有引用残留
3. ✅ **避免错误** - 不会触发已销毁实例的回调
4. ✅ **资源管理完善** - 所有组件都有对应的清理逻辑

---

**修复完成！** 🎉

