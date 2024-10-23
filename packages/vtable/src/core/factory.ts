export class Factory {
  private static _components: { [key: string]: any } = {};
  private static _functions: { [key: string]: any } = {};
  private static _cellTypes: { [key: string]: any } = {};

  static registerComponent(key: string, component: any) {
    Factory._components[key] = component;
  }

  static getComponent(key: string) {
    return Factory._components[key];
  }

  static registerFunction(key: string, func: any) {
    Factory._functions[key] = func;
  }

  static getFunction(key: string) {
    return Factory._functions[key];
  }

  static registerCellType(key: string, cellType: any) {
    Factory._cellTypes[key] = cellType;
  }

  static getCellType(key: string) {
    return Factory._cellTypes[key];
  }
}
