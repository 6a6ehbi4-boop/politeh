import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { HeatExchangerInputs, HeatExchangerResults } from '../types';
import { calculateHeatExchanger } from '../calc/calculateHeatExchanger';

interface GraphPanelProps {
  /** Текущие входные параметры — по одному будем варьировать для графика */
  inputs: HeatExchangerInputs;
  /** Параметр, по которому строим ось X */
  xParam: 'Gx' | 'Gg' | 'Tg1' | 'Tx1';
  /** Количество точек */
  points?: number;
}

/** График зависимости Tх2 от выбранного входного параметра */
export function GraphPanel({ inputs, xParam, points = 25 }: GraphPanelProps) {
  const data = useMemo(() => {
    const range = getRange(xParam, inputs);
    const step = (range.max - range.min) / (points - 1) || 1;
    const result: { x: number; Tx2: number; Q: number }[] = [];
    for (let i = 0; i < points; i++) {
      const x = range.min + i * step;
      const modified: HeatExchangerInputs = { ...inputs, [xParam]: x };
      const res: HeatExchangerResults = calculateHeatExchanger(modified);
      result.push({ x: Math.round(x * 100) / 100, Tx2: res.Tx2, Q: res.Q });
    }
    return result;
  }, [inputs, xParam, points]);

  const xLabel = getXLabel(xParam);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        Зависимость Tх2 и Q от {xLabel}
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" name={xLabel} unit={xParam.startsWith('G') ? ' м³/ч' : ' °C'} />
            <YAxis yAxisId="left" unit=" °C" />
            <YAxis yAxisId="right" orientation="right" unit=" кВт" />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'Tx2' ? `${value} °C` : `${value} кВт`,
                name === 'Tx2' ? 'Tх2' : 'Q',
              ]}
              labelFormatter={(label) => `${xLabel}: ${label}`}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Tx2"
              name="Tх2"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Q"
              name="Q"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getRange(
  param: keyof HeatExchangerInputs,
  _inputs: HeatExchangerInputs
): { min: number; max: number } {
  const ranges: Record<keyof HeatExchangerInputs, { min: number; max: number }> = {
    Tg1: { min: 50, max: 150 },
    Gg: { min: 0.5, max: 20 },
    Tx1: { min: 20, max: 60 },
    Gx: { min: 0.5, max: 20 },
  };
  return ranges[param];
}

function getXLabel(param: keyof HeatExchangerInputs): string {
  const labels: Record<keyof HeatExchangerInputs, string> = {
    Tg1: 'Tг1',
    Gg: 'Gг',
    Tx1: 'Tх1',
    Gx: 'Gх',
  };
  return labels[param];
}
