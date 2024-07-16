export const getBeforeYearMonth = (): string => {
  const d = new Date();

  return `${d.getFullYear()}${String(d.getMonth()).padStart(2, "0")}`;
};
