import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/Loader";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { formatLabelsByLocale } from "../../utils/formatTimeLabels";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const TransactionChart = ({
  title = "Transactions",
  value = "120",
  yLabel = "Transactions",
  currencySymbol = "€",
  trasctionData,
  isLoading = false,
  activeTab,
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
  const formattedLabels = formatLabelsByLocale(trasctionData?.labels, locale);

  const labels =
    activeTab === "daily"
      ? formattedLabels
      : trasctionData?.labels || ["M", "T", "W", "T", "F", "S", "S"];

  const data = {
    labels,
    datasets: [
      {
        label: "Transactions",
        data: trasctionData?.values || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#FF6446",
        barThickness: 30,
        borderRadius: 5,
        categoryPercentage: "25px", // controls space between bars (left/right)
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        padding: {
          left: 50,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#545454",
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false, // show all labels
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#b0b0b0",
          callback: (val) => (currencySymbol ? `${currencySymbol}${val}` : val),
        },
      },
    },
  };

  return (
    <div className="bg-[#FFFFFF] shadow-[0px_25.6px_48px_4px_rgba(0,0,0,0.08)] rounded-[28px] p-2 w-full">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-[#000000] mt-2 ml-2 font-semibold text-sm">
            {title}
          </p>
          <p className="text-white text-xl font-semibold">{value}</p>
        </div>
      </div>

      <div
        className="h-64 overflow-y-auto"
        style={{
          minWidth: "100%",
        }}
      >
        {isLoading || !trasctionData ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader className="w-8 h-8 text-[#FF6446]" />
          </div>
        ) : (
          <div
            className="h-[240px]"
            style={{
              minWidth:
                (trasctionData?.labels?.length || 0) *
                  (activeTab === "daily" ? 65 : 50) || 350,
            }}
          >
            <Bar data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionChart;
