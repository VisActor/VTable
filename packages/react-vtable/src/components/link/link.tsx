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

interface LinkStateStyle {
  textStyle?: {
    hover?: Partial<ITextGraphicAttribute>;
    disabled?: Partial<ITextGraphicAttribute>;
  };
  panelStyle?: {
    hover?: Partial<IRectGraphicAttribute>;
    disabled?: Partial<IRectGraphicAttribute>;
  };
}

export interface LinkProps {
  children?: string;
  textStyle?: Partial<ITextGraphicAttribute>;
  padding?: Padding;
  space?: number;
  panelStyle?: BackgroundAttributes;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  state?: LinkStateStyle;
  disabled?: boolean;
  icon?: boolean;
  cursor?: Cursor;
  href?: string;
  onClick?: (e: Event) => void;
}

const defaultProps: LinkProps = {
  textStyle: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fill: 'rgb(64, 128, 255)'
  },
  panelStyle: {
    visible: true,
    opacity: 0,
    fill: 'rgba(242, 243, 245, 0.5)',
    lineWidth: 1,
    cornerRadius: 2
  },
  padding: 4,
  space: 6,
  // cursor: 'pointer',
  state: {
    textStyle: {
      disabled: {
        fill: 'rgb(148, 191, 255)'
      }
    },
    panelStyle: {
      hover: {
        // visible: true
        opacity: 1
      }
    }
  }
};

function LinkComponent(baseProps: LinkProps, ref: React.Ref<Tag>) {
  const props: LinkProps = merge({}, defaultProps, baseProps);
  const { disabled, href, onClick } = props;
  let linkRef = React.useRef<Tag>(null);
  linkRef = ref ? (ref as React.RefObject<Tag>) : linkRef;

  const handleClick: React.MouseEventHandler<HTMLElement> = React.useCallback(
    (event: any): void => {
      if (disabled) {
        typeof event?.preventDefault === 'function' && event.preventDefault();
        return;
      }
      onClick && onClick(event);
      if (href) {
        // eslint-disable-next-line no-undef
        window.open(href);
      }
    },
    [disabled, href, onClick]
  );

  const attribute: TagAttributes = getTagAttribute(props);

  useEffect(() => {
    linkRef.current.addEventListener('mouseenter', () => {
      // console.log('mouseenter', linkRef.current, e.clone());
      if (!disabled) {
        linkRef.current.addState('hover', true, false);
        // linkRef.current._bgRect.addState('hover', true, false);
        // linkRef.current._textShape.addState('hover', true, false);
        linkRef.current.stage.renderNextFrame();
      }
    });
    linkRef.current.addEventListener('mouseleave', () => {
      // console.log('mouseleave', linkRef.current, e.clone());
      if (!disabled) {
        linkRef.current.removeState('hover', false);
        // linkRef.current._bgRect.removeState('hover', false);
        // linkRef.current._textShape.removeState('hover', false);
        linkRef.current.stage.renderNextFrame();
      }
    });
  }, []);

  useEffect(() => {
    if (disabled) {
      linkRef.current.removeState('disabled', false);
      // linkRef.current._bgRect.removeState('disabled', false);
      // linkRef.current._textShape.removeState('disabled', false);

      linkRef.current.addState('disabled', true, false);
      // linkRef.current._bgRect.addState('disabled', true, false);
      // linkRef.current._textShape.addState('disabled', true, false);
      // console.log('add disable');
    } else {
      linkRef.current.removeState('disabled', false);
      // linkRef.current._bgRect.removeState('disabled', false);
      // linkRef.current._textShape.removeState('disabled', false);
      // console.log('remove disable');
    }
    linkRef.current.stage.renderNextFrame();
  });

  return <VTag ref={linkRef} attribute={attribute} onClick={handleClick}></VTag>;
}

function getTagAttribute(props: LinkProps) {
  const {
    textStyle,
    padding,
    space,
    panelStyle,
    minWidth,
    maxWidth,
    visible,
    cursor,
    disabled,
    icon,
    state,
    children
  } = props;
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
    },
    space,
    shape: {
      visible: !!icon,
      fill: false,
      stroke: textStyle.fill,
      symbolType:
        // eslint-disable-next-line max-len
        'M -0.2927 -15.4348 L -15.142 -0.5855 C -18.6567 2.9292 -18.6567 8.6277 -15.142 12.1424 V 12.1424 C -11.6273 15.6571 -5.9288 15.6571 -2.4141 12.1424 L 15.2636 -5.5353 C 17.6067 -7.8784 17.6067 -11.6774 15.2636 -14.0206 V -14.0206 C 12.9205 -16.3637 9.1215 -16.3637 6.7783 -14.0206 L -10.8993 3.6571 C -12.0709 4.8287 -12.0709 6.7282 -10.8993 7.8997 V 7.8997 C -9.7278 9.0713 -7.8283 9.0713 -6.6567 7.8997 L 8.1925 -6.9495'
    }
  };

  return attr;
}

export const Link = React.forwardRef<Tag, LinkProps>(LinkComponent);

Link.displayName = 'Link';
