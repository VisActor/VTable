import type {
  BackgroundAttributes,
  Cursor,
  IRectGraphicAttribute,
  ITextGraphicAttribute,
  Padding,
  Tag as VRenderTag,
  TagAttributes
} from '@visactor/vtable/es/vrender';
import { Tag as VTag } from '../vrender-components/tag';
import { merge } from '@visactor/vutils';
import React, { useEffect } from 'react';

export interface TagProps {
  attribute?: TagAttributes;
  children?: string;
  textStyle?: Partial<ITextGraphicAttribute>;
  panelStyle?: Partial<IRectGraphicAttribute>;
  padding?: Padding;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
}

const defaultProps: TagProps = {
  textStyle: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fill: 'rgb(51, 101, 238)'
  },
  // padding: [8, 10],
  panelStyle: {
    visible: true,
    fill: '#e6fffb',
    lineWidth: 1,
    cornerRadius: 4
  }
};

function TagComponent(baseProps: TagProps, ref: React.Ref<VRenderTag>) {
  const props: TagProps = merge({}, defaultProps, baseProps);
  const { attribute, panelStyle, children, ...rest } = props;
  let tagRef = React.useRef<VRenderTag>(null);
  tagRef = ref ? (ref as React.RefObject<VRenderTag>) : tagRef;

  return (
    <VTag
      ref={tagRef}
      attribute={
        attribute ?? {
          text: children,
          panel: panelStyle as any,
          ...rest
        }
      }
      {...rest} // for REACT_TO_CANOPUS_EVENTS
    ></VTag>
  );
}

export const Tag = React.forwardRef<VRenderTag, TagProps>(TagComponent);

Tag.displayName = 'Tag';
