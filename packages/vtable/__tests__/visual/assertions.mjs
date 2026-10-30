/** 仅在显式业务状态比较失败处构造；不要包装浏览器或页面 API 的执行异常。 */
export function assertionError(message) {
  const error = new Error(message);
  error.name = 'VisualAssertionError';
  return error;
}

/** 识别显式业务断言，包括 Playwright 跨 page.evaluate 序列化后的首行类型标记。 */
export function isBusinessAssertion(error) {
  return (
    error.name === 'VisualAssertionError' ||
    /^(?:Error: )?(?:(?:page|frame)\.evaluate(?:Handle)?: )?VisualAssertionError: /.test(String(error.message ?? ''))
  );
}
