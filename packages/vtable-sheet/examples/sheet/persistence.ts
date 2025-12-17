import { register } from '@visactor/vtable';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import type { IVTableSheetOptions } from '../../src/index';
import { VTableSheet } from '../../src/index';
const CONTAINER_ID = 'vTable';
/**
 * 简化版筛选状态持久化示例
 * 演示核心功能：保存和恢复筛选状态
 */

export function createTable() {
  // 尝试从本地存储加载保存的配置
  const loadSavedConfig = (): IVTableSheetOptions | null => {
    try {
      const saved = localStorage.getItem('vtable-simple-demo');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('加载配置失败:', error);
      return null;
    }
  };

  // 保存配置到本地存储
  const saveConfig = (vtableSheet: VTableSheet) => {
    try {
      const config = vtableSheet.saveToConfig();
      localStorage.setItem('vtable-simple-demo', JSON.stringify(config));
      console.log('配置已保存: ', config);
      updateStatus('已保存');
    } catch (error) {
      console.error('保存失败:', error);
      updateStatus('保存失败');
    }
  };

  // 更新状态显示
  const updateStatus = (message: string) => {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = `状态: ${message} (${new Date().toLocaleTimeString()})`;
    }
  };

  // 默认配置
  const defaultConfig: IVTableSheetOptions = {
    showFormulaBar: true,
    showSheetTab: true,
    defaultRowHeight: 25,
    defaultColWidth: 100,
    sheets: [
      {
        sheetKey: 'demo1',
        sheetTitle: '员工信息',
        filter: true, // 启用筛选
        columns: [
          { title: '姓名', filter: true, width: 100, sort: true },
          { title: '年龄', filter: true, width: 80, sort: true },
          { title: '部门', filter: true, width: 100, sort: true },
          { title: '薪资', filter: true, width: 100, sort: true }
        ],
        data: [
          ['张三', 28, '技术部', 8000],
          ['李四', 32, '市场部', 7000],
          ['王五', 25, '技术部', 9000],
          ['赵六', 30, '人事部', 6500],
          ['钱七', 27, '市场部', 7500],
          ['孙八', 35, '技术部', 12000],
          ['周九', 29, '人事部', 7200],
          ['吴十', 31, '市场部', 8500],
          [null, null, null, '李四'],
          [null, null, null, 15000],
          [null, null, null, 16000],
          [null, null, null, 15500],
          [null, null, null, 14000],
          [null, null, null, 19500]
        ],
        formulas: {
          D10: '=测试数据!D3',
          D11: '=SUM(D2:D3)',
          D12: '=SUM(D3:D4)',
          D13: '=SUM(D4:D5)',
          D14: '=SUM(D5:D6)',
          D15: '=SUM(D6:D7)'
        },
        active: true
      },
      {
        sheetKey: 'demo2',
        sheetTitle: '测试数据',
        filter: true,
        columns: [
          { title: '项目', width: 120 },
          { title: '状态', width: 80 },
          { title: '优先级', width: 80 },
          { title: '负责人', width: 100 }
        ],
        data: [
          ['网站重构', '进行中', '高', '张三'],
          ['移动端开发', '已完成', '中', '李四'],
          ['数据分析', '待开始', '低', '王五'],
          ['用户体验优化', '进行中', '高', '赵六'],
          ['性能优化', '已完成', '中', '钱七']
        ],
        active: false
      }
    ]
  };

  // 使用保存的配置或默认配置
  const savedConfig = loadSavedConfig();
  const config = savedConfig || defaultConfig;

  console.log(savedConfig ? '使用保存的配置' : '使用默认配置');

  // 创建 VTableSheet 实例
  const sheetInstance = new VTableSheet(document.getElementById(CONTAINER_ID)!, config);

  // 创建简单的控制按钮
  const createControls = () => {
    // 清理已存在的控制面板，避免重复创建
    const existingControls = document.getElementById('simple-controls');
    if (existingControls) {
      existingControls.remove();
      console.log('清理已存在的控制面板');
    }

    const controlsHtml = `
      <div id="simple-controls" style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        z-index: 1000;
        min-width: 200px;
      ">
        <h4 style="margin: 0 0 12px 0; color: #333;">控制面板</h4>

        <button id="save-btn" style="
          width: 100%;
          margin: 4px 0;
          padding: 8px 12px;
          border: 1px solid #007bff;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        ">手动保存</button>

        <button id="reload-btn" style="
          width: 100%;
          margin: 4px 0;
          padding: 8px 12px;
          border: 1px solid #28a745;
          background: #28a745;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        ">重新加载</button>

        <button id="clear-btn" style="
          width: 100%;
          margin: 4px 0;
          padding: 8px 12px;
          border: 1px solid #dc3545;
          background: #dc3545;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        ">清除数据</button>

        <div id="status" style="
          margin-top: 12px;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        ">状态: 已加载</div>

        <div style="
          margin-top: 12px;
          padding: 8px;
          background: #e7f3ff;
          border-radius: 4px;
          font-size: 11px;
          color: #0066cc;
        ">
          设置筛选后点击保存，然后重新加载验证效果
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', controlsHtml);

    // 绑定事件
    document.getElementById('save-btn')?.addEventListener('click', () => {
      saveConfig(sheetInstance);
    });

    document.getElementById('reload-btn')?.addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('clear-btn')?.addEventListener('click', () => {
      localStorage.removeItem('vtable-simple-demo');
      updateStatus('数据已清除');
    });
  };

  // 创建控制面板
  createControls();

  // 监听 demo 切换，自动销毁控制面板
  const setupAutoDestroy = () => {
    // 监听侧边栏点击事件
    const sidebar = document.querySelector('#sidebar');
    if (sidebar) {
      const handleSidebarClick = (event: Event) => {
        const target = event.target as HTMLElement;
        if (target && target.classList.contains('menu-item') && !target.classList.contains('menu-title')) {
          const demoName = target.dataset.name;
          // 如果切换到其他 demo，销毁控制面板
          if (demoName && demoName !== 'persistence') {
            setTimeout(() => {
              const controlsToRemove = document.getElementById('simple-controls');
              if (controlsToRemove) {
                controlsToRemove.remove();
                console.log('切换到', demoName, '，已自动销毁 persistence 控制面板');
              }
            }, 100); // 延迟一点确保切换完成
          }
        }
      };

      sidebar.addEventListener('click', handleSidebarClick);
      console.log('已设置 persistence 控制面板自动销毁监听');
    }
  };

  // 延迟设置监听，确保 DOM 完全加载
  setTimeout(setupAutoDestroy, 100);

  window.sheetInstance = sheetInstance;

  return sheetInstance;
}
