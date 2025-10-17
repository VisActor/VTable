import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import * as VTablePlugins from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { register } from '@visactor/vtable';
import { editor } from '@visactor/vtable/es/register';

const CONTAINER_ID = 'vTable';
// 生成示例数据
const generateTestData = count => {
  return Array.from(new Array(count)).map((_, i) => {
    return i <= 2
      ? {
          id: i + 1,
          name: `第${i + 1}章`,
          arithmetic: i * 100 + 100,
          geometric: Math.pow(2, i),
          date: new Date(2024, 0, i + 27).toLocaleDateString(),
          week: i < 1 ? `星期一` : null,
          chineseNumber: i < 1 ? `一` : null,
          otherDirection_1: null,
          otherDirection_2: null
        }
      : {};
  });
};

const inputEditor = new InputEditor();
register.editor('input', inputEditor);
export function createTable() {
  const records = generateTestData(20);

  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80
    },
    {
      field: 'name',
      title: '章节',
      width: 150
    },
    {
      field: 'arithmetic',
      title: '等差',
      width: 120
    },
    {
      field: 'geometric',
      title: '等比',
      width: 120
    },
    {
      field: 'date',
      title: '日期',
      width: 120
    },
    {
      field: 'week',
      title: '星期',
      width: 120
    },
    {
      field: 'chineseNumber',
      title: '中文数字',
      width: 120
    },
    {
      field: 'otherDirection_1',
      title: '向其他方向拖拽',
      width: 150
    },
    {
      field: 'otherDirection_2',
      title: '',
      width: 120
    }
  ];

  // 创建自动填充插件
  const autoFillPlugin = new VTablePlugins.AutoFillPlugin({
    fastFillMode: 'copy',
    fillMode: 'series'
  });

  // 创建表格配置
  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    editor: inputEditor,
    excelOptions: {
      fillHandle: true // 启用填充炳功能
    },
    plugins: [autoFillPlugin]
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(option);
}
