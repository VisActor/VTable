/* eslint-disable @typescript-eslint/no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ListTable } from '@visactor/vtable';
import type { FC } from 'react';
import React from 'react';
import { useEffect, useRef } from 'react';

type Props = React.PropsWithChildren<any>;

export const ReactVTable: FC<Props> = props => {
  const { type, option, height = '100%', style, ...restProps } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      option.container = containerRef.current;
      new ListTable(option);
    }
  }, [option, type]);

  return (
    <div
      style={{
        ...style,
        height
      }}
      {...restProps}
      ref={containerRef}
      id="react-VTable"
    />
  );
};
