import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import gsap from "gsap";
import type { VisualizerProps } from "../types";
import dragDataPlugin from "chartjs-plugin-dragdata";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  dragDataPlugin
);

const ArrayVisualizer: React.FC<VisualizerProps> = ({ data, onBarDragEnd }) => {
  const chartRef = useRef<ChartJS<"bar", number[], string> | null>(null);

  let labels: string[];
  let chartDataValues: number[];
  let yAxisMax: number | undefined;

  const isCharArray = data.length > 0 && typeof data[0] === "string";

  if (isCharArray) {
    labels = data.map(
      (char) => `'${char}' (${(char as string).charCodeAt(0)})`
    );
    chartDataValues = (data as string[]).map((char) => char.charCodeAt(0));
    yAxisMax = 130; // Accommodate the ASCII range
  } else {
    labels = (data as number[]).map((_, i) => `[${i}]`);
    chartDataValues = data as number[];
    // Dynamically set y-axis max for better scaling
    yAxisMax =
      Math.max(...chartDataValues) > 0
        ? Math.max(...chartDataValues) * 1.2
        : 100;
  }

  const chartData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: isCharArray ? "ASCII Values" : "Array Values",
        data: chartDataValues,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false, // GSAP handles animation
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Array Visualization", color: "white" },
      dragData: {
        // ✅ Enable drag plugin
        round: isCharArray ? 0 : 1, // round char to whole numbers (ASCII), decimals for numbers
        showTooltip: true,
        onDragStart: (e: any) => console.log("Drag start", e),
        onDrag: (
          e: any,
          datasetIndex: number,
          index: number,
          value: number
        ) => {
          // You can hook into this if needed
        },
        onDragEnd: (
          e: any,
          datasetIndex: number,
          index: number,
          value: number
        ) => {
          // ✅ This is where you update state & sync to code
          onBarDragEnd(index, value);
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "white" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "white" },
        beginAtZero: true as const,
        max: yAxisMax,
      },
    },
  };

  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;
    if (chartInstance) {
      const bars = chartInstance.getDatasetMeta(0).data;
      gsap.fromTo(
        bars,
        { scaleY: 0.1, duration: 0.5 },
        { scaleY: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [data]);

  return (
    <div className="w-full max-w-4xl mx-auto h-full p-4 flex items-center justify-center">
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ArrayVisualizer;
