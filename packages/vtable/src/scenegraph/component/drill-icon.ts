import type { Cursor } from '@src/vrender';
import { Icon } from '../graphic/icon';
import * as icons from '../../icons';
import type { SvgIcon } from '../../ts-types';
import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';

const regedIcons = icons.get();

export class DrillIcon {
  icon: Icon;

  constructor() {
    const iconOption = regedIcons.drillDown as SvgIcon;
    this.icon = new Icon({
      x: -1000,
      y: -1000,
      image: iconOption.svg,
      width: iconOption.width,
      height: iconOption.height,
      dx: -iconOption.width / 2,
      dy: -iconOption.height / 2,
      visible: false,
      funcType: iconOption.funcType,
      cursor: iconOption.cursor as Cursor
    });
    this.icon.role = 'icon-drill';
  }

  appand(parent: Group) {
    parent.appendChild(this.icon);
  }

  update(visible: boolean, x: number, y: number, drillDown: boolean, drillUp: boolean, scene: Scenegraph) {
    if (!visible || (drillDown && drillUp)) {
      this.icon.setAttributes({
        x: -1000,
        y: -1000,
        visible: false
      });
      scene.updateNextFrame();
      return;
    }

    const drillDownOption = regedIcons.drillDown as SvgIcon;
    const drillUpOption = regedIcons.drillUp as SvgIcon;
    this.icon.setAttributes({
      x,
      y,
      image: drillDown ? drillDownOption.svg : drillUpOption.svg,
      visible: true
    });
    this.icon.loadImage(this.icon.attribute.image);
    scene.updateNextFrame();
  }
}
