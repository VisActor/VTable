export type percentCalcObj = {
  percent: number;
  delta: number;
};

export function percentCalc(percent: number, delta = 0) {
  return {
    percent,
    delta
  };
}
