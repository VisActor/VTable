/**
 * 显示Snackbar消息
 * @param message - 要显示的消息内容
 * @param duration - 显示时长(毫秒)，默认3000ms
 */
export function showSnackbar(message: string, duration = 3000): void {
  const snackbarId = `snackbar-${Date.now()}`;
  if (document.getElementById(snackbarId)) {
    return;
  }
  const snackbar = document.createElement('div');
  snackbar.id = snackbarId;
  snackbar.className = 'vtable-sheet-snackbar-message';
  snackbar.textContent = message;

  document.body.appendChild(snackbar);
  setTimeout(() => {
    snackbar.classList.add('show');
  }, 10);

  // 自动隐藏
  setTimeout(() => {
    snackbar.classList.remove('show');
    // 过渡结束后移除DOM
    snackbar.addEventListener('transitionend', function handler() {
      snackbar.removeEventListener('transitionend', handler);
      if (document.body.contains(snackbar)) {
        document.body.removeChild(snackbar);
      }
    });
  }, duration);
}
