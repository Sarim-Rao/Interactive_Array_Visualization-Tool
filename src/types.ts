// Type for the array data we track in the state
export type ArrayData = (string | number)[];

export interface VisualizerProps {
  data: ArrayData;
  onDataChange?: (index: number, value: number | string) => void;
  highlightedIndices?: number[];
  algorithmState?: AlgorithmState;
}

export interface AppState {
  code: string;
  arrayData: ArrayData;
}

export interface ExecutionState {
  mode: "live" | "step" | "algorithm";
  currentLine: number;
  executedLines: number[];
  isPlaying: boolean;
  arrayHistory: ArrayData[];
  algorithmState?: AlgorithmState;
}

export type ExecutionMode = "live" | "step" | "algorithm";

// Advanced algorithm types
export type AlgorithmType = "linearSearch" | "binarySearch" | "bubbleSort" | null;

export interface AlgorithmState {
  type: AlgorithmType;
  target?: number | string;
  currentStep: number;
  totalSteps: number;
  highlightedIndices: number[];
  comparisons: number;
  swaps: number;
  iterations: number;
  foundIndex?: number;
  isSorted?: boolean;
  steps: AlgorithmStep[];
  speed: number; // Animation speed multiplier (0.5x, 1x, 2x, 4x)
}

export interface AlgorithmStep {
  array: ArrayData;
  highlightedIndices: number[];
  description: string;
  comparisons: number;
  swaps: number;
  iterations: number;
  foundIndex?: number;
}

export interface AlgorithmCode {
  linearSearch: string;
  binarySearch: string;
  bubbleSort: string;
}