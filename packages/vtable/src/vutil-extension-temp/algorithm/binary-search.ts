/**
 * 二分靠近框架，返回数组中第一个大于等于目标值的数的索引
 * @param arr 数组
 * @param compareFn 比较函数，返回(当前值-目标值)
 */
export const binaryFuzzySearch = <T>(arr: T[], compareFn: (value: T) => number) => {
  return binaryFuzzySearchInNumberRange(0, arr.length, value => compareFn(arr[value]));
};

/**
 * 二分靠近框架，返回数字区间中第一个大于等于目标值的数字
 * @param x1 区间上界
 * @param x2 区间下界（不包含）
 * @param compareFn 比较函数，返回(当前值-目标值)
 */
export const binaryFuzzySearchInNumberRange = (x1: number, x2: number, compareFn: (value: number) => number) => {
  let left = x1;
  let right = x2;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (compareFn(mid) >= 0) {
      right = mid; // 第一个大于等于目标值的数
    } else {
      left = mid + 1;
    }
  }
  return left;
};
