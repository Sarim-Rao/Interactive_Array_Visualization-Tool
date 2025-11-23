import React from "react";
import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-b border-white/20 px-6 py-5 flex justify-between items-center z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About This Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-gradient-to-br hover:from-cyan-500/20 hover:to-purple-500/20 hover:border hover:border-white/30 hover:scale-110"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-200">
          {/* Overview */}
          <section className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Overview
            </h3>
            <p className="text-gray-200 leading-relaxed">
              This Interactive Array Visualization Tool allows you to write C++ array
              declarations and updates in real-time, and see them visualized as animated
              bar charts. It supports integer, character, and double arrays with instant
              visual feedback.
            </p>
          </section>

          {/* Features */}
          <section className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              Features
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Multiple Data Types:</strong> Support for
                int, char, and double arrays
              </li>
              <li>
                <strong className="text-white">Real-time Visualization:</strong> See your
                arrays update instantly as you type
              </li>
              <li>
                <strong className="text-white">Animated Charts:</strong> Beautiful bar
                charts with smooth animations using GSAP
              </li>
              <li>
                <strong className="text-white">Syntax Highlighting:</strong> Monaco Editor
                with C++ syntax support
              </li>
              <li>
                <strong className="text-white">Error Handling:</strong> Real-time error
                notifications for invalid operations
              </li>
              <li>
                <strong className="text-white">Resizable Panels:</strong> Adjust the
                editor and visualization panels to your preference
              </li>
              <li>
                <strong className="text-white">Character Array Support:</strong> Visualize
                character arrays with ASCII value representation
              </li>
            </ul>
          </section>

          {/* How It Works */}
          <section className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong className="text-white">Write C++ Code:</strong> Type your array
                declarations and updates in the left panel editor
              </li>
              <li>
                <strong className="text-white">Automatic Parsing:</strong> The application
                automatically parses your code as you type
              </li>
              <li>
                <strong className="text-white">Real-time Updates:</strong> The
                visualization panel updates instantly to reflect your changes
              </li>
              <li>
                <strong className="text-white">Visual Feedback:</strong> See your arrays
                represented as animated bar charts with proper scaling
              </li>
              <li>
                <strong className="text-white">Error Notifications:</strong> Invalid
                operations trigger toast notifications with helpful error messages
              </li>
            </ol>
          </section>

          {/* Usage Examples */}
          <section className="bg-gradient-to-br from-pink-500/5 to-cyan-500/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Usage Examples
            </h3>
            <div className="space-y-4">
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border-l-4 border-cyan-400 shadow-lg hover:shadow-cyan-500/20 transition-all">
                <p className="text-sm font-mono text-cyan-300 mb-2 font-semibold">
                  Integer Array:
                </p>
                <code className="text-sm text-cyan-200 block font-mono">
                  int numbers[5] = {`{10, 20, 30, 40, 50}`};
                  <br />
                  numbers[2] = 85;
                </code>
              </div>

              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border-l-4 border-purple-400 shadow-lg hover:shadow-purple-500/20 transition-all">
                <p className="text-sm font-mono text-purple-300 mb-2 font-semibold">
                  Character Array:
                </p>
                <code className="text-sm text-purple-200 block font-mono">
                  char word[4] = "byte";
                  <br />
                  word[0] = 'j';
                </code>
              </div>

              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border-l-4 border-pink-400 shadow-lg hover:shadow-pink-500/20 transition-all">
                <p className="text-sm font-mono text-pink-300 mb-2 font-semibold">
                  Double Array:
                </p>
                <code className="text-sm text-pink-200 block font-mono">
                  double values[3] = {`{1.5, 2.7, 3.14}`};
                  <br />
                  values[1] = 4.2;
                </code>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              Tips & Notes
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Comments (lines starting with <code className="text-cyan-300 bg-black/30 px-1 rounded">//</code>)
                are automatically ignored
              </li>
              <li>
                Array indices are validated - accessing invalid indices will show an error
              </li>
              <li>
                Array size validation ensures you don't exceed declared array bounds
              </li>
              <li>
                Character arrays display both the character and its ASCII value
              </li>
              <li>
                The chart automatically scales to fit your data range
              </li>
              <li>
                You can resize the panels by dragging the divider between them
              </li>
              <li>
                <strong className="text-yellow-300">Important:</strong> All statements must end with a semicolon (<code className="text-cyan-300 bg-black/30 px-1 rounded">;</code>). 
                Update statements like <code className="text-cyan-300 bg-black/30 px-1 rounded">values[1] = 9</code> won't be applied without a semicolon. 
                Use <code className="text-cyan-300 bg-black/30 px-1 rounded">values[1] = 9;</code> instead.
              </li>
            </ul>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-t border-white/20 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;

