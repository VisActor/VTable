export function extend(target: any, ...sources: any[]): any {
  for (const source of sources) {
    if (source) {
      for (const key of Object.keys(source)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

export function getIgnoreCase(obj: any, key: string) {
  if (!obj) return undefined;
  const lowerKey = key.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lowerKey) {
      return obj[k];
    }
  }
  return undefined;
}

// 合并多个对象，遇到 undefined/null 跳过，遇到对象递归合并，遇到基本类型后者覆盖前者
export function ingoreNoneValueMerge(target: any, ...sources: any[]): any {
  for (const source of sources) {
    if (!source) continue;
    for (const key of Object.keys(source)) {
      const value = source[key];
      if (value === undefined || value === null) continue;
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        typeof target[key] === 'object' &&
        target[key] !== null
      ) {
        target[key] = ingoreNoneValueMerge({}, target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
  return target;
}
