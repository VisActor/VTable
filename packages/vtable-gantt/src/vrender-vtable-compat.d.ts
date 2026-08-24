declare module '@visactor/vtable/es/vrender-app' {
  type VRenderAppEnv = 'browser' | 'node' | 'worker' | 'wx' | 'lynx' | 'harmony' | 'taro' | 'feishu' | 'tt';
  type VRenderStageMode = VRenderAppEnv | 'desktop-browser';

  export type VRenderStageAppOptions = {
    mode?: VRenderStageMode;
    scope?: string;
    app?: import('@visactor/vrender-core').IApp;
    stage?: import('@visactor/vrender-core').IStage;
    envParams?: import('@visactor/vrender-core').IEnvParamsMap[VRenderAppEnv];
  };

  export type VRenderStageAppRef = {
    app?: import('@visactor/vrender-core').IApp;
    stage: import('@visactor/vrender-core').IStage;
    releaseAppRef: () => void;
    stageOwned: boolean;
    appOwned: boolean;
  };

  export function createStageFromVRenderApp(
    params: Partial<import('@visactor/vrender-core').IStageParams>,
    options?: VRenderStageAppOptions
  ): VRenderStageAppRef;
}
