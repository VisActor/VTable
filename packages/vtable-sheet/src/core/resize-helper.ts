import type VTableSheet from '../components/vtable-sheet';

export function resizeSheetUI(sheet: VTableSheet) {
  updateRootSize(sheet);
  updateActiveSheetSize(sheet);
}
/**
 * 更新根元素尺寸
 */
function updateRootSize(sheet: VTableSheet): void {
  const containerWidth = sheet.getContainer().clientWidth;
  const containerHeight = sheet.getContainer().clientHeight;
  sheet.getRootElement().style.width = `${sheet.getOptions().width || containerWidth}px`;
  sheet.getRootElement().style.height = `${sheet.getOptions().height || containerHeight}px`;
}

/**
 * 更新活动 sheet 尺寸
 */
function updateActiveSheetSize(sheet: VTableSheet): void {
  if (sheet.getActiveSheet()) {
    sheet.getActiveSheet().resize();
  }
}
