# 数据持久化

VTable-Sheet提供了强大的状态持久化功能，使用户可以轻松保存和恢复表格的各种状态，包括过滤条件、选择区域、活动表格页等。本章介绍如何实现表格状态的持久化。

## 基本概念

数据持久化是指将表格的当前状态（包括数据和用户操作）保存起来，以便在后续使用时能够恢复到相同的状态。这在需要保留用户操作历史或实现自动保存功能时非常有用。

## 保存表格状态

VTableSheet提供了`saveToConfig`方法，可以将当前的表格状态导出为配置对象：

```typescript
// 获取当前表格的完整配置（包含所有状态）
const currentConfig = sheetInstance.saveToConfig();

// 将配置对象转换为JSON字符串
const configJson = JSON.stringify(currentConfig);

// 保存到localStorage
localStorage.setItem('vtable-sheet-state', configJson);
```

## 恢复表格状态

可以使用保存的配置重新创建表格，恢复之前的状态：

```typescript
// 从localStorage获取保存的配置
const savedConfigJson = localStorage.getItem('vtable-sheet-state');

if (savedConfigJson) {
  try {
    // 解析JSON字符串为配置对象
    const savedConfig = JSON.parse(savedConfigJson);
    
    // 使用保存的配置创建新的表格实例
    const sheetInstance = new VTableSheet(document.getElementById('container'), savedConfig);
  } catch (error) {
    console.error('恢复表格状态失败:', error);
    // 使用默认配置
    const sheetInstance = new VTableSheet(document.getElementById('container'), defaultConfig);
  }
} else {
  // 没有保存的状态，使用默认配置
  const sheetInstance = new VTableSheet(document.getElementById('container'), defaultConfig);
}
```

## 保存的状态内容

`saveToConfig`方法可以保存以下状态：

- 表格数据
- 列配置
- 过滤条件
- 当前激活的表格页
- 表格结构配置（行高、列宽等）
- 公式设置
- 单元格选择状态
- 用户自定义配置

## 自动保存功能

可以通过事件监听实现自动保存功能：

```typescript
// 创建表格实例
const sheetInstance = new VTableSheet(document.getElementById('container'), initialConfig);

// 设置自动保存
const autoSave = () => {
  const config = sheetInstance.saveToConfig();
  localStorage.setItem('vtable-auto-save', JSON.stringify(config));
  console.log('表格状态已自动保存:', new Date().toLocaleTimeString());
};

// 监听可能改变表格状态的事件
const events = ['cellValueChange', 'filterChange', 'sheetChange', 'selectionChange'];

events.forEach(eventName => {
  sheetInstance.on(eventName, () => {
    // 使用防抖函数避免频繁保存
    clearTimeout(window.autoSaveTimer);
    window.autoSaveTimer = setTimeout(autoSave, 1000);
  });
});
```

## 实用示例：简单的持久化功能

以下是一个简单的表格状态持久化示例：

```typescript
// 创建持久化辅助函数
const SheetPersistence = {
  // 保存表格状态
  saveState: (sheetInstance, key = 'vtable-sheet-state') => {
    try {
      const config = sheetInstance.saveToConfig();
      localStorage.setItem(key, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('保存表格状态失败:', error);
      return false;
    }
  },
  
  // 加载表格状态
  loadState: (containerId, key = 'vtable-sheet-state', defaultConfig = null) => {
    try {
      const savedJson = localStorage.getItem(key);
      
      if (savedJson) {
        const config = JSON.parse(savedJson);
        return new VTableSheet(document.getElementById(containerId), config);
      } else if (defaultConfig) {
        return new VTableSheet(document.getElementById(containerId), defaultConfig);
      }
    } catch (error) {
      console.error('加载表格状态失败:', error);
      if (defaultConfig) {
        return new VTableSheet(document.getElementById(containerId), defaultConfig);
      }
    }
    return null;
  },
  
  // 清除保存的状态
  clearState: (key = 'vtable-sheet-state') => {
    localStorage.removeItem(key);
  }
};

// 使用示例
const defaultConfig = {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      data: [
        ['姓名', '年龄', '部门'],
        ['张三', 28, '技术部'],
        ['李四', 32, '市场部']
      ],
      active: true
    }
  ]
};

// 尝试加载保存的状态，如果没有则使用默认配置
const sheetInstance = SheetPersistence.loadState('container', 'my-sheet', defaultConfig);

// 添加保存按钮
document.getElementById('save-btn').addEventListener('click', () => {
  if (SheetPersistence.saveState(sheetInstance, 'my-sheet')) {
    alert('表格状态已保存');
  } else {
    alert('保存失败');
  }
});

// 添加清除按钮
document.getElementById('clear-btn').addEventListener('click', () => {
  SheetPersistence.clearState('my-sheet');
  alert('已清除保存的表格状态');
});
```

## 持久化最佳实践

1. **定期自动保存**：设置定时器或监听关键事件实现自动保存功能
2. **提供手动保存选项**：让用户可以在关键时刻手动触发保存
3. **保存历史版本**：保存多个历史状态，允许用户回退到之前的版本
4. **优化存储内容**：只保存必要的状态信息，减少存储占用
5. **提供导入导出功能**：允许用户下载配置文件或从文件中导入配置
6. **处理错误情况**：添加适当的错误处理机制，确保在恢复失败时能够优雅降级

通过这些持久化功能，VTable-Sheet可以提供更好的用户体验，保留用户的工作进度和操作历史。

【注：此处需要添加持久化功能操作的截图，显示保存和恢复表格状态的过程】
