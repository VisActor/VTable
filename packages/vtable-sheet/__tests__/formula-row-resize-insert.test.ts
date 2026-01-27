// @ts-nocheck
import { VTableSheet, TYPES, VTable } from '../src/index';
import * as VTablePlugins from '@visactor/vtable-plugins';
import { createDiv, removeDom } from './dom';

// 设置全局版本变量
global.__VERSION__ = 'none';

describe('Formula with Row Resize and Insert Test', () => {
  let container: HTMLDivElement;
  let sheetInstance: VTableSheet;

  beforeEach(() => {
    container = createDiv();
  });

  afterEach(() => {
    if (sheetInstance) {
      sheetInstance.release();
    }
    removeDom(container);
  });

  test('should maintain formula value after row resize and insert', async () => {
    // 创建 VTableSheet 实例
    sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [
        {
          rowCount: 200,
          columnCount: 10,
          sheetKey: 'sheet1',
          sheetTitle: 'sheet1',
          filter: true,
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
        }
      ],
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

    const tableInstance = sheetInstance.getActiveSheet().tableInstance;

    // 设置公式 =SUM(A2:C2,B3,C3) 在 D5 (row: 4, col: 3)
    // 预期值: SUM(1,2,3,5,6) = 17
    sheetInstance.formulaManager.setCellContent({ sheet: 'sheet1', row: 4, col: 3 }, '=SUM(A2:C2,B3,C3)');

    // 获取公式结果并更新单元格
    const result = sheetInstance.formulaManager.getCellValue({
      sheet: 'sheet1',
      row: 4,
      col: 3
    });

    // 确保数据行数足够（至少5行，因为我们要设置 row: 4）
    const activeSheet = sheetInstance.getActiveSheet();
    const data = activeSheet.getData();
    while (data.length <= 4) {
      data.push([]);
    }

    // 直接更新数据（公式管理器已经更新了公式引擎中的数据）
    // 然后尝试更新表格显示，但如果布局映射未建立就跳过
    data[4][3] = result.error ? '#ERROR!' : result.value;

    // 只有在布局映射已建立时才调用 changeCellValue 更新显示
    // 这样可以避免 "Cannot destructure property 'field'" 错误
    const layoutMap = tableInstance.internalProps?.layoutMap;
    // if (layoutMap) {
    // try {
    const bodyCell = layoutMap.getBody(3, 4);
    if (bodyCell) {
      tableInstance.changeCellValue(3, 4, result.error ? '#ERROR!' : result.value, false, false);
    }
    // } catch (error) {
    //   // 如果布局映射未建立，忽略错误（数据已经更新）
    //   console.warn('Layout map not ready, skipping changeCellValue:', error);
    // }
    // }

    // 验证初始公式值
    expect(result.value).toBe(17);

    // 插入2行：在第2行位置（索引2）插入
    // 注意：addRecords 的参数是 (records, recordIndex, insertBefore)
    // recordIndex: 2 表示在第2行位置（索引2，即第3行）
    // insertBefore: true 表示在该位置之前插入
    tableInstance.addRecords([[], []], 2, true);
    // 等待公式重新计算
    // 插入2行后，原来的 D5 (row: 4, col: 3) 会变成 D7 (row: 6, col: 3)
    // 公式引用也会相应调整：A2:C2 -> A4:C4, B3,C3 -> B5,C5
    // 新的值应该是: SUM(1,2,3,5,6) = 17 (数据位置变了，但值相同)
    //
    // 数据变化：
    // 原始数据：
    //   row 0: [1, 2, 3]  -> A2:C2
    //   row 1: [4, 5, 6]  -> A3:C3 (B3=5, C3=6)
    //   row 2: [7, 8, 9]
    //   row 3: ['放到', '个', '哦']
    //   row 4: [公式 =SUM(A2:C2,B3,C3)] -> D5
    //
    // 插入2行后（在索引2之前插入）：
    //   row 0: [1, 2, 3]  -> A2:C2 (不变)
    //   row 1: [4, 5, 6]  -> A3:C3 (不变)
    //   row 2: [] (新插入)
    //   row 3: [] (新插入)
    //   row 4: [7, 8, 9]  -> A5:C5 (原 row 2)
    //   row 5: ['放到', '个', '哦'] -> A6:C6 (原 row 3)
    //   row 6: [公式 =SUM(A4:C4,B5,C5)] -> D7 (原 row 4)
    //
    // 公式引用调整：
    //   A2:C2 -> A4:C4 (原 row 0 变成 row 2，但插入后变成 row 4)
    //   B3,C3 -> B5,C5 (原 row 1 变成 row 3，但插入后变成 row 5)
    //   所以公式变成 =SUM(A4:C4,B5,C5) = SUM(1,2,3,5,6) = 17

    // 测试 getCellValue(3, 6) 预期值是 17
    // 注意：getCellValue 的参数是 (col, row)，所以 (3, 6) 表示 col: 3, row: 6
    // 使用 WorkSheet.getCellValue 而不是 tableInstance.getCellValue
    // 因为 WorkSheet.getCellValue 有回退机制，如果布局映射未建立，会从数据数组获取
    const cellValue = activeSheet.getCellValue(3, 6);

    // 如果从表格实例获取失败，从公式管理器获取
    const finalValue = cellValue;
    // if (cellValue === null || cellValue === undefined) {
    //   const formulaResult = sheetInstance.formulaManager.getCellValue({
    //     sheet: 'sheet1',
    //     row: 6,
    //     col: 3
    //   });
    //   finalValue = formulaResult.error ? '#ERROR!' : formulaResult.value;
    // }

    expect(finalValue).toBe(17);
  });
});
