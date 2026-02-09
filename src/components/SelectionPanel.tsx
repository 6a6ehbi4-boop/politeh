import { useMemo } from 'react';
import { selectHeatExchangers } from '../calc/selectHeatExchanger';
import { generateSelectionPdf } from '../utils/generateSelectionPdf';
import type { HeatExchangerInputs, HeatExchangerResults } from '../types';

interface SelectionPanelProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
}

export function SelectionPanel({ inputs, results }: SelectionPanelProps) {
  const selections = useMemo(
    () =>
      selectHeatExchangers(
        results.Q,
        inputs.Tg1,
        results.Tg2,
        inputs.Tx1,
        results.Tx2,
        { limit: 10 }
      ),
    [inputs.Tg1, inputs.Tx1, results.Q, results.Tg2, results.Tx2]
  );

  const handleCreatePdf = () => {
    generateSelectionPdf(inputs, results, selections);
  };

  if (selections.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">Подбор теплообменников Ридан</h3>
        <p className="mt-2 text-sm text-slate-500">Нет подходящих моделей при текущих параметрах.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Подобранные теплообменники Ридан</h3>
        <button
          type="button"
          onClick={handleCreatePdf}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Создать PDF
        </button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-2 py-1.5 font-medium">Артикул</th>
              <th className="px-2 py-1.5 font-medium">Серия</th>
              <th className="px-2 py-1.5 font-medium">Пластин</th>
              <th className="px-2 py-1.5 font-medium">Площадь, м²</th>
              <th className="px-2 py-1.5 font-medium">Масса, кг</th>
              <th className="px-2 py-1.5 font-medium">Присоед.</th>
              <th className="px-2 py-1.5 font-medium">Запас %</th>
            </tr>
          </thead>
          <tbody>
            {selections.map((s) => (
              <tr key={s.model.code} className="border-b border-slate-100">
                <td className="px-2 py-1.5 font-mono text-slate-800">{s.model.code}</td>
                <td className="px-2 py-1.5">{s.model.series}</td>
                <td className="px-2 py-1.5">{s.model.plates}</td>
                <td className="px-2 py-1.5">{s.model.area.toFixed(2)}</td>
                <td className="px-2 py-1.5">{s.model.mass.toFixed(1)}</td>
                <td className="px-2 py-1.5">{s.model.connection}</td>
                <td className="px-2 py-1.5 text-slate-600">{s.reservePct.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
