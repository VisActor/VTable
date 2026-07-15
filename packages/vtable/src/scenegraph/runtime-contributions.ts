import type { IApp } from '@visactor/vrender-core';
import { installRuntimeContributionModule } from '@visactor/vrender/entries/runtime-contribution';
import { CanvasPickerContribution } from '@visactor/vrender-kits/picker/contributions/constants';

import splitModule from './graphic/contributions';
import textMeasureModule from './utils/text-measure';

export function installVTableRuntimeContributions(app?: IApp): void {
  installRuntimeContributionModule(splitModule, {
    app,
    targets: ['graphic-renderer', 'draw-contribution', { picker: CanvasPickerContribution }]
  });

  installRuntimeContributionModule(textMeasureModule, {
    app,
    targets: ['graphic-renderer']
  });
}
