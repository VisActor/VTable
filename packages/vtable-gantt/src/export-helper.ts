import { Gantt } from './Gantt';

/**
 * 甘特图导出配置项接口
 * @property {string} [fileName] 导出文件名（默认'gantt-export'）
 * @property {'png'|'jpeg'} [type] 图片格式类型（默认'png'）
 * @property {number} [quality] 图片质量（0-1，仅JPEG有效）
 * @property {string} [backgroundColor] 画布背景色（默认'#ffffff'）
 * @property {number} [scale] 输出缩放比例（默认设备像素比）
 */
export interface ExportOptions {
  fileName?: string;
  type?: 'png' | 'jpeg';
  quality?: number;
  backgroundColor?: string;
  scale?: number;
}

/**
 * 甘特图导出工具类
 * @description 提供完整的甘特图导出功能，支持高分辨率输出和精准布局保留
 */
export class GanttExportHelper {
  /**
   * 构造函数
   * @param {Gantt} gantt 要导出的甘特图实例
   */
  constructor(private gantt: Gantt) {}

  /**
   * 执行甘特图导出操作
   * @async
   * @param {ExportOptions} [options={}] 导出配置选项
   * @returns {Promise<string>} 返回Base64格式的图片数据
   * @throws {Error} 导出过程中发生错误时抛出异常
   * 
   * @example
   * const exporter = new GanttExportHelper(myGantt);
   * await exporter.exportToImage({
   *   fileName: 'project-plan',
   *   type: 'png',
   *   scale: 2
   * });
   */
  public async exportToImage(options: ExportOptions = {}): Promise<string> {
    // 解构配置参数并设置默认值
    const {
      fileName = 'gantt-export',
      type = 'png',
      quality = 1,
      backgroundColor = '#ffffff',
      scale = window.devicePixelRatio || 1
    } = options;

    try {
      // 创建临时渲染容器和克隆的甘特图实例
      const { tempContainer, clonedGantt } = this.createFullSizeContainer(scale);

      try {
        // 等待下一帧渲染确保内容绘制完成
        await new Promise(resolve => requestAnimationFrame(resolve));

        // =============== 核心渲染逻辑 ===============
        // 计算导出画布总尺寸（包含缩放系数）
        const totalWidth = (clonedGantt.taskListTableInstance.getAllColsWidth() + clonedGantt.getAllDateColsWidth()) * scale;
        const totalHeight = clonedGantt.getAllRowsHeight() * scale;

        // 创建导出画布
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = totalWidth;
        exportCanvas.height = totalHeight;
        const ctx = exportCanvas.getContext('2d')!;

        // 绘制纯色背景
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // =============== 左侧任务列表绘制 ===============
        if (clonedGantt.taskListTableInstance) {
          ctx.drawImage(
            clonedGantt.taskListTableInstance.canvas,
            0, 0,  // 起始坐标
            clonedGantt.taskListTableInstance.getAllColsWidth() * scale,  // 缩放后宽度
            totalHeight  // 完整高度
          );
        }

        // =============== 垂直分割线绘制 ===============
        const splitLineWidth = 3 * scale;  // 物理像素宽度计算
        const splitLineX = clonedGantt.taskListTableInstance.getAllColsWidth() * scale;
        ctx.fillStyle = 'rgb(225, 228, 232)';  // 标准分割线颜色
        ctx.fillRect(
          splitLineX - splitLineWidth / 2,  // 居中定位计算
          0,
          splitLineWidth,  // 实际线宽
          totalHeight
        );

        // =============== 右侧甘特图绘制 ===============
        const sourceX = 4 * scale;  // 源图像裁剪起始点（跳过3逻辑像素）
        const sourceWidth = clonedGantt.canvas.width - sourceX;
        
        ctx.drawImage(
          clonedGantt.canvas,  // 源图像
          sourceX, 0,  // 源图像裁剪起始点
          sourceWidth, clonedGantt.canvas.height,  // 裁剪区域尺寸
          (clonedGantt.taskListTableInstance.getAllColsWidth() + 1.5) * scale, 0,  // 目标绘制位置（向右偏移3物理像素）
          (clonedGantt.getAllDateColsWidth() - 1.5) * scale,  // 目标宽度调整
          totalHeight
        );

        return this.finalizeExport(exportCanvas, fileName, type, quality);
      } finally {
        // 清理临时容器
        tempContainer.remove();
      }
    } catch (error) {
      console.error('[Gantt Export] 导出失败:', error);
      throw new Error(`甘特图导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 创建全尺寸临时容器
   * @private
   * @param {number} scale 缩放比例
   * @returns {Object} 包含临时容器和克隆甘特图实例的对象
   */
  private createFullSizeContainer(scale: number) {
    // 创建离屏临时容器
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';  // 移出可视区域
    tempContainer.style.overflow = 'hidden';
    document.body.appendChild(tempContainer);

    // 克隆原始容器节点
    const clonedContainer = this.gantt.container.cloneNode(true) as HTMLElement;
    
    // 计算容器精确尺寸
    const totalWidth = this.gantt.taskListTableInstance.getAllColsWidth() + this.gantt.getAllDateColsWidth();
    const totalHeight = this.gantt.getAllRowsHeight();
    
    // 设置克隆容器尺寸
    clonedContainer.style.width = `${totalWidth}px`;
    clonedContainer.style.height = `${totalHeight}px`;
    tempContainer.appendChild(clonedContainer);

    // 创建克隆甘特图实例（忽略宽度限制）
    const clonedGantt = new Gantt(clonedContainer, {
      ...this.gantt.options,
      taskListTable: {
        ...this.gantt.options.taskListTable,
        tableWidth: undefined as unknown as number,  // 强制类型转换以清除宽度限制
        minTableWidth: undefined as unknown as number,
        maxTableWidth: undefined as unknown as number
      },
      records: JSON.parse(JSON.stringify(this.gantt.records))  // 深度克隆数据
    });

    // 配置渲染参数
    clonedGantt.setPixelRatio(scale);  // 设置像素比
    clonedGantt.scenegraph.ganttGroup.setAttribute('clip', false);  // 禁用裁剪
    clonedGantt.scenegraph.stage.render();  // 立即渲染

    return { tempContainer, clonedGantt };
  }

  /**
   * 完成导出操作
   * @private
   * @param {HTMLCanvasElement} canvas 渲染完成的画布元素
   * @param {string} fileName 导出文件名
   * @param {string} type 图片类型
   * @param {number} quality 图片质量
   * @returns {string} Base64格式的图片数据
   */
  private finalizeExport(canvas: HTMLCanvasElement, fileName: string, type: string, quality: number) {
    const base64 = canvas.toDataURL(`image/${type}`, quality);
    const link = document.createElement('a');
    link.download = `${fileName}.${type}`;
    link.href = base64;
    document.body.appendChild(link);
    link.click();  // 触发下载
    document.body.removeChild(link);
    return base64;
  }
}