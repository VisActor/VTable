import { isFunction } from '@visactor/vutils';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import { Env } from '../tools/env';
import { regUrl } from '../tools/global';
import type { LinkColumnDefine, MousePointerCellEvent } from '../ts-types';
import type { BaseTableAPI, HeaderData } from '../ts-types/base-table';
import type { IAudioColumnBodyDefine, IImageColumnBodyDefine } from '../ts-types/list-table/define/image-define';
import { getOrApply } from '../tools/helper';
import { isAudioUrl } from '../tools/media';

const MEDIA_PREVIEW_MANAGER_KEY = '__vtable_media_preview_manager__';

interface MediaPreviewManager {
  closePreview: (() => void) | null;
  registered: boolean;
  close: () => void;
  open: (closePreview: () => void) => void;
  release: () => void;
  ensureRegistered: () => void;
}

function formatAudioTime(time: number) {
  if (!Number.isFinite(time) || time < 0) {
    return '0:00';
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateAudioProgressStyle(progress: HTMLInputElement, value: number) {
  progress.style.background = `linear-gradient(
    to right,
    #2563EB 0%,
    #2563EB ${value}%,
    #D1D5DB ${value}%,
    #D1D5DB 100%
  )`;
}

function ensureAudioPreviewStyle() {
  const styleId = 'vtable-audio-preview-style';
  if (document.getElementById(styleId)) {
    return;
  }
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .vtable-audio-preview-progress {
      -webkit-appearance: none;
      appearance: none;
    }
    .vtable-audio-preview-progress::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 999px;
      background: transparent;
    }
    .vtable-audio-preview-progress::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      margin-top: -4px;
      border-radius: 50%;
      border: 0;
      background: #2563EB;
    }
    .vtable-audio-preview-progress::-moz-range-track {
      height: 4px;
      border-radius: 999px;
      background: transparent;
    }
    .vtable-audio-preview-progress::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 0;
      background: #2563EB;
    }
  `;
  document.head.appendChild(style);
}

function createAudioPreview(cellValue: string) {
  ensureAudioPreviewStyle();

  const audio = document.createElement('audio');
  audio.src = cellValue;
  audio.preload = 'auto';
  let released = false;

  const wrapper = document.createElement('div');
  wrapper.style.width = '80%';
  wrapper.style.maxWidth = '640px';
  wrapper.style.height = '54px';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.padding = '0 16px';
  wrapper.style.borderRadius = '27px';
  wrapper.style.background = '#F8FAFC';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '10px';
  wrapper.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.16)';

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.textContent = '▶';
  playButton.style.width = '34px';
  playButton.style.height = '34px';
  playButton.style.border = '1px solid #CBD5E1';
  playButton.style.borderRadius = '8px';
  playButton.style.background = '#EFF6FF';
  playButton.style.color = '#0F172A';
  playButton.style.cursor = 'pointer';
  playButton.style.flex = '0 0 auto';
  playButton.style.fontSize = '14px';

  const timeLabel = document.createElement('span');
  timeLabel.textContent = '0:00 / 0:00';
  timeLabel.style.color = '#0F172A';
  timeLabel.style.font = '14px sans-serif';
  timeLabel.style.whiteSpace = 'nowrap';

  const progress = document.createElement('input');
  progress.className = 'vtable-audio-preview-progress';
  progress.type = 'range';
  progress.min = '0';
  progress.max = '100';
  progress.value = '0';
  progress.step = '0.1';
  progress.style.flex = '1 1 auto';
  progress.style.height = '4px';
  progress.style.borderRadius = '999px';
  progress.style.outline = 'none';
  progress.style.cursor = 'pointer';
  progress.style.accentColor = '#2563EB';
  updateAudioProgressStyle(progress, 0);

  const updateProgress = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const currentTime = audio.currentTime || 0;
    const value = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
    progress.disabled = duration <= 0;
    progress.style.cursor = duration > 0 ? 'pointer' : 'default';
    progress.value = `${value}`;
    timeLabel.textContent = `${formatAudioTime(currentTime)} / ${formatAudioTime(duration)}`;
    updateAudioProgressStyle(progress, value);
  };

  playButton.addEventListener('click', e => {
    e.stopPropagation();
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(error => {
          if (released || error?.name === 'AbortError') {
            return;
          }
          playButton.textContent = '▶';
        });
      }
    } else {
      audio.pause();
    }
  });

  progress.addEventListener('click', e => {
    e.stopPropagation();
  });

  progress.addEventListener('input', () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const value = Number(progress.value);
    if (duration > 0) {
      audio.currentTime = (duration * value) / 100;
    }
    updateAudioProgressStyle(progress, value);
  });

  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('durationchange', updateProgress);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('play', () => {
    playButton.textContent = '❚❚';
  });
  audio.addEventListener('pause', () => {
    playButton.textContent = '▶';
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    playButton.textContent = '▶';
    updateProgress();
  });

  wrapper.appendChild(playButton);
  wrapper.appendChild(timeLabel);
  wrapper.appendChild(progress);
  wrapper.appendChild(audio);

  return {
    element: wrapper,
    destroy: () => {
      released = true;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
  };
}

function createMediaPreviewManager(table: BaseTableAPI): MediaPreviewManager {
  const manager: MediaPreviewManager = {
    closePreview: null,
    registered: false,
    close() {
      const closePreview = manager.closePreview;
      manager.closePreview = null;
      closePreview?.();
    },
    open(closePreview: () => void) {
      manager.close();
      manager.closePreview = closePreview;
    },
    release() {
      manager.close();
      manager.registered = false;
    },
    ensureRegistered() {
      if (manager.registered) {
        return;
      }
      table.addReleaseObj(manager);
      manager.registered = true;
    }
  };
  return manager;
}

function getMediaPreviewManager(table: BaseTableAPI): MediaPreviewManager {
  const tableWithManager = table as any;
  if (!tableWithManager[MEDIA_PREVIEW_MANAGER_KEY]) {
    tableWithManager[MEDIA_PREVIEW_MANAGER_KEY] = createMediaPreviewManager(table);
  }
  const manager = tableWithManager[MEDIA_PREVIEW_MANAGER_KEY] as MediaPreviewManager;
  manager.ensureRegistered();
  return manager;
}

export function bindMediaClick(table: BaseTableAPI): void {
  if (Env.mode === 'browser') {
    // table.hasMedia = false;
    getMediaPreviewManager(table);

    table.on(TABLE_EVENT_TYPE.CLICK_CELL, (e: MousePointerCellEvent) => {
      //如果目前是在某个icon上，如收起展开按钮 则不进行其他点击逻辑
      const { col, row } = e;

      if (e.target.type === 'image' && (e.target as any).role && (e.target as any).role.startsWith('icon')) {
        // click icon
        return;
      }

      const cellType = table.getCellType(col, row);
      const columnDefine = table.isHeader(col, row)
        ? table.getHeaderDefine(col, row)
        : table.getBodyColumnDefine(col, row);
      const cellValue = table.getCellValue(col, row);
      const cellOriginValue = table.getCellOriginValue(col, row);
      if (cellType === 'link') {
        let linkJump: boolean | undefined = getOrApply((columnDefine as LinkColumnDefine).linkJump, {
          col,
          row,
          table,
          value: cellValue,
          dataValue: cellOriginValue,
          cellHeaderPaths: undefined
        });
        linkJump = linkJump !== false;
        if (!linkJump) {
          return;
        }

        // 点击链接，打开相应页面
        const templateLink = (columnDefine as LinkColumnDefine).templateLink;
        let linkDetect = getOrApply((columnDefine as LinkColumnDefine).linkDetect, {
          col,
          row,
          table,
          value: cellValue,
          dataValue: cellOriginValue,
          cellHeaderPaths: undefined
        });
        linkDetect = linkDetect !== false;
        let url;
        if (templateLink) {
          // 如果有模板链接，使用模板
          const rowData = table.getCellOriginRecord(col, row);
          if (rowData && rowData.vtableMerge) {
            // group title
            return;
          }
          const data = Object.assign(
            {
              __value: cellValue,
              __dataValue: cellOriginValue,
              value: cellValue,
              dataValue: cellOriginValue
            },
            rowData
          );
          if (isFunction(templateLink)) {
            url = templateLink(data, col, row, table);
          } else {
            const re = /\{\s*(\S+?)\s*\}/g;
            url = templateLink.replace(re, (matchs: string, key: string) => {
              matchs;
              return (data as any)[key];
            });
          }
        } else if (!linkDetect) {
          url = cellValue;
        } else if (regUrl.test(cellValue)) {
          // 没有模板链接，使用单元格内的字符串
          url = cellValue;
        } else {
          return;
        }

        if (!url) {
          return;
        }

        const linkTarget = (columnDefine as LinkColumnDefine).linkTarget;
        const linkWindowFeatures = (columnDefine as LinkColumnDefine).linkWindowFeatures;
        window.open(url, linkTarget, linkWindowFeatures);
      } else if (cellType === 'image') {
        // 点击图片，打开放大图片
        const { clickToPreview } = columnDefine as IImageColumnBodyDefine;
        if (clickToPreview === false) {
          return;
        }
        const previewManager = getMediaPreviewManager(table);

        // 开启蒙版
        const overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = 'rgba(30, 30, 30, 0.4)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.overflow = 'hidden';
        overlay.style.zIndex = '9999';

        const closeOverlay = () => {
          if (overlay.parentNode) {
            document.body.removeChild(overlay);
          }
        };
        previewManager.open(closeOverlay);

        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            previewManager.close();
          }
        });
        // overlay.addEventListener('pointermove', (e) => {
        //   e.stopPropagation();
        //   e.preventDefault();
        // });
        // overlay.addEventListener('mousemove', (e) => {
        //   e.stopPropagation();
        //   e.preventDefault();
        // });
        // 创建图片
        const image = new Image();
        image.src = cellValue;
        image.style.maxWidth = '80%';
        image.style.maxHeight = '80%';
        image.style.backgroundColor = '#FFF';
        overlay.appendChild(image);

        document.body.appendChild(overlay);
      } else if (cellType === 'audio' || (cellType === 'video' && isAudioUrl(cellValue))) {
        // 点击音频，弹出播放窗口
        const { clickToPreview } = columnDefine as IAudioColumnBodyDefine;
        if (clickToPreview === false) {
          return;
        }
        const previewManager = getMediaPreviewManager(table);

        // 开启蒙版
        const overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = 'rgba(30, 30, 30, 0.4)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.overflow = 'hidden';
        overlay.style.zIndex = '9999';

        const audioPreview = createAudioPreview(cellValue);
        const closeOverlay = () => {
          audioPreview.destroy();
          if (overlay.parentNode) {
            document.body.removeChild(overlay);
          }
        };
        previewManager.open(closeOverlay);

        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            previewManager.close();
          }
        });

        // 创建音频
        overlay.appendChild(audioPreview.element);

        document.body.appendChild(overlay);
      } else if (cellType === 'video') {
        // 点击视频，弹出播放窗口
        const { clickToPreview } = columnDefine as IImageColumnBodyDefine;
        if (clickToPreview === false) {
          return;
        }
        const previewManager = getMediaPreviewManager(table);

        // 开启蒙版
        const overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = 'rgba(30, 30, 30, 0.4)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.overflow = 'hidden';
        overlay.style.zIndex = '9999';

        const video = document.createElement('video');
        video.src = cellValue;
        video.style.maxWidth = '80%';
        video.style.maxHeight = '80%';
        video.setAttribute('preload', 'auto');
        video.setAttribute('controls', 'true');

        const closeOverlay = () => {
          try {
            video.pause();
          } catch (err) {
            // ignore media cleanup errors
          }
          video.removeAttribute('src');
          try {
            video.load();
          } catch (err) {
            // ignore media cleanup errors
          }
          if (overlay.parentNode) {
            document.body.removeChild(overlay);
          }
        };
        previewManager.open(closeOverlay);

        overlay.appendChild(video);

        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            previewManager.close();
          }
        });

        document.body.appendChild(overlay);
      }
    });
  }
}
