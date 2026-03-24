export const filterConfig = [
  {
    title: "Payment Date",
    key: "payment-date",
    items: [
      { key: "last_30day", value: "Last 30 Days" },
      { key: "last_12month", value: "Last 12 Months" },
    ],
  },
  {
    title: "Transaction Status",
    key: "PaymentStatus",
    items: [
      {
        key: "completed",
        value: "Completed",
      },
      {
        key: "Pending",
        value: "Pending",
      },
      {
        key: "Cancelled",
        value: "Cancelled",
      },
      {
        key: "Failed",
        value: "Failed",
      },
    ],
  },
];
