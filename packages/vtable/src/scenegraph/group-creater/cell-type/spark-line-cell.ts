import type { ILine, ISymbol, IThemeSpec } from '@src/vrender';
import { createLine, createSymbol } from '@src/vrender';
import { PointScale, LinearScale } from '@visactor/vscale';
import { isNumber, isValid } from '@visactor/vutils';
import { Group } from '../../graphic/group';
import type { CellInfo, SparklineSpec } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import type { ColumnData } from '../../../ts-types/list-table/layout-map/api';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';

const xScale: PointScale = new PointScale();
const yScale: LinearScale = new LinearScale();

export function createSparkLineCellGroup(
  cellGroup: Group | null,
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  width: number,
  height: number,
  padding: number[],
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  isAsync: boolean
) {
  // cell
  if (!cellGroup) {
    const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);

    if (isAsync) {
      cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
      if (cellGroup && cellGroup.role === 'cell') {
        cellGroup.setAttributes({
          x: xOrigin,
          y: yOrigin,
          width,
          height,
          // 背景相关，cell背景由cellGroup绘制
          lineWidth: cellTheme?.group?.lineWidth ?? undefined,
          fill: cellTheme?.group?.fill ?? undefined,
          stroke: cellTheme?.group?.stroke ?? undefined,
          strokeArrayWidth: strokeArrayWidth,
          strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
          cursor: (cellTheme?.group as any)?.cursor ?? undefined,
          lineDash: cellTheme?.group?.lineDash ?? undefined,
          lineCap: 'butt',
          clip: true,
          cornerRadius: cellTheme.group.cornerRadius
        } as any);
      }
    }
    if (!cellGroup || cellGroup.role !== 'cell') {
      cellGroup = new Group({
        x: xOrigin,
        y: yOrigin,
        width,
        height,
        // 背景相关，cell背景由cellGroup绘制
        lineWidth: cellTheme?.group?.lineWidth ?? undefined,
        fill: cellTheme?.group?.fill ?? undefined,
        stroke: cellTheme?.group?.stroke ?? undefined,
        strokeArrayWidth: strokeArrayWidth,
        strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
        cursor: (cellTheme?.group as any)?.cursor ?? undefined,
        lineDash: cellTheme?.group?.lineDash ?? undefined,
        lineCap: 'butt',
        clip: true,
        cornerRadius: cellTheme.group.cornerRadius
      } as any);
      cellGroup.role = 'cell';
      cellGroup.col = col;
      cellGroup.row = row;
      columnGroup?.addCellGroup(cellGroup);
    }
  }

  // chart
  const chartGroup = createSparkLine(col, row, width, height, padding, table);
  if (chartGroup) {
    cellGroup.appendChild(chartGroup);
  }

  return cellGroup;
}

export type CreateSparkLineCellGroup = typeof createSparkLineCellGroup;

