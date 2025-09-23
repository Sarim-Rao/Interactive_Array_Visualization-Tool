
// Type for the array data we track in the state
export type ArrayData = (string | number)[];

export interface VisualizerProps {
  data: ArrayData;
  onBarDragEnd?: (index: number, newValue: number) => void;
}

export interface AppState {
  code: string;
  arrayData: ArrayData;
  currentArrayName: string | null;
}