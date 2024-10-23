import type {
  BackgroundAttributes,
  Cursor,
  IRectGraphicAttribute,
  ITextGraphicAttribute,
  Padding,
  CheckBox as VRenderCheckbox,
  CheckboxAttributes
} from '@visactor/vtable/es/vrender';
import { Checkbox as VCheckbox } from '../vrender-components/checkbox';
import { merge } from '@visactor/vutils';
import React, { useCallback, useEffect } from 'react';

export interface CheckboxProps {
  children?: string;
  textStyle?: CheckboxAttributes['text'];
  boxStyle?: CheckboxAttributes['box'];
  iconStyle?: CheckboxAttributes['icon'];
  checked?: boolean;
  indeterminate?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  disableCursor?: Cursor;
  spaceBetweenTextAndIcon?: number;
  visible?: boolean;
  onChange?: (checked: boolean) => void;
}

const defaultProps: CheckboxProps = {};

function CheckboxComponent(baseProps: CheckboxProps, ref: React.Ref<VRenderCheckbox>) {
  const props: CheckboxProps = merge({}, defaultProps, baseProps);
  const { textStyle, boxStyle, iconStyle, children, ...rest } = props;
  let checkboxRef = React.useRef<VRenderCheckbox>(null);
  checkboxRef = ref ? (ref as React.RefObject<VRenderCheckbox>) : checkboxRef;

  const handleChange = useCallback((event: { target: VRenderCheckbox }) => {
    props.onChange && props.onChange(event.target.attribute.checked);
  }, []);

  useEffect(() => {
    checkboxRef.current?.addEventListener('checkbox_state_change', handleChange);
    return () => {
      checkboxRef.current?.removeEventListener('checkbox_state_change', handleChange);
    };
  }, []);

  return (
    <VCheckbox
      ref={checkboxRef}
      attribute={{
        text: {
          ...textStyle,
          text: children
        },
        box: boxStyle,
        icon: iconStyle,
        ...rest
      }}
      {...rest} // for REACT_TO_CANOPUS_EVENTS
    ></VCheckbox>
  );
}

export const Checkbox = React.forwardRef<VRenderCheckbox, CheckboxProps>(CheckboxComponent);

Checkbox.displayName = 'Checkbox';
