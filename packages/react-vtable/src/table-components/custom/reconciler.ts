import { application, REACT_TO_CANOPUS_EVENTS, Tag } from '@visactor/vtable/es/vrender';
import type { Graphic, IGraphic, IGraphicCreator } from '@visactor/vtable/es/vrender';
import { isFunction, merge } from '@visactor/vutils';
import React from 'react';
import ReactReconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants.js';
import { createVRenderComponent } from '../../components/vrender-components/component-creater';

type Instance = Graphic;

export const reconcilor = ReactReconciler({
  supportsMutation: true,
  supportsPersistence: false,

  createInstance: (type: string, props: any, instance) => {
    const graphic = createGraphic(type, props);
    if (graphic) {
      bindEventsToGraphic(graphic as IGraphic, props);
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
  const component = createVRenderComponent(type, props);
  if (component) {
    return component;
  }
  if (!application.graphicService.creator[type as keyof IGraphicCreator]) {
    return undefined;
  }
  const graphic = application.graphicService.creator[type as keyof IGraphicCreator]((props as any).attribute);
  return graphic;
}

function isEventProp(key: string, props: any) {
  return key.startsWith('on') && isFunction(props[key]);
}

function bindEventsToGraphic(graphic: IGraphic, props: any) {
  for (const key in props) {
    if (isEventProp(key, props) && REACT_TO_CANOPUS_EVENTS[key as keyof typeof REACT_TO_CANOPUS_EVENTS]) {
      graphic.addEventListener(REACT_TO_CANOPUS_EVENTS[key as keyof typeof REACT_TO_CANOPUS_EVENTS], props[key]);
    }
  }
}

function updateGraphicProps(graphic: IGraphic, newProps: any, oldProps: any) {
  // deal width event update
  for (const propKey in oldProps) {
    if (isEventProp(propKey, oldProps) && oldProps[propKey] !== newProps[propKey]) {
      graphic.removeEventListener(
        REACT_TO_CANOPUS_EVENTS[propKey as keyof typeof REACT_TO_CANOPUS_EVENTS],
        oldProps[propKey]
      );
    }
  }
  for (const propKey in newProps) {
    if (isEventProp(propKey, newProps) && oldProps[propKey] !== newProps[propKey]) {
      graphic.addEventListener(
        REACT_TO_CANOPUS_EVENTS[propKey as keyof typeof REACT_TO_CANOPUS_EVENTS],
        newProps[propKey]
      );
    }
  }
  // update all attribute
  const attribute = newProps.attribute ?? merge({}, newProps);
  graphic.initAttributes(attribute);
  if (graphic.type === 'image') {
    graphic.loadImage(attribute.image);
  }
}
