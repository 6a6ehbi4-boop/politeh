import { useState, useMemo } from 'react';
import { HeatExchangerScheme } from './components/HeatExchangerScheme';
import { calculateHeatExchanger } from './calc/calculateHeatExchanger';
import type { HeatExchangerInputs, HeatExchangerResults } from './types';

const DEFAULT_INPUTS: HeatExchangerInputs = {
  Tg1: 70,
  Tg2: 20,
  Tx1: 20,
  Tx2: 40,
  Gg: 5,
  Gx: 8,
};

export default function App() {
  const [inputs, setInputs] = useState<HeatExchangerInputs>(DEFAULT_INPUTS);

  const results = useMemo<HeatExchangerResults>(
    () => calculateHeatExchanger(inputs),
    [inputs]
  );

  const handleChange = (key: keyof HeatExchangerInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="max-w-4xl mx-auto p-4">
        <HeatExchangerScheme
          inputs={inputs}
          results={results}
          onChange={handleChange}
        />
      </main>
    </div>
  );
}
