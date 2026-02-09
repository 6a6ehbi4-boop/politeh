import { motion } from 'framer-motion';

export interface ControlValues {
  Tg1: number;
  Gg: number;
  Tx1: number;
  Gx: number;
}

interface ControlPanelProps {
  values: ControlValues;
  onChange: (values: ControlValues) => void;
}

const RANGES = {
  Tg1: { min: 50, max: 150, step: 1, label: 'Tг1 — температура греющей воды на входе, °C' },
  Gg: { min: 0.5, max: 20, step: 0.1, label: 'Gг — расход греющей воды, м³/ч' },
  Tx1: { min: 20, max: 60, step: 1, label: 'Tх1 — температура нагреваемой воды на входе, °C' },
  Gx: { min: 0.5, max: 20, step: 0.1, label: 'Gх — расход нагреваемой воды, м³/ч' },
} as const;

export function ControlPanel({ values, onChange }: ControlPanelProps) {
  const handleChange = (key: keyof ControlValues, value: number) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <motion.div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Входные параметры</h2>
      <div className="space-y-4">
        {(Object.keys(RANGES) as (keyof ControlValues)[]).map((key) => {
          const { min, max, step, label } = RANGES[key];
          const value = values[key];
          return (
            <motion.div key={key} layout className="space-y-1">
              <label className="block text-sm text-slate-600">{label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => handleChange(key, Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-slate-200 accent-blue-600"
                />
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={key === 'Gg' || key === 'Gx' ? 0.1 : 1}
                  value={value}
                  onChange={(e) => handleChange(key, Number(e.target.value) || min)}
                  className="w-20 rounded border border-slate-300 px-2 py-1 text-sm text-right"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
