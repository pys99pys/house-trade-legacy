export const parseToNumberFormat = (number: number): string =>
  number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
