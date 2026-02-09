import { motion } from 'framer-motion';
import type { HeatExchangerInputs, HeatExchangerResults, InputKeys, ConstantKeys } from '../types';

const SUPPLY_COLOR = '#c00';
const RETURN_COLOR = '#069';

const T_RANGE = { min: 0, max: 150, step: 1 };
const G_RANGE = { min: 0.1, max: 50, step: 0.1 };

const valueBoxCls =
  'bg-slate-700 text-white rounded-lg px-2 py-1 font-mono text-sm shadow border border-slate-600';

interface HeatExchangerSchemeProps {
  inputs: HeatExchangerInputs;
  results: HeatExchangerResults;
  constants: Record<ConstantKeys, boolean>;
  onChange: (key: InputKeys, value: number) => void;
  onConstantToggle: (key: ConstantKeys) => void;
}

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
  const yBottom = ex.y + (3 * ex.h) / 4;
  const portW = 26;
  const portH = 14;

  const leftPipeWidthPct = (ex.x / vb.w) * 100;
  const rightPipeWidthPct = ((vb.w - ex.x - ex.w) / vb.w) * 100;
  const rightPipeLeftPct = ((ex.x + ex.w) / vb.w) * 100;

  const pipePaths = [
    { d: `M 0 ${yTop} L ${ex.x} ${yTop}`, color: SUPPLY_COLOR, reverse: false },
    { d: `M ${ex.x} ${yBottom} L 0 ${yBottom}`, color: RETURN_COLOR, reverse: false },
    { d: `M ${vb.w} ${yTop} L ${ex.x + ex.w} ${yTop}`, color: RETURN_COLOR, reverse: false },
    { d: `M ${ex.x + ex.w} ${yBottom} L ${vb.w} ${yBottom}`, color: SUPPLY_COLOR, reverse: false },
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

        <g id="plate-heat-exchanger">
          <rect x={ex.x + 2} y={ex.y + 2} width={ex.w} height={ex.h} rx={6} fill="rgba(0,0,0,0.10)" />
          <rect x={ex.x} y={ex.y} width={ex.w} height={ex.h} rx={6} fill="#1677FF" stroke="#0B3D91" strokeWidth={2} />
          <rect x={ex.x + 10} y={ex.y + 12} width={ex.w - 20} height={ex.h - 24} rx={4} fill="#F5F7FA" stroke="#0B3D91" strokeWidth={1} opacity={0.95} />
          {Array.from({ length: 14 }).map((_, i) => {
            const px = ex.x + 14 + i * ((ex.w - 28) / 13);
            return <rect key={`plate-${i}`} x={px} y={ex.y + 16} width={2} height={ex.h - 32} rx={1} fill={i % 2 === 0 ? '#B9C3CF' : '#AEB8C5'} opacity={0.95} />;
          })}
          <rect x={ex.x + 10} y={ex.y + 8} width={ex.w - 20} height={6} rx={3} fill="#D6DEE8" stroke="#8A95A6" strokeWidth={1} />
          <rect x={ex.x + 10} y={ex.y + ex.h - 14} width={ex.w - 20} height={6} rx={3} fill="#D6DEE8" stroke="#8A95A6" strokeWidth={1} />
          {[{ x: ex.x - portW, y: yTop }, { x: ex.x - portW, y: yBottom }].map((p, idx) => (
            <g key={`L-port-${idx}`}>
              <rect x={p.x} y={p.y - portH / 2} width={portW} height={portH} rx={3} fill="#DCE3EC" stroke="#8A95A6" strokeWidth={1.5} />
              <rect x={p.x + portW - 6} y={p.y - portH / 2 - 1} width={6} height={portH + 2} rx={2} fill="#C7D0DB" opacity={0.95} />
            </g>
          ))}
          {[{ x: ex.x + ex.w, y: yTop }, { x: ex.x + ex.w, y: yBottom }].map((p, idx) => (
            <g key={`R-port-${idx}`}>
              <rect x={p.x} y={p.y - portH / 2} width={portW} height={portH} rx={3} fill="#DCE3EC" stroke="#8A95A6" strokeWidth={1.5} />
              <rect x={p.x} y={p.y - portH / 2 - 1} width={6} height={portH + 2} rx={2} fill="#C7D0DB" opacity={0.95} />
            </g>
          ))}
        </g>
      </svg>

      <div className={`absolute left-1/2 top-3 -translate-x-1/2 ${valueBoxCls}`} style={{ width: 'fit-content' }}>
        Q = {results.Q.toFixed(2)} кВт
      </div>

      <TempInput pipeY={yTop} pipeWidthPct={leftPipeWidthPct} pipeLeftPct={0} svgH={vb.h} label="Tг1" value={inputs.Tg1} key_="Tg1" constants={constants} onChange={onChange} onConstantToggle={onConstantToggle} valueBoxCls={valueBoxCls} ranges={T_RANGE} />
      <TempInput pipeY={yBottom} pipeWidthPct={leftPipeWidthPct} pipeLeftPct={0} svgH={vb.h} label="Tг2" value={inputs.Tg2} key_="Tg2" constants={constants} onChange={onChange} onConstantToggle={onConstantToggle} valueBoxCls={valueBoxCls} ranges={T_RANGE} />
      <TempInput pipeY={yTop} pipeWidthPct={rightPipeWidthPct} pipeLeftPct={rightPipeLeftPct} svgH={vb.h} label="Tх1" value={inputs.Tx1} key_="Tx1" constants={constants} onChange={onChange} onConstantToggle={onConstantToggle} valueBoxCls={valueBoxCls} ranges={T_RANGE} />
      <TempInput pipeY={yBottom} pipeWidthPct={rightPipeWidthPct} pipeLeftPct={rightPipeLeftPct} svgH={vb.h} label="Tх2" value={inputs.Tx2} key_="Tx2" constants={constants} onChange={onChange} onConstantToggle={onConstantToggle} valueBoxCls={valueBoxCls} ranges={T_RANGE} />

      <div className="absolute bottom-3 left-2 w-[38%] flex items-center justify-start">
        <FlowControl label="Gг" unit="м³/ч" value={inputs.Gg} key_="Gg" constant={constants.Gg} onChange={onChange} onConstantToggle={onConstantToggle} valueBoxCls={valueBoxCls} range={G_RANGE} />
      </div>
      <div className="absolute bottom-3 right-2 w-[38%] flex items-center justify-end">
        <FlowControl label="Gх" unit="м³/ч" value={inputs.Gx} key_="Gx" constant={constants.Gx} onChange={onChange} onConstantToggle={onConstantToggle} valueBoxCls={valueBoxCls} range={G_RANGE} />
      </div>
    </div>
  );
}

