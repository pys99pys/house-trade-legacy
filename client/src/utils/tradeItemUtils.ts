import { TradeItem } from "../queries/useTradeListQuery";
import { FilterType } from "../interfaces/Filter";

export const getStorageValue = (code: string, name: string) =>
  `${code}_${name}`;

export const filterItems = (
  items: TradeItem[],
  {
    code,
    savedItems,
    filter,
  }: {
    code: string;
    savedItems: string[];
    filter: FilterType;
  }
) =>
  items.filter((item) => {
    const includedApartName = filter.apartName
      ? item.name.includes(filter.apartName)
      : true;

    const includedBaseSize = filter.onlyBaseSize
      ? item.size > 83 && item.size < 85
      : true;

    const includedSavedList = filter.onlySavedList
      ? savedItems.some(
          (savedItem) => savedItem === getStorageValue(code, item.name)
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

export const parseToFloorText = (floor: number): string => `${floor}층`;

export const parseToAmountText = (amount: number): string =>
  `${amount / 100000000}억원`;
