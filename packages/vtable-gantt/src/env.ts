export type EnvMode = 'browser' | 'node' | 'worker' | 'miniApp' | 'desktop-miniApp';
export type LooseFunction = (...args: any) => any;

export class Env {
  static _mode: EnvMode;
  public static get mode() {
    if (!Env._mode) {
      Env._mode = defaultMode();
    }
    return Env._mode;
  }
  public static set mode(mode: EnvMode) {
    Env._mode = mode;
  }

  static dpr = 0;

  static CreateCanvas?: LooseFunction;

  static LoadImage?: LooseFunction;

  static RequestAnimationFrame?: LooseFunction;

  static CancelAnimationFrame?: LooseFunction;

  static RegisterCreateCanvas(func: LooseFunction) {
    Env.CreateCanvas = func;
  }

  static RegisterLoadImage(func: LooseFunction) {
    Env.LoadImage = func;
  }

  static GetCreateCanvasFunc(): LooseFunction | undefined {
    if (Env.CreateCanvas) {
      return Env.CreateCanvas;
    }
    if (Env.mode === 'worker') {
      return (width = 200, height = 200) => new OffscreenCanvas(width, height);
    }
    return undefined;
  }

  static RegisterRequestAnimationFrame(func: LooseFunction) {
    Env.RequestAnimationFrame = func();
  }

  static GetRequestAnimationFrame() {
    if (Env.RequestAnimationFrame) {
      return Env.RequestAnimationFrame;
    }
    return undefined;
  }

  static RegisterCancelAnimationFrame(func: LooseFunction) {
    Env.CancelAnimationFrame = func();
  }

  static GetCancelAnimationFrame() {
    if (Env.CancelAnimationFrame) {
      return Env.CancelAnimationFrame;
    }
    return undefined;
  }
}

/**
 *
 * 这个默认的判断方法并不能区分出不同的环境，所以这里采用是否判断
 * 满足条件为 'browser'，不满足则为 'node'
 */
function defaultMode(): EnvMode {
  let mode: EnvMode = 'browser';
  try {
    if ((window as any).type === 'node') {
      mode = 'node';
    } else if (typeof window !== 'undefined' && !window.performance) {
      mode = 'miniApp';
    } else if (typeof window === 'undefined') {
      mode = 'node';
    }
  } catch (err) {
    mode = 'node';
  }
  return mode;
}
