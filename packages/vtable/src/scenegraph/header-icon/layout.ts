import type { Group, IImageGraphicAttribute } from '@visactor/vrender';
import type { ColumnIconOption } from '../../ts-types';
import { IconPosition } from '../../ts-types';
import { Icon } from '../graphic/icon';

function createIcon(option: IImageGraphicAttribute): Icon {
  const icon = new Icon(option);
  icon.role = 'icon';
  return icon;
}

export function iconLayout(
  icons: ColumnIconOption[],
  cellGroup: Group,
  padding: number[],
  width: number,
  height: number,
  textWidth: number,
  textAlign: CanvasTextAlign
): number {
  // icons.forEach((icon, index) => {
  //   const image = createIcon({
  //     x: 100 + index * 20,
  //     y: 20,
  //     width: icon.width,
  //     height: icon.height,
  //     image: (<any>icon).svg,
  //   });
  //   cellGroup.addChild(image);
  // });

  //图标的inline对象
  const absoluteRightIcons = icons?.filter((value: ColumnIconOption) => {
    if (value.positionType === IconPosition.absoluteRight) {
      return true;
    }
    return false;
  });
  const absoluteRightIconsWidths = absoluteRightIcons.map(icon => {
    return icon.width + (icon.marginLeft || 0) + (icon.marginRight || 0);
  });
  const totalAbsoluteRightIconWidth = absoluteRightIconsWidths.reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  const rightIcons = icons?.filter((value: ColumnIconOption) => {
    if (value.positionType === IconPosition.right) {
      return true;
    }
    return false;
  });
  const rightIconsWidths = rightIcons.map(icon => {
    return icon.width + (icon.marginLeft || 0) + (icon.marginRight || 0);
  });
  const totalRightIconWidth = rightIconsWidths.reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  const leftIcons = icons?.filter((value: ColumnIconOption) => {
    if (value.positionType === IconPosition.left) {
      return true;
    }
    return false;
  });
  const leftIconsWidths = leftIcons.map(icon => {
    return icon.width + (icon.marginLeft || 0) + (icon.marginRight || 0);
  });
  const totalLeftIconWidth = leftIconsWidths.reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  // TODO: 处理行内换行图标
  const middleFrontIcons = icons?.filter((value: ColumnIconOption) => {
    if (value.positionType === IconPosition.inlineFront) {
      return true;
    }
    return false;
  });
  const middleFrontIconsWidths = middleFrontIcons.map(icon => {
    return icon.width + (icon.marginLeft || 0) + (icon.marginRight || 0);
  });
  const totalMiddleFrontIconWidth = middleFrontIconsWidths.reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  const middleEndIcons = icons?.filter((value: ColumnIconOption) => {
    if (value.positionType === IconPosition.inlineEnd) {
      return true;
    }
    return false;
  });
  const middleEndIconsWidths = middleEndIcons.map(icon => {
    return icon.width + (icon.marginLeft || 0) + (icon.marginRight || 0);
  });
  const totalMiddleEndIconWidth = middleEndIconsWidths.reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  let rightIconsLeft = width - padding[1] - totalRightIconWidth;
  let leftIconsLeft = padding[3];

  // 处理右侧图标
  // let rightIconsLeft = width - padding[1] - totalRightIconWidth;
  rightIcons.forEach((icon, index) => {
    const image = createIcon({
      x: rightIconsLeft,
      y: (height + padding[0] - padding[2]) / 2 - icon.height / 2,
      width: icon.width,
      height: icon.height,
      image: (<any>icon).svg
    });
    cellGroup.addChild(image);

    rightIconsLeft += rightIconsWidths[index];
  });

  // 处理左侧图标
  // let leftIconsLeft = padding[3];
  leftIcons.forEach((icon, index) => {
    const image = createIcon({
      x: leftIconsLeft,
      y: (height + padding[0] - padding[2]) / 2 - icon.height / 2,
      width: icon.width,
      height: icon.height,
      image: (<any>icon).svg
    });
    cellGroup.addChild(image);

    leftIconsLeft += leftIconsWidths[index];
  });

  // textAlign === 'left'
  let middleFrontIconsLeft = leftIconsLeft;
  let middleEndIconsLeft = padding[3] + totalLeftIconWidth + totalMiddleFrontIconWidth + textWidth;
  if (textAlign === 'right') {
    middleFrontIconsLeft =
      width - padding[1] - totalRightIconWidth - totalMiddleEndIconWidth - textWidth - totalMiddleFrontIconWidth;
    middleEndIconsLeft = width - padding[1] - totalRightIconWidth - totalMiddleEndIconWidth;
  } else if (textAlign === 'center') {
    const centerX = padding[1] + (width - padding[1] - padding[3]) / 2;
    middleFrontIconsLeft = centerX - textWidth / 2 - totalMiddleFrontIconWidth;
    middleEndIconsLeft = centerX + textWidth / 2;
  }

  // 处理行内左侧图标
  middleFrontIcons.forEach((icon, index) => {
    const image = createIcon({
      x: middleFrontIconsLeft,
      y: (height + padding[0] - padding[2]) / 2 - icon.height / 2,
      width: icon.width,
      height: icon.height,
      image: (<any>icon).svg
    });
    cellGroup.addChild(image);

    middleFrontIconsLeft += middleFrontIconsWidths[index];
  });

  // 处理行内右侧图标
  // let middleEndIconsLeft = padding[3] + totalLeftIconWidth + totalMiddleFrontIconWidth + textWidth;
  middleEndIcons.forEach((icon, index) => {
    const image = createIcon({
      x: middleEndIconsLeft,
      y: (height + padding[0] - padding[2]) / 2 - icon.height / 2,
      width: icon.width,
      height: icon.height,
      image: (<any>icon).svg
    });
    cellGroup.addChild(image);

    middleEndIconsLeft += middleEndIconsWidths[index];
  });

  // 处理absolute右侧图标
  let absoluteRightIconsLeft = width - totalAbsoluteRightIconWidth;
  absoluteRightIcons.forEach((icon, index) => {
    const image = createIcon({
      x: absoluteRightIconsLeft,
      y: (height + padding[0] - padding[2]) / 2 - icon.height / 2,
      width: icon.width,
      height: icon.height,
      image: (<any>icon).svg
    });
    cellGroup.addChild(image);

    absoluteRightIconsLeft += absoluteRightIconsWidths[index];
  });

  if (textAlign === 'right') {
    return -totalRightIconWidth - totalMiddleEndIconWidth;
  } else if (textAlign === 'center') {
    return 0;
  }
  // textAlign === 'left'
  return totalLeftIconWidth + totalMiddleFrontIconWidth;
}
