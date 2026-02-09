import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeatExchangerScheme } from './components/HeatExchangerScheme';
import { ControlPanel, type ControlValues } from './components/ControlPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { GraphPanel } from './components/GraphPanel';
import { calculateHeatExchanger } from './calc/calculateHeatExchanger';
import type { HeatExchangerInputs, HeatExchangerResults } from './types';

const DEFAULT_INPUTS: HeatExchangerInputs = {
  Tg1: 110,
  Gg: 5,
  Tx1: 40,
  Gx: 8,
};

function inputsFromControls(c: ControlValues): HeatExchangerInputs {
  return { Tg1: c.Tg1, Gg: c.Gg, Tx1: c.Tx1, Gx: c.Gx };
}

export default function App() {
  const [controls, setControls] = useState<ControlValues>(DEFAULT_INPUTS);
  const inputs = useMemo(() => inputsFromControls(controls), [controls]);
  const results = useMemo<HeatExchangerResults>(
    () => calculateHeatExchanger(inputs),
    [inputs]
  );
  const [graphXParam, setGraphXParam] = useState<'Gx' | 'Gg' | 'Tg1' | 'Tx1'>('Gx');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white py-4 px-6">
        <motion.h1
          className="text-2xl font-bold text-slate-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Пластинчатый теплообменник — интерактивная модель
        </motion.h1>
        <p className="text-sm text-slate-500 mt-1">
          Изменяйте параметры и наблюдайте связь выходных величин (Tх2, Q и др.)
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ControlPanel values={controls} onChange={setControls} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsPanel results={results} />
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <HeatExchangerScheme inputs={inputs} results={results} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-slate-600">Ось X графика:</span>
            <select
              value={graphXParam}
              onChange={(e) => setGraphXParam(e.target.value as 'Gx' | 'Gg' | 'Tg1' | 'Tx1')}
              className="rounded border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="Gx">Gх</option>
              <option value="Gg">Gг</option>
              <option value="Tg1">Tг1</option>
              <option value="Tx1">Tх1</option>
            </select>
          </div>
          <GraphPanel inputs={inputs} xParam={graphXParam} />
        </motion.section>
      </main>
    </div>
  );
}
