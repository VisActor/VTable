// @ts-nocheck
import { createVideoCellGroup } from '../../src/scenegraph/group-creater/cell-type/video-cell';
import { audioIconSvg, createAudioCellGroup } from '../../src/scenegraph/group-creater/cell-type/audio-cell';
import { createImageCellGroup } from '../../src/scenegraph/group-creater/cell-type/image-cell';
import { updateImageCellContentWhileResize } from '../../src/scenegraph/group-creater/cell-type/image-cell';
import { Group } from '../../src/scenegraph/graphic/group';
import { application, createImage, registerForVrender } from '../../src/vrender';
import * as icons from '../../src/icons';

global.__VERSION__ = 'none';

registerForVrender();

describe('video cell first frame snapshot', () => {
  const originalCreateElement = document.createElement.bind(document);
  let createdVideo: HTMLVideoElement | undefined;
  let drawImage: jest.Mock;

  function createTable(customConfig?: Record<string, unknown>, value = 'https://example.com/video.mp4') {
    return {
      options: {
        customConfig
      },
      _getCellStyle: jest.fn(() => ({})),
      getCellValue: jest.fn(() => value),
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

  function createCell(
    customConfig?: Record<string, unknown>,
    size = { width: 200, height: 120 },
    value = 'https://example.com/video.mp4'
  ) {
    const table = createTable(customConfig, value);
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
    createdVideo = undefined;
    (application.global as any).loadSvg = jest.fn(() =>
      Promise.resolve({
        data: {
          width: 24,
          height: 24
        }
      })
    );
    (application.global as any).getRequestAnimationFrame = () => (cb: FrameRequestCallback) => cb(0);
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

  it('renders an audio placeholder when a video cell receives an audio url', () => {
    const { image, video } = createCell(undefined, { width: 200, height: 120 }, 'https://example.com/audio.mp3');

    expect(video).toBeUndefined();
    expect(image.attribute.image).toBe(audioIconSvg);
    expect(image.attribute.width).toBe(32);
    expect(image.attribute.height).toBe(32);
  });

  it('keeps custom icons named image or play-icon when reusing a video cell for audio', () => {
    const { cellGroup, table } = createCell(undefined, { width: 200, height: 120 }, 'https://example.com/video.mp4');
    const customImageIcon = createImage({ x: 1, y: 1, width: 10, height: 10, image: audioIconSvg });
    customImageIcon.name = 'image';
    const customPlayIcon = createImage({ x: 2, y: 2, width: 10, height: 10, image: audioIconSvg });
    customPlayIcon.name = 'play-icon';
    cellGroup.appendChild(customImageIcon);
    cellGroup.appendChild(customPlayIcon);
    table.getCellValue.mockReturnValue('https://example.com/audio.mp3');
    table.scenegraph.highPerformanceGetCell.mockReturnValue(cellGroup);

    createVideoCellGroup(
      undefined,
      0,
      0,
      0,
      0,
      200,
      120,
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
      true
    );
    const children = [];
    cellGroup.forEachChildren(child => {
      children.push(child);
    });

    expect(children).toContain(customImageIcon);
    expect(children).toContain(customPlayIcon);
    expect(children.filter(child => child.name === 'image')).toHaveLength(2);
    expect(children.filter(child => child.name === 'play-icon')).toHaveLength(1);
  });

  it('resizes an image cell media node without touching custom icons with media names', () => {
    const table = createTable(undefined, '<svg width="20" height="10" xmlns="http://www.w3.org/2000/svg"></svg>');
    const cellGroup = new Group({
      x: 0,
      y: 0,
      width: 200,
      height: 120
    });
    cellGroup.role = 'cell';
    cellGroup.col = 0;
    cellGroup.row = 0;
    const customImageIcon = createImage({ x: 7, y: 8, width: 9, height: 10, image: audioIconSvg });
    customImageIcon.name = 'image';
    const customPlayIcon = createImage({ x: 11, y: 12, width: 13, height: 14, image: audioIconSvg });
    customPlayIcon.name = 'play-icon';
    cellGroup.appendChild(customImageIcon);
    cellGroup.appendChild(customPlayIcon);
    table.scenegraph.highPerformanceGetCell.mockReturnValue(cellGroup);
    table.scenegraph.getCell.mockReturnValue(cellGroup);

    createImageCellGroup(
      undefined,
      0,
      0,
      0,
      0,
      200,
      120,
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
      true
    );

    const children = [];
    cellGroup.forEachChildren(child => {
      children.push(child);
    });
    const mediaImage = children.find(child => child.name === 'image' && child !== customImageIcon);
    mediaImage.resources.set(mediaImage.attribute.image, {
      state: 'success',
      data: {
        width: 20,
        height: 10
      }
    });
    cellGroup.setAttribute('width', 260);
    updateImageCellContentWhileResize(cellGroup, 0, 0, 60, 0, table);

    expect(mediaImage.attribute.width).toBe(260);
    expect(mediaImage.attribute.height).toBe(120);
    expect(customImageIcon.attribute).toMatchObject({ x: 7, y: 8, width: 9, height: 10 });
    expect(customPlayIcon.attribute).toMatchObject({ x: 11, y: 12, width: 13, height: 14 });
  });

  it('resizes an audio cell media node without touching custom icons with media names', () => {
    const table = createTable(undefined, 'https://example.com/audio.mp3');
    const cellGroup = new Group({
      x: 0,
      y: 0,
      width: 200,
      height: 120
    });
    cellGroup.role = 'cell';
    cellGroup.col = 0;
    cellGroup.row = 0;
    const customImageIcon = createImage({ x: 7, y: 8, width: 9, height: 10, image: audioIconSvg });
    customImageIcon.name = 'image';
    const customPlayIcon = createImage({ x: 11, y: 12, width: 13, height: 14, image: audioIconSvg });
    customPlayIcon.name = 'play-icon';
    cellGroup.appendChild(customImageIcon);
    cellGroup.appendChild(customPlayIcon);
    table.scenegraph.highPerformanceGetCell.mockReturnValue(cellGroup);
    table.scenegraph.getCell.mockReturnValue(cellGroup);

    createAudioCellGroup(
      undefined,
      0,
      0,
      0,
      0,
      200,
      120,
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
      true
    );

    const children = [];
    cellGroup.forEachChildren(child => {
      children.push(child);
    });
    const mediaImage = children.find(child => child.name === 'image' && child !== customImageIcon);
    cellGroup.setAttribute('width', 260);
    updateImageCellContentWhileResize(cellGroup, 0, 0, 60, 0, table);

    expect(mediaImage.attribute.width).toBe(32);
    expect(mediaImage.attribute.height).toBe(32);
    expect(customImageIcon.attribute).toMatchObject({ x: 7, y: 8, width: 9, height: 10 });
    expect(customPlayIcon.attribute).toMatchObject({ x: 11, y: 12, width: 13, height: 14 });
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

  it('shows the damage image instead of drawing a zero-size video frame', () => {
    const { image, table, video } = createCell({
      videoFirstFrameSnapshot: true
    });
    Object.defineProperties(video, {
      videoWidth: {
        value: 0,
        configurable: true
      },
      videoHeight: {
        value: 0,
        configurable: true
      }
    });
    const regedIcons = icons.get();
    const damageImage = regedIcons.video_damage_pic
      ? (regedIcons.video_damage_pic as any).svg
      : (regedIcons.damage_pic as any).svg;

    video.dispatchEvent(new Event('loadeddata'));

    expect(drawImage).not.toHaveBeenCalled();
    expect(image.attribute.image).toBe(damageImage);
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
