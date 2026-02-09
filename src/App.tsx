import { useState, useMemo } from 'react';
import { HeatExchangerScheme } from './components/HeatExchangerScheme';
import {
  calculateHeatExchanger,
  Qheating,
  Qcold,
  solveGg,
  solveTg1,
  solveTg2,
  solveGx,
  solveTx1,
  solveTx2,
} from './calc/calculateHeatExchanger';
import type { HeatExchangerInputs, HeatExchangerResults, ConstantKeys } from './types';
import { HEATING_KEYS, COLD_KEYS } from './types';

const DEFAULT_INPUTS: HeatExchangerInputs = {
  Tg1: 70,
  Tg2: 20,
  Tx1: 20,
  Tx2: 40,
  Gg: 5,
  Gx: 8,
};

const DEFAULT_CONSTANTS: Record<ConstantKeys, boolean> = {
  Tg1: false,
  Tg2: false,
  Tx1: false,
  Tx2: false,
  Gg: false,
  Gx: false,
};

function getFreeKey(keys: ConstantKeys[], constants: Record<ConstantKeys, boolean>): ConstantKeys {
  const free = keys.find((k) => !constants[k]);
  return free ?? keys[0];
}

function countConstants(keys: ConstantKeys[], constants: Record<ConstantKeys, boolean>): number {
  return keys.filter((k) => constants[k]).length;
}

export default function App() {
  const [inputs, setInputs] = useState<HeatExchangerInputs>(DEFAULT_INPUTS);
  const [constants, setConstants] = useState<Record<ConstantKeys, boolean>>(DEFAULT_CONSTANTS);

  const results = useMemo<HeatExchangerResults>(
    () => calculateHeatExchanger(inputs),
    [inputs]
  );

  const handleChange = (key: ConstantKeys, value: number) => {
    const isHeating = HEATING_KEYS.includes(key);
    const otherKeys = isHeating ? COLD_KEYS : HEATING_KEYS;

    let next = { ...inputs, [key]: value };

    // Q из стороны, которую изменили
    const Qwatts = isHeating
      ? Qheating(next.Tg1, next.Tg2, next.Gg)
      : Qcold(next.Tx1, next.Tx2, next.Gx);
    const Q = Qwatts / 1000;

    // Пересчитать свободный параметр на другой стороне
    const freeKey = getFreeKey(otherKeys, constants);
    if (freeKey === 'Tg1') next = { ...next, Tg1: solveTg1(Q, next.Tg2, next.Gg) };
    else if (freeKey === 'Tg2') next = { ...next, Tg2: solveTg2(Q, next.Tg1, next.Gg) };
    else if (freeKey === 'Gg') next = { ...next, Gg: solveGg(Q, next.Tg1, next.Tg2) };
    else if (freeKey === 'Tx1') next = { ...next, Tx1: solveTx1(Q, next.Tx2, next.Gx) };
    else if (freeKey === 'Tx2') next = { ...next, Tx2: solveTx2(Q, next.Tx1, next.Gx) };
    else if (freeKey === 'Gx') next = { ...next, Gx: solveGx(Q, next.Tx1, next.Tx2) };

    setInputs(next);
  };

  const toggleConstant = (key: ConstantKeys) => {
    setConstants((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const sideKeys = HEATING_KEYS.includes(key) ? HEATING_KEYS : COLD_KEYS;
      const count = countConstants(sideKeys, next);
      if (count > 2) {
        const firstConst = sideKeys.find((k) => k !== key && next[k]);
        if (firstConst) next[firstConst] = false;
      }
      return next;
    });
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
