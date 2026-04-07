// Simplified algorithms for the array visualizer

// Algorithm code snippets for display
export const algorithmCodeSnippets = {
  linearSearch: `// Linear Search Algorithm
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Found at index i
        }
    }
    return -1; // Not found
}`,

  binarySearch: `// Binary Search Algorithm (requires sorted array)
int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid; // Found at index mid
        }
        
        if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    return -1; // Not found
}`,

  bubbleSort: `// Bubble Sort Algorithm
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
};

// Simple algorithm implementations
export function linearSearch(array: any[], target: any): any[] {
  const steps: any[] = [];
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
      steps.push({
        array: [...array],
        highlightedIndices: [i],
        description: `✓ Found ${target} at index ${i}!`,
        comparisons: i + 1,
        swaps: 0,
        iterations: i + 1
      });
      return steps;
    }
  }
  
  steps.push({
    array: [...array],
    highlightedIndices: [],
    description: `✗ ${target} not found in array`,
    comparisons: array.length,
    swaps: 0,
    iterations: array.length
  });
  
  return steps;
}

export function binarySearch(array: any[], target: any): any[] {
  const steps: any[] = [];
  let left = 0;
  let right = array.length - 1;
  let comparisons = 0;
  let iterations = 0;
  
  while (left <= right) {
    iterations++;
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    
    steps.push({
      array: [...array],
      highlightedIndices: [mid, left, right],
      description: `Searching range [${left}, ${right}], checking index ${mid} (value: ${array[mid]})`,
      comparisons,
      swaps: 0,
      iterations
    });
    
    if (array[mid] === target) {
      steps.push({
        array: [...array],
        highlightedIndices: [mid],
        description: `✓ Found ${target} at index ${mid}!`,
        comparisons,
        swaps: 0,
        iterations
      });
      return steps;
    }
    
    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  steps.push({
    array: [...array],
    highlightedIndices: [],
    description: `✗ ${target} not found in array`,
    comparisons,
    swaps: 0,
    iterations
  });
  
  return steps;
}

export function bubbleSort(array: any[]): any[] {
  const steps: any[] = [];
  const arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;
  
  steps.push({
    array: [...arr],
    highlightedIndices: [],
    description: "Starting Bubble Sort algorithm",
    comparisons: 0,
    swaps: 0,
    iterations: 0
  });
  
  for (let i = 0; i < arr.length - 1; i++) {
    iterations++;
    steps.push({
      array: [...arr],
      highlightedIndices: [],
      description: `Pass ${i + 1}: Comparing adjacent elements`,
      comparisons,
      swaps,
      iterations
    });
    
    for (let j = 0; j < arr.length - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlightedIndices: [j, j + 1],
        description: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
        comparisons,
        swaps,
        iterations
      });
      
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        steps.push({
          array: [...arr],
          highlightedIndices: [j, j + 1],
          description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
          comparisons,
          swaps,
          iterations
        });
      }
    }
  }
  
  steps.push({
    array: [...arr],
    highlightedIndices: Array.from({length: arr.length}, (_, i) => i),
    description: "✓ Array is now completely sorted!",
    comparisons,
    swaps,
    iterations
  });
  
  return steps;
}

export function initializeAlgorithmState(type: string, array: any[], target?: any): any {
  let steps: any[] = [];
  
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
    default:
      steps = [];
  }
  
  return {
    type,
    target,
    currentStep: 0,
    totalSteps: steps.length,
    highlightedIndices: steps[0]?.highlightedIndices || [],
    comparisons: steps[0]?.comparisons || 0,
    swaps: steps[0]?.swaps || 0,
    iterations: steps[0]?.iterations || 0,
    steps,
    speed: 1
  };
}

export function getNextStep(state: any) {
  if (!state || state.currentStep >= state.totalSteps - 1) {
    return state;
  }
  
  const nextStep = state.currentStep + 1;
  const step = state.steps[nextStep];
  
  return {
    ...state,
    currentStep: nextStep,
    highlightedIndices: step.highlightedIndices || [],
    comparisons: step.comparisons || 0,
    swaps: step.swaps || 0,
    iterations: step.iterations || 0
  };
}

export function getPreviousStep(state: any) {
  if (!state || state.currentStep <= 0) {
    return state;
  }
  
  const prevStep = state.currentStep - 1;
  const step = state.steps[prevStep];
  
  return {
    ...state,
    currentStep: prevStep,
    highlightedIndices: step.highlightedIndices || [],
    comparisons: step.comparisons || 0,
    swaps: step.swaps || 0,
    iterations: step.iterations || 0
  };
}

export function resetAlgorithm(state: any) {
  if (!state || !state.steps || state.steps.length === 0) {
    return state;
  }
  
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