import * as VTable from '@visactor/vtable';

export const registerChartModule = (name: string, chart: any) => {
  VTable.register.chartModule(name, chart);
};
