import type { RidanModel } from '../data/ridanModels';
import { RIDAN_MODELS } from '../data/ridanModels';

/** K для вода/этиленгликоль 20%, Вт/(м²·К) */
const K_WATER_GLYCOL = 2500;

/** Логарифмический температурный напор для противотока */
function logMeanTempDiff(Tg1: number, Tg2: number, Tx1: number, Tx2: number): number {
  const dt1 = Tg1 - Tx2;
  const dt2 = Tg2 - Tx1;
  if (dt1 <= 0 || dt2 <= 0) return 1;
  if (Math.abs(dt1 - dt2) < 0.01) return (dt1 + dt2) / 2;
  return (dt1 - dt2) / Math.log(dt1 / dt2);
}

/** Требуемая площадь теплообмена, м². F = Q / (K · Δt_лм) */
export function requiredArea(QkW: number, Tg1: number, Tg2: number, Tx1: number, Tx2: number): number {
  const Q = QkW * 1000; // кВт -> Вт
  const dT = logMeanTempDiff(Tg1, Tg2, Tx1, Tx2);
  if (dT <= 0) return 0;
  return Q / (K_WATER_GLYCOL * dT);
}

export interface SelectionItem {
  model: RidanModel;
  /** Запас по площади, % */
  reservePct: number;
}

/** Подбор моделей Ридан: F >= F_required, P <= Pmax. Сортировка по площади. */
export function selectHeatExchangers(
  QkW: number,
  Tg1: number,
  Tg2: number,
  Tx1: number,
  Tx2: number,
  options?: { pMax?: number; limit?: number }
): SelectionItem[] {
  const pMax = options?.pMax ?? 3;
  const limit = options?.limit ?? 10;

  const FReq = requiredArea(QkW, Tg1, Tg2, Tx1, Tx2);
  if (FReq <= 0) return [];

  const suitable: SelectionItem[] = [];
  for (const m of RIDAN_MODELS) {
    if (m.pn < pMax) continue; // модель должна выдерживать требуемое давление
    if (m.area < FReq) continue;
    const reservePct = ((m.area - FReq) / FReq) * 100;
    suitable.push({ model: m, reservePct });
  }

  suitable.sort((a, b) => a.model.area - b.model.area);
  return suitable.slice(0, limit);
}
