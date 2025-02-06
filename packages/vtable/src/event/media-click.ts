import { isFunction } from '@visactor/vutils';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import { Env } from '../tools/env';
import { regUrl } from '../tools/global';
import type { LinkColumnDefine, MousePointerCellEvent } from '../ts-types';
import type { BaseTableAPI, HeaderData } from '../ts-types/base-table';
import type { IImageColumnBodyDefine } from '../ts-types/list-table/define/image-define';
import { getOrApply } from '../tools/helper';

export function bindMediaClick(table: BaseTableAPI): void {
  if (Env.mode === 'browser') {
    // table.hasMedia = false;

    table.on(TABLE_EVENT_TYPE.CLICK_CELL, (e: MousePointerCellEvent) => {
      //如果目前是在某个icon上，如收起展开按钮 则不进行其他点击逻辑
      const { col, row } = e;

      if (e.target.type === 'image' && (e.target as any).role && (e.target as any).role.startsWith('icon')) {
        // click icon
        return;
      }
      let cellType;
      if (table.internalProps.layoutMap.isHeader(col, row)) {
        cellType = table.isPivotTable()
          ? (table._getHeaderLayoutMap(col, row) as HeaderData).headerType
          : (table.getHeaderDefine(col, row) as HeaderData).headerType;
      } else {
        cellType = table.getBodyColumnType(col, row);
      }
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
              __dataValue: cellOriginValue
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

        // 开启蒙版
        const overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = 'rgba(30, 30, 30, 0.4)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.overflow = 'hidden';
        overlay.style.zIndex = '9999';

        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            document.body.removeChild(overlay);
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
        overlay.appendChild(image);

        document.body.appendChild(overlay);
      } else if (cellType === 'video') {
        // 点击视频，弹出播放窗口
        const { clickToPreview } = columnDefine as IImageColumnBodyDefine;
        if (clickToPreview === false) {
          return;
        }

        // 开启蒙版
        const overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.backgroundColor = 'rgba(30, 30, 30, 0.4)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.overflow = 'hidden';
        overlay.style.zIndex = '9999';

        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            document.body.removeChild(overlay);
          }
        });

        // 创建视频
        const video = document.createElement('video');
        video.src = cellValue;
        video.style.maxWidth = '80%';
        video.style.maxHeight = '80%';
        video.setAttribute('preload', 'auto');
        video.setAttribute('controls', 'true');
        overlay.appendChild(video);

        document.body.appendChild(overlay);
      }
    });
  }
}
