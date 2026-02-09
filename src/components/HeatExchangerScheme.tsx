import { motion } from 'framer-motion';
import { useTemperatureColor } from '../hooks/useTemperatureColor';
import type { HeatExchangerInputs, HeatExchangerResults } from '../types';

interface HeatExchangerSchemeProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
}

/** Схема ПТО: центральный блок и четыре трубопровода с подписями и цветом по температуре */
export function HeatExchangerScheme({ inputs, results }: HeatExchangerSchemeProps) {
  const colorTg1 = useTemperatureColor(inputs.Tg1);
  const colorTg2 = useTemperatureColor(results.Tg2);
  const colorTx1 = useTemperatureColor(inputs.Tx1);
  const colorTx2 = useTemperatureColor(results.Tx2);

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center bg-slate-100 rounded-xl p-4">
      {/* Центральный блок — теплообменник (два пакета пластин) */}
      <motion.div
        className="absolute flex gap-1 items-center justify-center"
        layout
      >
        <div className="w-16 h-20 bg-slate-400 rounded border-2 border-slate-600 shadow" />
        <div className="w-16 h-20 bg-slate-500 rounded border-2 border-slate-700 shadow" />
      </motion.div>

      {/* Вход греющей среды — слева сверху */}
      <PipeSegment
        label="Tг1, Gг"
        value={`${inputs.Tg1}°C`}
        color={colorTg1}
        position="top-left"
        subLabel="Сеть (подача)"
      />
      {/* Выход греющей среды — справа сверху */}
      <PipeSegment
        label="Tг2"
        value={`${results.Tg2}°C`}
        color={colorTg2}
        position="top-right"
      />
      {/* Вход нагреваемой среды — справа снизу */}
      <PipeSegment
        label="Tх1, Gх"
        value={`${inputs.Tx1}°C`}
        color={colorTx1}
        position="bottom-right"
        subLabel="Объект (обратка)"
      />
      {/* Выход нагреваемой среды — слева снизу */}
      <PipeSegment
        label="Tх2"
        value={`${results.Tx2}°C`}
        color={colorTx2}
        position="bottom-left"
      />
    </div>
  );
}

type PipePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface PipeSegmentProps {
  label: string;
  value: string;
  color: string;
  position: PipePosition;
  subLabel?: string;
}

function PipeSegment({ label, value, color, position, subLabel }: PipeSegmentProps) {
  const posClasses: Record<PipePosition, string> = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };
  const arrowClasses: Record<PipePosition, string> = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-180',
    'bottom-left': 'rotate-0',
    'bottom-right': 'rotate-180',
  };

  return (
    <motion.div
      className={`absolute ${posClasses[position]} flex flex-col items-center`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="w-20 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-semibold text-white drop-shadow transition-colors duration-300"
        style={{ backgroundColor: color, borderColor: color }}
      >
        {value}
      </div>
      <span className="text-xs font-medium text-slate-600 mt-1">{label}</span>
      {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      <span className={`text-slate-400 ${arrowClasses[position]}`} aria-hidden>→</span>
    </motion.div>
  );
}
