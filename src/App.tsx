import { useState, useMemo } from 'react';
import { HeatExchangerScheme } from './components/HeatExchangerScheme';
import { calculateHeatExchanger } from './calc/calculateHeatExchanger';
import type { HeatExchangerInputs, HeatExchangerResults, ConstantKeys } from './types';

const DEFAULT_INPUTS: HeatExchangerInputs = {
  Tg1: 110,
  Gg: 5,
  Tx1: 15,
  Gx: 8,
};

export default function App() {
  const [inputs, setInputs] = useState<HeatExchangerInputs>(DEFAULT_INPUTS);
  const [constants, setConstants] = useState<Record<ConstantKeys, boolean>>({
    Tg1: false,
    Gg: false,
    Tx1: false,
    Gx: false,
  });

  const results = useMemo<HeatExchangerResults>(
    () => calculateHeatExchanger(inputs),
    [inputs]
  );

  const handleChange = (key: ConstantKeys, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const toggleConstant = (key: ConstantKeys) => {
    setConstants((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="max-w-4xl mx-auto p-4">
        <HeatExchangerScheme
          inputs={inputs}
          results={results}
          constants={constants}
          onChange={handleChange}
          onConstantToggle={toggleConstant}
        />
      </main>
    </div>
  );
}
