# 🧮 Interactive Array Visualization Tool

A sleek, real-time C++ array visualizer built with React, Monaco Editor, and Chart.js. Write C++-style array declarations and watch them come to life as animated bar charts — perfect for students, educators, and developers learning how arrays evolve in memory.


> 💡 *Supports `int`, `double`, and `char` arrays with dynamic updates!*

---

## ✨ Features

- 📝 **Live C++ Code Editor** — Write array declarations and assignments in real C++ syntax.
- 📊 **Animated Bar Charts** — Visualize array values (or ASCII codes for `char` arrays) with smooth GSAP animations.
- ↔️ **Resizable Panels** — Drag to adjust code and visualization panel widths.
- 🎯 **Real-time Parsing** — Instantly updates the chart as you type.
- 🖥️ **Dark Theme UI** — Modern, distraction-free interface with syntax highlighting.

---

## 🚀 Supported Syntax

### Integer Arrays
```cpp
int arr[5] = {10, 20, 30, 40, 50};
arr[2] = 85;

## Double Arrays
double arr[3] = {1.5, 2.7, 3.14};
arr[1] = 4.2;

## Character Arrays
char arr[4] = "byte";
arr[0] = 'j';

🛠️ Tech Stack
Frontend: React 19, TypeScript
Editor: Monaco Editor (VS Code engine)
Charts: Chart.js + react-chartjs-2
Animations: GSAP
Layout: react-resizable-panels
Styling: Tailwind CSS
Bundler: Vite



📦 Installation
git clone https://github.com/Sarim-Rao/Interactive_Array_Visualization-Tool.git
cd intractive-array

Install dependencies:
npm install

Start the development server:
npm run dev

Open http://localhost:5173 in your browser.

📁 Project Structure

src/
├── App.tsx              # Main application component
├── components/
│   └── ArrayVisualizer.tsx  # Chart visualization component
├── types.ts             # TypeScript interfaces
├── index.css            # Global styles
└── main.tsx             # React entry point