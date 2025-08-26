import * as VTableGantt from '@visactor/vtable-gantt';

// 甘特图导出配置项接口
export interface ExportOptions {
  fileName?: string;
  type?: 'png' | 'jpeg';
  quality?: number;
  backgroundColor?: string;
  scale?: number;
  download?: boolean;
}

/**
 * 甘特图导出插件
 * @description 提供完整的甘特图导出功能，支持高分辨率输出和精准布局保留
 */
export class ExportGanttPlugin implements VTableGantt.plugins.IGanttPlugin {
  id: string = `gantt-export-helper`;
  name = 'Gantt Export Helper';
  private _gantt: VTableGantt.Gantt | null = null;

  // run 方法，在插件初始化时由 PluginManager调用
  run(...args: any[]): void {
    const ganttInstance = args[0] as VTableGantt.Gantt;
    if (!ganttInstance) {
      console.error('ExportGanttPlugin: Gantt instance not provided to run method.');
      return;
    }
    this._gantt = ganttInstance;
  }
  /**
   * 执行甘特图导出操作
   * @async
   * @param {ExportOptions} [options={}] 导出配置选项
   * @returns {Promise<string | undefined>} 返回Base64格式的图片数据，或在未初始化时返回 undefined
   * @throws {Error} 导出过程中发生错误时抛出异常
   */
  async exportToImage(options: ExportOptions = {}): Promise<string | undefined> {
    if (!this._gantt) {
      // 保留这个 error
      console.error('ExportGanttPlugin: Gantt instance not available.');
      return undefined;
    }

    const {
      fileName = 'gantt-export',
      type = 'png',
      quality = 1,
      backgroundColor = '#ffffff',
      scale = window.devicePixelRatio || 1,
      download = true // 默认执行下载
    } = options;

    try {
      const { tempContainer, clonedGantt } = this.createFullSizeContainer(scale);

      try {
        await new Promise(resolve => requestAnimationFrame(resolve));

        const totalWidth =
          (clonedGantt.taskListTableInstance.getAllColsWidth() + clonedGantt.getAllDateColsWidth()) * scale;
        const totalHeight = clonedGantt.getAllRowsHeight() * scale;

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = totalWidth;
        exportCanvas.height = totalHeight;
        const ctx = exportCanvas.getContext('2d')!;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        if (clonedGantt.taskListTableInstance?.canvas) {
          ctx.drawImage(
            clonedGantt.taskListTableInstance.canvas,
            0,
            0,
            clonedGantt.taskListTableInstance.getAllColsWidth() * scale,
            totalHeight
          );
        }

        const splitLineWidth = 3 * scale;
        const splitLineX = clonedGantt.taskListTableInstance.getAllColsWidth() * scale;
        ctx.fillStyle = 'rgb(225, 228, 232)';
        ctx.fillRect(splitLineX - splitLineWidth / 2, 0, splitLineWidth, totalHeight);

        const sourceX = 4 * scale;
        const sourceWidth = clonedGantt.canvas.width - sourceX;

        if (clonedGantt.canvas) {
          ctx.drawImage(
            clonedGantt.canvas,
            sourceX,
            0,
            sourceWidth,
            clonedGantt.canvas.height,
            (clonedGantt.taskListTableInstance.getAllColsWidth() + 1.5) * scale,
            0,
            (clonedGantt.getAllDateColsWidth() - 1.5) * scale,
            totalHeight
          );
        }

        return this.finalizeExport(exportCanvas, fileName, type, quality, download);
      } finally {
        tempContainer.remove();
        // 确保克隆的甘特图实例被释放
        clonedGantt.release();
      }
    } catch (error) {
      console.error('[Gantt Export Plugin] Export failed:', error);
      throw new Error(`甘特图导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取甘特图的 Base64 图片数据，不触发下载
   * @async
   * @param {Omit<ExportOptions, 'download'>} [options={}] 导出配置选项（不包含 download 参数）
   * @returns {Promise<string | undefined>} 返回 Base64 格式的图片数据，或在未初始化时返回 undefined
   * @throws {Error} 导出过程中发生错误时抛出异常
   */
  async exportToBase64(options: Omit<ExportOptions, 'download'> = {}): Promise<string | undefined> {
    // 调用 exportToImage 方法，但设置 download 为 false
    return this.exportToImage({
      ...options,
      download: false
    });
  }

  private createFullSizeContainer(scale: number) {
    if (!this._gantt) {
      // 保留这个 error
      throw new Error('ExportGanttPlugin: Gantt instance not available to create container.');
    }

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.width = `${window.innerWidth + 100}px`;
    tempContainer.style.height = `${window.innerHeight + 100}px`;
    document.body.appendChild(tempContainer);

    const clonedContainer = document.createElement('div');

    const totalWidth = this._gantt.taskListTableInstance.getAllColsWidth() + this._gantt.getAllDateColsWidth();
    const totalHeight = this._gantt.getAllRowsHeight();

    clonedContainer.style.width = `${totalWidth}px`;
    clonedContainer.style.height = `${totalHeight}px`;
    tempContainer.appendChild(clonedContainer);

    const clonedGantt = new VTableGantt.Gantt(clonedContainer, {
      ...this._gantt.options,
      records: this._gantt.records,
      taskListTable: {
        ...this._gantt.options.taskListTable,
        tableWidth: undefined as unknown as number,
        minTableWidth: undefined as unknown as number,
        maxTableWidth: undefined as unknown as number
      },
      plugins: []
    });

    clonedGantt.setPixelRatio(scale);

    // 禁用裁剪
    if ((clonedGantt as any).scenegraph?.ganttGroup) {
      (clonedGantt as any).scenegraph.ganttGroup.setAttribute('clip', false);
    }
    if ((clonedGantt.taskListTableInstance as any)?.scenegraph?.tableGroup) {
      (clonedGantt.taskListTableInstance as any).scenegraph.tableGroup.setAttribute('clip', false);
    }

    clonedGantt.scenegraph.stage.render();

    return { tempContainer, clonedGantt };
  }
  private finalizeExport(
    canvas: HTMLCanvasElement,
    fileName: string,
    type: string,
    quality: number,
    download: boolean = true
  ): string {
    const base64 = canvas.toDataURL(`image/${type}`, quality);

    // 如果需要下载，则创建下载链接
    if (download) {
      const link = document.createElement('a');
      link.download = `${fileName}.${type}`;
      link.href = base64;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return base64;
  }

  release(): void {
    this._gantt = null;
  }
}
