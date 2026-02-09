import { motion } from 'framer-motion';
import type { HeatExchangerResults } from '../types';

interface ResultsPanelProps {
  results: HeatExchangerResults;
}

const FIELDS: { key: keyof HeatExchangerResults; label: string; unit: string }[] = [
  { key: 'Tg2', label: 'Tг2 — температура греющей воды на выходе', unit: '°C' },
  { key: 'Tx2', label: 'Tх2 — температура нагреваемой воды на выходе', unit: '°C' },
  { key: 'Q', label: 'Q — тепловая мощность', unit: 'кВт' },
  { key: 'deltaTg', label: 'Δtг — перепад в греющем контуре', unit: '°C' },
  { key: 'deltaTx', label: 'Δtх — перепад в нагреваемом контуре', unit: '°C' },
  { key: 'reserve', label: 'Запас (доля от макс. мощности)', unit: '' },
];

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <motion.div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Расчётные параметры</h2>
      <div className="space-y-2">
        {FIELDS.map(({ key, label, unit }) => (
          <motion.div
            key={key}
            className="flex justify-between items-baseline gap-2 py-1 border-b border-slate-100 last:border-0"
            layout
          >
            <span className="text-sm text-slate-600">{label}</span>
            <motion.span
              className="font-mono font-semibold text-slate-900"
              key={`${key}-${results[key]}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {typeof results[key] === 'number' && (key === 'reserve' || key === 'Q')
                ? (results[key] as number).toFixed(2)
                : results[key]}
              {unit}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
