# 常用代码模式与最佳实践

## 一、表格初始化模式

### 基本模板

```typescript
import { ListTable } from '@visactor/vtable';

// 创建容器
const container = document.getElementById('tableContainer');

// 创建表格
const table = new ListTable({
  container,
  records: data,
  columns: [...],
  widthMode: 'standard',
  defaultRowHeight: 40
});

// 窗口大小变化时自适应
window.addEventListener('resize', () => {
  table.renderWithRecreateCells();
});

// 页面销毁时释放
// table.release();
```

### 自适应容器

```typescript
const table = new ListTable({
  container,
  records: data,
  columns: [...],
  widthMode: 'adaptive',    // 列宽自适应容器
  heightMode: 'adaptive',   // 行高自适应容器
  autoFillWidth: true,       // 列不足时自动拉伸
  autoFillHeight: true       // 行不足时自动拉伸
});
```

### 大数据量优化

```typescript
const table = new ListTable({
  container,
  records: largeData,  // 百万级数据
  columns: [...],
  renderChartAsync: true,   // 图表异步渲染
  // VTable 内部使用虚拟滚动，无需额外配置
});

// 使用预排序优化排序性能
const sortedMap = new Map();
largeData.forEach((r, i) => sortedMap.set(i, r.sortKey));
table.setSortedIndexMap('field', sortedMap);
```

## 二、样式条件格式

### 根据值设置背景色

```typescript
{
  field: 'score',
  title: '分数',
  style: (args) => ({
    bgColor: args.dataValue >= 90 ? '#f6ffed' :
             args.dataValue >= 60 ? '#e6f7ff' :
             '#fff1f0',
    color: args.dataValue >= 90 ? '#52c41a' :
           args.dataValue >= 60 ? '#1890ff' :
           '#f5222d'
  })
}
```

### 交替行颜色

```typescript
{
  field: 'name',
  title: '姓名',
  style: (args) => ({
    bgColor: args.row % 2 === 0 ? '#fafafa' : '#fff'
  })
}
```

### 运行时动态样式

```typescript
// 注册样式
table.registerCustomCellStyle('highlight', {
  bgColor: '#ffffcc',
  fontWeight: 'bold'
});

// 根据条件分配
data.forEach((record, index) => {
  if (record.isImportant) {
    table.arrangeCustomCellStyle({
      cellPosition: { row: index + table.columnHeaderLevelCount },
      customStyleId: 'highlight'
    });
  }
});
```

## 三、编辑表格模式

### 完整编辑表格

```typescript
import { ListTable, register } from '@visactor/vtable';
import { InputEditor, ListEditor } from '@visactor/vtable-editors';

// 注册编辑器
register.editor('input', new InputEditor());
register.editor('list', new ListEditor({ values: ['进行中', '已完成', '已取消'] }));

const table = new ListTable({
  container,
  records: data,
  columns: [
    { field: 'name', title: '姓名', editor: 'input' },
    { field: 'status', title: '状态', editor: 'list' },
    { field: 'score', title: '分数' }  // 不可编辑
  ],
  editCellTrigger: 'doubleclick',
  keyboardOptions: {
    moveFocusCellOnTab: true,
    editCellOnEnter: true,
    copySelected: true,
    pasteValueToCell: true
  }
});

// 监听值变更
table.on('change_cell_value', (args) => {
  // 保存到后端
  saveToServer(args.col, args.row, args.value);
});
```

## 四、透视分析表模式

### 销售数据透视

```typescript
import { PivotTable } from '@visactor/vtable';
import * as VTable from '@visactor/vtable';

const table = new PivotTable({
  container,
  records: salesData,
  rows: [
    { dimensionKey: 'region', title: '地区', width: 120 },
    { dimensionKey: 'city', title: '城市', width: 100 }
  ],
  columns: [
    { dimensionKey: 'category', title: '品类' }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      title: '销售额',
      width: 120,
      format: (value) => value ? `¥${Number(value).toLocaleString()}` : '-',
      style: (args) => ({
        color: args.dataValue > 5000 ? '#52c41a' : '#333'
      })
    },
    {
      indicatorKey: 'profit',
      title: '利润',
      width: 100,
      format: (value) => value ? `¥${Number(value).toLocaleString()}` : '-'
    }
  ],
  dataConfig: {
    aggregationRules: [
      { indicatorKey: 'sales', field: 'sales', aggregationType: VTable.AggregationType.SUM },
      { indicatorKey: 'profit', field: 'profit', aggregationType: VTable.AggregationType.SUM }
    ],
    totals: {
      row: { showGrandTotals: true, grandTotalLabel: '总计' },
      column: { showGrandTotals: true, grandTotalLabel: '总计' }
    }
  },
  corner: { titleOnDimension: 'row' },
  rowHierarchyType: 'tree',
  rowExpandLevel: 1
});
```

