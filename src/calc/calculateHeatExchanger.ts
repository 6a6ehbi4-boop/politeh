import type { HeatExchangerInputs, HeatExchangerResults } from '../types';

const C = 4.19;
const RHO = 1000;
const K = (RHO / 3600) * C * 1000;

/** Q по греющему контуру, Вт */
export function Qheating(Tg1: number, Tg2: number, Gg: number): number {
  return Math.max(Gg, 0) * K * Math.max(0, Tg1 - Tg2);
}

/** Q по нагреваемому контуру, Вт */
export function Qcold(Tx1: number, Tx2: number, Gx: number): number {
  return Math.max(Gx, 0) * K * Math.max(0, Tx2 - Tx1);
}

export function calculateHeatExchanger(inputs: HeatExchangerInputs): HeatExchangerResults {
  const Q = Qheating(inputs.Tg1, inputs.Tg2, inputs.Gg) / 1000;
  return { Q: Math.round(Q * 100) / 100 };
}

/** Найти Gg из Q */
export function solveGg(Q: number, Tg1: number, Tg2: number): number {
  if (Tg2 >= Tg1 || Q <= 0) return 0.1;
  const g = (Q * 1000) / (K * (Tg1 - Tg2));
  return Math.max(0.1, Math.min(50, Math.round(g * 10) / 10));
}

/** Найти Tg2 из Q */
export function solveTg2(Q: number, Tg1: number, Gg: number): number {
  if (Gg <= 0 || Q <= 0) return Tg1;
  const tg2 = Tg1 - (Q * 1000) / (K * Gg);
  return Math.max(0, Math.min(150, Math.round(tg2 * 10) / 10));
}

/** Найти Tg1 из Q */
export function solveTg1(Q: number, Tg2: number, Gg: number): number {
  if (Gg <= 0 || Q <= 0) return Tg2;
  const tg1 = Tg2 + (Q * 1000) / (K * Gg);
  return Math.max(0, Math.min(150, Math.round(tg1 * 10) / 10));
}

/** Найти Gx из Q */
export function solveGx(Q: number, Tx1: number, Tx2: number): number {
  if (Tx2 <= Tx1 || Q <= 0) return 0.1;
  const g = (Q * 1000) / (K * (Tx2 - Tx1));
  return Math.max(0.1, Math.min(50, Math.round(g * 10) / 10));
}

/** Найти Tx2 из Q */
export function solveTx2(Q: number, Tx1: number, Gx: number): number {
  if (Gx <= 0 || Q <= 0) return Tx1;
  const tx2 = Tx1 + (Q * 1000) / (K * Gx);
  return Math.max(0, Math.min(150, Math.round(tx2 * 10) / 10));
}

/** Найти Tx1 из Q */
export function solveTx1(Q: number, Tx2: number, Gx: number): number {
  if (Gx <= 0 || Q <= 0) return Tx2;
  const tx1 = Tx2 - (Q * 1000) / (K * Gx);
  return Math.max(0, Math.min(150, Math.round(tx1 * 10) / 10));
}

