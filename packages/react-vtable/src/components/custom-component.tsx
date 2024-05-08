import type { ReactElement } from 'react';
import React, {
  type CSSProperties,
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
  useContext,
  useMemo
} from 'react';
import RootTableContext from '../context/table';
import { isNumber, merge } from '@visactor/vutils';

export interface CustomComponentProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'className' | 'ref'> {
  style?: CSSProperties;
  // className?: string | string[];
  className?: string;

  // for table
  displayMode: 'position' | 'cell';
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  // width?: number;
  // height?: number;
  row?: number;
  col?: number;
  anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  dx?: number | string;
  dy?: number | string;
  // dx?: number;
  // dy?: number;
}

export const CustomComponent: React.FC<CustomComponentProps> = (baseProps: CustomComponentProps) => {
  const context = useContext(RootTableContext);
  const { table } = context;

  // if (!table) {
  //   return null;
  // }

  const props = useMergeProps<CustomComponentProps>(baseProps, {
    style: {
      left: 0,
      top: 0
    },
    className: 'vtable-custom-component',
    displayMode: 'position',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    row: 0,
    col: 0,
    anchor: 'top-left',
    dx: 0,
    dy: 0
  });
  const { displayMode, x, y, width, height, row, col, anchor, dx, dy, className, children, style } = props;

  let styleLeft;
  let styleTop;
  let styleWidth;
  let styleHeight;

  if (displayMode === 'position') {
    styleLeft = x + (dx as number) + 'px';
    styleTop = y + (dy as number) + 'px';
    styleWidth = width + 'px';
    styleHeight = height + 'px';
  } else if (displayMode === 'cell') {
    const cellRect =
      table && col >= 0 && row >= 0
        ? table?.getCellRelativeRect(col, row)
        : { width: 0, height: 0, left: -9999, top: -9999 };
    styleWidth = dealWidthNumber(width, cellRect.width) + 'px';
    styleHeight = dealWidthNumber(height, cellRect.height) + 'px';
    if (anchor === 'top-left') {
      styleLeft = cellRect.left + dealWidthNumber(dx, cellRect.width) + 'px';
      styleTop = cellRect.top + dealWidthNumber(dy, cellRect.height) + 'px';
    } else if (anchor === 'top-right') {
      styleLeft = cellRect.left + dealWidthNumber(dx, cellRect.width) + cellRect.width + 'px';
      styleTop = cellRect.top + dealWidthNumber(dy, cellRect.height) + 'px';
    } else if (anchor === 'bottom-left') {
      styleLeft = cellRect.left + dealWidthNumber(dx, cellRect.width) + 'px';
      styleTop = cellRect.top + dealWidthNumber(dy, cellRect.height) + cellRect.height + 'px';
    } else if (anchor === 'bottom-right') {
      styleLeft = cellRect.left + dealWidthNumber(dx, cellRect.width) + cellRect.width + 'px';
      styleTop = cellRect.top + dealWidthNumber(dy, cellRect.height) + cellRect.height + 'px';
    }
  }

  const componentStyle = merge({}, style, {
    position: 'absolute',
    zIndex: 1000,
    width: styleWidth,
    height: styleHeight,
    left: styleLeft,
    top: styleTop
  });

  return (
    <div className={className} style={componentStyle}>
      {React.Children.map(children, (child: ReactNode) => {
        if (child) {
          return React.cloneElement(child as ReactElement, {});
        }
        return child;
      })}
    </div>
  );
};

// export const CustomComponent = forwardRef<unknown, CustomComponentProps>(CustomComponent1);

export default function useMergeProps<PropsType>(
  componentProps: PropsType,
  defaultProps: Partial<PropsType>
): PropsType {
  const _defaultProps = useMemo(() => {
    return { ...defaultProps };
  }, [defaultProps]);

  const props = useMemo(() => {
    const mProps = merge({}, componentProps);

    // https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react/src/ReactElement.js#L312
    for (const propName in _defaultProps) {
      if (mProps[propName] === undefined) {
        mProps[propName] = _defaultProps[propName];
      }
    }

    return mProps;
  }, [componentProps, _defaultProps]);

  return props;
}

function dealWidthNumber(value: string | number, refenceValue: number) {
  if (isNumber(value)) {
    return value;
  }

  if (typeof value === 'string' && value.endsWith('%')) {
    return (Number(value.slice(0, -1)) / 100) * refenceValue;
  }

  return 0;
}
