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

const valueBoxCls =
  'bg-slate-700 text-white rounded-lg px-2 py-1 font-mono text-sm shadow border border-slate-600';

interface HeatExchangerSchemeProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
  constants: Record<ConstantKeys, boolean>;
  onChange: (key: ConstantKeys, value: number) => void;
  onConstantToggle: (key: ConstantKeys) => void;
}

/** Схема ПТО: картинка теплообменника, трубы с анимацией (промежуток между сегментами), T над трубами + слайдер, G внизу по центру */
export function HeatExchangerScheme({
  inputs,
  results,
  constants,
  onChange,
  onConstantToggle,
}: HeatExchangerSchemeProps) {
  const vb = { w: 520, h: 300 };
  const ex = { x: 210, y: 70, w: 100, h: 160 };
  const yTop = ex.y + ex.h / 4;
  const yBottom = ex.y + (ex.h * 3) / 4;

  const pipePaths = [
    { d: `M 0 ${yTop} L ${ex.x} ${yTop}`, color: SUPPLY_COLOR },
    { d: `M 0 ${yBottom} L ${ex.x} ${yBottom}`, color: RETURN_COLOR },
    { d: `M ${ex.x + ex.w} ${yTop} L ${vb.w} ${yTop}`, color: RETURN_COLOR },
    { d: `M ${ex.x + ex.w} ${yBottom} L ${vb.w} ${yBottom}`, color: SUPPLY_COLOR },
  ];

  const heatExchangerSrc = `${import.meta.env.BASE_URL}heat-exchanger.png`;

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-slate-800 rounded-xl border border-slate-600 shadow-lg overflow-hidden">
      <svg viewBox={`0 0 ${vb.w} ${vb.h}`} className="w-full h-auto" fill="none">
        {/* Горизонтальные трубы: фон + анимация с видимым промежутком между сегментами */}
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
              strokeDasharray="16 24"
              animate={{ strokeDashoffset: [0, -40] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        ))}
      </svg>

      {/* Картинка теплообменника по центру (совмещение с концами труб) */}
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          left: '40.4%',
          top: '23.3%',
          width: '19.2%',
          height: '53.3%',
        }}
      >
        <img
          src={heatExchangerSrc}
          alt="Пластинчатый теплообменник"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Q сверху теплообменника */}
      <div
        className={`absolute left-1/2 top-3 -translate-x-1/2 ${valueBoxCls}`}
        style={{ width: 'fit-content' }}
      >
        Q = {results.Q.toFixed(2)} кВт
      </div>

      {/* Температуры над трубами: T + слайдер + конст. Без расхода — расход вынесен вниз. */}
      <PipeTempBlock
        position="left"
        pipeY={yTop}
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
        position="left"
        pipeY={yBottom}
        svgH={vb.h}
        label="Tг2"
        value={results.Tg2}
        constants={constants}
        editable={false}
      />
      <PipeTempBlock
        position="right"
        pipeY={yBottom}
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
        position="right"
        pipeY={yTop}
        svgH={vb.h}
        label="Tх2"
        value={results.Tx2}
        constants={constants}
        editable={false}
      />

      {/* Расходы внизу по центру: Gг и Gх */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-4 bg-slate-700/95 rounded-xl px-4 py-3 border border-slate-600 shadow"
      >
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
  position: 'left' | 'right';
  pipeY: number;
  svgH: number;
  label: string;
  value: number;
  key_?: ConstantKeys;
  ranges?: { min: number; max: number; step: number };
  constants: Record<ConstantKeys, boolean>;
  onChange?: (k: ConstantKeys, v: number) => void;
  onConstantToggle?: (k: ConstantKeys) => void;
  editable: boolean;
}

function PipeTempBlock({
  position,
  pipeY,
  svgH,
  label,
  value,
  key_,
  ranges,
  constants,
  onChange,
  onConstantToggle,
  editable,
}: PipeTempBlockProps) {
  const xPercent = position === 'left' ? 12 : 88;
  const topPercent = ((pipeY - 28) / svgH) * 100;

  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: `${xPercent}%`,
        top: `${topPercent}%`,
        transform: 'translate(-50%, 0)',
      }}
    >
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <span className="text-xs text-slate-400">{label}</span>
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
              className={`${valueBoxCls} w-14 text-right`}
            />
            <span className="text-xs text-slate-400">°C</span>
            <label className="flex items-center gap-0.5 cursor-pointer" title="Зафиксировать">
              <input
                type="checkbox"
                checked={constants[key_]}
                onChange={() => onConstantToggle(key_)}
                className="rounded border-slate-400"
              />
              <span className="text-[10px] text-slate-400">конст.</span>
            </label>
          </>
        ) : (
          <span className={`${valueBoxCls} min-w-[3rem] text-center`}>{value.toFixed(1)} °C</span>
        )}
      </div>
      {editable && key_ && ranges && onChange && (
        <input
          type="range"
          min={ranges.min}
          max={ranges.max}
          step={ranges.step}
          value={value}
          onChange={(e) => onChange(key_, Number(e.target.value))}
          disabled={constants[key_]}
          className="w-24 h-1.5 rounded-full appearance-none bg-slate-600 accent-slate-400"
        />
      )}
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
    <div className="flex flex-col items-center gap-1">
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
