import React, { useState } from "react";
import { Search, SortAsc, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import type { AlgorithmType } from "../types";

interface AlgorithmControlsProps {
  algorithmState: any; // Using any to avoid TypeScript issues for now
  onAlgorithmSelect: (type: any, target?: number | string) => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBack: boolean;
  currentArray: (string | number)[];
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithmState,
  onAlgorithmSelect,
  onStepForward,
  onStepBack,
  onReset,
  onPlay,
  onPause,
  onSpeedChange,
  isPlaying,
  canStepForward,
  canStepBack,
  currentArray,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(null);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [showTargetInput, setShowTargetInput] = useState(false);

  const handleAlgorithmSelect = (type: AlgorithmType) => {
    setSelectedAlgorithm(type);
    
    if (type === "linearSearch" || type === "binarySearch") {
      setShowTargetInput(true);
    } else {
      setShowTargetInput(false);
      onAlgorithmSelect(type);
    }
  };

  const handleRunAlgorithm = () => {
    if (!selectedAlgorithm) return;
    
    if (selectedAlgorithm === "linearSearch" || selectedAlgorithm === "binarySearch") {
      if (!searchTarget.trim()) {
        alert("Please enter a target value");
        return;
      }
      
      // Parse target value based on array type
      let target: number | string;
      if (currentArray.length > 0 && typeof currentArray[0] === "number") {
        target = parseFloat(searchTarget);
        if (isNaN(target)) {
          alert("Please enter a valid number");
          return;
        }
      } else {
        target = searchTarget.length === 1 ? searchTarget : searchTarget;
      }
      
      onAlgorithmSelect(selectedAlgorithm, target);
    } else {
      onAlgorithmSelect(selectedAlgorithm);
    }
  };

  const handleSpeedChange = (speed: number) => {
    onSpeedChange(speed);
  };

  const speedOptions = [
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
    { value: 4, label: "4x" },
  ];

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-white font-semibold text-lg">Algorithm Operations</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {algorithmState && (
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span className="px-2 py-1 bg-cyan-500/20 rounded">
              {algorithmState.type === "linearSearch" && "Linear Search"}
              {algorithmState.type === "binarySearch" && "Binary Search"}
              {algorithmState.type === "bubbleSort" && "Bubble Sort"}
            </span>
            <span className="px-2 py-1 bg-purple-500/20 rounded">
              Step {algorithmState.currentStep + 1}/{algorithmState.totalSteps}
            </span>
          </div>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Algorithm Selection */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3">Select Algorithm</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAlgorithmSelect("linearSearch")}
                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                  selectedAlgorithm === "linearSearch"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Search size={24} className="mb-2" />
                <span className="text-sm font-medium">Linear Search</span>
              </button>

              <button
                onClick={() => handleAlgorithmSelect("binarySearch")}
                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                  selectedAlgorithm === "binarySearch"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Search size={24} className="mb-2" />
                <span className="text-sm font-medium">Binary Search</span>
              </button>

              <button
                onClick={() => handleAlgorithmSelect("bubbleSort")}
                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                  selectedAlgorithm === "bubbleSort"
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <SortAsc size={24} className="mb-2" />
                <span className="text-sm font-medium">Bubble Sort</span>
              </button>
            </div>
          </div>

          {/* Target Input for Search Algorithms */}
          {showTargetInput && (
            <div className="mb-6">
              <h4 className="text-white/80 text-sm font-medium mb-2">
                Enter Target Value
              </h4>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder={
                    currentArray.length > 0 && typeof currentArray[0] === "number"
                      ? "Enter number to search"
                      : "Enter character to search"
                  }
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  onClick={handleRunAlgorithm}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-400 hover:to-emerald-400 transition-all duration-200 hover:scale-105"
                >
                  Run
                </button>
              </div>
            </div>
          )}

          {/* Algorithm Controls */}
          {algorithmState && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-white/70 text-sm">
                <div className="space-x-4">
                  <span>Comparisons: <span className="text-cyan-300 font-bold">{algorithmState.comparisons}</span></span>
                  {algorithmState.type === "bubbleSort" && (
                    <span>Swaps: <span className="text-pink-300 font-bold">{algorithmState.swaps}</span></span>
                  )}
                  <span>Iterations: <span className="text-purple-300 font-bold">{algorithmState.iterations}</span></span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-white/70">Speed:</span>
                  <div className="flex space-x-1">
                    {speedOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSpeedChange(option.value)}
                        className={`px-2 py-1 rounded text-xs ${
                          algorithmState.speed === option.value
                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(algorithmState.currentStep + 1) / algorithmState.totalSteps * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={onReset}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reset algorithm"
                >
                  <RotateCcw size={18} />
                </button>
                
                <button
                  onClick={onStepBack}
                  disabled={!canStepBack}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Step back"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={isPlaying ? onPause : onPlay}
                  className={`p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isPlaying
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  }`}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={onStepForward}
                  disabled={!canStepForward}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Step forward"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Algorithm Description */}
              {algorithmState.steps[algorithmState.currentStep] && (
                <div className="mt-4 p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <p className="text-sm text-gray-200">
                    {algorithmState.steps[algorithmState.currentStep].description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Run Button for Non-Search Algorithms */}
          {selectedAlgorithm && !showTargetInput && !algorithmState && (
            <div className="mt-4">
              <button
                onClick={handleRunAlgorithm}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Run {selectedAlgorithm === "bubbleSort" ? "Bubble Sort" : "Algorithm"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlgorithmControls;