  export const formatAmount = (value) => {
    if (value === null || value === undefined) return "0.00";

    const num = Number(value);

    if (Number.isNaN(num)) return "0.00";

    return num.toFixed(2);
  };