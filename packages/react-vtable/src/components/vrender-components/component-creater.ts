import { CheckBox, Radio, Tag } from '@visactor/vtable/es/vrender';

export function createVRenderComponent(type: string, props: any) {
  // may have unwanted onxxx prop
  if (type === 'tag') {
    const tag = new Tag(props.attribute ? props.attribute : props);
    return tag;
  } else if (type === 'radio') {
    const radio = new Radio(props.attribute ? props.attribute : props);
    return radio;
  } else if (type === 'checkbox') {
    const checkbox = new CheckBox(props.attribute ? props.attribute : props);
    return checkbox;
  }
  return undefined;
}
