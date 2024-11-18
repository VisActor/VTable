import type { EasingType } from '@src/vrender';

export interface IAnimationAppear {
  duration?: number;
  delay?: number;
  type?: 'all' | 'one-by-one';
  direction?: 'row' | 'column';
}

export interface ITableAnimationOption {
  duration?: number;
  easing?: EasingType;
}
