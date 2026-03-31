import * as VTable from '../../src';
import { AggregationType } from '../../src/ts-types';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

/**
 * 验证场景：合计行中 radio 单元格应降级为文本单元格，与 checkbox 行为保持一致。
 * 对应 issue: https://github.com/VisActor/VTable/issues/4027
 *
 * 复现步骤（修复前）：
 * 1. 表格配置了 bottomFrozenRowCount 和 aggregation（合计行）
 * 2. 某列配置 cellType: 'radio'
 * 3. 修复前：合计行中 radio 渲染异常，可能导致表格整体空白
 * 4. 修复后：合计行中 radio 列正确降级为纯文本显示，表格正常渲染
 */
export function createTable() {
  const data = [
    { percent: '100%', value: 20, check: { text: 'unchecked', checked: false, disable: false } },
    { percent: '80%', value: 18, check: { text: 'checked', checked: true, disable: false } },
    { percent: '20%', value: 12, check: { text: 'unchecked', checked: false, disable: false } },
    { percent: '0%', value: 10, check: { text: 'checked', checked: false, disable: false } },
    { percent: '60%', value: 16, check: { text: 'disable', checked: true, disable: true } },
    { percent: '40%', value: 14, check: { text: 'disable', checked: false, disable: true } },
    { percent: '0%', value: -10, check: true },
    { percent: '0%', value: -10, check: ['选中', '选中'] }
  ];
  let records: any[] = [];
  for (let i = 0; i < 10; i++) {
    records = records.concat(data);
  }

  const columns: VTable.ColumnsDefine = [
    {
      field: 'percent',
      title: 'percent',
      width: 120,
      sort: true
    },
    {
      field: 'value',
      title: 'value',
      width: 100,
      aggregation: [
        {
          aggregationType: AggregationType.SUM,
          formatFun(value) {
            return '合计: ' + Math.round(value);
          }
        }
      ]
    },
    {
      field: 'percent',
      title: 'column radio',
      width: 120,
      cellType: 'radio'
    },
    {
      field: 'check',
      title: 'cell radio',
      width: 200,
      cellType: 'radio',
      radioCheckType: 'cell',
      radioDirectionInCell: 'vertical',
      style: {
        spaceBetweenRadio: 10
      }
    },
    {
      field: 'percent',
      title: 'checkbox',
      width: 120,
      cellType: 'checkbox',
      disable: true,
      checked: true
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    widthMode: 'standard',
    heightMode: 'autoHeight',
    bottomFrozenRowCount: 1,
    rowSeriesNumber: {
      width: 50,
      cellType: 'checkbox'
    },
    theme: VTable.themes.DEFAULT.extends({
      bottomFrozenStyle: {
        fontWeight: 500
      }
    })
  };

  const instance = new ListTable(option);

  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  const { RADIO_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  instance.on(RADIO_STATE_CHANGE, e => {
    console.log('Radio state changed:', e.col, e.row, e.radioIndexInCell);
  });

  (window as any).tableInstance = instance;
}
