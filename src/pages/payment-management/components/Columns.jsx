import { TruncatedCell } from "../../usermanagment/components/Columns";
import { formatDate } from "../../../utils/formatDate";
import { Image } from "@heroui/react";

// Transaction type mapping for user-friendly display
const getTransactionTypeLabel = (type) => {
  const typeMap = {
    service_payment: "Service Payment",
    wallet_top_up: "Wallet Top Up",
    withdrawal: "Withdrawal",
    refund: "Refund",
    escrow_payment: "Escrow Payment",
    provider_transfer: "Provider Transfer",
    subscription_payment: "Subscription Payment",
    service_refund: "Service Refund",
    service_renegotiation_payment: "Service Renegotiation Payment",
  };
  return (
    typeMap[type] ||
    type?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    type
  );
};

export const columns = (t) => [
  { key: "id", label: t("number"), width: "60px" },
  {
    key: "name",
    label: t("transactionData.username"),
    width: "180px",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        {row.profile_photo_url ? (
          <div className="flex items-center gap-2">
            <Image
              src={`${row?.profile_photo_url}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

            <TruncatedCell value={value} maxWidth={100} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
              {value?.charAt(0)?.toUpperCase()}
            </div>
            <TruncatedCell value={value} maxWidth={100} />
          </div>
        )}
      </div>
    ),
  },
  {
    key: "transaction_id",
    label: t("transactionId"),
    render: (val) => <TruncatedCell value={val} maxWidth={120} />,
  },
  { key: "amount", label: t("totalAmount") },
  {
    key: "transaction_type",
    label: t("transactionData.transactiontype"),
    render: (val) => (
      <TruncatedCell value={getTransactionTypeLabel(val)} maxWidth={120} />
    ),
  },
  {
    key: "created_at",
    label: t("paymentDateTime"),
    render: (id, row) => {
      return <div className="text-black">{formatDate(row.created_at)}</div>;
    },
  },
  {
    key: "status",
    label: t("paymentStatus"),
    render: (value) => (
      <span
        className={`font-medium uppercase ${
          value === "SUCCESS"
            ? "text-[#22C55E]"
            : value === "FAILED"
              ? "text-[#EF4444]"
              : "text-[#F59E0B]"
        }`}
      >
        {value}
      </span>
    ),
  },
];

// export const columnsProf = [
//   { key: "id", label: "#", width: "60px" },
//   {
//     key: "name",
//     label: "User Name",
//     width: "180px",
//     render: (value, row) => (
//       <div className="flex items-center gap-3">
//         {row.profile_photo_url ? (
//           <div className="flex items-center gap-2">
//             <Image
//               src={`${row?.profile_photo_url}`}
//               alt="Avatar"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//             <span>{value}</span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
//               {value?.charAt(0)?.toUpperCase()}
//             </div>
//             <span>{value}</span>
//           </div>
//         )}
//       </div>
//     ),
//   },
//   {
//     key: "withdraw_request_id",
//     label: "Transaction ID",
//     render: (val) => <TruncatedCell value={val} maxWidth={120} />,
//   },
//   { key: "amount", label: "Total Amount" },
//   {
//     key: "created_at",
//     label: "Payment Date & Time",
//     render: (id, row) => {
//       return <div className="text-black">{formatDate(row.created_at)}</div>;
//     },
//   },
//   {
//     key: "status",
//     label: "Payment Status",
//     render: (value) => (
//       <span
//         className={`font-medium uppercase ${
//           value === "SUCCESS"
//             ? "text-[#22C55E]"
//             : value === "FAILED"
//               ? "text-[#EF4444]"
//               : "text-[#F59E0B]"
//         }`}
//       >
//         {value}
//       </span>
//     ),
//   },
// ];

export const columnsProf = (t) => [
  { key: "id", label: t("number"), width: "60px" },
  {
    key: "name",
    label: t("transactionData.username"),
    width: "180px",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        {row.profile_photo_url ? (
          <div className="flex items-center gap-2">
            <Image
              src={`${row?.profile_photo_url}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{value}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
              {value?.charAt(0)?.toUpperCase()}
            </div>
            <span>{value}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "withdraw_request_id",
    label: t("transactionId"),
    render: (val) => <TruncatedCell value={val} maxWidth={120} />,
  },
  { key: "amount", label: t("totalAmount") },
  {
    key: "created_at",
    label: t("paymentDateTime"),
    render: (id, row) => {
      return <div className="text-black">{formatDate(row.created_at)}</div>;
    },
  },
  {
    key: "status",
    label: t("paymentStatus"),
    render: (value) => (
      <span
        className={`font-medium uppercase ${
          value == "completed"
            ? "text-[#22C55E]"
            : value == "failed"
              ? "text-[#EF4444]"
              : "text-[#F59E0B]"
        }`}
      >
        {value}
      </span>
    ),
  },
];
