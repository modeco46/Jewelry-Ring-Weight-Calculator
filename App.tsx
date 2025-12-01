import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Settings2, 
  Scale, 
  Info,
  Circle,
  MoveHorizontal,
  Maximize2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { METALS, DEFAULT_DIMENSIONS, LIMITS } from './constants';
import { RingDimensions, CalculationResult } from './types';
import { RingSchematic } from './components/RingSchematic';

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState<RingDimensions>(DEFAULT_DIMENSIONS);
  const [result, setResult] = useState<CalculationResult>({ volumeCm3: 0, weights: {} });

  // Calculate volume and weight whenever dimensions change
  useEffect(() => {
    // 1. Calculate Volume in mm^3
    // V = pi * width * (R_outer^2 - R_inner^2)
    // R_inner = diameter / 2
    // R_outer = R_inner + thickness
    
    const r_inner = dimensions.diameter / 2;
    const r_outer = r_inner + dimensions.thickness;
    
    // Area of annulus cross section = pi * (R^2 - r^2)
    const areaMm2 = Math.PI * (Math.pow(r_outer, 2) - Math.pow(r_inner, 2));
    
    // Volume in mm3
    const volumeMm3 = areaMm2 * dimensions.width;
    
    // Volume in cm3 (1 cm3 = 1000 mm3)
    const volumeCm3 = volumeMm3 / 1000;

    // 2. Calculate Weights
    const weights: Record<string, number> = {};
    METALS.forEach(metal => {
      weights[metal.id] = volumeCm3 * metal.density;
    });

    setResult({ volumeCm3, weights });
  }, [dimensions]);

  const handleInputChange = (field: keyof RingDimensions, value: number) => {
    // Clamp values to limits
    const safeValue = Math.max(LIMITS[field].min, Math.min(LIMITS[field].max, value));
    setDimensions(prev => ({ ...prev, [field]: safeValue }));
  };

  const chartData = useMemo(() => {
    return METALS.map(metal => ({
      name: metal.name.split(' ')[0], // Short name
      fullName: metal.name,
      weight: result.weights[metal.id] || 0,
      color: metal.color
    }));
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Calculator size={20} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">JewelryCalc <span className="text-emerald-600">Pro</span></h1>
          </div>
          <div className="text-xs sm:text-sm font-medium text-slate-500 flex items-center">
            <Info size={14} className="mr-1" />
            Плотность учтена
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Settings2 className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Параметры кольца</h2>
              </div>

              {/* Diameter Input */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Circle size={16} className="mr-2 text-slate-400" />
                    Внутренний диаметр
                  </label>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {dimensions.diameter.toFixed(1)} мм
                  </span>
                </div>
                <input
                  type="range"
                  min={LIMITS.diameter.min}
                  max={LIMITS.diameter.max}
                  step={LIMITS.diameter.step}
                  value={dimensions.diameter}
                  onChange={(e) => handleInputChange('diameter', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all"
                />
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>{LIMITS.diameter.min} мм</span>
                  <span>{LIMITS.diameter.max} мм</span>
                </div>
              </div>

              {/* Thickness Input */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Maximize2 size={16} className="mr-2 text-slate-400" />
                    Толщина профиля
                  </label>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {dimensions.thickness.toFixed(1)} мм
                  </span>
                </div>
                <input
                  type="range"
                  min={LIMITS.thickness.min}
                  max={LIMITS.thickness.max}
                  step={LIMITS.thickness.step}
                  value={dimensions.thickness}
                  onChange={(e) => handleInputChange('thickness', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all"
                />
                 <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>{LIMITS.thickness.min} мм</span>
                  <span>{LIMITS.thickness.max} мм</span>
                </div>
              </div>

              {/* Width Input */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <MoveHorizontal size={16} className="mr-2 text-slate-400" />
                    Ширина кольца
                  </label>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {dimensions.width.toFixed(1)} мм
                  </span>
                </div>
                <input
                  type="range"
                  min={LIMITS.width.min}
                  max={LIMITS.width.max}
                  step={LIMITS.width.step}
                  value={dimensions.width}
                  onChange={(e) => handleInputChange('width', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all"
                />
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>{LIMITS.width.min} мм</span>
                  <span>{LIMITS.width.max} мм</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {METALS.map((metal) => {
                const weight = result.weights[metal.id] || 0;
                return (
                  <div key={metal.id} className={`${metal.bgColor} rounded-xl p-5 border border-slate-100/50 shadow-sm transition-transform hover:scale-105 duration-200`}>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{metal.name}</div>
                    <div className={`text-2xl font-bold ${metal.textColor} mb-1`}>
                      {weight.toFixed(2)} <span className="text-sm font-medium opacity-70">гр</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                       Плотность: {metal.density} г/см³
                    </div>
                  </div>
                );
              })}
            </div>
            
             {/* Chart Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Сравнение веса</div>
               <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)} гр`, 'Вес']}
                        cursor={{fill: 'transparent'}}
                      />
                      <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={32}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#E11D48' : index === 1 ? '#94A3B8' : '#cbd5e1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

          </div>

          {/* Right Column: Visualization & Summary */}
          <div className="lg:col-span-5 space-y-6">
             {/* Schematic */}
            <RingSchematic dimensions={dimensions} />

            {/* Volume Summary */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
               <div className="flex items-center space-x-2 mb-4">
                  <Scale className="text-emerald-400" size={20} />
                  <h3 className="font-bold">Итоговый расчет</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                     <span className="text-slate-400 text-sm">Объем материала</span>
                     <span className="font-mono font-bold text-lg">{result.volumeCm3.toFixed(4)} <span className="text-sm text-slate-500">см³</span></span>
                  </div>
                  <div className="text-sm text-slate-400 leading-relaxed">
                    Расчет произведен для цилиндрического профиля (обручальное кольцо типа "шайба"). Для выпуклых профилей вес может незначительно отличаться.
                  </div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;