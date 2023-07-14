// import * as VTable from '../../src';
// import { bindDebugTool } from '../../src/scenegraph/debug-tool';
// const sumNumberFormat = VTable.DataStatistics.numberFormat();
// const countNumberFormat = VTable.DataStatistics.numberFormat({
//   digitsAfterDecimal: 0,
//   thousandsSep: ''
// });
// function getColor(min: number, max: number, n: any) {
//   if (max === min) {
//     if (n > 0) {
//       return 'rgb(255,0,0)';
//     }
//     return 'rgb(255,255,255)';
//   }
//   if (n === '') {
//     return 'rgb(255,255,255)';
//   }
//   const c = Math.max(0.1, (n - min) / (max - min));
//   const red = 255;
//   const green = (1 - c) * 255;
//   return `rgb(${red},${green},${green})`;
// }
// const PivotTable = VTable.PivotTable;
// const Table_CONTAINER_DOM_ID = 'vTable';

// export function createTable() {
//   const option: VTable.PivotTableConstructorOptions = {
//     rows: ['地区', '省/自治区', '城市'],
//     columns: ['类别', '子类别'],
//     indicators: ['销售额', '销售数量'],
//     enableDataAnalysis: true,
//     dataConfig: {
//       aggregationRules: [
//         //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
//         {
//           indicatorKey: '销售额', //指标名称
//           field: '销售额', //指标依据字段
//           aggregationType: VTable.TYPES.AggregationType.SUM, //计算类型
//           formatFun: sumNumberFormat
//         },
//         {
//           indicatorKey: '销售数量', //指标名称
//           field: '销售额', //指标依据字段
//           aggregationType: VTable.TYPES.AggregationType.COUNT, //计算类型
//           formatFun: countNumberFormat
//         }
//       ],

