import React, { useState, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "react-monaco-editor";
import ArrayVisualizer from "./components/ArrayVisualizer";
import InfoModal from "./components/InfoModal";
import { Info } from "lucide-react";
import type { ArrayData } from "./types";
import "./index.css";
import {
  parseCharDeclaration,
  parseDoubleDeclaration,
  parseIntDeclaration,
  parseUpdate,
  detectMissingSemicolon,
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
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [currentArrayName, setCurrentArrayName] = useState<string>("");
  const [currentArrayType, setCurrentArrayType] = useState<"int" | "double" | "char" | null>(null);

  useEffect(() => {
    const lines = code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//"));

    const arrays: Record<string, ArrayData> = {};
    const arrayTypes: Record<string, "int" | "double" | "char"> = {};

    lines.forEach((line) => {
      const intDecl = parseIntDeclaration(line);
      const doubleDecl = parseDoubleDeclaration(line);
      const charDecl = parseCharDeclaration(line);
      const update = parseUpdate(line);

      // Check for missing semicolon in update statements
      if (!intDecl && !doubleDecl && !charDecl && !update && detectMissingSemicolon(line)) {
        toast.warning(
          "⚠️ Missing semicolon! Add a semicolon (;) at the end of your statement. Example: values[1] = 9;",
          { autoClose: 4000 }
        );
        return; // Skip processing this line
      }

      if (intDecl) {
        arrayTypes[intDecl.name] = "int";
        if (intDecl.size < 0) {
          toast.error("Negative array sizes are not allowed!");
        } else if (intDecl.size > 0) {
          if (intDecl.values.length > intDecl.size) {
            toast.error(
              `Too many initializers for int array '${intDecl.name}'. Declared size: ${intDecl.size}, provided: ${intDecl.values.length}`
            );
            arrays[intDecl.name] = intDecl.values.slice(0, intDecl.size); // keep only first N
          } else if (intDecl.values.length < intDecl.size) {
            toast.error(
              `Too few initializers for int array '${intDecl.name}'. Declared size: ${intDecl.size}, provided: ${intDecl.values.length}. Please provide exactly ${intDecl.size} values.`
            );
            // Don't create the array if size doesn't match
            return;
          } else {
            // Exact match
            arrays[intDecl.name] = intDecl.values;
          }
        } else {
          arrays[intDecl.name] = intDecl.values;
        }
        return;
      }

      if (doubleDecl) {
        arrayTypes[doubleDecl.name] = "double";
        if (doubleDecl.size < 0) {
          toast.error("Negative array sizes are not allowed!");
        } else if (doubleDecl.size > 0) {
          if (doubleDecl.values.length > doubleDecl.size) {
            toast.error(
              `Too many initial values for array "${doubleDecl.name}". Expected ${doubleDecl.size}, got ${doubleDecl.values.length}.`
            );
            arrays[doubleDecl.name] = doubleDecl.values.slice(
              0,
              doubleDecl.size
            ); // truncate extra
          } else if (doubleDecl.values.length < doubleDecl.size) {
            toast.error(
              `Too few initial values for array "${doubleDecl.name}". Declared size: ${doubleDecl.size}, provided: ${doubleDecl.values.length}. Please provide exactly ${doubleDecl.size} values.`
            );
            // Don't create the array if size doesn't match
            return;
          } else {
            // Exact match
            arrays[doubleDecl.name] = doubleDecl.values;
          }
        } else {
          arrays[doubleDecl.name] = doubleDecl.values;
        }
        return;
      }

      if (charDecl) {
        arrayTypes[charDecl.name] = "char";
        if (charDecl.size < 0) {
          toast.error("Negative array sizes are not allowed!");
        } else if (charDecl.size > 0) {
          if (charDecl.values.length > charDecl.size) {
            toast.error(
              `Too many initial values for array "${charDecl.name}". Expected ${charDecl.size}, got ${charDecl.values.length}.`
            );
            arrays[charDecl.name] = charDecl.values.slice(0, charDecl.size); // truncate
          } else if (charDecl.values.length < charDecl.size) {
            toast.error(
              `Too few initial values for array "${charDecl.name}". Declared size: ${charDecl.size}, provided: ${charDecl.values.length}. Please provide exactly ${charDecl.size} values.`
            );
            // Don't create the array if size doesn't match
            return;
          } else {
            // Exact match
            arrays[charDecl.name] = charDecl.values;
          }
        } else {
          arrays[charDecl.name] = charDecl.values;
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

    const firstArrayName = Object.keys(arrays)[0] || "";
    const firstArray = Object.values(arrays)[0] || [];
    setArrayData(firstArray);
    
    // Track the current array name and type
    if (firstArrayName) {
      setCurrentArrayName(firstArrayName);
      setCurrentArrayType(arrayTypes[firstArrayName] || null);
    } else {
      setCurrentArrayName("");
      setCurrentArrayType(null);
    }
  }, [code]);

  // Handle bar drag updates - update code in real-time
  const handleDataChange = (index: number, value: number | string) => {
    if (!currentArrayName || !currentArrayType) return;

    const lines = code.split("\n");
    let updateLineIndex = -1;
    
    // Find existing update statement for this index
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const update = parseUpdate(line);
      if (update && update.name === currentArrayName && update.index === index) {
        updateLineIndex = i;
        break;
      }
    }

    // Format the value based on type
    let formattedValue: string;
    if (currentArrayType === "char") {
      formattedValue = `'${value}'`;
    } else if (currentArrayType === "double") {
      formattedValue = typeof value === "number" ? value.toString() : parseFloat(value.toString()).toString();
    } else {
      formattedValue = typeof value === "number" ? Math.round(value).toString() : Math.round(parseFloat(value.toString())).toString();
    }

    const newUpdateStatement = `${currentArrayName}[${index}] = ${formattedValue};`;

    if (updateLineIndex >= 0) {
      // Update existing line
      lines[updateLineIndex] = newUpdateStatement;
    } else {
      // Add new update statement at the end (before any trailing comments)
      let insertIndex = lines.length;
      // Find the last non-empty, non-comment line
      for (let i = lines.length - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith("//")) {
          insertIndex = i + 1;
          break;
        }
      }
      lines.splice(insertIndex, 0, newUpdateStatement);
    }

    setCode(lines.join("\n"));
  };

  return (
    <div className="h-[100vh] flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-xy"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <header className="relative bg-black/30 backdrop-blur-xl text-white shadow-2xl border-b border-white/10 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <h1 className="relative text-center text-4xl font-extrabold py-5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-shimmer">
          Interactive Array Visualization Tool
        </h1>
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 transition-all duration-300 text-cyan-300 hover:text-cyan-100 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50"
          aria-label="Show application information"
          title="About this application"
        >
          <Info size={24} />
        </button>
      </header>
      <PanelGroup direction="horizontal" className="flex-1 relative z-0">
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-black/20 backdrop-blur-sm border-r border-white/10 shadow-2xl">
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
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-gradient-to-b from-cyan-500/30 via-purple-500/30 to-pink-500/30 hover:from-cyan-400/60 hover:via-purple-400/60 hover:to-pink-400/60 transition-all duration-300 cursor-ew-resize shadow-lg hover:shadow-cyan-500/50 relative group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-12 bg-white/30 rounded-full group-hover:bg-white/60 transition-all"></div>
          </div>
        </PanelResizeHandle>
        <Panel
          defaultSize={50}
          minSize={30}
          className="bg-black/20 backdrop-blur-sm p-4 flex items-center justify-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative z-10 w-full h-full">
            <ArrayVisualizer data={arrayData} onDataChange={handleDataChange} />
          </div>
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
        className="custom-toast"
        toastClassName="bg-black/80 backdrop-blur-xl border border-white/20"
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
};

export default App;
