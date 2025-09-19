import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
import { DataZoom, createStage } from '@visactor/vtable/es/vrender';
// import { debug } from 'console';
const CONTAINER_ID = 'vTable';

// 将 DataZoom 组件添加到现有的 Gantt stage 中

export function createTable() {
  // 创建适配独立 canvas 的 DataZoom
  const dataZoom = new DataZoom({
    start: 0.2,
    end: 0.5,
    position: {
      x: 0, // 在独立 canvas 中从原点开始
      y: 0
    },
    size: {
      width: 1000,
      height: 30
    },
    showDetail: false,
    delayTime: 10, // 减少延迟，更快响应
    backgroundChartStyle: {
      line: {
        visible: true,
        stroke: '#ddd'
      },
      area: {
        visible: true,
        fill: '#f5f5f5'
      }
    },
    startHandlerStyle: {
      fill: '#1976d2',
      size: 8
    },
    endHandlerStyle: {
      fill: '#1976d2',
      size: 8
    },
    middleHandlerStyle: {
      visible: true,
      background: {
        style: { fill: 'rgba(25,118,210,0.1)' }
      }
    }
  });

  // 获取 Gantt 视图边界的辅助函数 (Gantt → DataZoom)
  function getGanttViewBoundaries(ganttInstance: Gantt) {
    // 当前 Gantt 时间轴的水平滚动偏移量（单位：像素）
    const scrollLeft = ganttInstance.stateManager.scrollLeft;
    // 获取所有时间轴列的总宽度
    const totalWidth = ganttInstance.getAllDateColsWidth();
    // 获取 Gantt 表格的水平宽度（不包括左侧边框）
    const viewportWidth = ganttInstance.tableNoFrameWidth;

    const viewStartRatio = scrollLeft / totalWidth;
    const viewEndRatio = (scrollLeft + viewportWidth) / totalWidth;

    return {
      scrollLeft,
      totalWidth,
      viewportWidth,
      startRatio: Math.max(0, Math.min(1, viewStartRatio)),
      endRatio: Math.max(0, Math.min(1, viewEndRatio))
    };
  }

  // 计算 DataZoom 的合理范围限制
  function calculateDataZoomLimits(ganttInstance: Gantt) {
    const currentViewportWidth = ganttInstance.tableNoFrameWidth;
    const totalTimeRange = ganttInstance.parsedOptions._maxDateTime - ganttInstance.parsedOptions._minDateTime;

    // 获取 Gantt 的缩放限制
    let minTimePerPixel;
    let maxTimePerPixel;

    if (ganttInstance.zoomScaleManager) {
      // 使用 ZoomScaleManager 的全局限制
      minTimePerPixel = ganttInstance.zoomScaleManager.globalMinTimePerPixel;
      maxTimePerPixel = ganttInstance.zoomScaleManager.globalMaxTimePerPixel;
    } else {
      // 使用配置的限制
      minTimePerPixel = ganttInstance.parsedOptions.zoom?.minTimePerPixel ?? 1000;
      maxTimePerPixel = ganttInstance.parsedOptions.zoom?.maxTimePerPixel ?? 6000000;
    }

    // 计算对应的 DataZoom 范围限制
    // 最小范围：最大放大时，选中范围最小
    const minSelectedTimeRange = minTimePerPixel * currentViewportWidth;
    const minRangeRatio = minSelectedTimeRange / totalTimeRange;

    // 最大范围：最大缩小时，选中范围最大
    const maxSelectedTimeRange = maxTimePerPixel * currentViewportWidth;
    const maxRangeRatio = Math.min(1, maxSelectedTimeRange / totalTimeRange);

    console.log('🔒 DataZoom 范围限制计算:', {
      minTimePerPixel: minTimePerPixel.toFixed(0) + 'ms/px',
      maxTimePerPixel: maxTimePerPixel.toFixed(0) + 'ms/px',
      totalTimeRange: (totalTimeRange / (24 * 60 * 60 * 1000)).toFixed(1) + '天',
      minSelectedTimeRange: (minSelectedTimeRange / (24 * 60 * 60 * 1000)).toFixed(1) + '天',
      maxSelectedTimeRange: (maxSelectedTimeRange / (24 * 60 * 60 * 1000)).toFixed(1) + '天',
      minRangeRatio: (minRangeRatio * 100).toFixed(1) + '%',
      maxRangeRatio: (maxRangeRatio * 100).toFixed(1) + '%'
    });

    return {
      minRangeRatio,
      maxRangeRatio,
      minTimePerPixel,
      maxTimePerPixel
    };
  }

  // 从 DataZoom 范围反推 Gantt 视图状态的辅助函数 (DataZoom → Gantt)
  function applyDataZoomRangeToGantt(ganttInstance: Gantt, start: number, end: number) {
    console.log('🔄 DataZoom → Gantt 视图反推:', { start, end });

    // 检查输入值的有效性
    if (start === undefined || end === undefined || isNaN(start) || isNaN(end)) {
      console.error('❌ 无效的 start/end 值:', { start, end });
      return {
        success: false,
        actualStart: 0,
        actualEnd: 0,
        error: 'Invalid start/end values'
      };
    }

    // 获取 DataZoom 的合理范围限制
    const limits = calculateDataZoomLimits(ganttInstance);
    const originalRangeRatio = end - start;

    // 应用范围限制
    let adjustedStart = start;
    let adjustedEnd = end;
    let adjustedRangeRatio = originalRangeRatio;

    // 检查范围是否超出限制
    if (originalRangeRatio < limits.minRangeRatio) {
      console.warn('⚠️ DataZoom 范围过小，调整到最小限制');
      adjustedRangeRatio = limits.minRangeRatio;
      // 保持中心位置，调整范围
      const center = (start + end) / 2;
      adjustedStart = Math.max(0, center - adjustedRangeRatio / 2);
      adjustedEnd = Math.min(1, adjustedStart + adjustedRangeRatio);
      // 如果调整后超出边界，重新计算
      if (adjustedEnd > 1) {
        adjustedEnd = 1;
        adjustedStart = adjustedEnd - adjustedRangeRatio;
      }
    } else if (originalRangeRatio > limits.maxRangeRatio) {
      console.warn('⚠️ DataZoom 范围过大，调整到最大限制');
      adjustedRangeRatio = limits.maxRangeRatio;
      // 保持中心位置，调整范围
      const center = (start + end) / 2;
      adjustedStart = Math.max(0, center - adjustedRangeRatio / 2);
      adjustedEnd = Math.min(1, adjustedStart + adjustedRangeRatio);
      // 如果调整后超出边界，重新计算
      if (adjustedEnd > 1) {
        adjustedEnd = 1;
        adjustedStart = adjustedEnd - adjustedRangeRatio;
      }
    }

    console.log('🔧 范围限制应用:', {
      original: {
        start: (start * 100).toFixed(1) + '%',
        end: (end * 100).toFixed(1) + '%',
        range: (originalRangeRatio * 100).toFixed(1) + '%'
      },
      adjusted: {
        start: (adjustedStart * 100).toFixed(1) + '%',
        end: (adjustedEnd * 100).toFixed(1) + '%',
        range: (adjustedRangeRatio * 100).toFixed(1) + '%'
      },
      limits: {
        min: (limits.minRangeRatio * 100).toFixed(1) + '%',
        max: (limits.maxRangeRatio * 100).toFixed(1) + '%'
      },
      wasAdjusted: adjustedStart !== start || adjustedEnd !== end
    });

    // 如果范围被调整了，更新 DataZoom 显示
    if (adjustedStart !== start || adjustedEnd !== end) {
      console.log('🔄 更新 DataZoom 显示到调整后的范围');

      // 暂时禁用事件处理，防止循环触发
      isUpdatingFromDataZoom = true;

      setTimeout(() => {
        dataZoom.setStartAndEnd(adjustedStart, adjustedEnd);

        // 延迟重新启用事件处理
        setTimeout(() => {
          isUpdatingFromDataZoom = false;
        }, 100);
      }, 50);

      // 直接返回，不继续处理原始的超限值
      return {
        success: true,
        actualStart: adjustedStart,
        actualEnd: adjustedEnd,
        wasAdjusted: true,
        adjustedStart,
        adjustedEnd
      };
    }

    // 1. 获取当前 Gantt 的基础信息
    const currentTotalWidth = ganttInstance.getAllDateColsWidth();
    const currentViewportWidth = ganttInstance.tableNoFrameWidth;
    const currentTimePerPixel = ganttInstance.getCurrentTimePerPixel();

    console.log('📊 当前 Gantt 状态:', {
      totalWidth: currentTotalWidth.toFixed(0) + 'px',
      viewportWidth: currentViewportWidth.toFixed(0) + 'px',
      timePerPixel: currentTimePerPixel.toFixed(0) + 'ms/px'
    });

    // 2. 使用调整后的范围进行计算
    const rangeRatio = adjustedRangeRatio; // 使用调整后的范围比例

    console.log('🎯 DataZoom 范围分析:', {
      start: (adjustedStart * 100).toFixed(1) + '%',
      end: (adjustedEnd * 100).toFixed(1) + '%',
      rangeRatio: (rangeRatio * 100).toFixed(1) + '%',
      meaning: rangeRatio < 0.5 ? '需要放大' : rangeRatio > 0.8 ? '需要缩小' : '范围适中'
    });

    // 3. 根据 DataZoom 范围计算目标 timePerPixel
    // 原理：DataZoom 选中的时间范围应该填满整个视图宽度
    const totalTimeRange = ganttInstance.parsedOptions._maxDateTime - ganttInstance.parsedOptions._minDateTime;
    const selectedTimeRange = totalTimeRange * rangeRatio;
    const targetTimePerPixel = selectedTimeRange / currentViewportWidth;

    console.log('🔍 缩放级别计算:', {
      totalTimeRange: (totalTimeRange / (24 * 60 * 60 * 1000)).toFixed(1) + '天',
      selectedTimeRange: (selectedTimeRange / (24 * 60 * 60 * 1000)).toFixed(1) + '天',
      currentTimePerPixel: currentTimePerPixel.toFixed(0) + 'ms/px',
      targetTimePerPixel: targetTimePerPixel.toFixed(0) + 'ms/px',
      zoomChange: (targetTimePerPixel / currentTimePerPixel).toFixed(2) + 'x'
    });

    // 4. 应用新的 timePerPixel（这会触发重新渲染和级别切换）
    if (Math.abs(targetTimePerPixel - currentTimePerPixel) > currentTimePerPixel * 0.01) {
      console.log('📈 应用新的缩放级别...');

      // 使用 ZoomScaleManager 的智能缩放
      if (ganttInstance.zoomScaleManager) {
        const targetLevel = ganttInstance.zoomScaleManager.findOptimalLevel(targetTimePerPixel);
        const currentLevel = ganttInstance.zoomScaleManager.getCurrentLevel();

        if (targetLevel !== currentLevel) {
          console.log('🔄 切换缩放级别:', { from: currentLevel, to: targetLevel });
          ganttInstance.zoomScaleManager.switchToLevel(targetLevel);
        }

        ganttInstance.setTimePerPixel(targetTimePerPixel);
      } else {
        // 直接设置 timePerPixel
        ganttInstance.setTimePerPixel(targetTimePerPixel);
      }
    } else {
      console.log('⏭️ 缩放级别变化很小，跳过更新');
    }

    // 5. 重新计算滚动位置（基于新的 timePerPixel 和 totalWidth）
    const newTotalWidth = ganttInstance.getAllDateColsWidth();
    const targetScrollLeft = adjustedStart * newTotalWidth;

    console.log('📍 滚动位置计算:', {
      oldTotalWidth: currentTotalWidth.toFixed(0) + 'px',
      newTotalWidth: newTotalWidth.toFixed(0) + 'px',
      targetScrollLeft: targetScrollLeft.toFixed(0) + 'px',
      scrollRatio: (adjustedStart * 100).toFixed(1) + '%'
    });

    // 6. 应用滚动位置
    ganttInstance.stateManager.setScrollLeft(targetScrollLeft);

    // 7. 验证应用结果
    const newBoundaries = getGanttViewBoundaries(ganttInstance);
    console.log('✅ 应用结果验证:', {
      expectedStart: (adjustedStart * 100).toFixed(1) + '%',
      actualStart: (newBoundaries.startRatio * 100).toFixed(1) + '%',
      expectedEnd: (adjustedEnd * 100).toFixed(1) + '%',
      actualEnd: (newBoundaries.endRatio * 100).toFixed(1) + '%',
      startDiff: Math.abs(adjustedStart - newBoundaries.startRatio).toFixed(3),
      endDiff: Math.abs(adjustedEnd - newBoundaries.endRatio).toFixed(3)
    });

    return {
      success: Math.abs(adjustedStart - newBoundaries.startRatio) < 0.01,
      actualStart: newBoundaries.startRatio,
      actualEnd: newBoundaries.endRatio,
      wasAdjusted: adjustedStart !== start || adjustedEnd !== end,
      adjustedStart,
      adjustedEnd
    };
  }

  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-04',
      end: '2024-07-14',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-05',
      end: '2024-07-05',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/08',
      end: '2024/07/14',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-14',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/14/2024',
      end: '07/24/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-10',
      end: '2024-07-14',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-30',
      end: '2024-08-14',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/24',
      end: '2024/08/04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-04',
      end: '2024-08-04',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/24/2024',
      end: '08/04/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    }
  ];

  const columns = [
    // {
    //   field: 'id',
    //   title: 'ID',
    //   width: 80,
    //   sort: true
    // },
    {
      field: 'title',
      title: 'title',
      width: 200,
      sort: true
    },
    {
      field: 'start',
      title: 'start',
      width: 150,
      sort: true
    },
    {
      field: 'end',
      title: 'end',
      width: 150,
      sort: true
    },
    {
      field: 'priority',
      title: 'priority',
      width: 100,
      sort: true
    },

    {
      field: 'progress',
      title: 'progress',
      width: 200,
      sort: true
    }
  ];
  const option: GanttConstructorOptions = {
    records: [],
    taskListTable: {
      columns: columns,
      tableWidth: 100,
      minTableWidth: 100,
      maxTableWidth: 600
    },
    dependency: {
      links: [
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 2
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToFinish,
          linkedFromTaskKey: 2,
          linkedToTaskKey: 3
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 3,
          linkedToTaskKey: 4
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToFinish,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 5
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToFinish,
          linkedFromTaskKey: 5,
          linkedToTaskKey: 2
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 52,
          linkedToTaskKey: 1
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 53,
          linkedToTaskKey: 3
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToFinish,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 54
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 5
        }
      ],
      // linkLineSelectable: false,
      linkSelectedLineStyle: {
        shadowBlur: 5, //阴影宽度
        shadowColor: 'red',
        lineColor: 'red',
        lineWidth: 1
      },
      linkCreatable: true
    },
    frame: {
      verticalSplitLineMoveable: true,
      outerFrameStyle: {
        borderLineWidth: 2,
        borderColor: 'red',
        cornerRadius: 8
      },
      verticalSplitLine: {
        lineWidth: 3,
        lineColor: '#e1e4e8'
      },
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 3
      }
    },
    grid: {
      // backgroundColor: 'gray',
      weekendBackgroundColor: 'yellow',
      verticalLine(args) {
        const dateIndex = args.date?.getDate();
        if (dateIndex === 20) {
          return {
            lineWidth: 1,
            lineColor: '#e1e4e8'
          };
        }
        return {
          lineWidth: 1,
          lineColor: 'red'
        };
      },
      verticalLineDependenceOnTimeScale: 'week',
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
      // weekendBackgroundColor: 'rgba(0,100,0,0.3)',
      // verticalBackgroundColor: ['#fbfbfc', '#fbfbf0', '#fbfbe0'] // args => (args.index % 2 === 0 ? '#fbfbfc' : '#fbfbf0')
      // rowBackgroundColor: ['rgba(33,44,255,0.2)', '#fbfbf0', '#fbfbe0'] //args => (args.index % 2 === 0 ? '#fbfbfc' : '#fbfbf0')
    },
    headerRowHeight: 60,
    rowHeight: 40,
    // ZoomScale 多级别缩放配置
    zoomScale: {
      enabled: true,
      levels: [
        // 级别0：月-周组合 (最粗糙)
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          }
        ],
        // 级别1：月-日组合
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 4,
            format: date => date.startDate.getDate().toString()
          }
        ],
        // 级别2：月-周-日组合
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 1,
            format: date => date.startDate.getDate().toString()
          }
        ],
        // 级别3：周-日-小时组合 (12小时)
        [
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 12,
            format: date => {
              const startHour = date.startDate.getHours();
              const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
              return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
            }
          }
        ],
        // 级别4：日-小时组合 (6小时)
        [
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 6,
            format: date => {
              const startHour = date.startDate.getHours();
              const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
              return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
            }
          }
        ],
        // 级别5：日-小时组合 (1小时)
        [
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 1,
            format: date => {
              const hour = date.startDate.getHours();
              return `${hour.toString().padStart(2, '0')}:00`;
            }
          }
        ]
      ]
    },
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress',
      labelText: '{title} {progress}%',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 16,
        textAlign: 'left'
      },
      barStyle(args) {
        if (args.taskRecord.title === 'Scope') {
          return {
            width: 30,
            /** 任务条的颜色 */
            barColor: 'red',
            /** 已完成部分任务条的颜色 */
            completedBarColor: '#91e8e0',
            /** 任务条的圆角 */
            cornerRadius: 10
          };
        }
        return {
          width: 20,
          /** 任务条的颜色 */
          barColor: '#ee8800',
          /** 已完成部分任务条的颜色 */
          completedBarColor: '#91e8e0',
          /** 任务条的圆角 */
          cornerRadius: 10
        };
      },
      selectedBarStyle: {
        shadowBlur: 5, //阴影宽度
        shadowOffsetX: 0, //x方向偏移
        shadowOffsetY: 0, //Y方向偏移
        shadowColor: 'black', //阴影颜色
        borderColor: 'red', //边框颜色
        borderLineWidth: 1 //边框宽度
      }
    },
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 60,
      scales: [
        {
          unit: 'month',
          step: 1
        },
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'sunday',
          format(date) {
            return `Week ${date.dateIndex}`;
          },

          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red'
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date) {
            return date.dateIndex.toString();
          },

          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red'
          }
        }
        // {
        //   unit: 'quarter',
        //   step: 1,
        //   format(date: TYPES.DateFormatArgumentType) {
        //     return '第' + date.index + '季度';
        //   }
        // }
      ]
    },
    // minDate: '2024-07-01',
    // maxDate: '2024-10-15',
    // markLine: [
    //   {
    //     date: '2024-07-17',
    //     style: {
    //       lineWidth: 1,
    //       lineColor: 'blue',
    //       lineDash: [8, 4]
    //     }
    //   },
    //   {
    //     date: '2024-08-17',
    //     position: 'middle',
    //     // scrollToMarkLine: true,
    //     style: {
    //       lineWidth: 2,
    //       lineColor: 'red',
    //       lineDash: [8, 4]
    //     }
    //   }
    // ],
    rowSeriesNumber: {
      title: '行号',
      dragOrder: true,
      headerStyle: {
        bgColor: '#EEF1F5',

        borderColor: '#e1e4e8'
      },
      style: {
        bgColor: 'gray',
        color: '#FFF',
        fontSize: 14
      }
    },
    scrollStyle: {
      visible: 'always'
    },
    eventOptions: {
      preventDefaultContextMenu: false
    },
    overscrollBehavior: 'none'
  };
  // columns:[
  //   {
  //     title:'2024-07',
  //     columns:[
  //       {
  //         title:'01'
  //       },
  //       {
  //         title:'02'
  //       },
  //       ...
  //     ]
  //   },
  //   ...
  // ]
  // 为 DataZoom 设置模拟预览数据
  // 创建 canvas 元素用于 DataZoom
  // VRender 的 DataZoom 组件需要一个 Stage 来渲染
  // Stage 必须绑定到一个 Canvas 元素上
  let dataZoomCanvas = document.getElementById('dataZoomCanvas') as HTMLCanvasElement;
  if (!dataZoomCanvas) {
    dataZoomCanvas = document.createElement('canvas');
    dataZoomCanvas.id = 'dataZoomCanvas';
    dataZoomCanvas.style.position = 'fixed';
    dataZoomCanvas.style.bottom = '0px';
    dataZoomCanvas.style.left = '50%';
    dataZoomCanvas.style.transform = 'translateX(-50%)';
    dataZoomCanvas.style.zIndex = '1000';
    dataZoomCanvas.style.background = 'white';
    document.body.appendChild(dataZoomCanvas);
  }

  // 创建刚好适配 DataZoom 大小的 stage
  const stage = createStage({
    canvas: dataZoomCanvas,
    width: 1000, // 和 DataZoom 宽度一致
    height: 30, // 和 DataZoom 高度一致
    autoRender: true,
    background: 'rgba(255,255,255,1)'
  });

  // 调整 DataZoom 位置到 stage 的原点
  dataZoom.setAttributes({
    position: { x: 0, y: 0 } // 在 stage 内的位置从原点开始
  });

  // 添加 DataZoom 到 stage（使用类型断言解决类型不匹配问题）
  stage.defaultLayer.add(dataZoom as any);
  stage.render();

  console.log('✅ DataZoom 已添加到独立 stage');
  console.log('🔍 DataZoom 配置:', {
    position: dataZoom.attribute.position,
    size: dataZoom.attribute.size,
    visible: dataZoom.attribute.visible
  });
  console.log('🔍 Canvas 信息:', {
    width: dataZoomCanvas.width,
    height: dataZoomCanvas.height,
    style: dataZoomCanvas.style.cssText
  });

  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  (window as any).ganttInstance = ganttInstance;
  ganttInstance.setRecords(records);

  // 设置双向绑定标志，防止无限循环
  let isUpdatingFromDataZoom = false;
  let isUpdatingFromGantt = false;

  // 1. DataZoom 变化时反推到 Gantt 视图状态
  dataZoom.addEventListener('change', (event: any) => {
    if (isUpdatingFromGantt) {
      return;
    } // 防止循环更新

    isUpdatingFromDataZoom = true;

    // 先调试事件对象的结构
    console.log('🔍 DataZoom 事件对象调试:', event);
    console.log('🔍 事件对象属性:', Object.keys(event));

    // 尝试不同的属性访问方式
    let start = event.start ?? event.detail?.start ?? event.currentTarget?.attribute?.start;
    let end = event.end ?? event.detail?.end ?? event.currentTarget?.attribute?.end;

    // 如果还是 undefined，尝试从 DataZoom 实例直接获取
    if (start === undefined || end === undefined) {
      console.log('⚠️ 从事件中获取 start/end 失败，尝试从 DataZoom 实例获取');
      start = dataZoom.attribute.start;
      end = dataZoom.attribute.end;
    }

    console.log('🎯 DataZoom 范围变化事件:', {
      start: start !== undefined ? (start * 100).toFixed(1) + '%' : 'undefined',
      end: end !== undefined ? (end * 100).toFixed(1) + '%' : 'undefined',
      range: start !== undefined && end !== undefined ? ((end - start) * 100).toFixed(1) + '%' : 'undefined',
      tag: event.tag || event.type || 'unknown'
    });

    // 如果获取不到有效的 start/end 值，跳过处理
    if (start === undefined || end === undefined || isNaN(start) || isNaN(end)) {
      console.error('❌ 跳过处理：无效的 start/end 值');
      setTimeout(() => {
        isUpdatingFromDataZoom = false;
      }, 50);
      return;
    }

    // 使用反推函数应用到 Gantt 视图
    const result = applyDataZoomRangeToGantt(ganttInstance, start, end);

    if (result.success) {
      console.log('✅ DataZoom → Gantt 视图同步成功');
    } else if (result.error) {
      console.error('❌ DataZoom → Gantt 视图同步失败:', result.error);
    } else {
      console.warn('⚠️ DataZoom → Gantt 视图同步存在误差:', {
        expectedStart: (start * 100).toFixed(1) + '%',
        actualStart: (result.actualStart * 100).toFixed(1) + '%',
        expectedEnd: (end * 100).toFixed(1) + '%',
        actualEnd: (result.actualEnd * 100).toFixed(1) + '%'
      });
    }

    setTimeout(() => {
      isUpdatingFromDataZoom = false;
    }, 50);
  });

  // 2. Gantt 滚动时更新 DataZoom 范围
  ganttInstance.addEventListener('scroll', (event: any) => {
    if (isUpdatingFromDataZoom) {
      return;
    } // 防止循环更新
    if (event.scrollDirection !== 'horizontal') {
      return;
    } // 只处理水平滚动

    isUpdatingFromGantt = true;

    const boundaries = getGanttViewBoundaries(ganttInstance);

    console.log('🔄 Gantt 滚动变化:', {
      scrollLeft: boundaries.scrollLeft.toFixed(0) + 'px',
      startRatio: (boundaries.startRatio * 100).toFixed(1) + '%',
      endRatio: (boundaries.endRatio * 100).toFixed(1) + '%'
    });

    // 更新 DataZoom 的范围
    dataZoom.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);

    setTimeout(() => {
      isUpdatingFromGantt = false;
    }, 10);
  });

  // 3. 初始化时同步 DataZoom 和 Gantt 的位置
  setTimeout(() => {
    const boundaries = getGanttViewBoundaries(ganttInstance);
    console.log('🔄 初始化同步:', boundaries);

    // 如果 Gantt 有初始滚动位置，同步到 DataZoom
    if (boundaries.startRatio > 0 || boundaries.endRatio < 1) {
      dataZoom.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
    }
  }, 100);

  // 创建缩放控制按钮（不传入 dataZoom，保持原有功能不变）
  const zoomControlsContainer = createZoomControls(ganttInstance);

  const cleanup = () => {
    if (zoomControlsContainer && zoomControlsContainer.parentNode) {
      zoomControlsContainer.parentNode.removeChild(zoomControlsContainer);
    }
    // 清理 DataZoom canvas
    const dataZoomCanvas = document.getElementById('dataZoomCanvas');
    if (dataZoomCanvas && dataZoomCanvas.parentNode) {
      dataZoomCanvas.parentNode.removeChild(dataZoomCanvas);
    }
  };

  window.addEventListener('beforeunload', cleanup);

  const originalRelease = ganttInstance.release.bind(ganttInstance);
  ganttInstance.release = function () {
    cleanup();
    window.removeEventListener('beforeunload', cleanup);
    originalRelease();
  };

  ganttInstance.on('scroll', e => {
    console.log('scroll', e);
  });
  ganttInstance.on('zoom', args => {
    console.log('缩放事件:', args);

    // 获取当前时间单位信息
    const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
    console.log('当前时间单位:', {
      unit: scale?.unit,
      step: scale?.step,
      timelineColWidth: ganttInstance.parsedOptions.timelineColWidth.toFixed(1)
    });
  });
  ganttInstance.on('change_date_range', e => {
    console.log('change_date_range', e);
  });
  ganttInstance.on('mouseenter_task_bar', e => {
    console.log('mouseenter_taskbar', e);
  });
  ganttInstance.on('mouseleave_task_bar', e => {
    console.log('mouseleave_taskbar', e);
  });
  ganttInstance.on('click_task_bar', e => {
    console.log('click_task_bar', e);
  });
  ganttInstance.on('contextmenu_task_bar', e => {
    console.log('contextmenu_task_bar', e);
  });
  ganttInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  ganttInstance.taskListTableInstance?.on('change_header_position_start', e => {
    console.log('change_header_position_start ', e);
  });
  ganttInstance.taskListTableInstance?.on('changing_header_position', e => {
    console.log('changing_header_position ', e);
  });
  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}