//       mappingRules: [
//         {
//           bgColor: {
//             indicatorKey: '销售额',
//             mapping(grid, value) {
//               const max: number =
//                 grid.dataset.indicatorStatistics[grid.dataset.dataConfig.indicators.indexOf('销售额')].max.value();
//               const min: number =
//                 grid.dataset.indicatorStatistics[grid.dataset.dataConfig.indicators.indexOf('销售额')].min.value();
//               return getColor(min, max, value);
//             }
//           },
//           label: {
//             color: {
//               indicatorKey: '销售额',
//               mapping(value: any) {
//                 if (parseFloat(value) > 100) {
//                   return 'blue';
//                 }
//                 return 'lightblue';
//               }
//             }
//           },
//           symbol: {
//             shape: 'circle',
//             color: {
//               indicatorKey: '销售额',
//               mapping(value: any) {
//                 if (parseFloat(value) > 100) {
//                   return 'blue';
//                 }
//                 return 'lightblue';
//               }
//             }
//           }
//         }
//       ],
//       // indicatorsAsCol: false,
//       // hideIndicatorName:true,
//       sortRules: [
//         //针对相同sortField多条排序规则，靠前的优先级较高
//         {
//           sortField: '城市'
//           // sortBy: ['山城', '泗水', '沂水', '阳谷', '临清', '十字路', '莱州']
//         } as VTable.TYPES.SortByRule,
//         {
//           sortField: '城市',
//           sortByIndicator: '销售数量',
//           sortType: VTable.TYPES.SortType.ASC,
//           query: ['办公用品', '装订机']
//         } as VTable.TYPES.SortByIndicatorRule,
//         {
//           sortField: '省/自治区',
//           sortBy: ['上海', '北京', '山东', '河北']
//         } as VTable.TYPES.SortFuncRule
//       ],
//       filterRules: [
//         {
//           filterFunc: (row: Record<string, any>) => row['城市'] !== '开远'
//         }
//       ]
//     },
//     columns: [
//       {
//         dimensionKey: '类别',
//         dimensionTitle: '类别',
//         drillUp: true,
//         headerStyle: {
//           textAlign: 'center',
//           borderColor: 'blue',
//           color: 'purple',
//           textBaseline: 'middle',
//           textStick: true,
//           bgColor: '#6cd26f'
//         },
//         // 指标菜单
//         dropDownMenu: ['升序排序I', '降序排序I', '冻结列I'],
//         // corner菜单
//         cornerDropDownMenu: ['升序排序C', '降序排序C', '冻结列C']
//       },
//       {
//         dimensionKey: '子类别',
//         dimensionTitle: '子类别',
//         headerStyle: {
//           textAlign: 'center',
//           color: 'blue',
//           bgColor: 'lightblue'
//         }
//       }
//     ],
//     rows: [
//       {
//         dimensionKey: '地区',
//         dimensionTitle: '地区',
//         headerStyle: {
//           textStick: true
//         }
//       },
//       {
//         dimensionKey: '省/自治区',
//         dimensionTitle: '省/自治区',
//         // headerFormat(value) {
//         //   return `${value}省/自治区`;
//         // },
//         headerStyle: {
//           textAlign: 'center',
//           textBaseline: 'middle',
//           borderColor: 'blue',
//           color: 'pink',
//           underline: true,
//           textStick: true,
//           bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
//             return 'gray';
//           }
//         },
//         drillDown: true
//       }
//     ],
//     // indicators: [
//     //   {
//     //     indicatorKey: '销售额',
//     //     caption: '销售额',
//     //     format(rec) {
//     //       return `${rec.dataValue}%`;
//     //     },
//     //     headerStyle: {
//     //       color: 'red'
//     //       // bgColor(arg: xTable.TYPES.StylePropertyFunctionArg) {
//     //       //   if (
//     //       //     (<xTable.TYPES.IPivotGridCellHeaderPaths>(
//     //       //       arg.cellHeaderPaths.colHeaderPaths
//     //       //     ))[0].value === '东北'
//     //       //   )
//     //       //     return '#bd422a';
//     //       //   if (
//     //       //     (<xTable.TYPES.IPivotGridCellHeaderPaths>(
//     //       //       arg.cellHeaderPaths.colHeaderPaths
//     //       //     ))[0].value === '华北'
//     //       //   )
//     //       //     return '#ff9900';
//     //       //   return 'gray';
//     //       // },
//     //     }
//     //   },
//     //   {
//     //     indicatorKey: '销售数量',
//     //     caption: '销售数量',
//     //     format(rec) {
//     //       // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
//     //       return rec.dataValue;
//     //     }
//     //   }
//     // ],
//     corner: {
//       titleOnDimension: 'column',
//       headerStyle: {
//         textAlign: 'center',
//         borderColor: 'red',
//         color: 'yellow',
//         underline: true,
//         fontSize: 16,
//         fontStyle: 'bold',
//         fontFamily: 'sans-serif'
//         // lineHeight: '20px'
//       }
//     },
//     indicatorTitle: '指标名称',
//     // indicatorsAsCol: false,
//     parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
//     records: [
//       {
//         '行 ID': '1',
//         '订单 ID': 'US-2019-1357144',
//         订单日期: '2019/4/27',
//         发货日期: '2019/4/29',
//         邮寄方式: '二级',
//         '客户 ID': '曾惠-14485',
//         客户名称: '曾惠',
//         细分: '公司',
//         城市: '杭州',
//         '省/自治区': '浙江',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '办公用-用品-10002717',
//         类别: '办公用品',
//         子类别: '用品',
//         产品名称: 'Fiskars 剪刀, 蓝色',
//         销售额: '129.696',
//         数量: '2',
//         折扣: '0.4',
//         利润: '-60.704'
//       },
//       {
//         '行 ID': '2',
//         '订单 ID': 'CN-2019-1973789',
//         订单日期: '2019/6/15',
//         发货日期: '2019/6/19',
//         邮寄方式: '标准级',
//         '客户 ID': '许安-10165',
//         客户名称: '许安',
//         细分: '消费者',
//         城市: '内江',
//         '省/自治区': '四川',
//         '国家/地区': '中国',
//         地区: '西南',
//         '产品 ID': '办公用-信封-10004832',
//         类别: '办公用品',
//         子类别: '信封',
//         产品名称: 'GlobeWeis 搭扣信封, 红色',
//         销售额: '125.44',
//         数量: '2',
//         折扣: '0',
//         利润: '42.56'
//       },
//       {
//         '行 ID': '3',
//         '订单 ID': 'CN-2019-1973789',
//         订单日期: '2019/6/15',
//         发货日期: '2019/6/19',
//         邮寄方式: '标准级',
//         '客户 ID': '许安-10165',
//         客户名称: '许安',
//         细分: '消费者',
//         城市: '内江',
//         '省/自治区': '四川',
//         '国家/地区': '中国',
//         地区: '西南',
//         '产品 ID': '办公用-装订-10001505',
//         类别: '办公用品',
//         子类别: '装订机',
//         产品名称: 'Cardinal 孔加固材料, 回收',
//         销售额: '31.92',
//         数量: '2',
//         折扣: '0.4',
//         利润: '4.2'
//       },
//       {
//         '行 ID': '4',
//         '订单 ID': 'US-2019-3017568',
//         订单日期: '2019/12/9',
//         发货日期: '2019/12/13',
//         邮寄方式: '标准级',
//         '客户 ID': '宋良-17170',
//         客户名称: '宋良',
//         细分: '公司',
//         城市: '镇江',
//         '省/自治区': '江苏',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '办公用-用品-10003746',
//         类别: '办公用品',
//         子类别: '用品',
//         产品名称: 'Kleencut 开信刀, 工业',
//         销售额: '321.216',
//         数量: '4',
//         折扣: '0.4',
//         利润: '-27.104'
//       },
//       {
//         '行 ID': '5',
//         '订单 ID': 'CN-2018-2975416',
//         订单日期: '2018/5/31',
//         发货日期: '2018/6/2',
//         邮寄方式: '二级',
//         '客户 ID': '万兰-15730',
//         客户名称: '万兰',
//         细分: '消费者',
//         城市: '汕头',
//         '省/自治区': '广东',
//         '国家/地区': '中国',
//         地区: '中南',
//         '产品 ID': '办公用-器具-10003452',
//         类别: '办公用品',
//         子类别: '器具',
//         产品名称: 'KitchenAid 搅拌机, 黑色',
//         销售额: '1375.92',
//         数量: '3',
//         折扣: '0',
//         利润: '550.2'
//       },
//       {
//         '行 ID': '6',
//         '订单 ID': 'CN-2017-4497736',
//         订单日期: '2017/10/27',
//         发货日期: '2017/10/31',
//         邮寄方式: '标准级',
//         '客户 ID': '俞明-18325',
//         客户名称: '俞明',
//         细分: '消费者',
//         城市: '景德镇',
//         '省/自治区': '江西',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '技术-设备-10001640',
//         类别: '技术',
//         子类别: '设备',
//         产品名称: '柯尼卡 打印机, 红色',
//         销售额: '11129.58',
//         数量: '9',
//         折扣: '0',
//         利润: '3783.78'
//       },
//       {
//         '行 ID': '7',
//         '订单 ID': 'CN-2017-4497736',
//         订单日期: '2017/10/27',
//         发货日期: '2017/10/31',
//         邮寄方式: '标准级',
//         '客户 ID': '俞明-18325',
//         客户名称: '俞明',
//         细分: '消费者',
//         城市: '景德镇',
//         '省/自治区': '江西',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '办公用-装订-10001029',
//         类别: '办公用品',
//         子类别: '装订机',
//         产品名称: 'Ibico 订书机, 实惠',
//         销售额: '479.92',
//         数量: '2',
//         折扣: '0',
//         利润: '172.76'
//       },
//       {
//         '行 ID': '8',
//         '订单 ID': 'CN-2017-4497736',
//         订单日期: '2017/10/27',
//         发货日期: '2017/10/31',
//         邮寄方式: '标准级',
//         '客户 ID': '俞明-18325',
//         客户名称: '俞明',
//         细分: '消费者',
//         城市: '景德镇',
//         '省/自治区': '江西',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '家具-椅子-10000578',
//         类别: '家具',
//         子类别: '椅子',
//         产品名称: 'SAFCO 扶手椅, 可调',
//         销售额: '8659.84',
//         数量: '4',
//         折扣: '0',
//         利润: '2684.08'
//       },
//       {
//         '行 ID': '9',
//         '订单 ID': 'CN-2017-4497736',
//         订单日期: '2017/10/27',
//         发货日期: '2017/10/31',
//         邮寄方式: '标准级',
//         '客户 ID': '俞明-18325',
//         客户名称: '俞明',
//         细分: '消费者',
//         城市: '景德镇',
//         '省/自治区': '江西',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '办公用-纸张-10001629',
//         类别: '办公用品',
//         子类别: '纸张',
//         产品名称: 'Green Bar 计划信息表, 多色',
//         销售额: '588',
//         数量: '5',
//         折扣: '0',
//         利润: '46.9'
//       },
//       {
//         '行 ID': '10',
//         '订单 ID': 'CN-2017-4497736',
//         订单日期: '2017/10/27',
//         发货日期: '2017/10/31',
//         邮寄方式: '标准级',
//         '客户 ID': '俞明-18325',
//         客户名称: '俞明',
//         细分: '消费者',
//         城市: '景德镇',
//         '省/自治区': '江西',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '办公用-系固-10004801',
//         类别: '办公用品',
//         子类别: '系固件',
//         产品名称: 'Stockwell 橡皮筋, 整包',
//         销售额: '154.28',
//         数量: '2',
//         折扣: '0',
//         利润: '33.88'
//       },
//       {
//         '行 ID': '11',
//         '订单 ID': 'CN-2016-4195213',
//         订单日期: '2016/12/22',
//         发货日期: '2016/12/24',
//         邮寄方式: '二级',
//         '客户 ID': '谢雯-21700',
//         客户名称: '谢雯',
//         细分: '小型企业',
//         城市: '榆林',
//         '省/自治区': '陕西',
//         '国家/地区': '中国',
//         地区: '西北',
//         '产品 ID': '技术-设备-10000001',
//         类别: '技术',
//         子类别: '设备',
//         产品名称: '爱普生 计算器, 耐用',
//         销售额: '434.28',
//         数量: '2',
//         折扣: '0',
//         利润: '4.2'
//       },
//       {
//         '行 ID': '12',
//         '订单 ID': 'CN-2019-5801711',
//         订单日期: '2019/6/1',
//         发货日期: '2019/6/6',
//         邮寄方式: '标准级',
//         '客户 ID': '康青-19585',
//         客户名称: '康青',
//         细分: '消费者',
//         城市: '哈尔滨',
//         '省/自治区': '黑龙江',
//         '国家/地区': '中国',
//         地区: '东北',
//         '产品 ID': '技术-复印-10002416',
//         类别: '技术',
//         子类别: '复印机',
//         产品名称: '惠普 墨水, 红色',
//         销售额: '2368.8',
//         数量: '4',
//         折扣: '0',
//         利润: '639.52'
//       },
//       {
//         '行 ID': '13',
//         '订单 ID': 'CN-2017-2752724',
//         订单日期: '2017/6/5',
//         发货日期: '2017/6/9',
//         邮寄方式: '标准级',
//         '客户 ID': '赵婵-10885',
//         客户名称: '赵婵',
//         细分: '消费者',
//         城市: '青岛',
//         '省/自治区': '山东',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '办公用-信封-10000017',
//         类别: '办公用品',
//         子类别: '信封',
//         产品名称: 'Jiffy 局间信封, 银色',
//         销售额: '683.76',
//         数量: '3',
//         折扣: '0',
//         利润: '88.62'
//       },
//       {
//         '行 ID': '14',
//         '订单 ID': 'CN-2017-2752724',
//         订单日期: '2017/6/5',
//         发货日期: '2017/6/9',
//         邮寄方式: '标准级',
//         '客户 ID': '赵婵-10885',
//         客户名称: '赵婵',
//         细分: '消费者',
//         城市: '青岛',
//         '省/自治区': '山东',
//         '国家/地区': '中国',
//         地区: '华东',
//         '产品 ID': '技术-配件-10004920',
//         类别: '技术',
//         子类别: '配件',
//         产品名称: 'SanDisk 键区, 可编程',
//         销售额: '1326.5',
//         数量: '5',
//         折扣: '0',
//         利润: '344.4'
//       }
//     ],
//     showFrozenIcon: false, //显示VTable内置冻结列图标
//     allowFrozenColCount: 2,
//     widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
//     defaultRowHeight: 80,
//     columnResizeType: 'indicator', // 'column' | 'indicator' | 'all'
//     tooltip: {
//       isShowOverflowTextTooltip: true
//     }
//   };

//   const instance = new PivotTable(option);
//   window.tableInstance = instance;

//   const { PIVOT_SORT_CLICK } = VTable.PivotTable.EVENT_TYPE;
//   instance.listen(PIVOT_SORT_CLICK, e => {
//     const order = e.order === 'asc' ? 'desc' : e.order === 'desc' ? 'normal' : 'asc';
//     instance.updatePivotSortState([{ dimensions: e.dimensionInfo, order }]);
//   });

//   bindDebugTool(instance.scenegraph.stage as any, {
//     customGrapicKeys: ['role', '_updateTag']
//   });

//   // 只为了方便控制太调试用，不要拷贝
//   (window as any).tableInstance = instance;
// }
