import type {
  BackgroundAttributes,
  Cursor,
  IGroup,
  IGroupGraphicAttribute,
  IRectGraphicAttribute,
  ITextGraphicAttribute,
  Padding,
  Tag,
  TagAttributes
} from '@visactor/vtable/es/vrender';
import { Tag as VTag } from '../vrender-components/tag';
import type { BoundsAnchorType } from '@visactor/vutils';
import { isValid, merge } from '@visactor/vutils';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Group } from '../../table-components';

type Anchor = 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb';
export interface PopoverProps {
  children?: ReactElement;
  defaultPopupVisible?: boolean;
  // disabled?: boolean;
  // popupHoverStay?: boolean;
  popupVisible?: boolean;
  // color?: string;
  position?: Anchor;
  content?: ReactNode;
  // onVisibleChange?: (visible: boolean) => void;

  panelStyle?: CSSProperties;
  arrowStyle?: CSSProperties;
}

const defaultProps: PopoverProps = {
  defaultPopupVisible: false,
  // popupHoverStay: true,
  // popupVisible: false,
  position: 'top'
};

const defaultPoptipPanelStyle: CSSProperties = {
  backgroundColor: 'rgb(255, 255, 255)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, .1)',
  fontSize: '14px',
  borderRadius: '4px',
  lineHeight: '1.5715',
  boxSizing: 'border-box',
  color: 'rgb(78, 89, 105)',
  border: '1px solid rgb(229, 230, 235)',
  padding: '12px 16px'
};

const Tooltip = (props: {
  visible: boolean;
  content: ReactNode;
  position: Anchor;
  panelStyle?: CSSProperties;
  arrowStyle?: CSSProperties;
}) => {
  const arrowStyle: CSSProperties = {
    content: '',
    height: '8px',
    width: '8px',
    position: 'absolute',
    display: 'block',
    boxSizing: 'border-box',
    transform: 'rotate(45deg)',
    transformOrigin: '50% 50% 0',
    backgroundColor: 'rgb(255, 255, 255)',
    border: '1px solid rgb(229, 230, 235)',
    ...getArrowStyle(props.position),

    ...props.arrowStyle
  };

  return props.visible ? (
    <>
      <div style={merge({}, defaultPoptipPanelStyle, props.panelStyle)}>{props.content}</div>
      <div style={arrowStyle}></div>
    </>
  ) : (
    <></>
  );
};

function PopoverComponent(baseProps: PopoverProps, ref: React.Ref<IGroup>) {
  const props: PopoverProps = merge({}, defaultProps, baseProps);
  const { content, position, popupVisible, defaultPopupVisible, panelStyle, arrowStyle, children } = props;
  let popoverRef = React.useRef<IGroup>(null);
  popoverRef = ref ? (ref as React.RefObject<IGroup>) : popoverRef;

  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (popupVisible) {
      setPopupOpen(true);
    } else {
      setPopupOpen(false);
    }
    popoverRef.current.stage.renderNextFrame();
  }, [popupVisible]);

  useEffect(() => {
    setPopupOpen(popupVisible ?? defaultPopupVisible ?? false);
  }, []);

  const { transform, anchorType } = getTransform(position);
  const poptipContainerStyle: CSSProperties = {
    // display: popupOpen ? 'block' : 'none',
    transform: transform
  };

  const groupAttribute: IGroupGraphicAttribute = {
    react: {
      // width: 100,
      // height: 100,
      style: poptipContainerStyle,
      element: (
        <Tooltip
          visible={popupOpen}
          content={content}
          position={position}
          panelStyle={panelStyle}
          arrowStyle={arrowStyle}
        />
      ),
      container: null,
      visible: true,
      pointerEvents: false,
      anchorType: anchorType
    } as IGroupGraphicAttribute['react']
  };

  const groupMouseEnter = useCallback((event: any) => {
    if (isValid(popupVisible)) {
      return;
    }
    setPopupOpen(true);
    event.currentTarget.stage.renderNextFrame();
  }, []);

  const groupMouseLeave = useCallback((event: any) => {
    if (isValid(popupVisible)) {
      return;
    }
    setPopupOpen(false);
    event.currentTarget.stage.renderNextFrame();
  }, []);

  return (
    <Group ref={popoverRef} attribute={groupAttribute} onMouseEnter={groupMouseEnter} onMouseLeave={groupMouseLeave}>
      {children}
    </Group>
  );
}

