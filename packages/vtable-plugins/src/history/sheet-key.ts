import type { ListTable } from '@visactor/vtable';

export function resolveSheetKey(args: { vtableSheet: any; table: ListTable | null; cached: string | undefined }): {
  sheetKey: string | undefined;
  cached: string | undefined;
} {
  const { vtableSheet, table, cached } = args;
  if (!vtableSheet) {
    return { sheetKey: undefined, cached: undefined };
  }
  if (cached) {
    return { sheetKey: cached, cached };
  }
  try {
    // 优先通过 tableInstance 反查出 worksheet key，避免多 sheet 场景下拿错 active sheet。
    const workSheetInstances: Map<string, any> | undefined = vtableSheet.workSheetInstances;
    if (workSheetInstances && table) {
      for (const [sheetKey, worksheet] of workSheetInstances.entries()) {
        if (worksheet?.tableInstance === table) {
          return { sheetKey, cached: sheetKey };
        }
      }
    }
    // 回退到 active sheet key。
    const active = vtableSheet.getActiveSheet?.();
    if (active?.getKey) {
      const key = active.getKey();
      return { sheetKey: key, cached: key };
    }
    const activeDefine = vtableSheet.sheetManager?.getActiveSheet?.();
    const key = activeDefine?.sheetKey;
    return { sheetKey: key, cached: key };
  } catch {
    return { sheetKey: undefined, cached: undefined };
  }
}
