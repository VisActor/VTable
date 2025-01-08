import { convertPropsToCamelCase } from './stringUtils';
import { createCustomLayoutHandler } from './customLayoutUtils';
import type { ColumnDefine, ICornerDefine, IIndicator, IDimension, ITitleDefine } from '@visactor/vtable';
import type { TooltipProps } from '../components/component/tooltip';
import type { MenuProps } from '../components/component/menu';

export function extractPivotSlotOptions(vnodes: any[]) {
  const options = {
    columns: [] as ColumnDefine[],
    columnHeaderTitle: [] as ITitleDefine[],
    rows: [] as IDimension[],
    rowHeaderTitle: [] as ITitleDefine[],
    indicators: [] as IIndicator[],
    corner: {} as ICornerDefine | null,
    tooltip: {} as TooltipProps | null,
    menu: {} as MenuProps | null
  };

  const typeMapping: Record<string, keyof typeof options> = {
    PivotColumnDimension: 'columns',
    PivotColumnHeaderTitle: 'columnHeaderTitle',
    PivotRowDimension: 'rows',
    PivotRowHeaderTitle: 'rowHeaderTitle',
    PivotCorner: 'corner',
    PivotIndicator: 'indicators',
    Tooltip: 'tooltip',
    Menu: 'menu'
  };

  vnodes.forEach(vnode => {
    vnode.props = convertPropsToCamelCase(vnode.props);
    const typeName = vnode.type?.symbol || vnode.type?.name;
    const optionKey = typeMapping[typeName];

    if (optionKey) {
      if (Array.isArray(options[optionKey])) {
        if (vnode.props.hasOwnProperty('objectHandler')) {
          (options[optionKey] as any[]).push(vnode.props.objectHandler);
        } else {
          (options[optionKey] as any[]).push(vnode.props);
        }
      } else {
        options[optionKey] = vnode.props;
      }
    }
  });
  return options;
}

export function extractListSlotOptions(vnodes: any[]) {
  const options = {
    columns: [] as ColumnDefine[],
    tooltip: {} as TooltipProps,
    menu: {} as MenuProps
  };

  const typeMapping: Record<string, keyof typeof options> = {
    ListColumn: 'columns',
    Tooltip: 'tooltip',
    Menu: 'menu'
  };

  vnodes.forEach(vnode => {
    vnode.props = convertPropsToCamelCase(vnode.props);
    const typeName = vnode.type?.symbol || vnode.type?.name;
    const optionKey = typeMapping[typeName];

    if (optionKey) {
      if (optionKey === 'columns' && vnode.children) {
        vnode.props.customLayout = createCustomLayoutHandler(vnode.children);
      }

      if (Array.isArray(options[optionKey])) {
        (options[optionKey] as any[]).push(vnode.props);
      } else {
        options[optionKey] = vnode.props;
      }
    }
  });

  return options;
}

export function mergeSlotOptions(propsOptions: Record<string, unknown>, slotOptions: Record<string, any>) {
  return {
    ...propsOptions,
    columns: slotOptions.columns && slotOptions.columns.length ? slotOptions.columns : propsOptions.columns,
    columnHeaderTitle:
      slotOptions.columnHeaderTitle && slotOptions.columnHeaderTitle.length
        ? slotOptions.columnHeaderTitle
        : propsOptions.columnHeaderTitle,
    rows: slotOptions.rows && slotOptions.rows.length ? slotOptions.rows : propsOptions.rows,
    rowHeaderTitle:
      slotOptions.rowHeaderTitle && slotOptions.rowHeaderTitle.length
        ? slotOptions.rowHeaderTitle
        : propsOptions.rowHeaderTitle,
    indicators:
      slotOptions.indicators && slotOptions.indicators.length ? slotOptions.indicators : propsOptions.indicators,
    corner: Object.keys(propsOptions.corner || {}).length ? propsOptions.corner : slotOptions.corner,
    tooltip: Object.keys(slotOptions.tooltip || {}).length ? slotOptions.tooltip : propsOptions.tooltip,
    menu: Object.keys(slotOptions.menu || {}).length ? slotOptions.menu : propsOptions.menu
  };
}
