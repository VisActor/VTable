# 多表格页管理

VTable-Sheet支持在一个实例中管理多个表格页（Sheet），类似于Excel的工作簿功能。本章介绍如何创建、切换和管理多个表格页。

## 创建多个表格页

在初始化VTableSheet时，可以通过`sheets`配置项定义多个表格页：

```javascript live template=vtable
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  showSheetTab: true, // 显示底部表格页切换栏，多表格页时建议开启
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '销售数据',
      data: [
        ['产品', '一月', '二月', '三月'],
        ['产品A', 1200, 1500, 900],
        ['产品B', 950, 1100, 1300]
      ],
      active: true // 设置为激活状态
    },
    {
      sheetKey: 'sheet2',
      sheetTitle: '库存数据',
      data: [
        ['产品', '库存数量', '安全库存'],
        ['产品A', 500, 200],
        ['产品B', 300, 150]
      ]
    }
  ]
});
```

## 表格页切换

当配置了多个表格页并启用了`showSheetTab`选项时，用户可以通过点击底部的表格页标签来切换不同的表格页。

也可以通过编程方式切换表格页：

```typescript
// 根据key激活表格页
sheetInstance.activateSheet('sheet2');
```

## 动态添加表格页

可以在运行时动态添加新的表格页：

```typescript
const newSheet = sheetInstance.addSheet({
  sheetKey: 'sheet3',
  sheetTitle: '新表格页',
  columns: [
    { title: '名称', width: 100 },
    { title: '值', width: 80 }
  ],
  data: [
    ['项目1', 100],
    ['项目2', 200]
  ]
});

// 激活新添加的表格页
sheetInstance.activateSheet( 'sheet3');
```

## 删除表格页

可以删除不需要的表格页：

```typescript
// 通过key删除表格页
sheetInstance.removeSheet('sheet3');
```

## 获取表格页信息

VTableSheet提供了多种方法来获取表格页信息：

```typescript
// 获取当前激活的表格页
const activeSheet = sheetInstance.getActiveSheet();

// 根据key获取特定的表格页
const sheet2 = sheetInstance.getSheetByKey('sheet2');

// 获取所有表格页
const allSheets = sheetInstance.getAllSheets();

// 获取表格页总数
const sheetCount = sheetInstance.getSheetCount();
```

## 表格页配置项

每个表格页(Sheet)可以独立配置以下属性：

| 配置项 | 类型 | 说明 |
|-------|------|------|
| sheetKey | string | 表格页的唯一标识 |
| sheetTitle | string | 显示在标签上的名称 |
| data | any[][] | 表格数据 |
| columns | object[] | 列定义 |
| active | boolean | 是否激活该表格页 |
| filter | boolean \| object | 是否启用过滤功能 |
| frozenRowCount | number | 冻结的行数 |
| frozenColCount | number | 冻结的列数 |
| showHeader | boolean | 是否显示表头 |
| rowCount | number | 行数量 |
| columnCount | number | 列数量 |
| cellMerge | object[] | 单元格合并设置 |

## 表格页操作事件
TODO
VTableSheet提供了一系列与表格页操作相关的事件：

```typescript
// 表格页切换事件
sheetInstance.on('sheetChange', (evt) => {
  console.log('当前激活的表格页:', evt.sheet);
  console.log('之前激活的表格页:', evt.prevSheet);
});

// 表格页添加事件
sheetInstance.on('sheetAdd', (evt) => {
  console.log('新添加的表格页:', evt.sheet);
});

// 表格页删除事件
sheetInstance.on('sheetRemove', (evt) => {
  console.log('被删除的表格页key:', evt.sheetKey);
});
```

## 表格页样式定制

可以为每个表格页定制不同的样式：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '表格1',
      data: [...],
      // 单独为该表格页设置样式
      style: {
        headerStyle: {
          bgColor: '#f0f0f0',
          fontWeight: 'bold'
        },
        bodyStyle: {
          bgColor: '#ffffff',
          fontSize: 14
        }
      }
    },
    {
      sheetKey: 'sheet2',
      sheetTitle: '表格2',
      data: [...],
      // 另一个表格页的样式
      style: {
        headerStyle: {
          bgColor: '#e6f7ff',
          fontWeight: 'bold'
        },
        bodyStyle: {
          bgColor: '#f9f9f9',
          fontSize: 14
        }
      }
    }
  ]
});
```

## 实用示例

以下是一个包含多个表格页的完整示例：

```javascript livedemo template=vtable
// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// 容器
const container = document.getElementById(CONTAINER_ID);
// 创建表格实例
const sheetInstance = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    // 销售数据表格页
    {
      sheetKey: 'sales',
      sheetTitle: '销售数据',
      columns: [
        { title: '产品', width: 120 },
        { title: '一季度', width: 100 },
        { title: '二季度', width: 100 },
        { title: '三季度', width: 100 },
        { title: '四季度', width: 100 },
        { title: '总计', width: 100 }
      ],
      data: [
        ['笔记本电脑', 1200, 1500, 1800, 2000, 6500],
        ['智能手机', 2500, 2800, 3000, 3500, 11800],
        ['平板电脑', 900, 950, 1100, 1300, 4250],
        ['智能手表', 500, 650, 800, 950, 2900],
      ],
      active: true,
      frozenRowCount: 1,
      frozenColCount: 1
    },
    
    // 库存数据表格页
    {
      sheetKey: 'inventory',
      sheetTitle: '库存数据',
      columns: [
        { title: '产品', width: 120 },
        { title: '库存数量', width: 100 },
        { title: '安全库存', width: 100 },
        { title: '补货点', width: 100 },
        { title: '库存状态', width: 100 }
      ],
      data: [
        ['笔记本电脑', 150, 50, 75, '正常'],
        ['智能手机', 320, 100, 150, '充足'],
        ['平板电脑', 80, 40, 60, '警告'],
        ['智能手表', 35, 30, 45, '不足'],
      ]
    },
    
    // 员工数据表格页
    {
      sheetKey: 'employees',
      sheetTitle: '员工数据',
      columns: [
        { title: '姓名', width: 100 },
        { title: '部门', width: 120 },
        { title: '职位', width: 120 },
        { title: '入职日期', width: 120 },
        { title: '工资', width: 100 }
      ],
      data: [
        ['张三', '技术部', '工程师', '2022-01-15', 12000],
        ['李四', '市场部', '经理', '2020-06-20', 18000],
        ['王五', '技术部', '高级工程师', '2021-03-10', 15000],
        ['赵六', '人力资源', '专员', '2022-09-01', 9000]
      ]
    }
  ]
});
window['sheetInstance'] = sheetInstance;
```

通过这些功能，可以轻松管理多个表格页，构建功能丰富的电子表格应用。

