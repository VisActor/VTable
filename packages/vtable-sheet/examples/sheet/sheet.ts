import { VTableSheet, TYPES, VTable } from '../../src/index';
import * as VTablePlugins from '@visactor/vtable-plugins';
import { VTableSheetEventType } from '../../src/ts-types/spreadsheet-events';
const CONTAINER_ID = 'vTable';
export function createTable() {
  // 清理之前的实例（如果存在）
  if ((window as any).sheetInstance) {
    (window as any).sheetInstance.release();
    (window as any).sheetInstance = null;
  }

  const sheetInstance = new VTableSheet(document.getElementById(CONTAINER_ID)!, {
    // showFormulaBar: false,
    showSheetTab: true,
    // defaultRowHeight: 25,
    // defaultColWidth: 100,
    sheets: [
      {
        keyboardOptions: { selectAllOnCtrlA: true },
        rowCount: 200,
        columnCount: 10,
        sheetKey: 'sheet1',
        sheetTitle: 'sheet1',
        filter: true,
        columnWidthConfig: [
          {
            key: 0,
            width: 130
          }
        ],
        rowHeightConfig: [
          {
            key: 0,
            height: 65
          }
        ],
        columns: [
          {
            title: '名称',
            sort: true,
            width: 100
          }
        ],
        data: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ['放到', '个', '哦']
        ],
        active: true,
        // dragOrder: {
        //   enableDragColumnOrder: false,
        //   enableDragRowOrder: true
        // },
        theme: {
          rowSeriesNumberCellStyle: {
            text: {
              fill: 'green'
            }
          },
          tableTheme: TYPES.VTableThemes.ARCO.extends({
            bodyStyle: {
              color: 'red'
            },
            headerStyle: {
              color: 'pink'
            }
          })
        }
      },
      {
        sheetKey: 'sheet2',
        sheetTitle: 'sheet2',
        columns: [
          {
            key: 'name',
            title: '名称',
            width: 100,
            filter: false
          },
          {
            key: 'name1',
            title: '名称1',
            width: 100
          },
          {
            key: 'name2',
            filter: true,
            title: '名称2',
            width: 100
          }
        ],
        data: [
          [3, 4, 6],
          ['s', 'd', 'f']
        ],
        filter: false,
        active: false
      },
      {
        sheetKey: 'sheet3',
        sheetTitle: 'sheet3',
        data: [['s', 'd', 'f'], null, ['t', 'y', 'u'], null, null, null, null, ['3']],
        active: false,
        filter: true,
        columns: [
          {
            title: '3'
          },
          {
            title: '4'
          },
          {
            title: '6'
          }
        ]
      },
      {
        sheetKey: 'sheet4',
        sheetTitle: 'sheet4',
        active: false,
        showHeader: false,
        columnCount: 200,
        data: [
          ['r', 't', 'y', 1, 2, 3],
          ['y', 'u', 'i', 4, 5, 6],
          ['j', 'k', 'h', 7, 8, 9]
        ],
        cellMerge: [
          {
            text: 'r',
            range: {
              start: {
                col: 0,
                row: 0
              },
              end: {
                col: 1,
                row: 2
              },
              isCustom: true
            }
          },
          {
            text: 'y',
            range: {
              start: {
                col: 2,
                row: 0
              },
              end: {
                col: 2,
                row: 1
              },
              isCustom: true
            }
          }
        ]
      },
      {
        sheetKey: 'sheet5',
        sheetTitle: 'Sheet5',
        columnCount: 20,
        rowCount: 100,
        firstRowAsHeader: true,
        widthMode: 'autoWidth',
        // filter: true,
        // frozenRowCount: 10,
        // frozenColCount: 1,
        data: [
          ['类别', '细分', '邮寄方式', '客户名称', '产品名称', '子类别', '订单 ID', '数量', '利润', '折扣'],
          [
            '办公用品',
            '消费者',
            '一级',
            '严恒',
            'Acco 孔加固材料, 实惠',
            '装订机',
            'CN-2019-4794169',
            '7',
            '268.52',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级',
            '何芯',
            'SanDisk 羊皮纸, 多色',
            '纸张',
            'CN-2018-1150523',
            '7',
            '3,798.48',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '二级',
            '佘升',
            'Cardinal 订书机, 透明',
            '装订机',
            'CN-2018-4674220',
            '7',
            '229.32',
            '0'
          ],
          ['技术', '公司', '当日', '余婵', '夏普 个人复印机, 红色', '复印机', 'US-2016-1973789', '7', '547.82', '0'],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '冯娜',
            'Fellowes 搁板, 单宽度',
            '收纳具',
            'CN-2018-3258425',
            '7',
            '3,003.00',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '卢芳',
            'Acme 开信刀, 钢',
            '用品',
            'CN-2019-3184596',
            '7',
            '1,004.64',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '二级',
            '唐安',
            'Novimex 运输标签, 白色',
            '标签',
            'CN-2016-4217149',
            '7',
            '246.96',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '孙斯云',
            'Kleencut 美工刀, 蓝色',
            '用品',
            'CN-2016-5629911',
            '7',
            '-774.82',
            '0.4'
          ],
          ['技术', '消费者', '二级', '孙斯云', '三星 耳机, 混合尺寸', '电话', 'US-2016-2306215', '7', '-279.55', '0.8'],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '孙梦',
            'Eaton 笔记本, 回收',
            '纸张',
            'CN-2017-3223872',
            '7',
            '920.64',
            '0'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '孟刚',
            'Wilson Jones 订书机, 实惠',
            '装订机',
            'CN-2017-4893747',
            '7',
            '38.81',
            '0.4'
          ],
          [
            '技术',
            '公司',
            '二级',
            '宋良',
            'Brother 传真复印机, 红色',
            '复印机',
            'CN-2018-1599696',
            '7',
            '1,732.50',
            '0'
          ],
          [
            '家具',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '巩珑',
            'Sauder 柜, 白色',
            '书架',
            'CN-2019-5266113',
            '7',
            '532.84',
            '0'
          ],
          ['家具', '消费者', '二级', '廖乐', 'Novimex 摇椅, 每套两件', '椅子', 'US-2016-2756371', '7', '31.72', '0.4'],
          [
            '技术',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '廖宣',
            '爱普生 计算器, 耐用',
            '设备',
            'CN-2018-2162302',
            '7',
            '2,643.20',
            '0'
          ],
          ['办公用品', '小型企业', '当日', '廖立', 'Acme 修剪器, 工业', '用品', 'CN-2017-5448418', '7', '96.6', '0'],
          ['家具', '公司', '二级', '彭绅', 'SAFCO 凳子, 每套两件', '椅子', 'US-2017-5586841', '7', '65.8', '0'],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '徐菊',
            'Novimex 可去除的标签, 白色',
            '标签',
            'US-2018-2447332',
            '7',
            '2,552.20',
            '0'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '施梦',
            'Cuisinart 搅拌机, 红色',
            '器具',
            'US-2018-5578438',
            '7',
            '4,496.80',
            '0'
          ],
          [
            '家具',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '曹丽',
            'Dania 墙角架, 黑色',
            '书架',
            'CN-2019-1166331',
            '7',
            '-1,085.28',
            '0.4'
          ],
          ['办公用品', '消费者', '二级', '曹鹏', 'Fellowes 锁柜, 工业', '收纳具', 'CN-2018-2042105', '7', '410.2', '0'],
          [
            '办公用品',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '朱丽丽',
            'Eldon 文件车, 金属',
            '收纳具',
            'CN-2019-3172853',
            '7',
            '68.6',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '李康',
            'Fellowes 盒, 金属',
            '收纳具',
            'US-2017-5339863',
            '7',
            '184.8',
            '0'
          ],
          [
            '家具',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '柯婵',
            'Safco 书库, 传统',
            '书架',
            'CN-2017-5082514',
            '7',
            '51.66',
            '0'
          ],
          [
            '技术',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '武欢',
            'Hewlett 墨水, 彩色',
            '复印机',
            'CN-2019-4461870',
            '7',
            '209.16',
            '0'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '殷珑',
            'Eaton 信纸, 多色',
            '纸张',
            'US-2019-4595101',
            '7',
            '-281.23',
            '0.4'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '洪黎明',
            'Harbour Creations 圆形标签, 白色',
            '标签',
            'CN-2019-2872339',
            '7',
            '40.32',
            '0'
          ],
          [
            '家具',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '潘荷',
            'Dania 书架, 传统',
            '书架',
            'CN-2019-4200185',
            '7',
            '233.1',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级',
            '潘锦',
            'Breville 咖啡研磨机, 白色',
            '器具',
            'CN-2018-2823186',
            '7',
            '1,650.60',
            '0'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '潘雯',
            'Stockwell 按钉, 金属',
            '系固件',
            'CN-2016-5386927',
            '7',
            '2,548.98',
            '0'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '牛黎明',
            'Rogers 搁板, 工业',
            '收纳具',
            'US-2019-4479623',
            '7',
            '-1,189.94',
            '0.4'
          ],
          [
            '办公用品',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '王霖',
            'Stanley 记号笔, 混合尺寸',
            '美术',
            'CN-2019-5497693',
            '7',
            '255.78',
            '0'
          ],
          [
            '技术',
            '公司',
            '一级',
            '白婵',
            '夏普 无线传真机, 彩色',
            '复印机',
            'CN-2016-5908054',
            '7',
            '-1,202.04',
            '0.4'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '白斯云',
            'Kraft 马尼拉纸信封, 红色',
            '信封',
            'CN-2019-3497234',
            '7',
            '259.56',
            '0'
          ],
          [
            '家具',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '范宁',
            'Safco 墙角架, 金属',
            '书架',
            'US-2017-5579979',
            '7',
            '961.38',
            '0'
          ],
          [
            '家具',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '葛欢',
            'Sauder 墙角架, 金属',
            '书架',
            'US-2016-4719760',
            '7',
            '1,902.60',
            '0'
          ],
          [
            '技术',
            '小型企业',
            '二级',
            '蒋光',
            'StarTech 喷墨打印机, 白色',
            '设备',
            'CN-2017-5036114',
            '7',
            '11.84',
            '0.4'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '蔡安',
            'Acco 订书机, 实惠',
            '装订机',
            'CN-2016-3693431',
            '7',
            '506.52',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '薛君',
            'Advantus 订书钉, 金属',
            '系固件',
            'US-2017-5739201',
            '7',
            '-1,381.72',
            '4.8'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '袁丽华',
            'Advantus 橡皮筋, 整包',
            '系固件',
            'CN-2019-2577941',
            '7',
            '190.26',
            '0'
          ],
          [
            '技术',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '袁荣',
            '思科 办公室电话机, 整包',
            '电话',
            'CN-2018-3064620',
            '7',
            '1,068.48',
            '0'
          ],
          [
            '技术',
            '小型企业',
            '一级办公123123123213123123123123213123213213(标准级)',
            '许莞颖',
            '爱普生 卡片打印机, 耐用',
            '设备',
            'CN-2017-3261036',
            '7',
            '-4,156.74',
            '0.4'
          ],
          ['办公用品', '消费者', '一级', '贾丹', 'BIC 荧光笔, 蓝色', '美术', 'CN-2018-2551450', '7', '136.08', '0'],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '邓实',
            'Hoover 炉灶, 银色',
            '器具',
            'CN-2016-5908054',
            '7',
            '631.26',
            '0.4'
          ],
          [
            '家具',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '邱谦',
            'Rubvermaid 灯泡, 一包多件',
            '用具',
            'CN-2019-1973789',
            '7',
            '-5,244.12',
            '0.4'
          ],
          ['办公用品', '消费者', '二级', '邵兰', '施乐 羊皮纸, 多色', '纸张', 'CN-2018-1718050', '7', '-352.3', '0.8'],
          ['家具', '小型企业', '一级', '邹丽雪', 'SAFCO 椅垫, 红色', '椅子', 'CN-2016-2975416', '7', '-138.1', '0.4'],
          [
            '技术',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '邹妮',
            '柯尼卡 打印机, 红色',
            '设备',
            'CN-2016-1777670',
            '7',
            '91.98',
            '0'
          ],
          [
            '办公用品',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '郝廉',
            'Fiskars 美工刀, 锯齿状',
            '用品',
            'CN-2019-1726701',
            '7',
            '5,876.64',
            '0'
          ],
          [
            '技术',
            '消费者',
            '二级',
            '钱珑',
            'Hewlett 传真复印机, 彩色',
            '复印机',
            'US-2019-4240650',
            '7',
            '1,040.76',
            '0'
          ],
          [
            '家具',
            '消费者',
            '二级',
            '陶莞颖',
            'Chromcraft 圆桌, 白色',
            '桌子',
            'CN-2016-3772912',
            '7',
            '-2,893.21',
            '0.4'
          ],
          [
            '办公用品',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '韦松',
            'Avery 圆形标签, 白色',
            '标签',
            'CN-2017-5450028',
            '7',
            '1,669.50',
            '0'
          ],
          [
            '技术',
            '消费者',
            '一级办公123123123213123123123123213123213213(标准级)',
            '韦绅',
            'StarTech 计算器, 耐用',
            '设备',
            'CN-2019-4092793',
            '7',
            '163.07',
            '0.4'
          ],
          [
            '技术',
            '公司',
            '一级办公123123123213123123123123213123213213(标准级)',
            '马惠英',
            '惠普 复印机, 数字化',
            '复印机',
            'CN-2019-2666353',
            '7',
            '2,919.84',
            '0'
          ]
        ],
        active: true
        // showHeader: false,
      }
    ] as TYPES.ISheetDefine[],

    theme: {
      rowSeriesNumberCellStyle: {
        text: {
          fill: 'blue'
        }
      },
      colSeriesNumberCellStyle: {
        text: {
          fill: 'blue'
        }
      },
      tableTheme: TYPES.VTableThemes.ARCO.extends({
        bodyStyle: {
          color: 'gray'
        }
      })
    },
    VTablePluginModules: [
      {
        module: VTablePlugins.ExcelImportPlugin,
        moduleOptions: {
          // exportData:false
        }
      },
      {
        module: VTablePlugins.TableExportPlugin
      },
      {
        module: VTablePlugins.TableSeriesNumber,
        moduleOptions: {
          rowSeriesNumberCellStyle: {
            text: {
              fontSize: 14,
              fill: 'black',
              pickable: false,
              textAlign: 'left',
              textBaseline: 'middle',
              padding: [2, 4, 2, 4]
            },
            borderLine: {
              stroke: '#D9D9D9',
              lineWidth: 1,
              pickable: false
            }
          }
        }
      }
    ],
    mainMenu: {
      show: true,
      items: [
        {
          name: '导入',
          menuKey: TYPES.MainMenuItemKey.IMPORT,
          description: '导入数据替换到当前sheet'
        },
        {
          name: '导出',
          items: [
            {
              name: '导出csv',
              menuKey: TYPES.MainMenuItemKey.EXPORT_CURRENT_SHEET_CSV,
              description: '导出当前sheet数据到csv'
            },
            {
              name: '导出xlsx',
              menuKey: TYPES.MainMenuItemKey.EXPORT_CURRENT_SHEET_XLSX,
              description: '导出当前sheet数据到xlsx'
            },
            {
              name: '导出全部xlsx',
              menuKey: TYPES.MainMenuItemKey.EXPORT_ALL_SHEETS_XLSX,
              description: '导出所有sheet到xlsx'
            }
          ],
          description: '导出当前sheet数据'
        },
        {
          name: '测试',
          description: '测试',
          onClick: () => {
            alert('测试');
          }
        }
      ]
    }
  });
  (window as any).sheetInstance = sheetInstance;
  sheetInstance.onTableEvent(VTable.TABLE_EVENT_TYPE.CLICK_CELL, event => {
    console.log('点击了单元格', event.sheetKey, event.row, event.col);
  });
  sheetInstance.on(VTableSheetEventType.FORMULA_CALCULATE_START, event => {
    console.log('公式计算开始了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.FORMULA_CALCULATE_END, event => {
    console.log('公式计算结束了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.FORMULA_ERROR, event => {
    console.log('公式计算错误了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.FORMULA_DEPENDENCY_CHANGED, event => {
    console.log('公式依赖关系改变了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.FORMULA_ADDED, event => {
    console.log('公式添加了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.FORMULA_REMOVED, event => {
    console.log('公式移除了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.DATA_LOADED, event => {
    console.log('数据加载完成了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_ADDED, event => {
    console.log('工作表新增了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_MOVED, event => {
    console.log('工作表移动了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_RENAMED, event => {
    console.log('工作表重命名了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_REMOVED, event => {
    console.log('工作表删除了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_ACTIVATED, event => {
    console.log('工作表激活了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_DEACTIVATED, event => {
    console.log('工作表停用了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.SHEET_VISIBILITY_CHANGED, event => {
    console.log('工作表显示状态改变了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.IMPORT_START, event => {
    console.log('导入开始了', event.fileType);
  });
  sheetInstance.on(VTableSheetEventType.IMPORT_COMPLETED, event => {
    console.log('导入完成了', event.fileType);
  });
  sheetInstance.on(VTableSheetEventType.IMPORT_ERROR, event => {
    console.log('导入错误了', event.fileType);
  });
  sheetInstance.on(VTableSheetEventType.EXPORT_START, event => {
    console.log('导出了', event.fileType);
  });
  sheetInstance.on(VTableSheetEventType.EXPORT_COMPLETED, event => {
    console.log('导出完成了', event.fileType);
  });
  sheetInstance.on(VTableSheetEventType.EXPORT_ERROR, event => {
    console.log('导出错误了', event.fileType);
  });
  sheetInstance.on(VTableSheetEventType.CROSS_SHEET_REFERENCE_UPDATED, event => {
    console.log('跨工作表引用更新了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START, event => {
    console.log('跨工作表公式计算开始了', event.sheetKey);
  });
  sheetInstance.on(VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END, event => {
    console.log('跨工作表公式计算结束了', event.sheetKey);
  });
  // bindDebugTool(sheetInstance.activeWorkSheet.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
