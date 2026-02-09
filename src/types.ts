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
