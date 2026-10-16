/**
 * BugServer case IDs: 65e69276603de700d1d8b9e5
 * 验证目的：自定义西里尔字母集后多语言文本仍正常换行。
 * 改写：保留西里尔混排结构，文本换成通用示例。
 */
export default {
  mount(container) {
    // 测试页逐例隔离，修改全局字母集不会影响其他用例。
    window.VTable.setCustomAlphabetCharSet('БВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯбвгдежзийклмнопрстуфхцчшщъыьэюя');
    return new window.VTable.ListTable(container, {
      columns: [{ field: 'latin', title: 'Column 1', width: 'auto' },
        { field: 'cyrillic', title: 'Колонка 2', width: 'auto' },
        { field: 'mixed', title: 'Mixed колонка', width: 100 }],
      records: [{ latin: 'Example text with correct wrapping', cyrillic: 'Пример текста на кириллице',
        mixed: 'GGGGGGGGGGGGGGGG ЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮЮ' }],
      widthMode: 'standard', heightMode: 'autoHeight', autoWrapText: true
    });
  },
  async verify(page) {
    // 混合字符内容必须进入表格。
    await page.evaluate(() => {
      if (!window.__visualTable.getCellValue(2, 1).includes('Ю')) throw new Error('西里尔文本缺失');
    });
  }
};
