import type { HeatExchangerInputs, HeatExchangerResults } from '../types';

/** Удельная теплоёмкость воды, кДж/(кг·°C) */
const C = 4.19;
/** Плотность воды, кг/м³ */
const RHO = 1000;
/** Условная мощность аппарата (F*k), Вт/°C — «размер» теплообменника */
const FK = 1000;

/**
 * Чистая функция расчёта пластинчатого теплообменника (противоток).
 * Упрощённая модель: баланс + ограничение по теплопередаче.
 */
export function calculateHeatExchanger(inputs: HeatExchangerInputs): HeatExchangerResults {
  const { Tg1, Gg, Tx1, Gx } = inputs;

  // Защита от нулевых/отрицательных расходов
  const GgSafe = Math.max(Gg, 0.01);
  const GxSafe = Math.max(Gx, 0.01);

  // Перевод расхода м³/ч -> кг/с: (м³/ч) * 1000 / 3600
  const mg = (GgSafe * RHO) / 3600; // кг/с
  const mx = (GxSafe * RHO) / 3600;

  // Максимально возможный тепловой поток от греющего контура, Вт
  const QMaxSource = mg * C * 1000 * (Tg1 - Tx1);
  const QMaxSourceSafe = Math.max(0, QMaxSource);

  // Средний температурный напор (упрощение — среднеарифметический)
  const deltaTMean = Math.max(0, (Tg1 - Tx1) / 2);
  // Тепловой поток по уравнению теплопередачи Q = (F*k) * Δt_средн
  const QByTransfer = FK * deltaTMean;

  // Реальный тепловой поток: минимум из двух ограничений
  const QWatts = Math.min(QMaxSourceSafe, QByTransfer);
  const Q = QWatts / 1000; // кВт

  // Выходные температуры из баланса
  const Tg2 = Tg1 - QWatts / (mg * C * 1000);
  const Tx2 = Tx1 + QWatts / (mx * C * 1000);

  const deltaTg = Tg1 - Tg2;
  const deltaTx = Tx2 - Tx1;
  const reserve = QMaxSourceSafe > 0 ? QWatts / QMaxSourceSafe : 0;

  return {
    Tg2: Math.round(Tg2 * 10) / 10,
    Tx2: Math.round(Tx2 * 10) / 10,
    Q: Math.round(Q * 100) / 100,
    deltaTg: Math.round(deltaTg * 10) / 10,
    deltaTx: Math.round(deltaTx * 10) / 10,
    reserve: Math.round(reserve * 100) / 100,
  };
}

/**
 * Обратный расчёт: задано Tg2, найти Tg1.
 * Tg2 = Tg1 - Q/(mg*C*1000), Q = (Tg1-Tx1)*K, K = min(mg*C*1000, FK/2).
 */
export function solveTg1FromTg2(
  Tg2: number,
  Gg: number,
  Tx1: number,
  Gx: number
): number {
  const GgSafe = Math.max(Gg, 0.01);
  const GxSafe = Math.max(Gx, 0.01);
  const mg = (GgSafe * RHO) / 3600;
  const mx = (GxSafe * RHO) / 3600;
  const K = Math.min(mg * C * 1000, FK / 2);
  const c = K / (mg * C * 1000);
  if (c >= 1) return Tg2;
  const Tg1 = (Tg2 - Tx1 * c) / (1 - c);
  return Math.max(0, Math.min(100, Math.round(Tg1 * 10) / 10));
}

/**
 * Обратный расчёт: задано Tx2, найти Tx1.
 */
export function solveTx1FromTx2(
  Tx2: number,
  Tg1: number,
  Gg: number,
  Gx: number
): number {
  const GgSafe = Math.max(Gg, 0.01);
  const GxSafe = Math.max(Gx, 0.01);
  const mg = (GgSafe * RHO) / 3600;
  const mx = (GxSafe * RHO) / 3600;
  const K = Math.min(mg * C * 1000, FK / 2);
  const d = K / (mx * C * 1000);
  if (d >= 1) return Tx2;
  const Tx1 = (Tx2 - Tg1 * d) / (1 - d);
  return Math.max(0, Math.min(100, Math.round(Tx1 * 10) / 10));
}
