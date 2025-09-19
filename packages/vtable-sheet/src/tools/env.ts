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
/**
 * 清空页面上的所有文本选择，使用多种兼容性方法
 */
export function clearPageSelection(): void {
  try {
    const selection = window.getSelection();
    if (selection) {
      // 方法1: removeAllRanges() - 标准方法，最广泛支持
      if (typeof selection.removeAllRanges === 'function') {
        selection.removeAllRanges();
        return;
      }

      // 方法2: empty() - IE 和一些旧浏览器
      if (typeof (selection as any).empty === 'function') {
        (selection as any).empty();
        return;
      }

      // 方法3: collapse() - 备用方法
      if (typeof selection.collapse === 'function') {
        selection.collapse(document.body, 0);
        return;
      }

      console.warn('无法清空selection：不支持的浏览器');
    }
  } catch (error) {
    console.warn('清空selection时出错:', error);
  }
}
