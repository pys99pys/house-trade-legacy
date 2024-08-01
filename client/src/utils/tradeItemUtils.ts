import { FilterType } from "../interfaces/Filter";
import { TradeItem } from "../queries/useTradeListQuery";
import { parseToNumberFormat } from "./formatter";

export const createSavedTradeItemValue = ({
  cityCode,
  apartName,
  address,
  size,
}: {
  cityCode: string;
  apartName: string;
  address: string;
  size: number;
}) => `${cityCode}_${apartName}_${address}_${size}`;

export const filterItems = (
  items: TradeItem[],
  {
    cityCode,
    savedList,
    filter,
  }: {
    cityCode: string;
    savedList: string[];
    filter: FilterType;
  }
) =>
  items.filter((item) => {
    const includedApartName = filter.apartName
      ? item.apartName.includes(filter.apartName)
      : true;

    const includedBaseSize = filter.onlyBaseSize
      ? item.size > 83 && item.size < 85
      : true;

    const includedSavedList = filter.onlySavedList
      ? savedList.some(
          (savedItem) =>
            savedItem ===
            createSavedTradeItemValue({
              cityCode,
              apartName: item.apartName,
              address: item.address,
              size: item.size,
            })
        )
      : true;

    return includedApartName && includedBaseSize && includedSavedList;
  });

export const sortItems = (
  items: TradeItem[],
  order: [keyof TradeItem, "asc" | "desc"]
): TradeItem[] => {
  return items.sort((a, b) => {
    if (a[order[0]] > b[order[0]]) {
      return order[1] === "asc" ? 1 : -1;
    } else {
      return order[1] === "asc" ? -1 : 1;
    }
  });
};

export const sliceItems = (
  items: TradeItem[],
  {
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }
) => items.slice((page - 1) * perPage, page * perPage);

export const parseToFlatSize = (areaSize: number): number => {
  const area = areaSize * 0.3025;
  const addtionalSize = areaSize < 84 ? 8 : 9;

  return Math.floor(area + addtionalSize);
};

export const parseToAreaSize = (originSize: number): number => {
  return Math.round(originSize * 100) / 100;
};

export const parseToAmount = (amount: number): number => amount / 100000000;

export const parseToAverageAmountText = (tradeList: TradeItem[]): number => {
  const averageAmount = tradeList.reduce(
    (acc, item) => acc + Math.floor(item.tradeAmount / parseToFlatSize(item.size)),
    0
  );

  return averageAmount / tradeList.length;
};

export const parseToAmountText = (amount: number): string => {
  let restAmount = amount;
  const amountTextArr: string[] = [];

  if (amount > 100000000) {
    const n = parseInt((amount / 100000000).toString());

    amountTextArr.push(`${n}억`);
    restAmount = -amount - n * 100000000;
  }

  if (restAmount > 0) {
    amountTextArr.push(`${parseToNumberFormat(Math.floor(restAmount / 10000))}만`);
  }

  return `${amountTextArr.join(" ")}원`;
};
