// src/types.ts

// Type for the array data we track in the state
export type ArrayData = string[] | number[];

// Props for the ArrayVisualizer component
export interface VisualizerProps {
  data: ArrayData;
}

// Props for the App component (although mostly self-contained, good practice)
export interface AppState {
  code: string;
  arrayData: ArrayData;
}