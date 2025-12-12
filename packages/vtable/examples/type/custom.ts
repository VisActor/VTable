/**
 * 单元格类型 - 自定义
 *
 * 通过 TypeScript module augmentation 扩展 ColumnDefine，
 * 为内置 button 单元格增加一个自定义配置：highlightOnNegative。
 * 注意：
 *  - 当前运行时并不会使用 highlightOnNegative 配置。
 *  - Demo 的目的只是说明：用户可以安全地为 ColumnDefine 增加自定义列类型及其专有字段。
 */

import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

/**
 * 这里演示库使用方如何通过模块扩展自定义列类型
 * 注意：这个路径在真实使用场景下通常是 '@visactor/vtable/es/ts-types'
 */
declare module '../../src/ts-types/list-table/define' {
  /**
   * 为 ColumnBodyDefine 增加一个自定义按钮列配置
   * - 在原有 button 能力基础上新增 highlightOnNegative
   */
  interface CustomColumnBodyDefineMap {
    coloredButton: {
      cellType: 'button';
      field?: string;
      text?: string;
      disable?: boolean;
      /**
       * 当单元格对应 value 为负数时是否高亮
       * （运行时如何使用该配置由业务侧决定）
       */
      highlightOnNegative?: boolean;
      style?: any;
    };
  }

  /**
   * 给 ColumnDefine 增加一个完整的自定义列类型
   * - 通常是 Header 配置 + Body 配置的组合
   */
  interface CustomColumnDefineMap {
    coloredButtonColumn: {
      // Header 相关字段（简化示例，实际可根据需要补充）
      title?: string;
      width?: number | 'auto';

      // Body 相关字段
      field?: string;
      cellType: 'button';
      text?: string;
      disable?: boolean;
      highlightOnNegative?: boolean;
      style?: any;
    };
  }
}

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'percent',
        title: 'percent',
        width: 120
      },
      {
        field: 'value',
        title: 'value',
        width: 120
      },
      // ⬇️ 这里就是一个“自定义类型扩展后的按钮列”
      {
        field: 'value',
        title: 'custom button',
        width: 'auto',
        cellType: 'button',
        disable: false,
        text: 'check',
        // 这个属性是通过 CustomColumnDefineMap 扩展进来的，当前运行时并不会使用该配置。Demo 的目的只是说明：用户可以安全地为 ColumnDefine 增加自定义列类型及其专有字段。
        highlightOnNegative: true,
        style: {
          color: '#FFF'
        }
      }
    ],
    showFrozenIcon: true,
    widthMode: 'standard',
    defaultRowHeight: 80,
    heightMode: 'autoHeight'
  };

  const instance = new ListTable(option);

  const records = [
    { percent: '100%', value: 20 },
    { percent: '80%', value: 18 },
    { percent: '20%', value: 12 },
    { percent: '0%', value: 10 },
    { percent: '60%', value: 16 },
    { percent: '40%', value: 14 },
    { percent: '0%', value: -10 },
    { percent: '0%', value: -10 }
  ];

  // 设置表格数据
  instance.setRecords(records);

  bindDebugTool(instance.scenegraph.stage as any, {
    // customGrapicKeys: ['role', '_updateTag'],
  });

  instance.on(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e => {
    console.log(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e.col, e.row, e.event);
  });

  // 只为了方便控制台调试用，不要拷贝到正式代码
  (window as any).tableInstance = instance;
}
