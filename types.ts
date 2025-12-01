export interface Metal {
  id: string;
  name: string;
  density: number; // g/cm3
  color: string;
  textColor: string;
  bgColor: string;
}

export interface RingDimensions {
  diameter: number; // inner diameter in mm
  thickness: number; // wall thickness in mm
  width: number; // height of the ring in mm
}

export interface CalculationResult {
  volumeCm3: number;
  weights: Record<string, number>; // metalId -> weight in grams
}