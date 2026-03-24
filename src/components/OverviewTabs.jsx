import React, { useState } from "react";
import { DatePicker } from "@heroui/react";
import { useTranslation } from "react-i18next";

const OverviewTabs = ({ onTabChange, activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  // const [activeTab, setActiveTab] = useState('weekly');

  const tabs = [
    { id: "daily", label: t("overviewTab.daily") },
    { id: "weekly", label: t("overviewTab.weekly") },
    { id: "monthly", label: t("overviewTab.monthly") },
    { id: "yearly", label: t("overviewTab.yearly") },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className="bg-[#FFFF] backdrop-blur-[10px] min-h-14 rounded-[12px] flex flex-col sm:flex-row items-start sm:items-center px-3 sm:px-4 py-3 sm:py-0 gap-3 sm:gap-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto overflow-x-auto">
        <span className="text-black text-base font-semibold sm:mr-3 whitespace-nowrap">
          {t("overviewTab.overview")}
        </span>
        <div className="border-l border-[#E6E6E666]-3 h-4 sm:h-6 ml-3"></div>
        <div className="bg-[#E6E6E666] rounded-[13px] flex items-center p-1 overflow-x-auto w-full sm:w-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 sm:px-6 py-2 rounded-[13px] text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#0B83D0] text-[#FFFFFF]"
                    : "text-black hover:text-grey"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTabs;
