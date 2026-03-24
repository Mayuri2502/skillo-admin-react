import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Loader from "../../components/Loader";
import { formatLabelsByLocale } from "../../utils/formatTimeLabels";
import { useTranslation } from "react-i18next";

// Register the Filler plugin for area charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const SalesChart = ({
  title = "Sales Performance",
  value = "€ 3,200",
  currencySymbol = "€",
  chartData,
  isLoading = false,
  activeTab,
}) => {
  const chartRef = useRef(null);
  const { i18n } = useTranslation();
  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
  const formattedLabels = formatLabelsByLocale(chartData?.labels, locale);

  const labels =
    activeTab === "daily"
      ? formattedLabels
      : chartData?.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const graph = chartData?.values?.map((e) =>
    typeof e === "number" ? e.toFixed(2) : "0.00",
  );
  const graphData = [0, 0, 0, 0, 0];
  // Create gradient function
  const getGradient = (ctx, chartArea) => {
    if (!ctx || !chartArea) return null;

    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );

    gradient.addColorStop(0, "rgba(66, 178, 161, 0.35)");
    gradient.addColorStop(0.6, "rgba(66, 178, 161, 0.15)");
    gradient.addColorStop(1, "rgba(66, 178, 161, 0.02)");

    return gradient;
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: chartData?.values || graphData,
        borderColor: "#42B2A1",
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          return getGradient(ctx, chartArea);
        },
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        categoryPercentage: 0.5,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        offset: true,
        border: {
          display: false,
        },
        ticks: {
          color: "#545454",
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          padding: 10,
        },
      },
      y: {
        beginAtZero: false,
        min: 0,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#b0b0b0",
          callback: function (value) {
            return `${currencySymbol}${value}`;
          },
        },
      },
    },
  };

  // Force chart update after mount to ensure gradient is applied
  useEffect(() => {
    if (chartRef.current) {
      setTimeout(() => {
        chartRef.current?.update();
      }, 100);
    }
  }, []);

  return (
    <div className="bg-white rounded-[28px] shadow-[0px_25.6px_48px_4px_rgba(0,0,0,0.08)] p-5 w-full">
      <p className="text-black text-sm font-semibold mb-4">{title}</p>

      <div className="h-64 overflow-x-auto min-w-full [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full">
        {isLoading || !chartData ? (
          <div className="h-full flex items-center justify-center">
            <Loader className="w-8 h-8 text-[#42B2A1]" />
          </div>
        ) : (
          <div
            className="h-[240px]"
            style={{
              minWidth:
                (chartData?.labels?.length || 0) *
                  (activeTab === "daily" ? 65 : 50) || 350,
            }}
          >
            <Line ref={chartRef} data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
