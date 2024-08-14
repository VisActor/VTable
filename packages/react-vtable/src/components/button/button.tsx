import type {
  BackgroundAttributes,
  Cursor,
  IRectGraphicAttribute,
  ITextGraphicAttribute,
  Padding,
  Tag,
  TagAttributes
} from '@visactor/vtable/es/vrender';
import { Tag as VTag } from '../vrender-components/tag';
import { merge } from '@visactor/vutils';
import React, { useEffect } from 'react';

interface ButtonStateStyle {
  textStyle?: {
    hover?: Partial<ITextGraphicAttribute>;
    disabled?: Partial<ITextGraphicAttribute>;
  };
  panelStyle?: {
    hover?: Partial<IRectGraphicAttribute>;
    disabled?: Partial<IRectGraphicAttribute>;
  };
}

export interface ButtonProps {
  children?: string;
  textStyle?: Partial<ITextGraphicAttribute>;
  padding?: Padding;
  panelStyle?: BackgroundAttributes;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  state?: ButtonStateStyle;
  disabled?: boolean;
  cursor?: Cursor;
  onClick?: (e: Event) => void;
}

const defaultProps: ButtonProps = {
  textStyle: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fill: '#FFF'
  },
  panelStyle: {
    visible: true,
    fill: 'rgb(22, 93, 255)',
    lineWidth: 1,
    cornerRadius: 2
  },
  padding: 10,
  cursor: 'pointer',
  state: {
    panelStyle: {
      hover: {
        fill: 'rgb(64, 128, 255)'
      },
      disabled: {
        fill: 'rgb(148, 191, 255)'
      }
    }
  }
};

function ButtonComponent(baseProps: ButtonProps, ref: React.Ref<Tag>) {
  const props: ButtonProps = merge({}, baseProps, defaultProps);
  const { disabled, onClick } = props;
  let buttomRef = React.useRef<Tag>(null);
  buttomRef = ref ? (ref as React.RefObject<Tag>) : buttomRef;

  const handleClick: React.MouseEventHandler<HTMLElement> = React.useCallback(
    (event: any): void => {
      if (disabled) {
        typeof event?.preventDefault === 'function' && event.preventDefault();
        return;
      }
      onClick && onClick(event);
    },
    [disabled, onClick]
  );

  const attribute: TagAttributes = getTagAttribute(props);

  useEffect(() => {
    buttomRef.current.addEventListener('mouseenter', e => {
      // console.log('mouseenter', buttomRef.current, e.clone());
      buttomRef.current.addState('hover', true, false);
      buttomRef.current._bgRect.addState('hover', true, false);
      buttomRef.current._textShape.addState('hover', true, false);
      buttomRef.current.stage.renderNextFrame();
    });
    buttomRef.current.addEventListener('mouseleave', e => {
      // console.log('mouseleave', buttomRef.current, e.clone());
      buttomRef.current.removeState('hover', false);
      buttomRef.current._bgRect.removeState('hover', false);
      buttomRef.current._textShape.removeState('hover', false);
      buttomRef.current.stage.renderNextFrame();
    });
  }, []);

  useEffect(() => {
    if (disabled) {
      buttomRef.current.addState('disabled', true, false);
      buttomRef.current._bgRect.addState('disabled', true, false);
      buttomRef.current._textShape.addState('disabled', true, false);
      // console.log('add disable');
    } else {
      buttomRef.current.removeState('disabled', false);
      buttomRef.current._bgRect.removeState('disabled', false);
      buttomRef.current._textShape.removeState('disabled', false);
      // console.log('remove disable');
    }
    buttomRef.current.stage.renderNextFrame();
  });

  return <VTag ref={buttomRef} attribute={attribute} onClick={handleClick}></VTag>;
}

function getTagAttribute(props: ButtonProps) {
  const { textStyle, padding, panelStyle, minWidth, maxWidth, visible, cursor, state, children } = props;
  const attr: TagAttributes = {
    text: children,
    textStyle,
    padding,
    panel: panelStyle,
    minWidth,
    maxWidth,
    visible,
    cursor,
    childrenPickable: false,
    state: {
      text: {
        hover: state?.textStyle?.hover,
        disabled: state?.textStyle?.disabled
      },
      panel: {
        hover: state?.panelStyle?.hover,
        disabled: state?.panelStyle?.disabled
      }
    }
  };

  return attr;
}

export const Button = React.forwardRef<Tag, ButtonProps>(ButtonComponent);

Button.displayName = 'Button';
