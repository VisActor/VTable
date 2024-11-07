// 将连字符形式的字符串转换为驼峰形式
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

// 将 vnode.props 中的所有属性名转换为驼峰形式
export function convertPropsToCamelCase(props: Record<string, any>): Record<string, any> {
  const newProps: Record<string, any> = {};
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const camelCaseKey = toCamelCase(key);
      newProps[camelCaseKey] = props[key];
    }
  }
  return newProps;
}
