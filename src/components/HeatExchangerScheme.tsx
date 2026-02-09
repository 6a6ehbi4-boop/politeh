import { motion } from 'framer-motion';
import type { HeatExchangerInputs, HeatExchangerResults } from '../types';

const SUPPLY_COLOR = '#c00';
const RETURN_COLOR = '#069';

interface HeatExchangerSchemeProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
}

/** Схема ПТО: SVG-трубы (красная подача, синяя обратка) с анимацией потока, серые блоки значений */
export function HeatExchangerScheme({ inputs, results }: HeatExchangerSchemeProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <svg
        viewBox="0 0 400 320"
        className="w-full h-full"
        fill="none"
      >
        {/* Теплообменник — центральный блок с пластинами */}
        <rect x="155" y="120" width="90" height="80" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={i}
            x1={165 + i * 10}
            y1={125}
            x2={165 + i * 10}
            y2={195}
            stroke="#64748b"
            strokeWidth="1.5"
          />
        ))}

        {/* Труба: подача греющая (слева сверху) — красная */}
        <PipeWithFlowFixed id="pipe-tl" color={SUPPLY_COLOR} strokeWidth={12} />
        <PipeWithFlowFixed id="pipe-tr" color={RETURN_COLOR} strokeWidth={12} />
        <PipeWithFlowFixed id="pipe-br" color={RETURN_COLOR} strokeWidth={12} />
        <PipeWithFlowFixed id="pipe-bl" color={SUPPLY_COLOR} strokeWidth={12} />
      </svg>

      {/* Блоки значений у труб — серый стиль, минимум текста */}
      <ValueBox position="top-left">
        <span className="text-slate-600 text-xs">Tг1</span>
        <span className="font-mono text-sm text-slate-900">{inputs.Tg1} °C</span>
        <span className="text-slate-600 text-xs">Gг</span>
        <span className="font-mono text-sm text-slate-900">{inputs.Gg} м³/ч</span>
      </ValueBox>
      <ValueBox position="top-right">
        <span className="text-slate-600 text-xs">Tг2</span>
        <span className="font-mono text-sm text-slate-900">{results.Tg2.toFixed(1)} °C</span>
      </ValueBox>
      <ValueBox position="bottom-right">
        <span className="text-slate-600 text-xs">Tх1</span>
        <span className="font-mono text-sm text-slate-900">{inputs.Tx1} °C</span>
        <span className="text-slate-600 text-xs">Gх</span>
        <span className="font-mono text-sm text-slate-900">{inputs.Gx} м³/ч</span>
      </ValueBox>
      <ValueBox position="bottom-left">
        <span className="text-slate-600 text-xs">Tх2</span>
        <span className="font-mono text-sm text-slate-900">{results.Tx2.toFixed(1)} °C</span>
        <span className="text-slate-600 text-xs">Q</span>
        <span className="font-mono text-sm text-slate-900">{results.Q.toFixed(2)} кВт</span>
      </ValueBox>
    </div>
  );
}

const PIPE_PATHS: Record<string, string> = {
  'pipe-tl': 'M 50 80 L 120 80 L 120 100 L 155 120',
  'pipe-tr': 'M 245 120 L 280 100 L 280 80 L 350 80',
  'pipe-br': 'M 350 240 L 280 240 L 280 220 L 245 200',
  'pipe-bl': 'M 155 200 L 120 220 L 120 240 L 50 240',
};

interface PipeWithFlowProps {
  id: string;
  color: string;
  strokeWidth: number;
}

function PipeWithFlowFixed({ id, color, strokeWidth }: PipeWithFlowProps) {
  const d = PIPE_PATHS[id];
  if (!d) return null;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12 12"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
      />
    </g>
  );
}

type BoxPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

function ValueBox({
  position,
  title = '',
  children,
}: {
  position: BoxPosition;
  title?: string;
  children: React.ReactNode;
}) {
  const pos: Record<BoxPosition, string> = {
    'top-left': 'left-2 top-2',
    'top-right': 'right-2 top-2',
    'bottom-left': 'left-2 bottom-2',
    'bottom-right': 'right-2 bottom-2',
  };
  return (
    <div
      className={`absolute ${pos[position]} bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 shadow-sm flex flex-wrap items-baseline gap-x-2 gap-y-0.5`}
    >
      {title ? <span className="text-xs text-slate-500 w-full">{title}</span> : null}
      {children}
    </div>
  );
}
