import { isObject } from './isx';

export function debounce(func: Function, wait?: number, options?: any) {
  let lastArgs: any;
  let lastThis: any;
  let maxWait: number; // 最长等待时间
  let result: any; // 存储 func 函数的返回值
  let timerId: number | undefined; // 定时器 id
  let lastCallTime: number; // 最近一次 执行 debounced 函数时的时间

  // 最近一次执行 func 时的时间戳
  let lastInvokeTime = 0;
  // options 是否 传入了 maxWait
  let maxing = false;
  // 是否在延迟开始前调用函数
  let leading = false;
  // 是否在延迟结束后调用函数
  let trailing = true;

  const useRAF = !wait && wait !== 0 && typeof requestAnimationFrame === 'function';

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  wait = +(wait as number) || 0;

  if (isObject(options)) {
    leading = !!options.leading;

    maxing = 'maxWait' in options;
    if (maxing) {
      maxWait = Math.max(+options.maxWait || 0, wait);
    }

    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastThis = undefined;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  // 开启定时器
  function startTimer(pendingFunc: any, wait: number) {
    if (useRAF) {
      return requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  }

  // 清除定时器
  // function cancelTimer(id: number) {
  //   if (useRAF) {
  //     return cancelAnimationFrame(id);
  //   }
  //   clearTimeout(id);
  // }

  // 在延迟开始前调用
  function leadingEdge(time: number) {
    // 记录 函数被调用时 的时间戳
    lastInvokeTime = time;
    //@ts-ignore
    timerId = startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  // 在延迟结束后调用
  function trailingEdge(time: number) {
    timerId = undefined;

    // lastArgs 在 debounced 函数执行时赋值
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    // 重置参数和作用域
    lastThis = undefined;
    lastArgs = undefined;
    return result;
  }

  function remainingWait(time: number) {
    // 计算 time 与最近一次调用 debounced 函数的时间差
    const timeSinceLastCall = time - lastCallTime;
    // 计算 time 与最近一次调用 func 函数的时间差
    const timeSinceLastInvoke = time - lastInvokeTime;
    // 用 wait 减去已经等待的时间
    const timeWaiting = wait && -timeSinceLastCall;

    return maxing ? Math.min(timeWaiting as number, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  // 是否可以执行函数
  function shouldInvoke(time: number) {
    // 计算 time 与最近一次调用 debounced 函数的时间差
    const timeSinceLastCall = time - lastCallTime;
    // 计算 time 与最近一次调用 func 函数的时间差
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      // 是不是第一次执行 debouned 函数
      lastCallTime === undefined ||
      timeSinceLastCall >= (wait as number) ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  // 封装执行函数，用于 wait 延迟结束后执行
  function timerExpired() {
    const time = Date.now();
    // 根据时间来判断是否可以执行 func 函数
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // 重新计算时间，重新建一个定时器
    // @ts-ignore
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function debounced(this: any, ...args: any) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      // 第一次执行时
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // @ts-ignore
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    // 因为 trailingEdge 函数内部会执行 timerId = undefined
    // trailingEdge 函数执行之后，又触发了 debounced
    if (timerId === undefined) {
      // @ts-ignore
      timerId = startTimer(timerExpired, wait);
    }

    return result;
  }

  return debounced;
}
