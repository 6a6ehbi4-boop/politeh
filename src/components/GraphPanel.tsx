import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HeatExchangerInputs } from '../types';
import { calculateHeatExchanger } from '../calc/calculateHeatExchanger';

interface GraphPanelProps {
  /** Текущие входные параметры — по одному будем варьировать для графика */
  inputs: HeatExchangerInputs;
  /** Параметр, по которому строим ось X */
  xParam: keyof HeatExchangerInputs;
  /** Количество точек */
  points?: number;
}

/** График зависимости Q от выбранного входного параметра */
export function GraphPanel({ inputs, xParam, points = 25 }: GraphPanelProps) {
  const data = useMemo(() => {
    const range = getRange(xParam);
    const step = (range.max - range.min) / (points - 1) || 1;
    const result: { x: number; Q: number }[] = [];
    for (let i = 0; i < points; i++) {
      const x = range.min + i * step;
      const modified: HeatExchangerInputs = { ...inputs, [xParam]: x };
      const res = calculateHeatExchanger(modified);
      result.push({ x: Math.round(x * 100) / 100, Q: res.Q });
    }
    return result;
  }, [inputs, xParam, points]);

  const xLabel = getXLabel(xParam);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        Зависимость Q от {xLabel}
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" name={xLabel} unit={xParam.startsWith('G') ? ' м³/ч' : ' °C'} />
            <YAxis unit=" кВт" />
            <Tooltip
              formatter={(value: number) => [`${value} кВт`, 'Q']}
              labelFormatter={(label) => `${xLabel}: ${label}`}
            />
            <Line type="monotone" dataKey="Q" name="Q" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getRange(param: keyof HeatExchangerInputs): { min: number; max: number } {
  const ranges: Record<keyof HeatExchangerInputs, { min: number; max: number }> = {
    Tg1: { min: 50, max: 150 },
    Tg2: { min: 20, max: 80 },
    Tx1: { min: 5, max: 60 },
    Tx2: { min: 20, max: 80 },
    Gg: { min: 0.5, max: 50 },
    Gx: { min: 0.5, max: 50 },
  };
  return ranges[param];
}

function getXLabel(param: keyof HeatExchangerInputs): string {
  const labels: Record<keyof HeatExchangerInputs, string> = {
    Tg1: 'Tг1',
    Tg2: 'Tг2',
    Tx1: 'Tх1',
    Tx2: 'Tх2',
    Gg: 'Gг',
    Gx: 'Gх',
  };
  return labels[param];
}
