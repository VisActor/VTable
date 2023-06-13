import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ElementOptions } from './element';
import { BaseElement } from './element';

type TextOptions = {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string | boolean;
} & ElementOptions;

export class Text extends BaseElement {
  type: 'text' = 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string | boolean;
  textBaseline: 'top' = 'top';
  textAlign: 'left' = 'left';

  constructor(options: TextOptions) {
    super(options);
    this.text = options.text;
    this.fontSize = options.fontSize || 12;
    this.fontFamily = options.fontFamily || 'sans-serif';
    this.fill = options.fill || 'black';
    // this.font = `${this.fontSize}px ${this.fontFamily}`;
  }

  getSize(table: BaseTableAPI) {
    const { width, height } = table.measureText(this.text, {
      fontSize: this.fontSize,
      fontFamily: this.fontFamily
    });
    this.width = width;
    this.height = height;
    this.initLayoutSize();

    if (this.background) {
      this.dx += this.background.expandX || 0;
      this.dy += this.background.expandY || 0;
    }
  }
}
