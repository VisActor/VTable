import type { Stage } from '@src/vrender';
import type { DebugToolOptions } from './debug-tool';
import { DebugTool } from './debug-tool';

export function bindDebugTool(stage: Stage, options: DebugToolOptions) {
  return new DebugTool(stage, options);
}
