import type { IContainerOptions } from './container';
import { Container } from './container';

export class GroupElement extends Container {
  constructor(option: IContainerOptions) {
    option.flexWrap = 'nowrap';
    super(option);
  }
}
