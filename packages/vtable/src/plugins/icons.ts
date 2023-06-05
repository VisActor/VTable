import type { ColumnIconOption } from '../ts-types';

export const icons: { [key: string]: ColumnIconOption } = {};

export class IconCache {
  private static cache: Map<string, ColumnIconOption> = new Map();

  static setIcon(key: string, icon: ColumnIconOption) {
    this.cache.set(key, icon);
  }

  static getIcon(key: string): ColumnIconOption | null {
    if (this.cache.has(key)) {
      return this.cache.get(key) as ColumnIconOption;
    }
    return null;
  }

  static hasIcon(key: string): boolean {
    return this.cache.has(key);
  }

  static clear(key: string): boolean {
    return this.cache.delete(key);
  }

  static clearAll() {
    this.cache = new Map();
  }
}
