import * as VTable from '@visactor/vtable';
export interface SomeOptions {
  propone: string;
}

export class BeforeInitPlugin implements VTable.plugins.IVTablePlugin {
  id = '....';
  name = '...';
  type: 'layout' = 'layout';
  runTime = VTable.TABLE_EVENT_TYPE.BEFORE_INIT;
  options: SomeOptions;
  table: any;
  constructor(options: SomeOptions) {
    this.options = options;
  }
  run(...args: any[]) {
    console.log('Table BEFORE_INIT');
    // const table = args[0];
    // const eventArgs = args[1];
    // const options = eventArgs.options;
    // const container = eventArgs.container;
    // 可以通过options.container重置替换容器
  }
}
