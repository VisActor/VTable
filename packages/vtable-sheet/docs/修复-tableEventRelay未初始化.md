# 修复：tableEventRelay 未初始化错误

## 🐛 问题

浏览器执行时报错：
```
Cannot read properties of undefined (reading 'onTableEvent')
```

## 🔍 原因分析

在 `VTableSheet` 构造函数中，**初始化顺序错误**：

```typescript
// ❌ 错误的顺序
constructor(container: HTMLElement, options: IVTableSheetOptions) {
  // ...
  this.eventManager = new EventManager(this);      // 第 70 行
  // ...
  this.tableEventRelay = new TableEventRelay(this); // 第 75 行
  // ...
}
```

### 问题分析

1. **第 70 行**：创建 `EventManager` 实例
2. `EventManager` 构造函数立即调用 `setupTableEventListeners()`
3. `setupTableEventListeners()` 中调用 `this.sheet.onTableEvent()`
4. `onTableEvent()` 内部访问 `this.tableEventRelay.onTableEvent()`
5. ❌ **此时 `tableEventRelay` 还未初始化**（要到第 75 行才初始化）
6. 💥 抛出错误：`Cannot read properties of undefined`

### 调用栈

```
VTableSheet 构造函数
  └─> new EventManager(this)                        // 第 70 行
        └─> EventManager.constructor()
              └─> this.setupTableEventListeners()   // 第 19 行
                    └─> this.sheet.onTableEvent()   // 第 69 行
                          └─> this.tableEventRelay.onTableEvent()  // 第 689 行
                                └─> ❌ this.tableEventRelay is undefined
```

## ✅ 解决方案

**调整初始化顺序**：确保 `tableEventRelay` 在 `eventManager` 之前初始化

```typescript
// ✅ 正确的顺序
constructor(container: HTMLElement, options: IVTableSheetOptions) {
  this.container = container;
  this.options = this.mergeDefaultOptions(options);

  // 创建管理器（注意：tableEventRelay 必须在 eventManager 之前初始化）
  this.sheetManager = new SheetManager();
  this.formulaManager = new FormulaManager(this);
  this.tableEventRelay = new TableEventRelay(this); // ⚠️ 必须在 EventManager 之前
  this.eventManager = new EventManager(this);       // EventManager 会调用 onTableEvent
  this.dragManager = new SheetTabDragManager(this);
  this.menuManager = new MenuManager(this);
  this.formulaUIManager = new FormulaUIManager(this);
  this.sheetTabEventHandler = new SheetTabEventHandler(this);

  // 初始化UI
  this.initUI();

  // 初始化sheets
  this.initSheets();

  this.resize();
}
```

## 📝 代码改动

### 文件：`packages/vtable-sheet/src/components/vtable-sheet.ts`

**改动前**（第 67-75 行）：
```typescript
// 创建管理器
this.sheetManager = new SheetManager();
this.formulaManager = new FormulaManager(this);
this.eventManager = new EventManager(this);        // ❌ 这里会失败
this.dragManager = new SheetTabDragManager(this);
this.menuManager = new MenuManager(this);
this.formulaUIManager = new FormulaUIManager(this);
this.sheetTabEventHandler = new SheetTabEventHandler(this);
this.tableEventRelay = new TableEventRelay(this);  // ⚠️ 太晚了
```

**改动后**：
```typescript
// 创建管理器（注意：tableEventRelay 必须在 eventManager 之前初始化）
this.sheetManager = new SheetManager();
this.formulaManager = new FormulaManager(this);
this.tableEventRelay = new TableEventRelay(this); // ✅ 提前到 EventManager 之前
this.eventManager = new EventManager(this);       // ✅ 现在可以正常工作
this.dragManager = new SheetTabDragManager(this);
this.menuManager = new MenuManager(this);
this.formulaUIManager = new FormulaUIManager(this);
this.sheetTabEventHandler = new SheetTabEventHandler(this);
```

## 🎯 为什么这个顺序重要？

### 依赖关系

```
EventManager
  └─> 依赖 VTableSheet.onTableEvent()
        └─> 依赖 VTableSheet.tableEventRelay
              └─> 必须先初始化！
```

### 初始化流程

```
1. new TableEventRelay(this)
   └─> tableEventRelay 就绪

2. new EventManager(this)
   └─> EventManager.constructor()
       └─> setupTableEventListeners()
           └─> this.sheet.onTableEvent('click_cell', ...)  ✅ 成功
               └─> this.tableEventRelay.onTableEvent(...)   ✅ tableEventRelay 已初始化
```

## 🔧 相关代码

### EventManager.constructor() - 会立即调用 onTableEvent

```typescript
// packages/vtable-sheet/src/event/event-manager.ts
export class EventManager {
  constructor(sheet: VTableSheet) {
    this.sheet = sheet;

    this.setupEventListeners();
    this.setupTableEventListeners(); // ⚠️ 立即调用
  }

  private setupTableEventListeners(): void {
    // ⚠️ 这里会调用 this.sheet.onTableEvent()
    this.sheet.onTableEvent('click_cell', (event) => {
      // ...
    });
  }
}
```

### VTableSheet.onTableEvent() - 依赖 tableEventRelay

```typescript
// packages/vtable-sheet/src/components/vtable-sheet.ts
onTableEvent(type: string, callback: (...args: any[]) => void): void {
  // ⚠️ 这里会访问 this.tableEventRelay
  this.tableEventRelay.onTableEvent(type, callback);
}
```

## ✅ 验证

修复后，初始化顺序正确：

```typescript
// ✅ 正确的执行流程
1. this.tableEventRelay = new TableEventRelay(this);  // tableEventRelay 初始化完成
2. this.eventManager = new EventManager(this);        // 开始初始化 EventManager
   └─> EventManager.constructor()
       └─> this.setupTableEventListeners()
           └─> this.sheet.onTableEvent('click_cell', handler)
               └─> this.tableEventRelay.onTableEvent('click_cell', handler)
                   └─> ✅ 成功！tableEventRelay 已经存在
```

## 🎉 结论

通过调整初始化顺序，确保 `tableEventRelay` 在 `eventManager` 之前初始化，成功解决了 `undefined` 错误。

**核心原则**：在构造函数中，**被依赖的对象必须先初始化**。

---

**修复完成！** ✅

