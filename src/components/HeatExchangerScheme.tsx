import { motion } from 'framer-motion';
import type { HeatExchangerInputs, HeatExchangerResults, ConstantKeys } from '../types';

const SUPPLY_COLOR = '#c00';
const RETURN_COLOR = '#069';

const RANGES: Record<ConstantKeys, { min: number; max: number; step: number }> = {
  Tg1: { min: 50, max: 150, step: 1 },
  Gg: { min: 0.5, max: 20, step: 0.1 },
  Tx1: { min: 1, max: 30, step: 1 },
  Gx: { min: 0.5, max: 20, step: 0.1 },
};

interface HeatExchangerSchemeProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
  constants: Record<ConstantKeys, boolean>;
  onChange: (key: ConstantKeys, value: number) => void;
  onConstantToggle: (key: ConstantKeys) => void;
}

/** Схема ПТО: горизонтальные трубы (1/4 и 3/4 высоты), ввод T сверху трубы, G снизу, Q сверху аппарата, галочка константа */
export function HeatExchangerScheme({
  inputs,
  results,
  constants,
  onChange,
  onConstantToggle,
}: HeatExchangerSchemeProps) {
  const vb = { w: 520, h: 280 };
  const ex = { x: 210, y: 60, w: 100, h: 160 }; // теплообменник
  const q1 = ex.h / 4;
  const q3 = (ex.h * 3) / 4;
  const yTop = ex.y + q1;
  const yBottom = ex.y + q3;

  const pipePaths = [
    { id: 'lt', d: `M 0 ${yTop} L ${ex.x} ${yTop}`, color: SUPPLY_COLOR },
    { id: 'lb', d: `M 0 ${yBottom} L ${ex.x} ${yBottom}`, color: RETURN_COLOR },
    { id: 'rt', d: `M ${ex.x + ex.w} ${yTop} L ${vb.w} ${yTop}`, color: RETURN_COLOR },
    { id: 'rb', d: `M ${ex.x + ex.w} ${yBottom} L ${vb.w} ${yBottom}`, color: SUPPLY_COLOR },
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <svg viewBox={`0 0 ${vb.w} ${vb.h}`} className="w-full h-auto" fill="none">
        {/* Горизонтальные трубы с анимацией потока */}
        {pipePaths.map(({ d, color }) => (
          <g key={d}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.4}
            />
            <motion.path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray="14 14"
              animate={{ strokeDashoffset: [0, -28] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        ))}

        {/* Теплообменник: синий корпус, вертикальные пластины */}
        <rect
          x={ex.x}
          y={ex.y}
          width={ex.w}
          height={ex.h}
          rx={4}
          fill="#2563eb"
          stroke="#1d4ed8"
          strokeWidth={2}
        />
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            x1={ex.x + 8 + i * 3.5}
            y1={ex.y + 4}
            x2={ex.x + 8 + i * 3.5}
            y2={ex.y + ex.h - 4}
            stroke="#93c5fd"
            strokeWidth={1.2}
          />
        ))}
        {/* Патрубки (серые фланцы) */}
        {[yTop, yBottom].map((y, i) => (
          <g key={i}>
            <rect x={ex.x - 6} y={y - 10} width={12} height={20} rx={2} fill="#94a3b8" stroke="#64748b" />
            <rect x={ex.x + ex.w - 6} y={y - 10} width={12} height={20} rx={2} fill="#94a3b8" stroke="#64748b" />
          </g>
        ))}
      </svg>

      {/* Тепловая мощность сверху теплообменника */}
      <div
        className="absolute left-1/2 top-4 -translate-x-1/2 bg-slate-700 text-white rounded-lg px-3 py-1.5 font-mono text-sm shadow"
        style={{ width: 'fit-content' }}
      >
        Q = {results.Q.toFixed(2)} кВт
      </div>

      {/* Левый верх: подача греющая — Tг1 (сверху), Gг (снизу) */}
      <PipeParams
        position="left"
        verticalPosition="top"
        svgW={vb.w}
        svgH={vb.h}
        pipeY={yTop}
        tempLabel="Tг1"
        tempValue={inputs.Tg1}
        tempKey="Tg1"
        flowLabel="Gг"
        flowValue={inputs.Gg}
        flowKey="Gg"
        constants={constants}
        onChange={onChange}
        onConstantToggle={onConstantToggle}
        isResult={false}
      />

      {/* Левый низ: обратка греющая — Tг2 (сверху), Gг (снизу) */}
      <PipeParams
        position="left"
        verticalPosition="bottom"
        svgW={vb.w}
        svgH={vb.h}
        pipeY={yBottom}
        tempLabel="Tг2"
        tempValue={results.Tg2}
        flowLabel="Gг"
        flowValue={inputs.Gg}
        flowKey="Gg"
        constants={constants}
        onChange={onChange}
        onConstantToggle={onConstantToggle}
        isResult={true}
        resultTempOnly
      />

      {/* Правый низ: подача нагреваемой — Tх1 (сверху), Gх (снизу) */}
      <PipeParams
        position="right"
        verticalPosition="bottom"
        svgW={vb.w}
        svgH={vb.h}
        pipeY={yBottom}
        tempLabel="Tх1"
        tempValue={inputs.Tx1}
        tempKey="Tx1"
        flowLabel="Gх"
        flowValue={inputs.Gx}
        flowKey="Gx"
        constants={constants}
        onChange={onChange}
        onConstantToggle={onConstantToggle}
        isResult={false}
      />

      {/* Правый верх: обратка нагреваемой — Tх2 (сверху), Gх (снизу) */}
      <PipeParams
        position="right"
        verticalPosition="top"
        svgW={vb.w}
        svgH={vb.h}
        pipeY={yTop}
        tempLabel="Tх2"
        tempValue={results.Tx2}
        flowLabel="Gх"
        flowValue={inputs.Gx}
        flowKey="Gx"
        constants={constants}
        onChange={onChange}
        onConstantToggle={onConstantToggle}
        isResult={true}
        resultTempOnly
      />
    </div>
  );
}