/**
 * 创建缩放控制按钮
 */
function createZoomControls(ganttInstance: Gantt) {
  // 创建按钮容器
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'zoom-controls';
  controlsContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 8px;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: Arial, sans-serif;
    min-width: 180px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  // 创建标题
  const title = document.createElement('div');
  title.textContent = '缩放控制';
  title.style.cssText = `
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 8px;
    color: #333;
    text-align: center;
  `;
  controlsContainer.appendChild(title);

  // 创建按钮容器
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  `;

  // 放大10%按钮
  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = '放大10%';
  zoomInBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomInBtn.onmouseover = () => {
    zoomInBtn.style.background = '#45a049';
  };
  zoomInBtn.onmouseout = () => {
    zoomInBtn.style.background = '#4CAF50';
  };
  zoomInBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(10);
      updateStatusDisplay();
    } else {
      // eslint-disable-next-line no-console
      console.warn('ZoomScaleManager 未启用');
    }
  };

  // 缩小10%按钮
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.textContent = '缩小10%';
  zoomOutBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomOutBtn.onmouseover = () => {
    zoomOutBtn.style.background = '#da190b';
  };
  zoomOutBtn.onmouseout = () => {
    zoomOutBtn.style.background = '#f44336';
  };
  zoomOutBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(-10);
      updateStatusDisplay();
    } else {
      // eslint-disable-next-line no-console
      console.warn('ZoomScaleManager 未启用');
    }
  };

  buttonsContainer.appendChild(zoomInBtn);
  buttonsContainer.appendChild(zoomOutBtn);
  controlsContainer.appendChild(buttonsContainer);

  // 获取状态按钮
  const getStatusBtn = document.createElement('button');
  getStatusBtn.textContent = '获取缩放状态';
  getStatusBtn.style.cssText = `
    padding: 6px 8px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    margin-bottom: 8px;
    transition: background-color 0.2s;
  `;
  getStatusBtn.onmouseover = () => {
    getStatusBtn.style.background = '#0b7dda';
  };
  getStatusBtn.onmouseout = () => {
    getStatusBtn.style.background = '#2196F3';
  };
  getStatusBtn.onclick = () => {
    updateStatusDisplay();
    // eslint-disable-next-line no-console
    console.log('当前缩放状态已更新');
  };
  controlsContainer.appendChild(getStatusBtn);

  // 缩放级别选择区域
  if (ganttInstance.zoomScaleManager) {
    const levelSelectorContainer = document.createElement('div');
    levelSelectorContainer.style.cssText = `
      background: #f9f9f9;
      padding: 8px;
      border-radius: 3px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
    `;

    const levelTitle = document.createElement('div');
    levelTitle.textContent = '缩放级别选择:';
    levelTitle.style.cssText = `
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 6px;
      color: #333;
    `;
    levelSelectorContainer.appendChild(levelTitle);

    // 获取级别配置
    const levels = ganttInstance.zoomScaleManager.config.levels;

    const radioGroup = document.createElement('div');
    radioGroup.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px;
    `;

    levels.forEach((level, index) => {
      const minUnit = ganttInstance.zoomScaleManager?.findMinTimeUnit(level);

      const radioContainer = document.createElement('label');
      radioContainer.style.cssText = `
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 10px;
        padding: 1px 3px;
        border-radius: 2px;
        transition: background-color 0.2s;
      `;
      radioContainer.onmouseover = () => {
        radioContainer.style.backgroundColor = '#e8f4fd';
      };
      radioContainer.onmouseout = () => {
        radioContainer.style.backgroundColor = 'transparent';
      };

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'zoomLevel';
      radio.value = index.toString();
      radio.style.cssText = `
        margin-right: 4px;
        transform: scale(0.8);
      `;

      // 检查当前级别
      if (index === ganttInstance.zoomScaleManager?.getCurrentLevel()) {
        radio.checked = true;
      }

      radio.onchange = () => {
        if (radio.checked) {
          // 切换到对应级别的中间状态
          ganttInstance.zoomScaleManager?.setZoomPosition({
            levelNum: index
          });
          updateStatusDisplay();
        }
      };

      const label = document.createElement('span');
      label.textContent = `L${index}: ${minUnit?.unit}×${minUnit?.step}`;
      label.style.cssText = `
        color: #555;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      radioContainer.appendChild(radio);
      radioContainer.appendChild(label);
      radioGroup.appendChild(radioContainer);
    });

    levelSelectorContainer.appendChild(radioGroup);
    controlsContainer.appendChild(levelSelectorContainer);

    // 监听缩放事件，更新单选按钮状态
    ganttInstance.on('zoom', () => {
      const currentLevel = ganttInstance.zoomScaleManager?.getCurrentLevel();
      const radios = radioGroup.querySelectorAll('input[name="zoomLevel"]');
      radios.forEach((radio, index) => {
        (radio as HTMLInputElement).checked = index === currentLevel;
      });
    });
  }

  // 状态显示区域
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'zoom-status';
  statusDisplay.style.cssText = `
    background: #f5f5f5;
    padding: 8px;
    border-radius: 3px;
    font-size: 10px;
    line-height: 1.3;
    color: #666;
    border: 1px solid #ddd;
  `;
  controlsContainer.appendChild(statusDisplay);

  // 更新状态显示的函数
  function updateStatusDisplay() {
    const currentTimePerPixel = ganttInstance.getCurrentTimePerPixel();
    const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
    const zoomConfig = ganttInstance.parsedOptions.zoom;

    let zoomScaleInfo = '';
    if (ganttInstance.zoomScaleManager) {
      const state = ganttInstance.zoomScaleManager.getCurrentZoomState();
      const currentLevel = ganttInstance.zoomScaleManager.getCurrentLevel();
      zoomScaleInfo = `
        <strong>ZoomScale状态:</strong><br>
        • 当前级别: ${currentLevel}<br>
        • 最小单位: ${state?.minUnit} × ${state?.step}<br>
        • 列宽: ${state?.currentColWidth}px<br>
      `;
    }

    statusDisplay.innerHTML = `
      <strong>缩放状态:</strong><br>
      • TimePerPixel: ${currentTimePerPixel.toFixed(0)}<br>
      • 时间轴列宽: ${ganttInstance.parsedOptions.timelineColWidth.toFixed(1)}px<br>
      • 当前时间单位: ${scale?.unit} × ${scale?.step}<br>
      • 缩放范围: ${zoomConfig?.minTimePerPixel?.toFixed(0)} ~ ${zoomConfig?.maxTimePerPixel?.toFixed(0)}<br>
      ${zoomScaleInfo}
    `;
  }

  // 初始化状态显示
  updateStatusDisplay();

  // 监听缩放事件，自动更新状态
  ganttInstance.on('zoom', () => {
    updateStatusDisplay();
  });

  // 将控制面板添加到页面
  document.body.appendChild(controlsContainer);

  // 返回控制面板元素，便于后续操作
  return controlsContainer;
}
