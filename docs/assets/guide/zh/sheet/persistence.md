# 数据持久化

VTable-Sheet提供了状态持久化能力，使用户可以保存和恢复表格的各种状态，包括过滤条件、选择区域、活动表格页等。本章介绍如何实现表格状态的持久化。

## 基本概念

数据持久化是指将表格的当前状态（包括数据和用户操作）保存起来，以便在后续使用时能够恢复到相同的状态。这在需要保留用户操作历史或实现自动保存功能时非常有用。


## 保存表格状态

VTableSheet提供了`saveToConfig`方法，可以将当前的表格状态导出为配置对象（以保存到localStorage为例）：

```typescript
// 获取当前表格的完整配置（包含所有状态）
const currentConfig = sheetInstance.saveToConfig();

// 将配置对象转换为JSON字符串
const configJson = JSON.stringify(currentConfig);

// 保存到localStorage 或者后端接口保存等
localStorage.setItem('vtable-sheet-state', configJson);
```

## 恢复表格状态

可以使用保存的配置重新创建表格，恢复之前的状态（以从localStorage获取保存的配置为例）：

```javascript
// 从localStorage获取保存的配置 或者从后端接口获取
const savedConfigJson = localStorage.getItem('vtable-sheet-state');

if (savedConfigJson) {
  try {
    // 解析JSON字符串为配置对象
    const savedConfig = JSON.parse(savedConfigJson);
    
    // 使用保存的配置创建新的表格实例
    const sheetInstance = new VTableSheet.VTableSheet(document.getElementById(CONTAINER_ID), savedConfig);
  } catch (error) {
    console.error('恢复表格状态失败:', error);
    // 使用默认配置
    const sheetInstance = new VTableSheet.VTableSheet(document.getElementById(CONTAINER_ID), defaultConfig);
  }
} else {
  // 没有保存的状态，使用默认配置
  const sheetInstance = new VTableSheet.VTableSheet(document.getElementById(CONTAINER_ID), defaultConfig);
}
```

## 保存的状态内容

`saveToConfig`方法可以保存的状态有：

- 各个工作表的数据
- 过滤条件
- 当前激活的工作表
- 公式设置
- 合并单元格状态
- 冻结行列

待开发实现的保存状态有：

- 单元格选择状态
- 表格结构配置（行高、列宽等）


## 使用示例：简单的持久化功能

以下是一个简单的表格状态持久化示例：

```javascript livedemo template=vtable
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
  loadState: (container, key = 'vtable-sheet-state', defaultConfig = null) => {
    try {
      const savedJson = localStorage.getItem(key);
      
      if (savedJson) {
        const config = JSON.parse(savedJson);
        return new VTableSheet.VTableSheet(container, config);  
      } else if (defaultConfig) {
        return new VTableSheet.VTableSheet(container,JSON.parse(JSON.stringify(defaultConfig)));
      }
    } catch (error) {
      console.error('加载表格状态失败:', error);
      if (defaultConfig) {
        return new VTableSheet.VTableSheet(container,JSON.parse(JSON.stringify(defaultConfig)));
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

const container = document.getElementById(CONTAINER_ID);
// 尝试加载保存的状态，如果没有则使用默认配置
const sheetInstance = SheetPersistence.loadState(container, 'my-sheet', defaultConfig);
window.sheetInstance = sheetInstance;

  // 创建简单的控制按钮
  const createControls = () => {
    // 清理已存在的控制面板，避免重复创建
    const existingControls = document.getElementById('simple-controls');
    if (existingControls) {
      existingControls.remove();
      console.log('清理已存在的控制面板');
    }

    const controlsHtml = `
      <div id="simple-controls" style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: white;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        z-index: 1000;
        width: 120px;
      ">
        <h4 style="margin: 0 0 6px 0; color: #333; font-size: 12px;">控制面板</h4>

        <button id="save-btn" style="
          width: 100%;
          margin: 2px 0;
          padding: 4px;
          border: 1px solid #007bff;
          background: #007bff;
          color: white;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">保存</button>

        <button id="reload-btn" style="
          width: 100%;
          margin: 2px 0;
          padding: 4px;
          border: 1px solid #28a745;
          background: #28a745;
          color: white;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">重载</button>

        <button id="clear-btn" style="
          width: 100%;
          margin: 2px 0;
          padding: 4px;
          border: 1px solid #dc3545;
          background: #dc3545;
          color: white;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">清除</button>

        <div id="status" style="
          margin-top: 6px;
          padding: 3px;
          background: #f8f9fa;
          border-radius: 3px;
          font-size: 10px;
          color: #666;
        ">状态: 已加载</div>
      </div>
    `;

   container.insertAdjacentHTML('beforeend', controlsHtml);

    // 绑定事件
    document.getElementById('save-btn')?.addEventListener('click', () => {
      if (SheetPersistence.saveState(sheetInstance, 'my-sheet')) {
        alert('表格状态已保存');
      } else {
        alert('保存失败');
      }
    });


    document.getElementById('reload-btn')?.addEventListener('click', () => {
      // window.location.reload();
      debugger;
       window.sheetInstance?.release?.();
      const sheetInstance = SheetPersistence.loadState(container, 'my-sheet', defaultConfig);
      window.sheetInstance = sheetInstance;
    });
    document.getElementById('clear-btn')?.addEventListener('click', () => {
     SheetPersistence.clearState('my-sheet');
      alert('已清除缓存中保存的表格状态，点击重新加载后恢复默认状态');
    });
  };

  // 创建控制面板
  createControls();



```