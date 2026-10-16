/**
 * BugServer case IDs: 67b823fc88790a00ae624ae3, 67b829a64d4ded00b2f12762
 * 验证目的：开关与按钮列同时覆盖普通、默认选中和禁用视觉状态。
 * 改写：合并两个使用相同记录结构的示例，保留各自的核心列配置。
 */
export default {
  mount(container) {
    // 保留对象值开关和列级 checked/disable 两类来源条件。
    return new window.VTable.ListTable(container, {
      columns: [
        { field: 'value', title: 'Value', width: 100 },
        { field: 'switch', title: 'Switch', width: 110, cellType: 'switch', checkedText: 'on', uncheckedText: 'off' },
        { field: 'switch1', title: 'Checked', width: 110, cellType: 'switch', checked: true, checkedText: 'on', uncheckedText: 'off' },
        { field: 'switch2', title: 'Disabled', width: 110, cellType: 'switch', checked: true, disable: true },
        { field: 'button', title: 'Button', width: 110, cellType: 'button', text: 'click' },
        { field: 'button', title: 'Disabled button', width: 130, cellType: 'button', disable: true, text: 'click' }
      ],
      records: [
        { value: 20 }, { value: 18 }, { value: 12, switch: { checked: true, disable: true } },
        { value: 10 }, { value: -10 }
      ],
      widthMode: 'standard', defaultRowHeight: 80, heightMode: 'autoHeight'
    });
  },
  async verify(page) {
    // 验证渲染类型和来源对象的选中状态，其他外观由截图比较。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.getCellType(1, 3) !== 'switch' || table.getCellType(4, 3) !== 'button')
        throw new Error('开关或按钮列类型错误');
      if (table.getCellSwitchState(1, 3) !== true) throw new Error('开关状态错误');
    });
  }
};
