import React from 'react';
import { RingDimensions } from '../types';

interface RingSchematicProps {
  dimensions: RingDimensions;
}

export const RingSchematic: React.FC<RingSchematicProps> = ({ dimensions }) => {
  // Normalize sizes for display purpose to fit in SVG
  // We exaggerate thickness slightly for visibility if it's too thin relative to diameter
  const scale = 5;
  const cx = 100;
  const cy = 100;
  
  const innerR = (dimensions.diameter / 2) * scale;
  const outerR = ((dimensions.diameter / 2) + dimensions.thickness) * scale;
  
  // Side view dimensions
  const sideWidth = (dimensions.diameter + (dimensions.thickness * 2)) * scale;
  const sideHeight = dimensions.width * scale;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Визуализация сечения</div>
      
      <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
          {/* Outer Circle (Thickness) */}
          <circle cx={cx} cy={cy} r={outerR} fill="#0F766E" fillOpacity="0.1" stroke="#0F766E" strokeWidth="2" />
          {/* Inner Circle (Hole) */}
          <circle cx={cx} cy={cy} r={innerR} fill="white" stroke="#64748B" strokeWidth="1" strokeDasharray="4 2" />
          
          {/* Dimension Lines */}
          <line x1={cx} y1={cy} x2={cx + innerR} y2={cy} stroke="#64748B" strokeWidth="1" />
          <text x={cx + (innerR/2)} y={cy - 5} textAnchor="middle" fontSize="10" fill="#64748B">Ø {dimensions.diameter}</text>
          
          <line x1={cx + innerR} y1={cy} x2={cx + outerR} y2={cy} stroke="#0F766E" strokeWidth="2" />
          {dimensions.thickness > 1.2 && (
             <text x={cx + innerR + (dimensions.thickness * scale / 2)} y={cy - 5} textAnchor="middle" fontSize="10" fill="#0F766E" fontWeight="bold">T</text>
          )}
        </svg>
        <div className="absolute bottom-0 text-xs text-slate-500 font-medium">Вид сверху</div>
      </div>

      <div className="relative w-full max-w-[240px] flex flex-col items-center justify-center pt-4 border-t border-slate-100">
         <svg width="200" height={Math.max(60, sideHeight + 40)} viewBox={`0 0 200 ${Math.max(60, sideHeight + 40)}`} className="overflow-visible">
            {/* Side View Rect */}
            <rect 
              x={100 - (sideWidth / 2)} 
              y={10} 
              width={sideWidth} 
              height={sideHeight} 
              fill="#0F766E" 
              fillOpacity="0.8" 
              rx="2"
            />
            {/* Width Dimension Line */}
            <line 
              x1={100 + (sideWidth / 2) + 10} 
              y1={10} 
              x2={100 + (sideWidth / 2) + 10} 
              y2={10 + sideHeight} 
              stroke="#0F766E" 
              strokeWidth="1" 
              markerStart="url(#arrow)" 
              markerEnd="url(#arrow)"
            />
            <text x={100 + (sideWidth / 2) + 20} y={10 + (sideHeight / 2)} dominantBaseline="middle" fontSize="11" fill="#0F766E" fontWeight="bold">
               {dimensions.width} мм
            </text>
         </svg>
         <div className="text-xs text-slate-500 font-medium mt-2">Вид сбоку (Ширина)</div>
      </div>
    </div>
  );
};