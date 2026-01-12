// Type for the array data we track in the state
export type ArrayData = (string | number)[];

export interface VisualizerProps {
  data: ArrayData;
  onDataChange?: (index: number, value: number | string) => void;
}

export interface AppState {
  code: string;
  arrayData: ArrayData;
}

export interface ExecutionState {
  mode: "live" | "step";
  currentLine: number;
  executedLines: number[];
  isPlaying: boolean;
  arrayHistory: ArrayData[];
}

export type ExecutionMode = "live" | "step";