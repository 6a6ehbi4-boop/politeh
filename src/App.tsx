import { useState, useMemo } from 'react';
import { HeatExchangerScheme } from './components/HeatExchangerScheme';
import {
  calculateHeatExchanger,
  solveGgFromTg2,
  solveGxFromTx2,
  solveTg1FromTg2,
  solveTx1FromTx2,
} from './calc/calculateHeatExchanger';
import type { HeatExchangerInputs, HeatExchangerResults, ConstantKeys, ExtendedConstantKeys } from './types';

const DEFAULT_INPUTS: HeatExchangerInputs = {
  Tg1: 70,
  Gg: 5,
  Tx1: 20,
  Gx: 8,
};

export default function App() {
  const [inputs, setInputs] = useState<HeatExchangerInputs>(DEFAULT_INPUTS);
  const [constants, setConstants] = useState<Record<ExtendedConstantKeys, boolean>>({
    Tg1: false,
    Gg: false,
    Tx1: false,
    Gx: false,
    Tg2: false,
    Tx2: false,
  });

  const results = useMemo<HeatExchangerResults>(
    () => calculateHeatExchanger(inputs),
    [inputs]
  );

  const handleChange = (key: ConstantKeys, value: number) => {
    if (constants.Tg2 && (key === 'Tg1' || key === 'Gg')) {
      if (key === 'Tg1') {
        const Gg = solveGgFromTg2(results.Tg2, value, inputs.Tx1, inputs.Gx);
        setInputs((prev) => ({ ...prev, Tg1: value, Gg }));
      } else {
        const Tg1 = solveTg1FromTg2(results.Tg2, value, inputs.Tx1, inputs.Gx);
        setInputs((prev) => ({ ...prev, Gg: value, Tg1 }));
      }
    } else if (constants.Tx2 && (key === 'Tx1' || key === 'Gx')) {
      if (key === 'Tx1') {
        const Gx = solveGxFromTx2(results.Tx2, value, inputs.Tg1, inputs.Gg);
        setInputs((prev) => ({ ...prev, Tx1: value, Gx }));
      } else {
        const Tx1 = solveTx1FromTx2(results.Tx2, inputs.Tg1, inputs.Gg, value);
        setInputs((prev) => ({ ...prev, Gx: value, Tx1 }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleReturnTempChange = (key: 'Tg2' | 'Tx2', value: number) => {
    if (key === 'Tg2') {
      if (constants.Tg1) {
        const Gg = solveGgFromTg2(value, inputs.Tg1, inputs.Tx1, inputs.Gx);
        setInputs((prev) => ({ ...prev, Gg }));
      } else if (constants.Gg) {
        const Tg1 = solveTg1FromTg2(value, inputs.Gg, inputs.Tx1, inputs.Gx);
        setInputs((prev) => ({ ...prev, Tg1 }));
      } else {
        const Tg1 = solveTg1FromTg2(value, inputs.Gg, inputs.Tx1, inputs.Gx);
        setInputs((prev) => ({ ...prev, Tg1 }));
      }
    } else {
      if (constants.Tx1) {
        const Gx = solveGxFromTx2(value, inputs.Tx1, inputs.Tg1, inputs.Gg);
        setInputs((prev) => ({ ...prev, Gx }));
      } else if (constants.Gx) {
        const Tx1 = solveTx1FromTx2(value, inputs.Tg1, inputs.Gg, inputs.Gx);
        setInputs((prev) => ({ ...prev, Tx1 }));
      } else {
        const Tx1 = solveTx1FromTx2(value, inputs.Tg1, inputs.Gg, inputs.Gx);
        setInputs((prev) => ({ ...prev, Tx1 }));
      }
    }
  };

  const toggleConstant = (key: ExtendedConstantKeys) => {
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
