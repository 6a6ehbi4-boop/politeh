import { motion } from 'framer-motion';
import type { HeatExchangerResults } from '../types';

interface ResultsPanelProps {
  results: HeatExchangerResults;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <motion.div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Расчётные параметры</h2>
      <div className="flex justify-between items-baseline gap-2 py-1">
        <span className="text-sm text-slate-600">Q — тепловая мощность</span>
        <motion.span
          className="font-mono font-semibold text-slate-900"
          key={results.Q}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {results.Q.toFixed(2)} кВт
        </motion.span>
      </div>
    </motion.div>
  );
}