interface TempInputProps {
  pipeY: number;
  pipeWidthPct: number;
  pipeLeftPct: number;
  svgH: number;
  label: string;
  value: number;
  key_: InputKeys;
  constants: Record<ConstantKeys, boolean>;
  onChange: (k: InputKeys, v: number) => void;
  onConstantToggle: (k: ConstantKeys) => void;
  valueBoxCls: string;
  ranges: { min: number; max: number; step: number };
}

function TempInput({ pipeY, pipeWidthPct, pipeLeftPct, svgH, label, value, key_, constants, onChange, onConstantToggle, valueBoxCls, ranges }: TempInputProps) {
  const topPercent = ((pipeY - 36) / svgH) * 100;
  const isConst = Boolean(constants[key_]);
  return (
    <div className="absolute flex flex-col gap-1" style={{ left: `${pipeLeftPct}%`, top: `${topPercent}%`, width: `${pipeWidthPct}%` }}>
      <div className="flex flex-row items-center gap-2 w-full">
        <span className="text-xs text-slate-400 shrink-0">{label}</span>
        <input
          type="number"
          min={ranges.min}
          max={ranges.max}
          step={ranges.step}
          value={value}
          onChange={(e) => onChange(key_, Number(e.target.value) || ranges.min)}
          disabled={isConst}
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
          disabled={isConst}
          className="flex-1 min-w-0 h-1.5 rounded-full appearance-none bg-slate-600 accent-slate-400"
        />
        <label className="flex items-center gap-0.5 shrink-0 cursor-pointer" title="Зафиксировать">
          <input type="checkbox" checked={isConst} onChange={() => onConstantToggle(key_)} className="rounded border-slate-400" />
          <span className="text-[10px] text-slate-400">конст.</span>
        </label>
      </div>
    </div>
  );
}

interface FlowControlProps {
  label: string;
  unit: string;
  value: number;
  key_: InputKeys;
  constant: boolean;
  onChange: (k: InputKeys, v: number) => void;
  onConstantToggle: (k: ConstantKeys) => void;
  valueBoxCls: string;
  range: { min: number; max: number; step: number };
}

function FlowControl({ label, unit, value, key_, constant, onChange, onConstantToggle, valueBoxCls, range }: FlowControlProps) {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-700/95 rounded-lg px-3 py-2 border border-slate-600">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <input
          type="number"
          min={range.min}
          max={range.max}
          step={range.step}
          value={value}
          onChange={(e) => onChange(key_, Number(e.target.value) || range.min)}
          disabled={constant}
          className={`${valueBoxCls} w-16 text-right`}
        />
        <span className="text-xs text-slate-400">{unit}</span>
        <label className="flex items-center gap-0.5 cursor-pointer" title="Зафиксировать">
          <input type="checkbox" checked={constant} onChange={() => onConstantToggle(key_)} className="rounded border-slate-400" />
          <span className="text-[10px] text-slate-400">конст.</span>
        </label>
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(key_, Number(e.target.value))}
        disabled={constant}
        className="w-32 h-2 rounded-full appearance-none bg-slate-600 accent-slate-400"
      />
    </div>
  );
}
