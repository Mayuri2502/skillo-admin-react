import { Tooltip, Avatar } from "@heroui/react"; // Import Avatar from your UI kit
import { FaEye } from "react-icons/fa";
import { RiUserForbidFill } from "react-icons/ri";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getColumns = (
  userType,
  navigate,
  setModelOpen,
  setSelectedUser,
  pageSize,
  page,
  t,
) => {
  const renderUserCell = (name, row) => (
    <div className="flex items-center gap-3 min-w-0">
      {!name ? (
        <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <span className="text-[#9AA0A6] text-[10px]">N/A</span>
        </div>
      ) : (
        <Avatar
          src={row.profile_photo_url}
          name={name}
          size="sm"
          className="w-10 h-10 min-w-[40px]"
          classNames={{ base: "bg-[#F5F5F5]" }}
        />
      )}

      <TruncatedCell value={name} maxWidth={160} />
    </div>
  );

  const commonColumns = [
    {
      key: "email",
      label: t("email"),
      width: "200px",
      render: (val) => <TruncatedCell value={val} maxWidth={200} />,
    },
    ...(userType === "service_provider"
      ? [
          {
            key: "service_provider_type",
            label: t("professionalUser"),
            width: "120px",
            render: (val) => <TruncatedCell value={val} maxWidth={120} />,
          },
        ]
      : []),
    {
      key: "created_at",
      label: t("accountCreatedOn"),
      width: "140px",
      render: (val) => (
        <TruncatedCell
          value={val ? new Date(val).toLocaleDateString() : "-"}
          maxWidth={140}
        />
      ),
    },

    {
      key: "last_login_at",
      label: t("lastLogin"),
      width: "160px",
      render: (val) => (
        <TruncatedCell
          value={val ? new Date(val).toLocaleDateString() : "-"}
          maxWidth={160}
        />
      ),
    },
  ];

  const typeSpecificColumns = [
    {
      key: "id",
      label: "#",
      width: "60px",
      render: (_val, _row, currentIndex) => (
        <span className="text-[#1F2128] font-light text-sm">
          {currentIndex + 1}
        </span>
      ),
    },
    {
      key: "first_name",
      label: t("firstName"),
      width: "200px",
      render: (val, row) => renderUserCell(val, row), // Merged photo + name
    },
    {
      key: "last_name",
      label: t("lastName"),
      width: "150px",
      render: (val) => <TruncatedCell value={val} maxWidth={150} />,
    },
  ];

  const actionColumn = {
    key: "action",
    label: t("action"),
    width: "150px",
    render: (_, row) => {
      const isBanned = row.is_banned === true;
      const isActive = !isBanned;

      return (
        <div className="flex gap-2 items-center">
          {/* View Button */}
          <button
            disabled={!isActive}
            onClick={() =>
              navigate(
                `/user-management/${
                  userType === "elderly_user"
                    ? "elder-users"
                    : "professional-users"
                }/${row.id}`,
              )
            }
            className={`
            group h-10 w-10 flex items-center justify-center rounded-xl transition-colors
            ${
              isActive
                ? "bg-[#FF94291F] hover:bg-[#2C6587] cursor-pointer"
                : "bg-gray-200 cursor-not-allowed"
            }
          `}
          >
            <FaEye
              className={`
              transition-colors
              ${
                isActive
                  ? "text-[#FF9429] group-hover:text-white"
                  : "text-gray-400"
              }
            `}
            />
          </button>

          {/* Ban / Unban Button */}
          <button
            onClick={() => {
              setSelectedUser(row);
              setModelOpen(true);
            }}
            className={`
            group h-10 w-10 flex items-center justify-center rounded-xl transition-colors
            ${
              isBanned
                ? "bg-[#2C65871F] hover:bg-[#2C6587]" // Unban
                : "bg-[#FF3B3C1F] hover:bg-red-500" // Ban
            }
          `}
          >
            <RiUserForbidFill
              className={`
              transition-colors
              ${
                isBanned
                  ? "text-[#2C6587] group-hover:text-white"
                  : "text-[#FF3B3C] group-hover:text-white"
              }
            `}
            />
          </button>
        </div>
      );
    },
  };

  return [...typeSpecificColumns, ...commonColumns, actionColumn];
};

export const TruncatedCell = ({ value, maxWidth = 160 }) => {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <span
      className={`block truncate whitespace-nowrap ${
        hasValue ? "text-[#1F2128]" : "text-[#9AA0A6]"
      }`}
      style={{ maxWidth }}
      title={hasValue ? value : undefined}
      aria-label={hasValue ? value : "No data available"}
    >
      {hasValue ? value : "-"}
    </span>
  );
};
