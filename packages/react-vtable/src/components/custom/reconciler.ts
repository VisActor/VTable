import { VRender } from '@visactor/vtable';
import { isFunction } from '@visactor/vutils';
import React from 'react';
import ReactReconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants.js';

const { application, createText, REACT_TO_CANOPUS_EVENTS, Tag } = VRender;
type Graphic = VRender.Graphic;
type Instance = Graphic;

export const reconcilor = ReactReconciler({
  supportsMutation: true,
  supportsPersistence: false,

  createInstance: (type: string, props: any, instance) => {
    const graphic = createGraphic(type, props);
    if (graphic) {
      bindEventsToGraphic(graphic, props);
    } else {
      return undefined;
      // createInstance
      // graphic = createGraphic('group', {});
    }
    return graphic;
  },

  createTextInstance: (text, instance) => {
    // const textGraphic = createText({ text });
    // return textGraphic;
    // debugger;
    // return document.createTextNode(text);
    return undefined;
  },

  appendInitialChild: (parentInstance: Instance, childInstance: Instance) => {
    parentInstance.add(childInstance);
  },

  finalizeInitialChildren: () => false,

  prepareUpdate: () => true,

  shouldSetTextContent: () => false,

  getRootHostContext: () => null,

  getChildHostContext: () => null,

  getPublicInstance: (instance: Instance) => {
    return instance;
  },

  prepareForCommit: () => null,

  resetAfterCommit: () => undefined,

  preparePortalMount: () => null,

  // eslint-disable-next-line no-undef
  scheduleTimeout: setTimeout,
  // eslint-disable-next-line no-undef
  cancelTimeout: clearTimeout,

  noTimeout: -1,
  isPrimaryRenderer: false,

  getCurrentEventPriority: () => DefaultEventPriority,

  getInstanceFromNode: node => null,

  beforeActiveInstanceBlur: () => undefined,

  afterActiveInstanceBlur: () => undefined,

  prepareScopeUpdate: () => undefined,

  getInstanceFromScope: () => undefined,

  detachDeletedInstance: () => undefined,

  supportsHydration: false,

  appendChild: (parentInstance: Instance, child: Instance) => {
    parentInstance.add(child);
  },
  appendChildToContainer: (container: Instance, child: Instance) => {
    container.add(child);
  },

  insertBefore: (parentInstance: Instance, child: Instance, beforeChild: Instance) => {
    parentInstance.insertBefore(child, beforeChild);
  },

  insertInContainerBefore: (parentInstance: Instance, child: Instance, beforeChild: Instance) => {
    parentInstance.insertBefore(child, beforeChild);
  },

  removeChild: (parentInstance: Instance, child: Instance) => {
    child.delete();
  },

  removeChildFromContainer: (parentInstance: Instance, child: Instance) => {
    child.delete();
  },

  commitUpdate: (instance, updatePayload, type, oldProps, newProps) => {
    updateGraphicProps(instance, newProps, oldProps);
  },

  hideInstance: (instance: Instance) => {
    instance.setAttribute('visible', false);
  },

  unhideInstance: (instance, props) => {
    instance.setAttribute('visible', true);
  },

  clearContainer: (container: Instance) => {
    container.removeAllChild();
  },

  commitTextUpdate: (textInstance: any, oldText: string, newText: string) => {
    // debugger;
  }
});

reconcilor.injectIntoDevTools({
  // findFiberByHostInstance: () => {},
  // @ts-ignore
  // eslint-disable-next-line no-undef
  bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
  version: React.version,
  rendererPackageName: 'react-vtable'
});

function createGraphic(type: string, props: any) {
  // may have unwanted onxxx prop
  if (type === 'tag') {
    const tag = new Tag(props.attribute);
    return tag;
  } else if (!application.graphicService.creator[type]) {
    return;
  }
  const graphic = application.graphicService.creator[type]((props as any).attribute);
  return graphic;
}

function isEventProp(key: string, props: any) {
  return key.startsWith('on') && isFunction(props[key]);
}

function bindEventsToGraphic(graphic: Graphic, props: any) {
  for (const key in props) {
    if (isEventProp(key, props)) {
      graphic.addEventListener(REACT_TO_CANOPUS_EVENTS[key], props[key]);
    }
  }
}

function updateGraphicProps(graphic: Graphic, newProps: any, oldProps: any) {
  // deal width event update
  for (const propKey in oldProps) {
    if (isEventProp(propKey, oldProps) && oldProps[propKey] !== newProps[propKey]) {
      graphic.removeEventListener(REACT_TO_CANOPUS_EVENTS[propKey], oldProps[propKey]);
    }
  }
  for (const propKey in newProps) {
    if (isEventProp(propKey, newProps) && oldProps[propKey] !== newProps[propKey]) {
      graphic.addEventListener(REACT_TO_CANOPUS_EVENTS[propKey], newProps[propKey]);
    }
  }

  // update all attribute
  graphic.initAttributes(newProps.attribute);
  if (graphic.type === 'image') {
    graphic.loadImage(newProps.attribute.image);
  }
}
