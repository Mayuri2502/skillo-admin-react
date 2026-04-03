import { FaEye } from "react-icons/fa";
import { TruncatedCell } from "../../usermanagment/components/Columns";
import { useTranslation } from "react-i18next";

export const getRequestColumns = ({ navigate, t }) => {
  return [
    {
      key: "id",
      label: "Request id",
      width: "70px",
      render: (val) => <TruncatedCell value={val} maxWidth={70} />,
    },

    {
      key: "category_name",
      label: t("RequestManagementData.serviceCategory"),
      width: "180px",
      render: (val) => {
        const iconName = renderIcons(val);

        const iconSrc = `/assets/icons/${iconName}.png`;

        return (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 min-w-[32px] overflow-hidden bg-gray-200 bg-transparent">
              <img src={iconSrc} alt={val} className="object-cover w-6 h-6" />
            </div>
            <TruncatedCell value={val} maxWidth={130} />
          </div>
        );
      },
    },

    {
      key: "sub_category_name",
      label: t("RequestManagementData.serviceName"),
      width: "220px",
      render: (val) => <TruncatedCell value={val} maxWidth={200} />,
    },

    {
      key: "elder_name",
      label: t("RequestManagementData.elderName"),
      width: "200px",
      render: (val) => <TruncatedCell value={val} maxWidth={180} />,
    },

    {
      key: "validation_amount",
      label: t("RequestManagementData.valuation"),
      width: "120px",
      render: (val) => (
        <TruncatedCell
          value={val !== null && val !== undefined ? `€${val}` : "-"}
          maxWidth={100}
        />
      ),
    },

    {
      key: "professional_name",
      label: t("RequestManagementData.proficinalName"),
      width: "180px",
      render: (val) => <TruncatedCell value={val} maxWidth={160} />,
    },

    {
      key: "status",
      label: t("RequestManagementData.status"),
      width: "120px",
      render: (val) => {
        const statusKey = String(val || "")
          .toLowerCase()
          .trim();
        const colorClass = STATUS_COLOR_MAP[statusKey] || "text-gray-400";

        return (
          <span
            className={`block truncate whitespace-nowrap font-medium capitalize ${colorClass}`}
            style={{ maxWidth: 100 }}
            title={val}
          >
            {val || "-"}
          </span>
        );
      },
    },

    {
      key: "action",
      label: t("RequestManagementData.action"),
      width: "100px",
      render: (_, row) => (
        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/requests/${row.id}`)}
            className="
              group h-10 w-10 flex items-center justify-center rounded-xl
              bg-[#FF94291F] hover:bg-[#EC613D] transition-colors
            "
          >
            <FaEye className="text-[#FF9429] group-hover:text-white" />
          </button>
        </div>
      ),
    },
  ];
};

export const renderIcons = (name) => {
  switch (name) {
    case "Pets":
      return "pets";
    case "Homecare":
      return "homecare";
    case "Housekeeping":
      return "housekeeping";
    case "Childcare":
      return "childcare";
    case "DIY":
      return "diy";
    case "Transport":
      return "transport";
    case "Personal Care":
      return "personal-care";
    case "Tech Support":
      return "support";
    case "Gardening":
      return "gardening";
    default:
      return "pets";
  }
};

export const STATUS_COLOR_MAP = {
  // Success
  accepted: "text-green-600",
  completed: "text-green-600",

  // Pending / In progress
  pending: "text-yellow-600",
  send: "text-yellow-600",

  // Informational
  open: "text-blue-600",

  // Error / Failure
  rejected: "text-red-600",
  cancelled: "text-red-600",

  // Inactive / System
  expired: "text-gray-500",
};

const statusColor = {
  completed: "text-[#46BCAA]",
  pending: "text-[#F39C12]",
  assigned: "text-[#2ECC71]",
  cancelled: "text-[#E74C3C]",
};
