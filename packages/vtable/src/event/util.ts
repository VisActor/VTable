import type { FederatedPointerEvent, IEventTarget } from '@src/vrender';
import type { Group } from '../scenegraph/graphic/group';
import type { MergeCellInfo } from '../ts-types';
import { isValid } from '@visactor/vutils';

export interface SceneEvent {
  abstractPos: {
    x: number;
    y: number;
  };
  eventArgs?: {
    col: number;
    row: number;
    event: FederatedPointerEvent;
    targetCell: Group;
    mergeInfo?: MergeCellInfo;
    target: IEventTarget;
  };
}

export function getCellEventArgsSet(e: FederatedPointerEvent): SceneEvent {
  const tableEvent: SceneEvent = {
    abstractPos: {
      // x: e.x,
      // y: e.y,
      x: e.viewport.x,
      y: e.viewport.y
    }
    // eventArgs: {
    //   col: (e.target as any).col,
    //   row: (e.target as any).row,
    //   event: e,
    // },
  };
  const targetCell = getTargetCell(e.target);
  if (targetCell) {
    tableEvent.eventArgs = {
      col: targetCell.col,
      row: targetCell.row,
      event: e,
      targetCell,
      mergeInfo: getMergeCellInfo(targetCell),
      target: e.target
    };
  }
  return tableEvent;
}

export function getTargetCell(target: any) {
  while (target && target.parent) {
    if (target.role === 'cell') {
      return target;
    }
    target = target.parent;
  }
  return null;
}

function getMergeCellInfo(cellGroup: Group): MergeCellInfo | undefined {
  if (
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    return {
      colStart: cellGroup.mergeStartCol,
      colEnd: cellGroup.mergeEndCol,
      rowStart: cellGroup.mergeStartRow,
      rowEnd: cellGroup.mergeEndRow
    };
  }
  return undefined;
}

export const regIndexReg = /radio-\d+-\d+-(\d+)/;

export function setDataToHTML(data: string) {
  const result = ['<table>'];
  const META_HEAD = [
    '<meta name="author" content="Visactor"/>', // 后面可用于vtable之间的快速复制粘贴
    //white-space:normal，连续的空白字符会被合并为一个空格，并且文本会根据容器的宽度自动换行显示
    //mso-data-placement:same-cell，excel专用， 在同一个单元格中显示所有数据，而不是默认情况下将数据分散到多个单元格中显示
    '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>'
  ].join('');
  const rows = data.split('\r\n'); // 将数据拆分为行
  rows.forEach(function (rowCells: any, rowIndex: number) {
    const cells = rowCells.split('\t'); // 将行数据拆分为单元格
    const rowValues: string[] = [];
    if (rowIndex === 0) {
      result.push('<tbody>');
    }
    cells.forEach(function (cell: string, cellIndex: number) {
      // 单元格数据处理
      const parsedCellData = !cell
        ? ' '
        : cell
            .toString()
            .replace(/&/g, '&amp;') // replace & with &amp; to prevent XSS attacks
            .replace(/'/g, '&#39;') // replace ' with &#39; to prevent XSS attacks
            .replace(/</g, '&lt;') // replace < with &lt; to prevent XSS attacks
            .replace(/>/g, '&gt;') // replace > with &gt; to prevent XSS attacks
            .replace(/\n/g, '<br>') // replace \n with <br> to prevent XSS attacks
            .replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, '<br>\r\n') //   replace <br> with <br>\r\n to prevent XSS attacks
            .replace(/\x20{2,}/gi, (substring: string | any[]) => {
              //  excel连续空格序列化
              return `<span style="mso-spacerun: yes">${'&nbsp;'.repeat(substring.length - 1)} </span>`;
            }) // replace 2 or more spaces with &nbsp; to prevent XSS attacks
            .replace(/\t/gi, '&#9;'); //   replace \t with &#9; to prevent XSS attacks

      rowValues.push(`<td>${parsedCellData}</td>`);
    });
    result.push('<tr>', ...rowValues, '</tr>');

    if (rowIndex === rows.length - 1) {
      result.push('</tbody>');
    }
  });
  result.push('</table>');
  return [META_HEAD, result.join('')].join('');
}
