import React from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Zap } from "lucide-react";

interface ExecutionControlsProps {
  mode: "live" | "step";
  onModeChange: (mode: "live" | "step") => void;
  currentLine: number;
  totalLines: number;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onPlay: () => void;
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBack: boolean;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  mode,
  onModeChange,
  currentLine,
  totalLines,
  onStepForward,
  onStepBack,
  onReset,
  onPlay,
  isPlaying,
  canStepForward,
  canStepBack,
}) => {
  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Execution Mode</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onModeChange("live")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              mode === "live"
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Zap size={16} className="inline mr-2" />
            Live Mode
          </button>
          <button
            onClick={() => onModeChange("step")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              mode === "step"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <SkipForward size={16} className="inline mr-2" />
            Step Mode
          </button>
        </div>
      </div>

      {mode === "step" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-white/70 text-sm">
            <span>Line Progress</span>
            <span>{currentLine} / {totalLines}</span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalLines > 0 ? (currentLine / totalLines) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={onReset}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reset to start"
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
              onClick={onPlay}
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
        </div>
      )}
    </div>
  );
};

export default ExecutionControls;
