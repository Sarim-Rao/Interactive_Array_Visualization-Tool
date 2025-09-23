import React, { useState, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "react-monaco-editor";
import ArrayVisualizer from "./components/ArrayVisualizer";
import type { ArrayData } from "./types";
import "./index.css";
import {
  parseCharDeclaration,
  parseDoubleDeclaration,
  parseIntDeclaration,
  parseUpdate,
} from "./utils";
import { ToastContainer, toast } from "react-toastify";

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
  const [currentArrayName, setCurrentArrayName] = useState<string | null>(null); // Track name

  const handleBarDragEnd = (index: number, newValue: number) => {
    if (!currentArrayName) return;

    // Update local state
    const newData = [...arrayData];
    newData[index] = isCharData(newData)
      ? String.fromCharCode(newValue)
      : newValue;
    setArrayData(newData);

    // Reconstruct code
    const lines = code.split("\n");
    const newLines = lines.map((line) => {
      const trimmed = line.trim();

      // Match assignment line: e.g., numbers[2] = 85;
      const assignmentRegex = new RegExp(
        `^${currentArrayName}\\[\\s*${index}\\s*]\\s*=\\s*[^;]+;`
      );
      if (assignmentRegex.test(trimmed)) {
        // Replace existing assignment
        const valueStr = isCharData(newData)
          ? `'${newData[index]}'`
          : newData[index];
        return `${currentArrayName}[${index}] = ${valueStr};`;
      }

      // If no assignment exists, append one at the end
      return line;
    });

    // Check if we found and replaced — if not, append new assignment
    const hasAssignment = newLines.some((line) =>
      new RegExp(`^${currentArrayName}\\[\\s*${index}\\s*]\\s*=`).test(
        line.trim()
      )
    );

    let finalCode = newLines.join("\n");
    if (!hasAssignment) {
      const valueStr = isCharData(newData)
        ? `'${newData[index]}'`
        : newData[index];
      finalCode += `\n${currentArrayName}[${index}] = ${valueStr};`;
    }

    setCode(finalCode);
  };

  // Helper to detect if data is char array
  const isCharData = (data: ArrayData): boolean => {
    return data.length > 0 && typeof data[0] === "string";
  };

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
        if (intDecl.size < 0) {
          toast.error("Negative array sizes are not allowed!");
        } else if (intDecl.size > 0 && intDecl.values.length > intDecl.size) {
          toast.error(
            `Too many initializers for int array '${intDecl.name}'. Declared size: ${intDecl.size}, provided: ${intDecl.values.length}`
          );
          arrays[intDecl.name] = intDecl.values.slice(0, intDecl.size); // keep only first N
        } else {
          arrays[intDecl.name] =
            intDecl.size > 0
              ? [
                  ...intDecl.values,
                  ...Array(intDecl.size - intDecl.values.length).fill(0),
                ]
              : intDecl.values;
        }
        return;
      }

      if (doubleDecl) {
        if (doubleDecl.size < 0) {
          toast.error("Negative array sizes are not allowed!");
        } else {
          if (doubleDecl.values.length > doubleDecl.size) {
            toast.error(
              `Too many initial values for array "${doubleDecl.name}". Expected ${doubleDecl.size}, got ${doubleDecl.values.length}.`
            );
            arrays[doubleDecl.name] = doubleDecl.values.slice(
              0,
              doubleDecl.size
            ); // truncate extra
          } else {
            arrays[doubleDecl.name] = doubleDecl.values;
          }
        }
        return;
      }

      if (charDecl) {
        if (charDecl.size < 0) {
          toast.error("Negative array sizes are not allowed!");
        } else {
          if (charDecl.values.length > charDecl.size) {
            toast.error(
              `Too many initial values for array "${charDecl.name}". Expected ${charDecl.size}, got ${charDecl.values.length}.`
            );
            arrays[charDecl.name] = charDecl.values.slice(0, charDecl.size); // truncate
          } else {
            arrays[charDecl.name] = charDecl.values;
          }
        }
        return;
      }

      if (update && arrays[update.name]) {
        const newArr = [...arrays[update.name]];

        if (update.index < 0 || update.index >= newArr.length) {
          toast.error(`Invalid array index: ${update.index}`);
        } else {
          newArr[update.index] = update.value;
          arrays[update.name] = newArr;
        }
      }
    });

    // const firstArray = Object.values(arrays)[0] || [];
    // setArrayData(firstArray);
    const firstArrayName = Object.keys(arrays)[0] || null;
    const firstArray = arrays[firstArrayName] || [];
    setArrayData(firstArray);
    setCurrentArrayName(firstArrayName);
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
          <ArrayVisualizer data={arrayData} onBarDragEnd={handleBarDragEnd} />
        </Panel>
      </PanelGroup>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default App;
