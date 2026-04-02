import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

/**
 * 验证场景：列宽/行高调整过程中调用 setRecords 或 updateOption 时，
 * 调整指示线应被正确清除，不会残留在表格上。
 * 对应 issue: https://github.com/VisActor/VTable/issues/4120
 *
 * 复现步骤：
 * 1. 点击"自动定时刷新"按钮开启每3秒自动 setRecords
 * 2. 拖动列头边界开始调整列宽（鼠标按住不放）
 * 3. 等待自动刷新触发（或手动点击按钮）
 * 4. 修复前：指示线会卡在表格上无法消失
 * 5. 修复后：指示线在 setRecords/updateOption 调用时被正确清除
 */
export function createTable() {
  const generatePersons = (count: number) => {
    return Array.from(new Array(count)).map((_, i) => ({
      id: i + 1,
      name: `员工${i + 1}`,
      email: `user${i + 1}@example.com`,
      department: ['研发部', '市场部', '设计部', '产品部', '运营部'][i % 5],
      salary: Math.round(Math.random() * 10000 + 5000),
      city: ['北京', '上海', '广州', '深圳', '杭州'][i % 5]
    }));
  };

  let records = generatePersons(100);

  const columns: VTable.ColumnsDefine = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: '姓名', width: 120 },
    { field: 'email', title: '邮箱', width: 220 },
    { field: 'department', title: '部门', width: 120 },
    { field: 'salary', title: '薪资', width: 120 },
    { field: 'city', title: '城市', width: 120 }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    widthMode: 'standard',
    defaultRowHeight: 40,
    defaultHeaderRowHeight: 50,
    theme: VTable.themes.ARCO
  };

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'padding: 10px 0; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;';

  const tip = document.createElement('span');
  tip.style.cssText = 'color: #666; font-size: 13px;';
  tip.textContent = '操作：先拖动列边界调整列宽，拖动过程中点击下方按钮';
  btnContainer.appendChild(tip);

  const btnSetRecords = document.createElement('button');
  btnSetRecords.textContent = 'setRecords (刷新数据)';
  btnSetRecords.style.cssText =
    'padding: 6px 16px; cursor: pointer; background: #416EFF; color: #fff; border: none; border-radius: 4px;';
  btnSetRecords.addEventListener('click', () => {
    records = generatePersons(100);
    instance.setRecords(records);
    console.log('setRecords called');
  });
  btnContainer.appendChild(btnSetRecords);

  const btnUpdateOption = document.createElement('button');
  btnUpdateOption.textContent = 'updateOption (更新配置)';
  btnUpdateOption.style.cssText =
    'padding: 6px 16px; cursor: pointer; background: #52C41A; color: #fff; border: none; border-radius: 4px;';
  btnUpdateOption.addEventListener('click', () => {
    records = generatePersons(100);
    instance.updateOption({
      ...option,
      records
    });
    console.log('updateOption called');
  });
  btnContainer.appendChild(btnUpdateOption);

  let timer: any = null;
  const btnAutoTest = document.createElement('button');
  btnAutoTest.textContent = '自动定时刷新 (每3秒)';
  btnAutoTest.style.cssText =
    'padding: 6px 16px; cursor: pointer; background: #FA8C16; color: #fff; border: none; border-radius: 4px;';
  btnAutoTest.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      btnAutoTest.textContent = '自动定时刷新 (每3秒)';
      btnAutoTest.style.background = '#FA8C16';
    } else {
      timer = setInterval(() => {
        records = generatePersons(100);
        instance.setRecords(records);
        console.log('auto setRecords triggered');
      }, 3000);
      btnAutoTest.textContent = '停止自动刷新';
      btnAutoTest.style.background = '#FF4D4F';
    }
  });
  btnContainer.appendChild(btnAutoTest);

  document.getElementById(CONTAINER_ID)?.before(btnContainer);

  const instance = new ListTable(option);

  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  const originalRelease = instance.release.bind(instance);
  instance.release = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    btnContainer.remove();
    originalRelease();
  };

  (window as any).tableInstance = instance;
}
