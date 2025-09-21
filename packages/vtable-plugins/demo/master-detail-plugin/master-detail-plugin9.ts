// 该case是主从表的懒加载的情况
import { MasterDetailPlugin } from '../../src/master-detail-plugin';
import * as VTable from '@visactor/vtable';

const CONTAINER_ID = 'vTable';

// 注册主题
VTable.register.theme('simpleDark', {
  defaultStyle: {
    borderLineWidth: 1,
    borderColor: '#e1e4e8',
    fontFamily: 'Arial, sans-serif'
  },
  bodyStyle: {
    borderColor: '#e1e4e8',
    bgColor: '#fff'
  },
  headerStyle: {
    borderColor: '#e1e4e8',
    bgColor: '#f7f8fa'
  }
});

export function createTable() {
  // 获取容器
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Container element with id "${CONTAINER_ID}" not found`);
  }

  // 主表数据 - 包含懒加载标识
  const masterData = [
    {
      id: 1,
      orderNo: 'ORD001',
      customer: '张三公司',
      amount: 15000,
      status: '已完成',
      date: '2024-01-15',
      // 静态子表数据
      children: [
        { productName: '笔记本电脑', quantity: 2, price: 5000, total: 10000 },
        { productName: '鼠标', quantity: 5, price: 100, total: 500 }
      ]
    },
    {
      id: 2,
      orderNo: 'ORD002',
      customer: '李四企业',
      amount: 25000,
      status: '处理中',
      date: '2024-01-16',
      children: true // 懒加载标识 - 需要异步加载数据
    },
    {
      id: 3,
      orderNo: 'ORD003',
      customer: '王五集团',
      amount: 35000,
      status: '已完成',
      date: '2024-01-17',
      children: true // 懒加载标识 - 需要异步加载数据
    },
    {
      id: 4,
      orderNo: 'ORD004',
      customer: '赵六有限公司',
      amount: 18000,
      status: '待发货',
      date: '2024-01-18'
      // 没有children属性，表示没有子数据，不显示展开图标
    }
  ];

  // 创建主从表插件
  const plugin = new MasterDetailPlugin({
    enableCheckboxCascade: true,
    // 懒加载事件处理
    onLazyLoad: async eventData => {
      const { record, callback } = eventData;
      try {
        // 从记录中获取订单ID
        const orderId = (record as { id: number }).id;
        // 异步获取数据
        const detailData = await mockFetchDetailData(orderId);
        // 通过callback返回数据
        callback(null, {
          records: detailData,
          style: {
            height: 250,
            margin: [10, 20, 10, 20]
          }
        });
      } catch (error) {
        console.error('数据加载失败:', error);
        // 通过callback返回错误
        callback(error, null);
      }
    },
    detailTableOptions: params => {
      const { data } = params;
      return {
        columns: [
          { field: 'productName', title: '产品名称', width: 150 },
          { field: 'quantity', title: '数量', width: 80 },
          { field: 'price', title: '单价', width: 100 },
          { field: 'total', title: '小计', width: 100 }
        ],
        records: (data as any).children,
        style: {
          height: 200,
          margin: [10, 20, 10, 20]
        }
      };
    }
  });

  // 主表配置
  const tableOptions: VTable.ListTableConstructorOptions = {
    columns: [
      { field: 'orderNo', title: '订单号', width: 120 },
      { field: 'customer', title: '客户名称', width: 150 },
      { field: 'amount', title: '订单金额', width: 120 },
      { field: 'status', title: '状态', width: 100 },
      { field: 'date', title: '订单日期', width: 120 }
    ],
    records: masterData,
    widthMode: 'standard',
    allowFrozenColCount: 2,
    defaultRowHeight: 40,
    plugins: [plugin]
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(container, tableOptions);

  // 模拟异步数据获取函数
  async function mockFetchDetailData(orderId: number) {
    const delay = 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    // 根据订单ID返回不同的产品明细数据
    const mockDetailData: Record<
      number,
      Array<{ productName: string; quantity: number; price: number; total: number }>
    > = {
      2: [
        { productName: '台式机', quantity: 1, price: 8000, total: 8000 },
        { productName: '显示器', quantity: 2, price: 2000, total: 4000 },
        { productName: '键盘', quantity: 1, price: 200, total: 200 },
        { productName: 'U盘', quantity: 10, price: 50, total: 500 },
        { productName: '音响', quantity: 1, price: 1200, total: 1200 }
      ],
      3: [
        { productName: '服务器', quantity: 2, price: 15000, total: 30000 },
        { productName: '网络设备', quantity: 5, price: 1000, total: 5000 },
        { productName: '交换机', quantity: 3, price: 800, total: 2400 }
      ]
    };
    return mockDetailData[orderId] || [{ productName: '默认产品', quantity: 1, price: 100, total: 100 }];
  }
  // 将表格实例挂载到全局，方便调试
  (window as unknown as { tableInstance: unknown; plugin: unknown }).tableInstance = tableInstance;
  (window as unknown as { tableInstance: unknown; plugin: unknown }).plugin = plugin;
  return tableInstance;
}
