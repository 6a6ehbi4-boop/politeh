/** Входные параметры — симуляция процесса, все вводятся вручную */
export interface HeatExchangerInputs {
  Tg1: number;
  Tg2: number;
  Tx1: number;
  Tx2: number;
  Gg: number;
  Gx: number;
}

/** Результат: Q по тепловому балансу греющего контура */
export interface HeatExchangerResults {
  Q: number;
}

export type InputKeys = keyof HeatExchangerInputs;
export type ConstantKeys = InputKeys;

/** Греющая сторона: Tg1, Tg2, Gg */
export const HEATING_KEYS: ConstantKeys[] = ['Tg1', 'Tg2', 'Gg'];
/** Нагреваемая сторона: Tx1, Tx2, Gx */
export const COLD_KEYS: ConstantKeys[] = ['Tx1', 'Tx2', 'Gx'];