function createSparkLine(
  col: number,
  row: number,
  width: number,
  height: number,
  padding: number[],
  table: BaseTableAPI
): Group | undefined {
  //获取场景树对象，根据当前单元格位置更改其位置
  //待定 TODO group需要设置shape属性吗
  let sparklineSpec: SparklineSpec;
  let chartGroup: Group;
  const chartSpecRaw = (table.internalProps.layoutMap.getBody(col, row) as ColumnData).sparklineSpec;
  const dataValue = table.getCellValue(col, row) as unknown as any[];

  if (!Array.isArray(dataValue)) {
    return undefined;
  }

  const x = padding[3];
  const y = padding[0];
  width -= padding[1] + padding[3];
  height -= padding[0] + padding[2];
  const left = 0;
  // const top = y;
  // const right = x + width;
  const bottom = height;
  if (typeof chartSpecRaw === 'function') {
    // 动态组织spec
    const arg = {
      col,
      row,
      dataValue: table.getCellOriginValue(col, row) || '',
      value: table.getCellValue(col, row) || '',
      rect: table.getCellRangeRelativeRect(table.getCellRange(col, row)),
      table
    };
    sparklineSpec = chartSpecRaw(arg);
    chartGroup = createChartGroup(sparklineSpec, x, y, width, height);
  } else {
    sparklineSpec = chartSpecRaw;
    chartGroup = createChartGroup(chartSpecRaw, x, y, width, height);
  }

  // #region scale对x y轴映射
  const items: { x: number; y: number; defined?: boolean }[] = [];
  const dataItems: any[] = [];

  let xField;
  let yField;
  if (typeof sparklineSpec.xField === 'object') {
    xScale.domain(sparklineSpec.xField.domain);
    xField = sparklineSpec.xField.field;
  } else if (typeof sparklineSpec.xField === 'string') {
    const indexValues = dataValue.map((value: any) => value[sparklineSpec.xField as string]);
    xScale.domain(indexValues);
    xField = sparklineSpec.xField;
  } else {
    // xField未配置 data为数值数组的情况
    if (Array.isArray(dataValue)) {
      xScale.domain(Array.from({ length: dataValue.length }, (_, i) => i));
      xField = sparklineSpec.xField;
    }
  }
  xScale.range([0, width]);

  if (typeof sparklineSpec.yField === 'object') {
    yScale.domain(sparklineSpec.yField.domain);
    yField = sparklineSpec.yField.field;
  } else if (typeof sparklineSpec.yField === 'string') {
    // string类型 自动计算出domain
    // const values = dataValue.map((value: any) => value[sparklineSpec.yField as string]);
    const values = getYNumbers(dataValue, sparklineSpec.yField as string);
    yScale.domain([Math.min(...values), Math.max(...values)]);
    yField = sparklineSpec.yField;
  } else {
    // yField未配置 检查data是否为数值数组
    if (Array.isArray(dataValue)) {
      const values = getYNumbers(dataValue);
      yScale.domain([Math.min(...values), Math.max(...values)]);
      yField = sparklineSpec.yField;
    }
  }
  yScale.range([0, height]);

  if (typeof sparklineSpec.xField === 'object' && Array.isArray(sparklineSpec.xField.domain)) {
    // 如果xField.domain合法，需要按需补充null值点
    const values = dataValue.map((value: any) => value[(sparklineSpec.xField as any).field]);
    const domain = sparklineSpec.xField.domain;
    for (let i = 0; i < domain.length; i++) {
      let valid = false;
      for (let j = 0; j < values.length; j++) {
        // eslint-disable-next-line eqeqeq
        if (domain[i] === values[j]) {
          const data: any = dataValue[j];
          // 无效数据不进行scale，避免null被解析为0
          if (!isValid(data[xField]) || !isValid(data[yField])) {
            break;
          }
          items.push({
            x: left + xScale.scale(data[xField]),
            y: bottom - yScale.scale(data[yField]),
            defined: isValid(data[yField])
          });
          dataItems.push(data); //收集原始数据
          valid = true;
          break;
        }
      }

      if (!valid) {
        // 该domain的index没有在数据中，补充无效点
        items.push({
          x: left + xScale.scale(domain[i]),
          y: 0,
          defined: false
        });
        dataItems.push({ [xField]: domain[i], [yField]: null });
      }
    }
  } else {
    for (let i = 0; i < dataValue.length; i++) {
      const data: any = dataValue[i];
      items.push({
        x: left + xScale.scale(xField ? data[xField] : i),
        y: bottom - yScale.scale(yField ? data[yField] : data),
        defined: isValid(yField ? data[yField] : data),
        rawData: data
      } as any);
      dataItems.push(data);
    }
  }
  // #endregion

  // 更新线节点属性
  const line = chartGroup.getChildByName('sparkline-line') as ILine;
  if (line) {
    line.setAttribute('points', items);
  }
  (line as any).bandwidth = xScale.step();
  (line as any).min = yScale.range()[0];
  (line as any).max = yScale.range()[1];

  // 更新symbol节点属性
  const symbolGroup = chartGroup.getChildByName('sparkline-symbol-group') as ILine;
  if (symbolGroup) {
    const isShowIsolatedPoint = sparklineSpec.pointShowRule === 'isolatedPoint';
    if (sparklineSpec.pointShowRule === 'all') {
      for (let i = 0; i < items.length; i++) {
        const { x, y, defined } = items[i];
        if (defined) {
          const symbol: ISymbol = createSymbol({ x, y });
          symbolGroup.appendChild(symbol);
        }
      }
    } else if (isShowIsolatedPoint) {
      // 处理孤立点显示
      for (let i = 0; i < items.length; i++) {
        const { x, y, defined } = items[i];
        if (defined && (!items[i - 1] || !items[i - 1].defined) && (!items[i + 1] || !items[i + 1].defined)) {
          // 规范孤立数据显示Symbol的spec api
          const symbol: ISymbol = createSymbol({ x, y });
          symbolGroup.appendChild(symbol);
        }
      }
    }
  }
  return chartGroup;
}

function createChartGroup(
  spec: SparklineSpec | ((arg: CellInfo) => SparklineSpec),
  x: number,
  y: number,
  width: number,
  height: number
): Group {
  let specObj: SparklineSpec;
  if (typeof spec === 'function') {
    // specObj = spec.apply(null, null);
    specObj = spec(null);
  } else {
    specObj = spec;
  }
  // 生成根节点
  const group = new Group({
    x,
    y,
    width,
    height,
    stroke: false,
    fill: false
  });
  group.name = 'sparkline';

  if (specObj.type === 'line') {
    // 生成line
    const line = createLine({
      x: 0,
      y: 0,
      curveType: specObj.smooth ? 'monotoneX' : 'linear',
      stroke: specObj.line?.style?.stroke ?? 'blue',
      lineWidth: specObj.line?.style?.strokeWidth ?? 2
    });
    line.name = 'sparkline-line';
    group.addChild(line);
    if (specObj.crosshair) {
      (line as any).hover = specObj.crosshair?.style ?? {
        stroke: '#000',
        interpolate: 'linear'
      };
    }

    // 生成symbol
    const symbolGroup = new Group({
      x: 0,
      y: 0,
      width,
      height,
      stroke: false,
      fill: false
    });
    symbolGroup.name = 'sparkline-symbol-group';
    symbolGroup.setTheme({
      symbol: {
        stroke: specObj.point?.style?.stroke ?? '#000',
        lineWidth: specObj.point?.style?.strokeWidth ?? 1,
        fill: specObj.point?.style?.fill ?? '#000',
        size: (specObj.point?.style?.size ?? 3) * 2, // 之前配置的是圆半径
        symbolType: 'circle'
      }
    });
    group.addChild(symbolGroup);
    (symbolGroup as any).hover = specObj.point?.hover ?? false;
  }
  return group;
}

function getYNumbers(data: any[], field?: string): number[] {
  // return data.map((item) => item[field]).filter((item) => isValid(item));
  const numbers = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (isValid(field) && isValid(item[field])) {
      numbers.push(item[field]);
    } else if (!isValid(field) && isValid(item)) {
      numbers.push(item);
    }
  }

  return numbers;
}
