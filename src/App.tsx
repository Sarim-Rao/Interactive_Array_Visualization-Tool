
import React, { useState, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import MonacoEditor from 'react-monaco-editor';
import ArrayVisualizer from './components/ArrayVisualizer';
import type { ArrayData } from './types';
import './index.css';

// --- Parsing Functions ---

/**
 * Parses a C++ `int` array declaration.
 * Example: `int arr[5] = {10, 20, 30, 40, 50};`
 */
const parseIntDeclaration = (line: string): number[] | null => {
  const match = line.match(/int\s+arr\[\s*\d*\s*]\s*=\s*\{([^}]+)\};/);
  if (match) {
    const values = match[1].split(',').map(s => {
      const num = parseInt(s.trim(), 10);
      return isNaN(num) ? 0 : num;
    });
    return values;
  }
  return null;
};


/**
 * Parses a C++ `double` array declaration.
 * Example: `double arr[3] = {1.5, 2.7, 3.14};`
 */
const parseDoubleDeclaration = (line: string): number[] | null => {
  const match = line.match(/double\s+arr\[\s*\d*\s*]\s*=\s*\{([^}]+)\};/);
  if (match) {
    const values = match[1].split(',').map(s => {
      const num = parseFloat(s.trim());
      return isNaN(num) ? 0.0 : num;
    });
    return values;
  }
  return null;
};


/**
 * Parses a C++ `char` array declaration from a string literal or braced list.
 * Example: `char arr[5] = "Hello";` or `char arr[5] = {'H', 'e', 'l', 'l', 'o'};`
 */
const parseCharDeclaration = (line: string): string[] | null => {
  // Regex for string literal: `char arr[size] = "string";`
  const stringLiteralMatch = line.match(/char\s+arr\[\s*\d*\s*]\s*=\s*"([^"]*)";/);
  if (stringLiteralMatch) {
    return stringLiteralMatch[1].split('');
  }
  return null;
};


/**
 * Parses an element update for an array of any type.
 * Examples: `arr[2] = 85;` or `arr[0] = 'a';`
 */
const parseUpdate = (line: string): { index: number; value: number | string } | null => {
  const intUpdateMatch = line.match(/arr\[(\d+)]\s*=\s*(\d+);/);
  if (intUpdateMatch) {
    const index = parseInt(intUpdateMatch[1], 10);
    const value = parseInt(intUpdateMatch[2], 10);
    if (!isNaN(index) && !isNaN(value)) {
      return { index, value };
    }
  }

   // Match double update (supports decimals and integers too)
  const doubleUpdateMatch = line.match(/arr\[(\d+)]\s*=\s*([\d.]+);/);
  if (doubleUpdateMatch) {
    const index = parseInt(doubleUpdateMatch[1], 10);
    const value = parseFloat(doubleUpdateMatch[2]);
    if (!isNaN(index) && !isNaN(value)) {
      return { index, value };
    }
  }

  const charUpdateMatch = line.match(/arr\[(\d+)]\s*=\s*'(.*)';/);
  if (charUpdateMatch) {
    const index = parseInt(charUpdateMatch[1], 10);
    const value = charUpdateMatch[2];
    if (!isNaN(index) && value.length === 1) {
      return { index, value };
    }
  }
  return null;
};

// --- Main Component ---

const initialCode = `// C++ Array Visualization Prototype
// Supports int, char, and double arrays.

// Example: Integer Array
int arr[5] = {10, 20, 30, 40, 50}; 
arr[2] = 85; 

// Example: Character Array
// char arr[4] = "byte";
// arr[0] = 'j';

// Example: Double Array
// double arr[3] = {1.5, 2.7, 3.14};
// arr[1] = 4.2;
`;

const App: React.FC = () => {
  const [code, setCode] = useState<string>(initialCode);
  const [arrayData, setArrayData] = useState<ArrayData>([]);

  useEffect(() => {
    const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('//'));
    let currentArray: ArrayData = [];

    // Process all lines sequentially to build the array state
    lines.forEach(line => {
      // Prioritize declaration types
      const charDeclaration = parseCharDeclaration(line);
      const intDeclaration = parseIntDeclaration(line);
      const doubleDeclaration = parseDoubleDeclaration(line);

      if (charDeclaration) {
        currentArray = charDeclaration;
        return;
      }
      if (intDeclaration) {
        currentArray = intDeclaration;
        return;
      }
      if (doubleDeclaration) {
        currentArray = doubleDeclaration;
        return;
      }

      // Handle updates after declaration
      const update = parseUpdate(line);
      if (update && currentArray.length > update.index) {
        const newArr = [...currentArray];
        if (typeof update.value === 'number') {
          newArr[update.index] = update.value;
        } else if (typeof update.value === 'string') {
          newArr[update.index] = update.value;
        }
        currentArray = newArr;
      }
    });

    setArrayData(currentArray);
  }, [code]);




  return (
    <div className="h-[100vh] flex flex-col">
      <h1 className="text-center text-3xl font-extrabold py-4 bg-gray-900 text-white shadow-lg">
        Interactive Array Visualization Tool 
      </h1>
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30} >
          <MonacoEditor
            width="100%"
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(newValue) => setCode(newValue)}
             options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              scrollbar: {
                vertical: "hidden",  // 👈 hides vertical scrollbar
                verticalScrollbarSize: 0
              },
              overviewRulerLanes: 0,  
              lineNumbersMinChars: 3, 
            }}
          />
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-600 hover:bg-teal-500 transition-colors duration-200 cursor-ew-resize" />
        <Panel defaultSize={50} minSize={30} className="bg-gray-900 p-4 flex items-center justify-center">
          <ArrayVisualizer data={arrayData} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default App;