function getTransform(position: Anchor): { transform: string; anchorType: BoundsAnchorType } {
  switch (position) {
    case 'top':
      return {
        anchorType: 'top',
        transform: 'translate(-50%, calc(-100% - 10px))'
      };
    case 'tl':
      return {
        anchorType: 'top-left',
        transform: 'translate(0, calc(-100% - 10px))'
      };
    case 'tr':
      return {
        anchorType: 'top-right',
        transform: 'translate(-100%, calc(-100% - 10px))'
      };
    case 'bottom':
      return {
        anchorType: 'bottom',
        transform: 'translate(-50%, 10px)'
      };
    case 'bl':
      return {
        anchorType: 'bottom-left',
        transform: 'translate(0, 10px)'
      };
    case 'br':
      return {
        anchorType: 'bottom-right',
        transform: 'translate(-100%, 10px)'
      };
    case 'left':
      return {
        anchorType: 'left',
        transform: 'translate(calc(-100% - 10px), -50%)'
      };
    case 'lt':
      return {
        anchorType: 'top-left',
        transform: 'translate(calc(-100% - 10px), 0)'
      };
    case 'lb':
      return {
        anchorType: 'bottom-left',
        transform: 'translate(calc(-100% - 10px), -100%)'
      };
    case 'right':
      return {
        anchorType: 'right',
        transform: 'translate(10px, -50%)'
      };
    case 'rt':
      return {
        anchorType: 'top-right',
        transform: 'translate(10px, 0)'
      };
    case 'rb':
      return {
        anchorType: 'bottom-right',
        transform: 'translate(10px, -100%)'
      };
  }
}

function getArrowStyle(position: Anchor): CSSProperties {
  switch (position) {
    case 'top':
      return {
        top: 'calc(100% - 5px)',
        left: 'calc(50% - 5px)',
        borderTop: 'none',
        borderLeft: 'none'
      };
    case 'tl':
      return {
        top: 'calc(100% - 4px)',
        left: '14px', // 4(1/2width) + 10(offset)
        borderTop: 'none',
        borderLeft: 'none'
      };
    case 'tr':
      return {
        top: 'calc(100% - 4px)',
        left: 'calc(100% - 24px)', // 10(offset) + 10(width) + 4(1/2width)
        borderTop: 'none',
        borderLeft: 'none'
      };
    case 'bottom':
      return {
        top: '-4px',
        left: 'calc(50% - 4px)',
        borderRight: 'none',
        borderBottom: 'none'
      };
    case 'bl':
      return {
        top: '-4px',
        left: '14px', // 4(1/2width) + 10(offset)
        borderRight: 'none',
        borderBottom: 'none'
      };
    case 'br':
      return {
        top: '-4px',
        left: 'calc(100% - 24px)', // 10(offset) + 10(width) + 4(1/2width)
        borderRight: 'none',
        borderBottom: 'none'
      };
    case 'left':
      return {
        top: 'calc(50% - 4px)',
        left: 'calc(100% - 5px)',
        borderLeft: 'none',
        borderBottom: 'none'
      };
    case 'lt':
      return {
        top: '14px', // 4(1/2width) + 10(offset)
        left: 'calc(100% - 5px)',
        borderLeft: 'none',
        borderBottom: 'none'
      };
    case 'lb':
      return {
        top: 'calc(100% - 24px)', // 10(offset) + 10(width) + 4(1/2width)
        left: 'calc(100% - 5px)',
        borderLeft: 'none',
        borderBottom: 'none'
      };
    case 'right':
      return {
        top: 'calc(50% - 4px)',
        left: '-4px',
        borderRight: 'none',
        borderTop: 'none'
      };
    case 'rt':
      return {
        top: '14px', // 4(1/2width) + 10(offset)
        left: '-4px',
        borderRight: 'none',
        borderTop: 'none'
      };
    case 'rb':
      return {
        top: 'calc(100% - 24px)', // 10(offset) + 10(width) + 4(1/2width)
        left: '-4px',
        borderRight: 'none',
        borderTop: 'none'
      };
  }
}

export const Popover = React.forwardRef<IGroup, PopoverProps>(PopoverComponent);

Popover.displayName = 'Popover';
