import type { HeatExchangerInputs, HeatExchangerResults } from '../types';

/** Удельная теплоёмкость воды, кДж/(кг·°C) */
const C = 4.19;
/** Плотность воды, кг/м³ */
const RHO = 1000;

/**
 * Расчёт Q по тепловому балансу греющего контура.
 * Q = G · ρ · c · (Tг1 − Tг2). Без ограничения по мощности.
 */
export function calculateHeatExchanger(inputs: HeatExchangerInputs): HeatExchangerResults {
  const { Tg1, Tg2, Gg } = inputs;
  const mg = Math.max(Gg, 0) * (RHO / 3600);
  const QWatts = mg * C * 1000 * Math.max(0, Tg1 - Tg2);
  const Q = QWatts / 1000;
  return { Q: Math.round(Q * 100) / 100 };
}
