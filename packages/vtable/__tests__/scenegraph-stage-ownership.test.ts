// @ts-nocheck
import { Scenegraph } from '../src/scenegraph/scenegraph';

(globalThis as { __VERSION__?: string }).__VERSION__ = 'none';

describe('Scenegraph stage ownership', () => {
  test('does not release a borrowed stage or app reference', () => {
    const releaseStage = jest.fn();
    const releaseAppRef = jest.fn();
    const removeChild = jest.fn();
    const releaseTableGroup = jest.fn();
    const tableGroup = {
      parent: { removeChild },
      release: releaseTableGroup
    };
    const scenegraph = Object.create(Scenegraph.prototype);

    scenegraph.stage = { release: releaseStage };
    scenegraph.stageOwned = false;
    scenegraph.releaseVRenderAppRef = releaseAppRef;
    scenegraph.tableGroup = tableGroup;

    scenegraph.releaseStage();

    expect(releaseStage).not.toHaveBeenCalled();
    expect(releaseAppRef).toHaveBeenCalledTimes(1);
    expect(removeChild).toHaveBeenCalledWith(tableGroup);
    expect(releaseTableGroup).toHaveBeenCalledWith(true);
  });
});
