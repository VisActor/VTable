export class LimitPromiseQueue {
  max: number;
  _count: number;
  _pendingTaskQueue: Function[];
  constructor(max: number) {
    this.max = max;
    this._count = 0;
    this._pendingTaskQueue = [];
  }
  /**
   * 调用器，将异步任务函数和它的参数传入
   * @param caller 异步任务函数，返回Promise的函数
   * @param args 异步任务函数的参数列表
   * @returns {Promise} 返回一个新的Promise
   */
  call(caller: any, ...arg: any[]) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, arg, resolve, reject);
      if (this._count >= this.max) {
        this._pendingTaskQueue.push(task);
      } else {
        task();
      }
    });
  }

  /**
   * 创建一个任务
   * @param caller 实际执行的函数
   * @param args 执行函数的参数
   * @param resolve
   * @param reject
   * @returns {Function} 返回一个任务函数
   * @private
   */
  _createTask(caller: Function, arg: any[], resolve: any, reject: any) {
    return () => {
      // 当前请求数量加一
      this._count++;
      // 实际上是在这里调用了异步任务，并将异步任务的返回（resolve和reject）抛给了上层
      caller(...arg)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          console.log('finally');
          // 任务队列的消费区，利用Promise的finally方法，在异步任务结束后，取出下一个任务执行
          this._count--;
          if (this._pendingTaskQueue.length) {
            const task = this._pendingTaskQueue.shift();
            task();
          }
        });
    };
  }
}
