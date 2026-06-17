import { Text } from '../../src/vrender';
import { Group } from '../../src/scenegraph/graphic/group';
import { dealWithIcon, insertTextBeforeCellIcons } from '../../src/scenegraph/utils/text-icon-layout';

describe('text icon layout insertion', () => {
  test('clones ancestor text before inserting it into a cell group', () => {
    const ancestorText = new Text({ text: 'value' });
    ancestorText.name = 'text';
    (ancestorText as any).addChildUpdateBoundTag = jest.fn();
    const cellGroup = new Group({});
    const iconGroup = new Group({});
    iconGroup.name = 'icon';

    cellGroup.appendChild(iconGroup);
    (cellGroup as any).parent = ancestorText;

    const insertedText = insertTextBeforeCellIcons(cellGroup, ancestorText as any);

    expect(insertedText).not.toBe(ancestorText);
    expect(insertedText.name).toBe('text');
    expect(insertedText.parent).toBe(cellGroup);
    expect(cellGroup.firstChild).toBe(insertedText);
    expect(insertedText.nextSibling).toBe(iconGroup);

    cellGroup.removeAllChild();
    (cellGroup as any).parent = null;
  });

  test('maps circle image icons to native image corner radius', () => {
    const iconMark = dealWithIcon({
      type: 'image',
      src: 'avatar',
      name: 'avatar_pic',
      shape: 'circle',
      width: 30,
      height: 20
    } as any);

    expect(iconMark.attribute.shape).toBe('circle');
    expect(iconMark.attribute.cornerRadius).toBe(10);
  });
});
