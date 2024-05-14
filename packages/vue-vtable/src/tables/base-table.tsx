/* eslint-disable react/display-name */
import * as VTable from '@visactor/vtable';
import { isNil } from '@visactor/vutils';
import { toArray } from '../util';
import { REACT_PRIVATE_PROPS } from '../constants';
import type { EventsProps } from '../eventsUtils';
import { TABLE_EVENTS_KEYS } from '../eventsUtils';

export type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;
export type IOption =
  | VTable.ListTableConstructorOptions
  | VTable.PivotTableConstructorOptions
  | VTable.PivotChartConstructorOptions;

export interface BaseTableProps extends EventsProps {
  type?: string;
  /** 上层container */
  container?: HTMLDivElement;
  /** option */
  option?: any;
  /** 数据 */
  records?: Record<string, unknown>[];
  /** 画布宽度 */
  width?: number;
  /** 画布高度 */
  height?: number;
  skipFunctionDiff?: boolean;

  /** 表格渲染完成事件 */
  onReady?: (instance: IVTable, isInitial: boolean) => void;
  /** throw error when chart run into an error */
  onError?: (err: Error) => void;
}

type Props = React.PropsWithChildren<BaseTableProps>;

const notOptionKeys = [
  ...REACT_PRIVATE_PROPS,
  ...TABLE_EVENTS_KEYS,
  'skipFunctionDiff',
  'onError',
  'onReady',
  'option',
  'records',
  'container'
];

const getComponentId = (child: React.ReactNode, index: number) => {
  const componentName = child && (child as any).type && ((child as any).type.displayName || (child as any).type.name);
  return `${componentName}-${index}`;
};

const parseOptionFromChildren = (props: Props) => {
  const optionFromChildren: Omit<IOption, 'type' | 'data' | 'width' | 'height'> = {};

  toArray(props.children).map((child, index) => {
    const parseOption = child && (child as any).type && (child as any).type.parseOption;

    if (parseOption && (child as any).props) {
      const childProps = isNil((child as any).props.componentId)
        ? {
            ...(child as any).props,
            componentId: getComponentId(child, index)
          }
        : (child as any).props;

      const optionResult = parseOption(childProps);

      if (optionResult.isSingle) {
        optionFromChildren[optionResult.optionName] = optionResult.option;
      } else {
        if (!optionFromChildren[optionResult.optionName]) {
          optionFromChildren[optionResult.optionName] = [];
        }

        optionFromChildren[optionResult.optionName].push(optionResult.option);
      }
    }
  });

  return optionFromChildren;
};
