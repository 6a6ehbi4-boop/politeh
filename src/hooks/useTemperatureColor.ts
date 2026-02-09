import { useMemo } from 'react';

/** Градиент: 0°C — синий, 100°C — красный. Возвращает hex-цвет. */
export function useTemperatureColor(temperature: number): string {
  return useMemo(() => {
    const t = Math.max(0, Math.min(100, temperature));
    const ratio = t / 100;
    // Синий (0,0,255) -> Голубой -> Зелёный -> Жёлтый -> Красный (255,0,0)
    let r: number;
    let g: number;
    let b: number;
    if (ratio < 0.25) {
      const x = ratio / 0.25;
      r = Math.round(0);
      g = Math.round(255 * x);
      b = 255;
    } else if (ratio < 0.5) {
      const x = (ratio - 0.25) / 0.25;
      r = 0;
      g = 255;
      b = Math.round(255 * (1 - x));
    } else if (ratio < 0.75) {
      const x = (ratio - 0.5) / 0.25;
      r = Math.round(255 * x);
      g = 255;
      b = 0;
    } else {
      const x = (ratio - 0.75) / 0.25;
      r = 255;
      g = Math.round(255 * (1 - x));
      b = 0;
    }
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, [temperature]);
}
