# JSX 自定义布局完整示例

## 1. 用户卡片（头像 + 信息 + 标签）

```jsx
import * as VTable from '@visactor/vtable';
const { Group, Text, Image, Tag } = VTable.CustomLayout;

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: users,
  columns: [
    {
      field: 'user',
      title: '用户',
      width: 320,
      customLayout: (args) => {
        const { table, row, col } = args;
        const record = table.getCellOriginRecord(col, row);
        return {
          rootContainer: (
            <Group display="flex" flexDirection="row" alignItems="center" padding={8}>
              <Image
                src={record.avatar}
                width={48}
                height={48}
                cornerRadius={24}
              />
              <Group display="flex" flexDirection="column" margin={[0, 0, 0, 12]} flex={1}>
                <Text text={record.name} fontSize={14} fontWeight="bold" fill="#1a1a1a" />
                <Text text={record.email} fontSize={12} fill="#8c8c8c" margin={[4, 0, 0, 0]} />
              </Group>
              <Tag
                text={record.role}
                fill={record.role === 'Admin' ? '#e6f7ff' : '#f6ffed'}
                textStyle={{
                  fill: record.role === 'Admin' ? '#1890ff' : '#52c41a',
                  fontSize: 11
                }}
                padding={[2, 8]}
                cornerRadius={4}
              />
            </Group>
          ),
          renderDefault: false,
          expectedHeight: 64
        };
      }
    },
    { field: 'department', title: '部门', width: 120 },
    { field: 'joinDate', title: '入职日期', width: 120 }
  ],
  defaultRowHeight: 64
});
```

## 2. 多指标仪表板单元格

```jsx
const { Group, Text, Rect } = VTable.CustomLayout;

function dashboardCell(args) {
  const { table, row, col, rect } = args;
  const record = table.getCellOriginRecord(col, row);

  const rate = record.completion / 100;
  const barWidth = (rect.width - 24) * rate;
  const barColor = rate >= 0.8 ? '#52c41a' : rate >= 0.5 ? '#faad14' : '#ff4d4f';

  return {
    rootContainer: (
      <Group display="flex" flexDirection="column" padding={8}>
        <Group display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text text={record.metric} fontSize={12} fill="#8c8c8c" />
          <Text text={`${record.completion}%`} fontSize={16} fontWeight="bold" fill={barColor} />
        </Group>
        <Group width={rect.width - 24} height={8} fill="#f0f0f0" cornerRadius={4} margin={[8, 0, 0, 0]}>
          <Rect width={barWidth} height={8} fill={barColor} cornerRadius={4} />
        </Group>
        <Group display="flex" flexDirection="row" justifyContent="space-between" margin={[6, 0, 0, 0]}>
          <Text text={`目标: ${record.target}`} fontSize={11} fill="#bfbfbf" />
          <Text text={`实际: ${record.actual}`} fontSize={11} fill="#595959" />
        </Group>
      </Group>
    ),
    renderDefault: false,
    expectedHeight: 72
  };
}
```

## 3. 可点击操作列

```jsx
const { Group, Text, Image } = VTable.CustomLayout;

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: orderData,
  columns: [
    { field: 'orderId', title: '订单号', width: 120 },
    { field: 'product', title: '产品', width: 150 },
    {
      field: 'actions',
      title: '操作',
      width: 200,
      customLayout: (args) => {
        const { table, row, col } = args;
        const record = table.getCellOriginRecord(col, row);

        return {
          rootContainer: (
            <Group display="flex" flexDirection="row" alignItems="center" padding={4}>
              <Group
                display="flex" alignItems="center" justifyContent="center"
                width={60} height={28} fill="#e6f7ff" cornerRadius={4}
                cursor="pointer"
                onClick={() => handleView(record)}
              >
                <Text text="查看" fontSize={12} fill="#1890ff" />
              </Group>
              <Group
                display="flex" alignItems="center" justifyContent="center"
                width={60} height={28} fill="#fff7e6" cornerRadius={4}
                margin={[0, 0, 0, 8]}
                cursor="pointer"
                onClick={() => handleEdit(record)}
              >
                <Text text="编辑" fontSize={12} fill="#fa8c16" />
              </Group>
              <Group
                display="flex" alignItems="center" justifyContent="center"
                width={60} height={28} fill="#fff2f0" cornerRadius={4}
                margin={[0, 0, 0, 8]}
                cursor="pointer"
                onClick={() => handleDelete(record)}
              >
                <Text text="删除" fontSize={12} fill="#ff4d4f" />
              </Group>
            </Group>
          ),
          renderDefault: false
        };
      }
    }
  ]
});
```

## 4. 带状态和 hover 效果的列表项

```jsx
const { Group, Text, Image, Circle } = VTable.CustomLayout;

function statusCell(args) {
  const { table, row, col } = args;
  const record = table.getCellOriginRecord(col, row);

  const statusMap = {
    running: { color: '#52c41a', text: '运行中' },
    stopped: { color: '#ff4d4f', text: '已停止' },
    pending: { color: '#faad14', text: '等待中' }
  };
  const status = statusMap[record.status] || { color: '#999', text: '未知' };

  return {
    rootContainer: (
      <Group display="flex" flexDirection="row" alignItems="center" padding={[4, 8]}>
        <Circle radius={4} fill={status.color} />
        <Text text={status.text} fontSize={13} fill={status.color} margin={[0, 0, 0, 6]} />
      </Group>
    ),
    renderDefault: false
  };
}
```

## 5. 表头自定义布局

```jsx
const { Group, Text, Image } = VTable.CustomLayout;

const table = new VTable.ListTable({
  container: document.getElementById('tableContainer'),
  records: data,
  columns: [
    {
      field: 'sales',
      title: '销售额',
      width: 180,
      headerCustomLayout: (args) => {
        return {
          rootContainer: (
            <Group display="flex" flexDirection="row" alignItems="center" padding={[4, 8]}>
              <Image src="/icons/chart.svg" width={16} height={16} />
              <Group display="flex" flexDirection="column" margin={[0, 0, 0, 6]}>
                <Text text="销售额" fontSize={13} fontWeight="bold" fill="#333" />
                <Text text="单位: 万元" fontSize={10} fill="#999" margin={[2, 0, 0, 0]} />
              </Group>
            </Group>
          ),
          renderDefault: false
        };
      },
      style: { textAlign: 'right' }
    }
  ]
});
```
