import { isValid } from '@visactor/vutils';

/**
 * throttle 保障了首次立即执行 后续触发的回调执行间隔delay时间 区别于throttle2 最后执行时机会提前
 * @param { Function } func 执行函数
 * @param { Interger } time 多长时间内不能第二次执行
 * @returns function 返回经过节流处理的函数
 */
export function throttle(func: Function, delay: number) {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    // let args=arguments 也可以写成这种或...args也是代表我们传过来的实参
    if (!timer) {
      func.apply(this, args); //先执行函数,保证第一次立即执行
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
    // console.log('throttle');
    // 当我们第一次触发事件，定时器不存在时就执行函数，当我们再次点击时，因为定时器存在，
    // 所以无法再进入函数调用(无论事件如何执行),那么只能等定时器事件结束，
    // 我们让timer=null，回到第一次的状态,就又重新开始新的一轮
  };
}
/**
 * throttle节流 间隔delay时间后执行 保障了最后执行时机是在delay之后
 * @param { Function } func 执行函数
 * @param { Interger } time 多长时间内不能第二次执行
 * @returns function 返回经过节流处理的函数
 */
export function throttle2(func: Function, delay: number) {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    // let args=arguments 也可以写成这种或...args也是代表我们传过来的实参
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
