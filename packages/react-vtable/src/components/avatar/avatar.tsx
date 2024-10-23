import type { IGroup, IGroupAttribute } from '@visactor/vtable/es/vrender';
import {
  measureTextSize,
  type BackgroundAttributes,
  type Cursor,
  type IRectGraphicAttribute,
  type ITextGraphicAttribute,
  type Padding,
  type Tag,
  type TagAttributes
} from '@visactor/vtable/es/vrender';
import { Tag as VTag } from '../vrender-components/tag';
import { isString, merge } from '@visactor/vutils';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Group, Image, Text } from '../../table-components';

export interface AvatarProps {
  children?: string | React.ReactNode;
  textStyle?: Partial<ITextGraphicAttribute>;
  panelStyle?: BackgroundAttributes;
  size?: number;
  shape?: 'circle' | 'square';
  visible?: boolean;
  cursor?: Cursor;
  autoFixFontSize?: boolean;
  onClick?: (e: Event) => void;
}

const defaultProps: AvatarProps = {
  textStyle: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fill: '#FFF'
  },
  panelStyle: {
    visible: true,
    fill: 'rgb(201, 205, 212)',
    lineWidth: 1,
    cornerRadius: 2
  },
  size: 40,
  shape: 'circle',
  autoFixFontSize: true
  // cursor: 'pointer',
};

function AvatarComponent(baseProps: AvatarProps, ref: React.Ref<IGroup>) {
  const props: AvatarProps = merge({}, defaultProps, baseProps);
  const { size, children, onClick } = props;
  let avatarRef = React.useRef<IGroup>(null);
  avatarRef = ref ? (ref as React.RefObject<IGroup>) : avatarRef;

  const handleClick: React.MouseEventHandler<HTMLElement> = React.useCallback(
    (event: any): void => {
      onClick && onClick(event);
    },
    [onClick]
  );

  const groupAttribute = getGroupAttribute(props);
  if (isString(children)) {
    const textAttribute = getTextAttribute(props);
    return (
      <Group ref={avatarRef} attribute={groupAttribute} onClick={handleClick}>
        <Text attribute={textAttribute}></Text>
      </Group>
    );
  }
  if ((children as ReactElement).type === 'image') {
    (children as ReactElement).props.attribute.width = size;
    (children as ReactElement).props.attribute.height = size;
  }
  return (
    <Group ref={avatarRef} attribute={groupAttribute} onClick={handleClick}>
      {children}
    </Group>
  );
}

function getTextAttribute(props: AvatarProps) {
  const { textStyle, size, children, autoFixFontSize } = props;

  const attribute: ITextGraphicAttribute = {
    text: children as string,
    ...textStyle
  };

  if (autoFixFontSize) {
    getAutoFixFontSize(size, attribute);
  }

  return attribute;
}
function getGroupAttribute(props: AvatarProps) {
  const { panelStyle, size, shape } = props;
  const attribute: IGroupAttribute = {
    ...panelStyle,
    width: size,
    height: size,
    clip: true,
    cornerRadius: shape === 'circle' ? size / 2 : panelStyle.cornerRadius ?? 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    visibleAll: true,
    path: undefined
  };
  return attribute;
}

export const Avatar = React.forwardRef<IGroup, AvatarProps>(AvatarComponent);

Avatar.displayName = 'Avatar';

// auto adjust font size
function getAutoFixFontSize(size: number, attribute: ITextGraphicAttribute) {
  const textWidth = measureTextSize(attribute.text, attribute).width;
  const scale = size / (textWidth + 8);
  const fontSize = Math.max(Math.floor(attribute.fontSize * scale), 6);
  attribute.fontSize = fontSize;
}
