# 修复：移除不支持的 query 参数

## 🐛 问题

`table-event-relay.ts` 中错误地模仿了 VTable 的 `onVChartEvent` 实现，提供了 `query` 参数支持。但实际上：

- ✅ **VChart 的事件系统支持 query 参数**
- ❌ **VTable 的事件系统不支持 query 参数**

## 🔍 原因分析

### VTable 的 EventTarget.on() - 不支持 query

```typescript
// packages/vtable/src/event/EventTarget.ts
on<TYPE extends keyof TableEventHandlersEventArgumentMap>(
  type: TYPE,
  listener: TableEventListener<TYPE>
): EventListenerId {
  // ❌ 只有两个参数：type 和 listener
  // 不支持 query 参数
}
```

### VTable 的 onVChartEvent() - 支持 query（仅用于中转 VChart 事件）

```typescript
// packages/vtable/src/core/BaseTable.ts
onVChartEvent(type: string, callback: AnyFunction): void;
onVChartEvent(type: string, query: any, callback: AnyFunction): void;
onVChartEvent(type: string, query?: any, callback?: AnyFunction): void {
  // ✅ 支持 query 参数，因为这是中转 VChart 事件
  // VChart 的事件系统支持 query
}

// 绑定到 VChart 实例时
_bindChartEvent(activeChartInstance: any) {
  for (const key in this._chartEventMap) {
    (this._chartEventMap[key] || []).forEach(e => {
      if (e.query) {
        activeChartInstance.on(key, e.query, e.callback); // ✅ VChart 支持
      } else {
        activeChartInstance.on(key, e.callback);
      }
    });
  }
}
```

### table-event-relay.ts 的错误实现

```typescript
// ❌ 错误：模仿了 onVChartEvent，但 VTable 不支持 query
interface EventHandler {
  callback: EventCallback;
  query?: any; // ❌ VTable 不支持
}

onTableEvent(type: string, callback: EventCallback): void;
onTableEvent(type: string, query: any, callback: EventCallback): void; // ❌ 无用的重载
onTableEvent(type: string, query?: any, callback?: EventCallback): void {
  // ...
}

// 绑定时
if (handler.query) {
  (tableInstance as any).on(eventType, handler.query, wrappedCallback); // ❌ 不会工作
} else {
  tableInstance.on(eventType as any, wrappedCallback);
}
```

## ✅ 解决方案

移除对 `query` 参数的支持，因为 VTable 的事件系统不支持它。

### 1. 简化 EventHandler 接口

```typescript
// ✅ 改动前
interface EventHandler {
  callback: EventCallback;
  query?: any; // ❌ 移除
}

// ✅ 改动后
interface EventHandler {
  callback: EventCallback;
}
```

### 2. 简化 onTableEvent 方法

```typescript
// ❌ 改动前
onTableEvent(type: string, callback: EventCallback): void;
onTableEvent(type: string, query: any, callback: EventCallback): void;
onTableEvent(type: string, query?: any, callback?: EventCallback): void {
  if (!this._tableEventMap[type]) {
    this._tableEventMap[type] = [];
  }

  if (typeof query === 'function') {
    this._tableEventMap[type].push({ callback: query });
  } else {
    this._tableEventMap[type].push({ callback: callback!, query });
  }

  this.bindToAllSheets(type);
}

// ✅ 改动后
onTableEvent(type: string, callback: EventCallback): void {
  if (!this._tableEventMap[type]) {
    this._tableEventMap[type] = [];
  }

  this._tableEventMap[type].push({ callback });

  this.bindToAllSheets(type);
}
```

### 3. 简化 bindSheetEvent 方法

```typescript
// ❌ 改动前
// 绑定到 tableInstance
if (handler.query) {
  (tableInstance as any).on(eventType, handler.query, wrappedCallback);
} else {
  tableInstance.on(eventType as any, wrappedCallback);
}

// ✅ 改动后
// 绑定到 tableInstance（VTable 的 on 方法不支持 query 参数）
tableInstance.on(eventType as any, wrappedCallback);
```