interface PipeParamsProps {
  position: 'left' | 'right';
  verticalPosition: 'top' | 'bottom';
  svgW: number;
  svgH: number;
  pipeY: number;
  tempLabel: string;
  tempValue: number;
  tempKey?: ConstantKeys;
  flowLabel: string;
  flowValue: number;
  flowKey: ConstantKeys;
  constants: Record<ConstantKeys, boolean>;
  onChange: (k: ConstantKeys, v: number) => void;
  onConstantToggle: (k: ConstantKeys) => void;
  isResult: boolean;
  /** для обратки: только показываем T и G, без ввода и галочки */
  resultTempOnly?: boolean;
}

function PipeParams({
  position,
  verticalPosition,
  svgW,
  svgH,
  pipeY,
  tempLabel,
  tempValue,
  tempKey,
  flowLabel,
  flowValue,
  flowKey,
  constants,
  onChange,
  onConstantToggle,
  isResult,
  resultTempOnly,
}: PipeParamsProps) {
  const isLeft = position === 'left';
  const xPercent = isLeft ? 12 : 88;
  const isTop = verticalPosition === 'top';
  const topPercent = isTop ? ((pipeY - 36) / svgH) * 100 : ((pipeY - 12) / svgH) * 100;

  const inputCls =
    'w-14 rounded border border-slate-300 px-1 py-0.5 text-sm text-right font-mono bg-white disabled:bg-slate-100 disabled:text-slate-600';
  const labelCls = 'text-xs text-slate-500';

  const tempRow = (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      <span className={labelCls}>{tempLabel}</span>
      {isResult && resultTempOnly ? (
        <span className="font-mono text-sm text-slate-900">{tempValue.toFixed(1)} °C</span>
      ) : tempKey ? (
        <>
          <input
            type="number"
            min={RANGES[tempKey].min}
            max={RANGES[tempKey].max}
            step={RANGES[tempKey].step}
            value={tempValue}
            onChange={(e) => onChange(tempKey, Number(e.target.value) || RANGES[tempKey].min)}
            disabled={constants[tempKey]}
            className={inputCls}
          />
          <span className="text-xs text-slate-400">°C</span>
          <label className="flex items-center gap-0.5 cursor-pointer" title="Зафиксировать">
            <input
              type="checkbox"
              checked={constants[tempKey]}
              onChange={() => onConstantToggle(tempKey)}
              className="rounded border-slate-300"
            />
            <span className="text-[10px] text-slate-400">конст.</span>
          </label>
        </>
      ) : null}
    </div>
  );

  const flowRow = (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      <span className={labelCls}>{flowLabel}</span>
      {isResult && resultTempOnly ? (
        <span className="font-mono text-sm text-slate-900">{flowValue.toFixed(1)} м³/ч</span>
      ) : (
        <>
          <input
            type="number"
            min={RANGES[flowKey].min}
            max={RANGES[flowKey].max}
            step={RANGES[flowKey].step}
            value={flowValue}
            onChange={(e) => onChange(flowKey, Number(e.target.value) || RANGES[flowKey].min)}
            disabled={constants[flowKey]}
            className={inputCls}
          />
          <span className="text-xs text-slate-400">м³/ч</span>
          <label className="flex items-center gap-0.5 cursor-pointer" title="Зафиксировать">
            <input
              type="checkbox"
              checked={constants[flowKey]}
              onChange={() => onConstantToggle(flowKey)}
              className="rounded border-slate-300"
            />
            <span className="text-[10px] text-slate-400">конст.</span>
          </label>
        </>
      )}
    </div>
  );

  return (
    <div
      className="absolute flex flex-col items-center gap-0.5 bg-white/90 rounded px-1.5 py-0.5 border border-slate-200 shadow-sm"
      style={{
        left: `${xPercent}%`,
        top: `${topPercent}%`,
        transform: 'translate(-50%, 0)',
      }}
    >
      {isTop ? (
        <>
          {tempRow}
          {flowRow}
        </>
      ) : (
        <>
          {flowRow}
          {tempRow}
        </>
      )}
    </div>
  );
}
