// Simple algorithms implementation
export const algorithmCodeSnippets = {
  linearSearch: `// Linear Search Algorithm
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,

  binarySearch: `// Binary Search Algorithm
int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,

  bubbleSort: `// Bubble Sort Algorithm
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
};

// Import types from the main types file
import type { AlgorithmStep, AlgorithmState, AlgorithmType } from "../types";

// Simple algorithm implementations
export function linearSearch(array: any[], target: any): LocalAlgorithmStep[] {
  const steps: LocalAlgorithmStep[] = [];
  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      highlightedIndices: [i],
      description: `Checking index ${i}: ${array[i]} == ${target}?`,
      comparisons: i + 1,
      swaps: 0,
      iterations: i + 1
    });
    if (array[i] === target) {
      return steps;
    }
  }
  return steps;
}

export interface LocalAlgorithmStep {
  array: any[];
  highlightedIndices: number[];
  mid?: number;
  left?: number;
  right?: number;
  foundIndex?: number;
  description: string;
  comparisons: number;
  swaps: number;
  iterations: number;
}

export function binarySearch(array: any[], target: any): LocalAlgorithmStep[] {
  const steps: LocalAlgorithmStep[] = [];
  let left = 0;
  let right = array.length - 1;
  let comparisons = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    // Step before comparison
    steps.push({
      array: [...array],
      highlightedIndices: [mid], // highlight mid for visualization
      mid,
      left,
      right,
      description: `Checking index ${mid} (value ${array[mid]}) in range [${left}, ${right}]`,
      comparisons,
      swaps: 0,
      iterations: comparisons
    });

    if (array[mid] === target) {
      // Step when target found
      steps.push({
        array: [...array],
        highlightedIndices: [mid],
        mid,
        left,
        right,
        foundIndex: mid,
        description: `✅ Found target ${target} at index ${mid}`,
        comparisons,
        swaps: 0,
        iterations: comparisons
      });

      // Return only steps for UI
      return steps;
    }

    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Target not found: still return steps for UI
  steps.push({
    array: [...array],
    highlightedIndices: [],
    description: `❌ Target ${target} not found in the array`,
    comparisons,
    swaps: 0,
    iterations: comparisons
  });

  return steps;
}

export function bubbleSort(array: any[]): LocalAlgorithmStep[] {
  const steps: LocalAlgorithmStep[] = [];
  const arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlightedIndices: [j, j + 1],
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        comparisons,
        swaps,
        iterations: i + 1
      });
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        steps.push({
          array: [...arr],
          highlightedIndices: [j, j + 1],
          description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
          comparisons,
          swaps,
          iterations: i + 1
        });
      }
    }
  }
  
  return steps;
}

export function initializeAlgorithmState(type: string, array: any[], target?: any): AlgorithmState {
  let steps: LocalAlgorithmStep[] = [];
  
  switch (type) {
    case "linearSearch":
      steps = linearSearch(array, target);
      break;
    case "binarySearch":
      steps = binarySearch(array, target);
      break;
    case "bubbleSort":
      steps = bubbleSort(array);
      break;
  }
  
  // Convert string type to AlgorithmType
  const algorithmType: AlgorithmType = type as AlgorithmType;
  
  return {
    type: algorithmType,
    target,
    currentStep: 0,
    totalSteps: steps.length,
    highlightedIndices: steps[0]?.highlightedIndices || [],
    comparisons: steps[0]?.comparisons || 0,
    swaps: steps[0]?.swaps || 0,
    iterations: steps[0]?.iterations || 0,
    steps: steps as AlgorithmStep[], // Cast to the expected type
    speed: 1
  };
}

export function getNextAlgorithmStep(state: AlgorithmState): AlgorithmState {
  if (state.currentStep >= state.totalSteps - 1) return state;
  
  const nextStep = state.currentStep + 1;
  const step = state.steps[nextStep];
  
  return {
    ...state,
    currentStep: nextStep,
    highlightedIndices: step.highlightedIndices,
    comparisons: step.comparisons,
    swaps: step.swaps,
    iterations: step.iterations
  };
}

export function getPreviousAlgorithmStep(state: AlgorithmState): AlgorithmState {
  if (state.currentStep <= 0) return state;
  
  const prevStep = state.currentStep - 1;
  const step = state.steps[prevStep];
  
  return {
    ...state,
    currentStep: prevStep,
    highlightedIndices: step.highlightedIndices,
    comparisons: step.comparisons,
    swaps: step.swaps,
    iterations: step.iterations
  };
}

export function resetAlgorithmState(state: AlgorithmState): AlgorithmState {
  const firstStep = state.steps[0];
  
  return {
    ...state,
    currentStep: 0,
    highlightedIndices: firstStep?.highlightedIndices || [],
    comparisons: firstStep?.comparisons || 0,
    swaps: firstStep?.swaps || 0,
    iterations: firstStep?.iterations || 0
  };
}