### 4. 更新 VTableSheet.onTableEvent() 签名

```typescript
// ❌ 改动前
onTableEvent(type: string, callback: (...args: any[]) => void): void;
onTableEvent(type: string, query: any, callback: (...args: any[]) => void): void;
onTableEvent(type: string, query?: any, callback?: (...args: any[]) => void): void {
  this.tableEventRelay.onTableEvent(type, query as any, callback as any);
}

// ✅ 改动后
onTableEvent(type: string, callback: (...args: any[]) => void): void {
  this.tableEventRelay.onTableEvent(type, callback);
}
```

## 📝 代码改动总结

| 文件 | 改动 | 说明 |
|------|------|------|
| `table-event-relay.ts` | - 移除 `EventHandler.query` 字段<br>- 移除 `onTableEvent` 的 query 重载<br>- 移除 `bindSheetEvent` 中的 query 判断 | 不再支持 query 参数 |
| `vtable-sheet.ts` | - 移除 `onTableEvent` 的 query 重载<br>- 简化方法实现 | 统一 API 签名 |

## 🎯 为什么这样改？

### 事件系统对比

| 事件系统 | 是否支持 query | 说明 |
|---------|---------------|------|
| VChart | ✅ 支持 | VChart 的事件系统原生支持 query 参数 |
| VTable.onVChartEvent | ✅ 支持 | 用于中转 VChart 事件，保留 query 参数 |
| VTable.on | ❌ 不支持 | VTable 自己的事件系统不支持 query |
| VTableSheet.onTableEvent | ❌ 不支持 | 应该遵循 VTable 的事件系统设计 |

### 架构清晰度

```
VTable 事件系统
  └─> EventTarget.on(type, listener)
        └─> ❌ 不支持 query

VChart 事件系统
  └─> VChart.on(type, query, listener)
        └─> ✅ 支持 query

VTable 中转 VChart
  └─> VTable.onVChartEvent(type, query, callback)
        └─> VChart.on(type, query, callback)
              └─> ✅ 保留 query 给 VChart

VTableSheet 中转 VTable
  └─> VTableSheet.onTableEvent(type, callback)
        └─> VTable.on(type, callback)
              └─> ❌ 不需要 query
```

## 🎉 修复后的效果

### 更简洁的 API

```typescript
// ✅ 简单直接
sheet.onTableEvent('click_cell', (event) => {
  console.log(`Sheet ${event.sheetKey} 被点击`);
});

// ❌ 不再有无用的 query 重载
// sheet.onTableEvent('click_cell', someQuery, callback); // 已移除
```

### 符合 VTable 的事件系统设计

```typescript
// VTable 的原生事件监听
tableInstance.on('click_cell', callback);

// VTableSheet 的事件监听（保持一致）
sheet.onTableEvent('click_cell', callback);
```

### 代码更清晰

```typescript
// ✅ 直接绑定，没有无效的 if-else
tableInstance.on(eventType as any, wrappedCallback);

// ❌ 之前的代码（无效的判断）
// if (handler.query) {
//   (tableInstance as any).on(eventType, handler.query, wrappedCallback);
// } else {
//   tableInstance.on(eventType as any, wrappedCallback);
// }
```

## 📚 相关资源

- [VTable EventTarget 源码](../../vtable/src/event/EventTarget.ts)
- [VTable BaseTable.onVChartEvent 源码](../../vtable/src/core/BaseTable.ts#L4784-4795)
- [table-event-relay.ts](../src/core/table-event-relay.ts)

## ✅ 结论

**VTable 的事件系统不支持 query 参数**，之前的实现是错误的。修复后：

1. ✅ API 更简洁
2. ✅ 符合 VTable 的设计
3. ✅ 代码更清晰
4. ✅ 移除了无效的代码

---

**修复完成！** ✨

