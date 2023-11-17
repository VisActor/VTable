import type React from 'react';

type Props = { updateId?: number };

export interface IMarkElement extends React.ReactElement<Props, React.JSXElementConstructor<Props>> {
  id: string | number;
}
