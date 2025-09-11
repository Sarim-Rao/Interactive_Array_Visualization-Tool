import React, { useState, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "react-monaco-editor";
import ArrayVisualizer from "./components/ArrayVisualizer";
import type { ArrayData } from "./types";
import "./index.css";
import { parseCharDeclaration, parseDoubleDeclaration, parseIntDeclaration, parseUpdate } from "./utils";



// --- Main Component ---

const initialCode = `// C++ Array Visualization Prototype
// Supports int, char, and double arrays.

// Example: Integer Array
int numbers[5] = {10, 20, 30, 40, 50}; 
numbers[2] = 85; 

// Example: Character Array
// char word[4] = "byte";
// word[0] = 'j';

// Example: Double Array
// double values[3] = {1.5, 2.7, 3.14};
// values[1] = 4.2;
`;

const App: React.FC = () => {
  const [code, setCode] = useState<string>(initialCode);
  const [arrayData, setArrayData] = useState<ArrayData>([]);

  useEffect(() => {
    const lines = code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//"));

    const arrays: Record<string, ArrayData> = {};

    lines.forEach((line) => {
      const intDecl = parseIntDeclaration(line);
      const doubleDecl = parseDoubleDeclaration(line);
      const charDecl = parseCharDeclaration(line);
      const update = parseUpdate(line);

      if (intDecl) {
        arrays[intDecl.name] = intDecl.values;
        return;
      }
      if (doubleDecl) {
        arrays[doubleDecl.name] = doubleDecl.values;
        return;
      }
      if (charDecl) {
        arrays[charDecl.name] = charDecl.values;
        return;
      }

      if (update && arrays[update.name]) {
        const newArr = [...arrays[update.name]];
        newArr[update.index] = update.value;
        arrays[update.name] = newArr;
      }
    });

    const firstArray = Object.values(arrays)[0] || [];
    setArrayData(firstArray);
  }, [code]);

  return (
    <div className="h-[100vh] flex flex-col">
      <h1 className="text-center text-3xl font-extrabold py-4 bg-gray-900 text-white shadow-lg">
        Interactive Array Visualization Tool
      </h1>
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
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
                vertical: "hidden",
                verticalScrollbarSize: 0,
              },
              overviewRulerLanes: 0,
              lineNumbersMinChars: 3,
            }}
          />
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-teal-500 transition-colors duration-200 cursor-ew-resize" />
        <Panel
          defaultSize={50}
          minSize={30}
          className="bg-gray-900 p-4 flex items-center justify-center"
        >
          <ArrayVisualizer data={arrayData} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default App;