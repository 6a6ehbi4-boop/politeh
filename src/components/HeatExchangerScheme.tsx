import { motion } from 'framer-motion';
import type { HeatExchangerInputs, HeatExchangerResults, ConstantKeys, ExtendedConstantKeys } from '../types';

const SUPPLY_COLOR = '#c00';
const RETURN_COLOR = '#069';

const RANGES: Record<ConstantKeys, { min: number; max: number; step: number }> = {
  Tg1: { min: 0, max: 100, step: 1 },
  Gg: { min: 0.1, max: 20, step: 0.1 },
  Tx1: { min: 0, max: 100, step: 1 },
  Gx: { min: 0.1, max: 20, step: 0.1 },
};

const RETURN_TEMP_RANGE = { min: 0, max: 100, step: 1 };

const valueBoxCls =
  'bg-slate-700 text-white rounded-lg px-2 py-1 font-mono text-sm shadow border border-slate-600';

interface HeatExchangerSchemeProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
  constants: Record<ExtendedConstantKeys, boolean>;
  onChange: (key: ConstantKeys, value: number) => void;
  onReturnTempChange: (key: 'Tg2' | 'Tx2', value: number) => void;
  onConstantToggle: (key: ExtendedConstantKeys) => void;
}

/** Схема ПТО: труба на всю длину, над ней — подпись, поле, ползунок, галочка. Слева: край→теплообменник, справа: теплообменник→край */
export function HeatExchangerScheme({
  inputs,
  results,
  constants,
  onChange,
  onReturnTempChange,
  onConstantToggle,
}: HeatExchangerSchemeProps) {
  const vb = { w: 520, h: 300 };
  const ex = { x: 210, y: 70, w: 100, h: 160 };
  const yTop = ex.y + ex.h / 4;
  const yBottom = ex.y + (ex.h * 3) / 4;

  const leftPipeWidthPct = (ex.x / vb.w) * 100;
  const rightPipeWidthPct = ((vb.w - ex.x - ex.w) / vb.w) * 100;
  const rightPipeLeftPct = ((ex.x + ex.w) / vb.w) * 100;

  /* Tг1,Tx1: слева→направо; Tг2,Tx2: справа→налево */
  const pipePaths = [
    { d: `M 0 ${yTop} L ${ex.x} ${yTop}`, color: SUPPLY_COLOR, reverse: false }, // Tг1: слева→направо (лев. верх)
    { d: `M ${ex.x} ${yBottom} L 0 ${yBottom}`, color: RETURN_COLOR, reverse: true }, // Tг2: справа→налево (лев. низ)
    { d: `M ${vb.w} ${yTop} L ${ex.x + ex.w} ${yTop}`, color: RETURN_COLOR, reverse: true }, // Tx2: справа→налево (прав. верх)
    { d: `M ${ex.x + ex.w} ${yBottom} L ${vb.w} ${yBottom}`, color: SUPPLY_COLOR, reverse: false }, // Tx1: слева→направо (прав. низ)
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-slate-800 rounded-xl border border-slate-600 shadow-lg overflow-hidden">
      <svg viewBox={`0 0 ${vb.w} ${vb.h}`} className="w-full h-auto" fill="none">
        {pipePaths.map(({ d, color, reverse }) => (
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
              strokeDasharray="16 24"
              animate={{ strokeDashoffset: reverse ? [0, 40] : [0, -40] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        ))}

        {/* Пластинчатый теплообменник: синяя рама с двойной обводкой, пластины с рифлёной текстурой, патрубки с буртиками, стяжные шпильки */}
        <g id="heat-exchanger">
          {/* Двойная обводка рамы */}
          <rect
            x={ex.x}
            y={ex.y}
            width={ex.w}
            height={ex.h}
            rx={3}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth={3}
          />
          <rect
            x={ex.x + 2}
            y={ex.y + 2}
            width={ex.w - 4}
            height={ex.h - 4}
            rx={2}
            fill="#2563eb"
            stroke="#3b82f6"
            strokeWidth={1}
          />
          {/* Пакет пластин с рифлёной текстурой (чередование светло-серых полос) */}
          {Array.from({ length: 32 }, (_, i) => (
            <line
              key={i}
              x1={ex.x + 8 + i * 2.7}
              y1={ex.y + 6}
              x2={ex.x + 8 + i * 2.7}
              y2={ex.y + ex.h - 6}
              stroke={i % 2 === 0 ? '#cbd5e1' : '#94a3b8'}
              strokeWidth={1}
            />
          ))}
          {/* Стяжные шпильки сверху и снизу с гайками */}
          <line
            x1={ex.x - 6}
            y1={ex.y + 10}
            x2={ex.x + ex.w + 6}
            y2={ex.y + 10}
            stroke="#64748b"
            strokeWidth={1.5}
          />
          <circle cx={ex.x - 4} cy={ex.y + 10} r={2.5} fill="#94a3b8" stroke="#64748b" strokeWidth={0.5} />
          <circle cx={ex.x + ex.w + 4} cy={ex.y + 10} r={2.5} fill="#94a3b8" stroke="#64748b" strokeWidth={0.5} />
          <line
            x1={ex.x - 6}
            y1={ex.y + ex.h - 10}
            x2={ex.x + ex.w + 6}
            y2={ex.y + ex.h - 10}
            stroke="#64748b"
            strokeWidth={1.5}
          />
          <circle cx={ex.x - 4} cy={ex.y + ex.h - 10} r={2.5} fill="#94a3b8" stroke="#64748b" strokeWidth={0.5} />
          <circle cx={ex.x + ex.w + 4} cy={ex.y + ex.h - 10} r={2.5} fill="#94a3b8" stroke="#64748b" strokeWidth={0.5} />
          {/* Патрубки с буртиками — слева и справа на 1/4 и 3/4 высоты, металлический вид */}
          {[yTop, yBottom].map((y) => (
            <g key={y}>
              <rect x={ex.x - 8} y={y - 6} width={8} height={12} rx={1} fill="#94a3b8" stroke="#64748b" strokeWidth={0.5} />
              <rect x={ex.x - 10} y={y - 8} width={3} height={16} rx={1} fill="#64748b" stroke="#475569" strokeWidth={0.5} />
              <rect x={ex.x + ex.w} y={y - 6} width={8} height={12} rx={1} fill="#94a3b8" stroke="#64748b" strokeWidth={0.5} />
              <rect x={ex.x + ex.w + 6} y={y - 8} width={3} height={16} rx={1} fill="#64748b" stroke="#475569" strokeWidth={0.5} />
            </g>
          ))}
        </g>
      </svg>

      <div
        className={`absolute left-1/2 top-3 -translate-x-1/2 ${valueBoxCls}`}
        style={{ width: 'fit-content' }}
      >
        Q = {results.Q.toFixed(2)} кВт
      </div>

      {/* Слева: край → теплообменник. Блок над трубой на всю длину трубы. */}
      <PipeTempBlock
        pipeY={yTop}
        pipeWidthPct={leftPipeWidthPct}
        pipeLeftPct={0}
        svgH={vb.h}
        label="Tг1"
        value={inputs.Tg1}
        key_="Tg1"
        ranges={RANGES.Tg1}
        constants={constants}
        onChange={onChange}
        onConstantToggle={onConstantToggle}
        editable
      />
      <PipeTempBlock
        pipeY={yBottom}
        pipeWidthPct={leftPipeWidthPct}
        pipeLeftPct={0}
        svgH={vb.h}
        label="Tг2"
        value={results.Tg2}
        returnKey="Tg2"
        returnRange={RETURN_TEMP_RANGE}
        constants={constants}
        onReturnTempChange={onReturnTempChange}
        onConstantToggle={onConstantToggle}
      />
      {/* Справа: теплообменник → край */}
      <PipeTempBlock
        pipeY={yBottom}
        pipeWidthPct={rightPipeWidthPct}
        pipeLeftPct={rightPipeLeftPct}
        svgH={vb.h}
        label="Tх1"
        value={inputs.Tx1}
        key_="Tx1"
        ranges={RANGES.Tx1}
        constants={constants}
        onChange={onChange}
        onConstantToggle={onConstantToggle}
        editable
      />
      <PipeTempBlock
        pipeY={yTop}
        pipeWidthPct={rightPipeWidthPct}
        pipeLeftPct={rightPipeLeftPct}
        svgH={vb.h}
        label="Tх2"
        value={results.Tx2}
        returnKey="Tx2"
        returnRange={RETURN_TEMP_RANGE}
        constants={constants}
        onReturnTempChange={onReturnTempChange}
        onConstantToggle={onConstantToggle}
      />

      {/* Расход Gг слева, Gх справа */}
      <div className="absolute bottom-3 left-2 w-[38%] flex items-center justify-start">
        <FlowControl
          label="Gг"
          unit="м³/ч"
          value={inputs.Gg}
          key_="Gg"
          ranges={RANGES.Gg}
          constant={constants.Gg}
          onChange={onChange}
          onConstantToggle={onConstantToggle}
        />
      </div>
      <div className="absolute bottom-3 right-2 w-[38%] flex items-center justify-end">
        <FlowControl
          label="Gх"
          unit="м³/ч"
          value={inputs.Gx}
          key_="Gx"
          ranges={RANGES.Gx}
          constant={constants.Gx}
          onChange={onChange}
          onConstantToggle={onConstantToggle}
        />
      </div>
    </div>
  );
}

interface PipeTempBlockProps {
  pipeY: number;
  pipeWidthPct: number;
  pipeLeftPct: number;
  svgH: number;
  label: string;
  value: number;
  key_?: ConstantKeys;
  ranges?: { min: number; max: number; step: number };
  constants?: Partial<Record<ExtendedConstantKeys, boolean>>;
  onChange?: (k: ConstantKeys, v: number) => void;
  onConstantToggle?: (k: ExtendedConstantKeys) => void;
  editable?: boolean;
  returnKey?: 'Tg2' | 'Tx2';
  returnRange?: { min: number; max: number; step: number };
  onReturnTempChange?: (key: 'Tg2' | 'Tx2', value: number) => void;
}

/** Блок над трубой: подпись, поле, ползунок на всю длину трубы, галочка. Либо подача (editable), либо обратка (returnKey). */
function PipeTempBlock({
  pipeY,
  pipeWidthPct,
  pipeLeftPct,
  svgH,
  label,
  value,
  key_,
  ranges,
  constants = {},
  onChange,
  onConstantToggle,
  editable = false,
  returnKey,
  returnRange,
  onReturnTempChange,
}: PipeTempBlockProps) {
  const topPercent = ((pipeY - 36) / svgH) * 100;

  const isReturn = Boolean(returnKey && returnRange && onReturnTempChange);

  return (
    <div
      className="absolute flex flex-col gap-1"
      style={{
        left: `${pipeLeftPct}%`,
        top: `${topPercent}%`,
        width: `${pipeWidthPct}%`,
      }}
    >
      <div className="flex flex-row items-center gap-2 w-full">
        <span className="text-xs text-slate-400 shrink-0">{label}</span>
        {editable && key_ && ranges && onChange && onConstantToggle ? (
          <>
            <input
              type="number"
              min={ranges.min}
              max={ranges.max}
              step={ranges.step}
              value={value}
              onChange={(e) => onChange(key_, Number(e.target.value) || ranges.min)}
              disabled={constants[key_]}
              className={`${valueBoxCls} w-14 shrink-0 text-right`}
            />
            <span className="text-xs text-slate-400 shrink-0">°C</span>
            <input
              type="range"
              min={ranges.min}
              max={ranges.max}
              step={ranges.step}
              value={value}
              onChange={(e) => onChange(key_, Number(e.target.value))}
              disabled={constants[key_]}
              className="flex-1 min-w-0 h-1.5 rounded-full appearance-none bg-slate-600 accent-slate-400"
            />
            <label className="flex items-center gap-0.5 shrink-0 cursor-pointer" title="Зафиксировать">
              <input
                type="checkbox"
                checked={constants[key_]}
                onChange={() => onConstantToggle(key_)}
                className="rounded border-slate-400"
              />
              <span className="text-[10px] text-slate-400">конст.</span>
            </label>
          </>
        ) : isReturn && returnKey && returnRange && onReturnTempChange ? (
          <>
            <span className={`${valueBoxCls} min-w-[3rem] text-center shrink-0`}>
              {value.toFixed(1)} °C
            </span>
            <span className="text-xs text-slate-400 shrink-0">°C</span>
            <input
              type="range"
              min={returnRange.min}
              max={returnRange.max}
              step={returnRange.step}
              value={value}
              onChange={(e) => onReturnTempChange(returnKey, Number(e.target.value))}
              className="flex-1 min-w-0 h-1.5 rounded-full appearance-none bg-slate-600 accent-slate-400"
            />
            {onConstantToggle && (
              <label className="flex items-center gap-0.5 shrink-0 cursor-pointer" title="Зафиксировать">
                <input
                  type="checkbox"
                  checked={Boolean(constants?.[returnKey])}
                  onChange={() => onConstantToggle(returnKey)}
                  className="rounded border-slate-400"
                />
                <span className="text-[10px] text-slate-400">конст.</span>
              </label>
            )}
          </>
        ) : (
          <span className={`${valueBoxCls} min-w-[3rem] text-center shrink-0`}>
            {value.toFixed(1)} °C
          </span>
        )}
      </div>
    </div>
  );
}

interface FlowControlProps {
  label: string;
  unit: string;
  value: number;
  key_: ConstantKeys;
  ranges: { min: number; max: number; step: number };
  constant: boolean;
  onChange: (k: ConstantKeys, v: number) => void;
  onConstantToggle: (k: ConstantKeys) => void;
}

function FlowControl({
  label,
  unit,
  value,
  key_,
  ranges,
  constant,
  onChange,
  onConstantToggle,
}: FlowControlProps) {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-700/95 rounded-lg px-3 py-2 border border-slate-600">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <input
          type="number"
          min={ranges.min}
          max={ranges.max}
          step={ranges.step}
          value={value}
          onChange={(e) => onChange(key_, Number(e.target.value) || ranges.min)}
          disabled={constant}
          className={`${valueBoxCls} w-16 text-right`}
        />
        <span className="text-xs text-slate-400">{unit}</span>
        <label className="flex items-center gap-0.5 cursor-pointer" title="Зафиксировать">
          <input
            type="checkbox"
            checked={constant}
            onChange={() => onConstantToggle(key_)}
            className="rounded border-slate-400"
          />
          <span className="text-[10px] text-slate-400">конст.</span>
        </label>
      </div>
      <input
        type="range"
        min={ranges.min}
        max={ranges.max}
        step={ranges.step}
        value={value}
        onChange={(e) => onChange(key_, Number(e.target.value))}
        disabled={constant}
        className="w-32 h-2 rounded-full appearance-none bg-slate-600 accent-slate-400"
      />
    </div>
  );
}
