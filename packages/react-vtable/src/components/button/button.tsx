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
    fill: '#165dff',
    lineWidth: 1,
    cornerRadius: 2
  },
  padding: 10,
  // cursor: 'pointer',
  state: {
    panelStyle: {
      hover: {
        fill: '#4080ff'
      },
      disabled: {
        fill: '#94bfff'
      }
    }
  }
};

function ButtonComponent(baseProps: ButtonProps, ref: React.Ref<Tag>) {
  const props: ButtonProps = merge({}, defaultProps, baseProps);
  const { disabled, onClick } = props;
  let buttonRef = React.useRef<Tag>(null);
  buttonRef = ref ? (ref as React.RefObject<Tag>) : buttonRef;

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
    buttonRef.current.addEventListener('mouseenter', () => {
      // console.log('mouseenter', buttonRef.current, e.clone());
      if (!disabled) {
        buttonRef.current.addState('hover', true, false);
        // buttonRef.current._bgRect.addState('hover', true, false);
        // buttonRef.current._textShape.addState('hover', true, false);
        buttonRef.current.stage.renderNextFrame();
      }
    });
    buttonRef.current.addEventListener('mouseleave', () => {
      // console.log('mouseleave', buttonRef.current, e.clone());
      if (!disabled) {
        buttonRef.current.removeState('hover', false);
        // buttonRef.current._bgRect.removeState('hover', false);
        // buttonRef.current._textShape.removeState('hover', false);
        buttonRef.current.stage.renderNextFrame();
      }
    });
  });

  useEffect(() => {
    if (disabled) {
      buttonRef.current.removeState('disabled', false);
      // buttonRef.current._bgRect.removeState('disabled', false);
      // buttonRef.current._textShape.removeState('disabled', false);

      buttonRef.current.addState('disabled', true, false);
      // buttonRef.current._bgRect.addState('disabled', true, false);
      // buttonRef.current._textShape.addState('disabled', true, false);
      // console.log('add disable');
    } else {
      buttonRef.current.removeState('disabled', false);
      // buttonRef.current._bgRect.removeState('disabled', false);
      // buttonRef.current._textShape.removeState('disabled', false);
      // console.log('remove disable');
    }
    buttonRef.current.stage.renderNextFrame();
  });

  return <VTag ref={buttonRef} attribute={attribute} onClick={handleClick}></VTag>;
}

function getTagAttribute(props: ButtonProps) {
  const { textStyle, padding, panelStyle, minWidth, maxWidth, visible, cursor, disabled, state, children } = props;
  const attr: TagAttributes = {
    text: children,
    textStyle,
    padding,
    panel: panelStyle,
    minWidth,
    maxWidth,
    visible,
    cursor: cursor ?? disabled ? 'not-allowed' : 'pointer',
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
