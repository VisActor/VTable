import { application, REACT_TO_CANOPUS_EVENTS, Group, Tag, Text } from '@visactor/vtable/es/vrender';
import type { FlexLayoutPlugin, Graphic, IGraphic, IGraphicCreator } from '@visactor/vtable/es/vrender';
import { isFunction, isNumber, merge } from '@visactor/vutils';
import React from 'react';
import ReactReconciler from 'react-reconciler';
import { ConcurrentRoot, DefaultEventPriority, LegacyRoot } from 'react-reconciler/constants.js';
import { createVRenderComponent } from '../../components/vrender-components/component-creater';

declare const process: any;

const rendererPackageName = 'react-vtable';
const rendererVersion =
  typeof (React as any).version === 'string' && (React as any).version.length > 0 ? (React as any).version : '0.0.0';

/**
 * react-reconciler 与 React 主版本强绑定：
 * - React18 对应 react-reconciler@0.29.x
 * - React19 对应 react-reconciler@0.31.x
 *
 * 本仓库默认依赖树以 React18 为主；React19 Demo 通过 Vite alias 指向 .react19-deps 的 react-reconciler，
 * 避免因版本不匹配出现运行时报错（例如读取内部字段 undefined）。
 */
type Instance = any;
let currentUpdatePriority: number = DefaultEventPriority;

export type ReconcilerErrorType = 'uncaught' | 'caught' | 'recoverable';
export type ReconcilerErrorReporter = (type: ReconcilerErrorType, error: unknown) => void;

export const reconcilor = (ReactReconciler as any)({
  supportsMutation: true,
  supportsPersistence: false,
  rendererVersion,
  rendererPackageName,

  createInstance: (type: string, props: any, instance: any): any => {
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

  createTextInstance: (text: string, instance: any): any => {
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

  getRootHostContext: (): Record<string, never> => ({}),

  getChildHostContext: (): Record<string, never> => ({}),

  getPublicInstance: (instance: Instance): any => {
    return instance;
  },

  prepareForCommit: (): null => null,

  resetAfterCommit: (): undefined => undefined,

  preparePortalMount: (): null => null,

  // eslint-disable-next-line no-undef
  scheduleTimeout: setTimeout,
  // eslint-disable-next-line no-undef
  cancelTimeout: clearTimeout,
  supportsMicrotasks: true,
  scheduleMicrotask: (callback: () => void) => {
    Promise.resolve().then(callback);
  },

  noTimeout: -1,
  isPrimaryRenderer: false,

  setCurrentUpdatePriority: (newPriority: number): void => {
    currentUpdatePriority = newPriority;
  },

  getCurrentUpdatePriority: (): number => {
    return currentUpdatePriority;
  },

  resolveUpdatePriority: (): number => {
    return currentUpdatePriority;
  },

  getCurrentEventPriority: (): number => DefaultEventPriority,

  getInstanceFromNode: (node: any): null => null,

  beforeActiveInstanceBlur: (): undefined => undefined,

  afterActiveInstanceBlur: (): undefined => undefined,

  prepareScopeUpdate: (): undefined => undefined,

  getInstanceFromScope: (): undefined => undefined,

  detachDeletedInstance: (): undefined => undefined,

  supportsHydration: false,
  maySuspendCommit: (): boolean => false,
  preloadInstance: (): null => null,
  startSuspendingCommit: (): null => null,
  suspendInstance: (): undefined => undefined,
  waitForCommitToBeReady: (): null => null,

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

  commitUpdate: (...args: any[]): void => {
    const instance = args[0];
    if (typeof args[1] === 'string') {
      const oldProps = args[2];
      const newProps = args[3];
      updateGraphicProps(instance, newProps, oldProps);
      return;
    }
    const oldProps = args[3];
    const newProps = args[4];
    updateGraphicProps(instance, newProps, oldProps);
  },

  hideInstance: (instance: Instance) => {
    instance.setAttribute('visible', false);
  },

  unhideInstance: (instance: any, props: any): void => {
    instance.setAttribute('visible', true);
  },

  clearContainer: (container: Instance) => {
    container.removeAllChild();
  },

  commitTextUpdate: (textInstance: any, oldText: string, newText: string) => {
    // debugger;
  }
});

const injectIntoDevTools = (reconcilor as any).injectIntoDevTools;
if (typeof injectIntoDevTools === 'function') {
  if (injectIntoDevTools.length === 0) {
    injectIntoDevTools();
  } else {
    injectIntoDevTools({
      bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
      version: rendererVersion,
      rendererPackageName
    });
  }
}

export const createReconcilerContainer = (
  container: Instance,
  identifierPrefix = 'custom',
  reportError?: ReconcilerErrorReporter
) => {
  const createContainer = (reconcilor as any).createContainer;
  const hydrationCallbacks: null = null;
  const isStrictMode = false;
  const concurrentUpdatesByDefaultOverride = false;
  const noop = (): void => undefined;
  // React19 的 createContainer 需要传入 error callbacks；这里不做任何全局 side-effect，
  // 由上层（例如 BaseTable 的 onError）选择是否接收这些错误。
  const onUncaughtError = reportError ? (error: unknown) => reportError('uncaught', error) : noop;
  const onCaughtError = reportError ? (error: unknown) => reportError('caught', error) : noop;
  const onRecoverableError = reportError ? (error: unknown) => reportError('recoverable', error) : noop;
  const transitionCallbacks: null = null;

  const majorVersion = Number.parseInt(String((React as any).version ?? '0').split('.')[0], 10);
  const rootTag = Number.isFinite(majorVersion) && majorVersion >= 19 ? ConcurrentRoot : LegacyRoot;
  return createContainer(
    container as any,
    rootTag,
    hydrationCallbacks,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onUncaughtError,
    onCaughtError,
    onRecoverableError,
    transitionCallbacks
  );
};

function createGraphic(type: string, props: any) {
  const component = createVRenderComponent(type, props);
  if (component) {
    return component;
  }
  if (type === 'group') {
    return new Group(props.attribute ? props.attribute : props);
  }
  if (type === 'text') {
    return new Text(props.attribute ? props.attribute : props);
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
  const attribute = newProps.attribute ?? merge({}, newProps);

  // update all attribute
  graphic.initAttributes(attribute);
  if (graphic.type === 'image') {
    graphic.loadImage(attribute.image);
  }

  if (
    attribute.display === 'flex' &&
    attribute.width === undefined &&
    attribute.height === undefined &&
    isNumber(oldProps.attribute.width) &&
    isNumber(oldProps.attribute.height)
  ) {
    const plugin = graphic.stage.pluginService.findPluginsByName('FlexLayoutPlugin')[0] as FlexLayoutPlugin;
    if (plugin) {
      plugin.tryLayoutChildren(graphic);
    }
  }
}
