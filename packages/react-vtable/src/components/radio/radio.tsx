import type {
  BackgroundAttributes,
  Cursor,
  IRectGraphicAttribute,
  ITextGraphicAttribute,
  Padding,
  Radio as VRenderRadio,
  RadioAttributes
} from '@visactor/vtable/es/vrender';
import { Radio as VRadio } from '../vrender-components/radio';
import { merge } from '@visactor/vutils';
import React, { useCallback, useEffect } from 'react';

export interface RadioProps {
  children?: string;
  textStyle?: RadioAttributes['text'];
  circleStyle?: RadioAttributes['circle'];
  checked?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  disableCursor?: Cursor;
  spaceBetweenTextAndIcon?: number;
  visible?: boolean;
  onChange?: (checked: boolean) => void;
}

const defaultProps: RadioProps = {};

function RadioComponent(baseProps: RadioProps, ref: React.Ref<VRenderRadio>) {
  const props: RadioProps = merge({}, defaultProps, baseProps);
  const { textStyle, circleStyle, children, ...rest } = props;
  let radioRef = React.useRef<VRenderRadio>(null);
  radioRef = ref ? (ref as React.RefObject<VRenderRadio>) : radioRef;

  const handleChange = useCallback((event: { target: VRenderRadio }) => {
    props.onChange && props.onChange(event.target.attribute.checked);
  }, []);

  useEffect(() => {
    radioRef.current?.addEventListener('radio_checked', handleChange);
    return () => {
      radioRef.current?.removeEventListener('radio_checked', handleChange);
    };
  }, []);

  return (
    <VRadio
      ref={radioRef}
      attribute={{
        text: {
          ...textStyle,
          text: children
        },
        circle: circleStyle,
        ...rest
      }}
      {...rest} // for REACT_TO_CANOPUS_EVENTS
    ></VRadio>
  );
}

export const Radio = React.forwardRef<VRenderRadio, RadioProps>(RadioComponent);

Radio.displayName = 'Radio';
