import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import dragData from "chartjs-plugin-dragdata";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  dragData
);

const ArrayVisualizer: React.FC<VisualizerProps> = ({ data, onDataChange }) => {
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

  // Create gradient colors for bars
  const createGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.8)"); // cyan-500
    gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.8)"); // purple-500
    gradient.addColorStop(1, "rgba(236, 72, 153, 0.8)"); // pink-500
    return gradient;
  };

  const chartData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: isCharArray ? "ASCII Values" : "Array Values",
        data: chartDataValues,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(6, 182, 212, 0.8)";
          return createGradient(ctx);
        },
        borderColor: (context) => {
          const index = context.dataIndex;
          const colors = [
            "rgba(6, 182, 212, 1)", // cyan
            "rgba(168, 85, 247, 1)", // purple
            "rgba(236, 72, 153, 1)", // pink
          ];
          return colors[index % colors.length];
        },
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false as const, // GSAP handles animation
    plugins: {
      dragData: {
        round: 0,
        showTooltip: true,
        onDragStart: () => {
          document.body.style.cursor = "grabbing";
        },
        onDrag: (_e: any, _datasetIndex: number, index: number, value: number | [number, number] | null) => {
          if (value === null || Array.isArray(value)) return;
          chartDataValues[index] = value;
          // Convert back to original type if it's a char array
          if (isCharArray && onDataChange) {
            const charValue = String.fromCharCode(value);
            onDataChange(index, charValue);
          } else if (onDataChange) {
            onDataChange(index, value);
          }
        },
        onDragEnd: (_e: any, _datasetIndex: number, index: number, value: number | [number, number] | null) => {
          document.body.style.cursor = "default";
          if (value !== null && !Array.isArray(value)) {
            console.log(`Bar ${index} updated to ${value}`);
          }
        }
      },
      legend: { display: false },
      title: {
        display: true,
        text: "Array Visualization",
        color: "#fff",
        font: {
          size: 20,
          weight: "bold" as const,
          family: "'Inter', sans-serif",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(6, 182, 212, 0.5)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 12,
            weight: "normal" as const,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 12,
            weight: "normal" as const,
          },
        },
        beginAtZero: true as const,
        max: yAxisMax,
      },
    },
  };

  useEffect(() => {
    // Use setTimeout to ensure chart is rendered
    const timer = setTimeout(() => {
      const chartInstance = chartRef.current;
      if (chartInstance) {
        try {
          const bars = chartInstance.getDatasetMeta(0).data;
          gsap.fromTo(
            bars,
            { scaleY: 0.1, duration: 0.5 },
            { scaleY: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
          );
        } catch (error) {
          // Chart might not be ready yet
          console.debug("Chart animation skipped:", error);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="w-full max-w-5xl mx-auto h-full p-6 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
      <div className="relative z-10 w-full h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-6">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ArrayVisualizer;
