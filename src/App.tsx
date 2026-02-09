import { useState, useMemo } from 'react';
import { HeatExchangerScheme } from './components/HeatExchangerScheme';
import {
  calculateHeatExchanger,
  solveTg1FromTg2,
  solveTx1FromTx2,
} from './calc/calculateHeatExchanger';
import type { HeatExchangerInputs, HeatExchangerResults, ConstantKeys } from './types';

const DEFAULT_INPUTS: HeatExchangerInputs = {
  Tg1: 70,
  Gg: 5,
  Tx1: 20,
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

  const handleReturnTempChange = (key: 'Tg2' | 'Tx2', value: number) => {
    if (key === 'Tg2') {
      const Tg1 = solveTg1FromTg2(value, inputs.Gg, inputs.Tx1, inputs.Gx);
      setInputs((prev) => ({ ...prev, Tg1 }));
    } else {
      const Tx1 = solveTx1FromTx2(value, inputs.Tg1, inputs.Gg, inputs.Gx);
      setInputs((prev) => ({ ...prev, Tx1 }));
    }
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
          onReturnTempChange={handleReturnTempChange}
          onConstantToggle={toggleConstant}
        />
      </main>
    </div>
  );
}
