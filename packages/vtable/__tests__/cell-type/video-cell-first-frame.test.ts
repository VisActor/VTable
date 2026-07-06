// @ts-nocheck
import { createVideoCellGroup } from '../../src/scenegraph/group-creater/cell-type/video-cell';
import { updateImageCellContentWhileResize } from '../../src/scenegraph/group-creater/cell-type/image-cell';
import { registerForVrender } from '../../src/vrender';
import * as icons from '../../src/icons';

global.__VERSION__ = 'none';

registerForVrender();

describe('video cell first frame snapshot', () => {
  const originalCreateElement = document.createElement.bind(document);
  let createdVideo: HTMLVideoElement;
  let drawImage: jest.Mock;

  function createTable(customConfig?: Record<string, unknown>) {
    return {
      options: {
        customConfig
      },
      _getCellStyle: jest.fn(() => ({})),
      getCellValue: jest.fn(() => 'https://example.com/video.mp4'),
      colCount: 1,
      rowCount: 1,
      theme: {
        cellInnerBorder: true,
        frameStyle: {}
      },
      getCellIcons: jest.fn(),
      scenegraph: {
        updateNextFrame: jest.fn(),
        highPerformanceGetCell: jest.fn(),
        getCell: jest.fn()
      }
    };
  }

  function createCell(customConfig?: Record<string, unknown>, size = { width: 200, height: 120 }) {
    const table = createTable(customConfig);
    const cellGroup = createVideoCellGroup(
      undefined,
      0,
      0,
      0,
      0,
      size.width,
      size.height,
      false,
      false,
      [0, 0, 0, 0],
      'left',
      'middle',
      false,
      table,
      {
        group: {},
        text: {}
      },
      undefined,
      false
    );
    table.scenegraph.getCell.mockReturnValue(cellGroup);

    return {
      table,
      cellGroup,
      image: cellGroup.getChildByName('image', true),
      video: createdVideo
    };
  }

  beforeEach(() => {
    drawImage = jest.fn();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage
    } as any);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'video') {
        createdVideo = element as HTMLVideoElement;
        Object.defineProperties(createdVideo, {
          videoWidth: {
            value: 640,
            configurable: true
          },
          videoHeight: {
            value: 360,
            configurable: true
          },
          pause: {
            value: jest.fn(),
            configurable: true
          },
          load: {
            value: jest.fn(),
            configurable: true
          }
        });
      }
      return element;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps existing video rendering when first frame snapshot is not enabled', () => {
    const { image, video } = createCell();

    video.dispatchEvent(new Event('loadeddata'));

    expect(image.attribute.image).toBe(video);
    expect(drawImage).not.toHaveBeenCalled();
    expect(video.pause).not.toHaveBeenCalled();
    expect(video.load).not.toHaveBeenCalled();
  });

  it('uses a canvas snapshot and releases the video when enabled', () => {
    const { image, table, video } = createCell({
      videoFirstFrameSnapshot: true,
      videoFirstFrameMaxCanvasSize: 128
    });

    expect(video.getAttribute('preload')).toBe('auto');
    expect(video.getAttribute('src')).toBe('https://example.com/video.mp4');

    video.dispatchEvent(new Event('loadeddata'));

    expect(drawImage).toHaveBeenCalledWith(video, 0, 0, 128, 77);
    expect(image.attribute.image).toBeInstanceOf(HTMLCanvasElement);
    expect((image.attribute.image as HTMLCanvasElement).width).toBe(128);
    expect((image.attribute.image as HTMLCanvasElement).height).toBe(77);
    expect(video.pause).toHaveBeenCalledTimes(1);
    expect(video.hasAttribute('src')).toBe(false);
    expect(video.load).toHaveBeenCalledTimes(1);
    expect(table.scenegraph.updateNextFrame).toHaveBeenCalled();
  });

  it('releases the video and redraws on load error', () => {
    const { table, video } = createCell({
      videoFirstFrameSnapshot: true
    });

    video.dispatchEvent(new Event('error'));

    expect(video.pause).toHaveBeenCalledTimes(1);
    expect(video.hasAttribute('src')).toBe(false);
    expect(video.load).toHaveBeenCalledTimes(1);
    expect(table.scenegraph.updateNextFrame).toHaveBeenCalled();
  });

  it('keeps the video damage image aspect ratio immediately after load error', () => {
    const { image, video } = createCell(
      {
        videoFirstFrameSnapshot: true
      },
      { width: 360, height: 40 }
    );
    const regedIcons = icons.get();
    const damageImage = regedIcons.video_damage_pic
      ? (regedIcons.video_damage_pic as any).svg
      : (regedIcons.damage_pic as any).svg;

    image.resources.set(damageImage, {
      state: 'success',
      data: {
        width: 24,
        height: 24
      }
    });
    video.dispatchEvent(new Event('error'));

    expect(image.attribute.image).toBe(damageImage);
    expect(image.attribute.x).toBe(0);
    expect(image.attribute.y).toBe(0);
    expect(image.attribute.width).toBe(40);
    expect(image.attribute.height).toBe(40);
  });

  it('keeps custom video damage svg aspect ratio before the icon resource is cached', () => {
    const originalVideoDamageIcon = (icons.icons as any).video_damage_pic;
    (icons.icons as any).video_damage_pic = {
      type: 'svg',
      svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="14" x="3" y="5"/><circle cx="18" cy="18" r="4"/></svg>',
      name: 'video_damage_pic',
      positionType: 'right'
    };

    try {
      const { image, video } = createCell(
        {
          videoFirstFrameSnapshot: true
        },
        { width: 360, height: 40 }
      );

      video.dispatchEvent(new Event('error'));

      expect(image.attribute.image).toBe((icons.icons as any).video_damage_pic.svg);
      expect(image.attribute.x).toBe(0);
      expect(image.attribute.y).toBe(0);
      expect(image.attribute.width).toBe(40);
      expect(image.attribute.height).toBe(40);
    } finally {
      if (originalVideoDamageIcon) {
        (icons.icons as any).video_damage_pic = originalVideoDamageIcon;
      } else {
        delete (icons.icons as any).video_damage_pic;
      }
    }
  });

  it('keeps the video damage image aspect ratio when the column resizes after load error', () => {
    const { cellGroup, image, table, video } = createCell({
      videoFirstFrameSnapshot: true
    });
    const regedIcons = icons.get();
    const damageImage = regedIcons.video_damage_pic
      ? (regedIcons.video_damage_pic as any).svg
      : (regedIcons.damage_pic as any).svg;

    video.dispatchEvent(new Event('error'));
    image.resources.set(damageImage, {
      state: 'success',
      data: {
        width: 24,
        height: 24
      }
    });
    cellGroup.setAttribute('width', 360);
    updateImageCellContentWhileResize(cellGroup, 0, 0, 160, 0, table);

    expect(image.attribute.image).toBe(damageImage);
    expect(image.attribute.x).toBe(0);
    expect(image.attribute.y).toBe(0);
    expect(image.attribute.width).toBe(120);
    expect(image.attribute.height).toBe(120);
  });
});