## 五、自定义卡片布局

### 用户信息卡片

```typescript
import { ListTable, Group, Text, Image, Tag } from '@visactor/vtable';

const table = new ListTable({
  container,
  records: users,
  defaultRowHeight: 64,
  columns: [{
    field: 'user',
    title: '用户',
    width: 280,
    customLayout: (args) => {
      const { rect, table, col, row } = args;
      const record = table.getCellOriginRecord(col, row);
      
      return {
        rootContainer: (
          <Group display="flex" flexDirection="row" alignItems="center"
                 width={rect.width} height={rect.height} padding={[8, 12]}>
            <Image
              src={record.avatar}
              width={40} height={40}
              cornerRadius={20}
            />
            <Group display="flex" flexDirection="column" padding={[0, 0, 0, 10]}>
              <Text text={record.name} fontSize={14} fontWeight="bold" fill="#1f2329" />
              <Group display="flex" flexDirection="row" gap={4} padding={[4, 0, 0, 0]}>
                <Tag text={record.role} fill="#e6f7ff"
                     textStyle={{ fill: '#1890ff', fontSize: 11 }}
                     padding={[1, 6]} cornerRadius={3} />
                <Tag text={record.department} fill="#f6ffed"
                     textStyle={{ fill: '#52c41a', fontSize: 11 }}
                     padding={[1, 6]} cornerRadius={3} />
              </Group>
            </Group>
          </Group>
        ),
        renderDefault: false
      };
    }
  },
  { field: 'email', title: '邮箱', width: 200 },
  { field: 'joinDate', title: '入职日期', width: 120 }]
});
```

## 六、搜索与高亮

```typescript
import { SearchComponent } from '@visactor/vtable-search';

const searchComponent = new SearchComponent({
  table,
  autoJump: true  // 自动跳转到第一个匹配
});

// 搜索
searchComponent.search('keyword');

// 下一个/上一个
searchComponent.next();
searchComponent.prev();

// 清除搜索
searchComponent.clear();
```

## 七、导出

```typescript
import { exportVTableToExcel } from '@visactor/vtable-export';

// 导出 Excel
exportVTableToExcel(table, {
  fileName: 'table-data',
  ignoreIcon: true
});

// 导出图片
const imgBase64 = table.exportImg();

// 导出单个单元格图片
const cellImg = table.exportCellImg(col, row);
```

## 八、生命周期最佳实践

```typescript
// 创建
const table = new ListTable(options);

// 等待初始化完成
table.on('initialized', () => {
  console.log('表格初始化完成');
});

// 每次渲染完成
table.on('after_render', () => {
  console.log('渲染完成');
});

// 更新配置
table.updateOption(newOptions);     // 全量更新
table.updateColumns(newColumns);    // 只更新列
table.updateTheme(newTheme);        // 只更新主题
table.setRecords(newRecords);       // 只更新数据

// ⚠️ 销毁（必须调用，避免内存泄漏）
table.release();
```

## 九、常见问题模式

### 表格不显示

```typescript
// ✅ 确保容器有明确的宽高
const container = document.getElementById('table');
container.style.width = '800px';
container.style.height = '600px';

const table = new ListTable({ container, ... });
```

### 数据更新后不刷新

```typescript
// ❌ 直接修改不会触发更新
table.records[0].name = 'new';

// ✅ 使用 API
table.changeCellValue(col, row, 'new');
// 或
table.setRecords(newRecords);
```

### 动态调整冻结列

```typescript
// 设置后需要重建
table.frozenColCount = 3;
table.renderWithRecreateCells();
```

### 自适应容器大小变化

```typescript
const resizeObserver = new ResizeObserver(() => {
  table.renderWithRecreateCells();
});
resizeObserver.observe(container);
```
